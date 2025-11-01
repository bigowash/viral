import { createServiceRoleClient } from '@/lib/db/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import Stripe from 'stripe';
import { trackEvent as trackPostHogEvent } from '@/lib/analytics/posthog-server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    });

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error('No plan found for this subscription.');
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      throw new Error('No product ID found for this subscription.');
    }

    const userId = session.client_reference_id;
    if (!userId) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    const supabase = createServiceRoleClient();

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('User not found in database.');
    }

    // Get user's team
    const { data: membership } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('profile_id', userId)
      .limit(1)
      .single();

    if (!membership) {
      throw new Error('User is not associated with any team.');
    }

    // Update team with Stripe subscription info
    const { error: updateError } = await supabase
      .from('teams')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan_name: (plan.product as Stripe.Product).name,
        subscription_status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', membership.team_id);

    if (updateError) {
      throw new Error(`Failed to update team: ${updateError.message}`);
    }

    // Track checkout completed event (don't fail if this fails)
    try {
      trackPostHogEvent(userId, 'checkout_completed', {
        team_id: membership.team_id,
        customer_id: customerId,
        subscription_id: subscriptionId,
        plan_name: (plan.product as Stripe.Product).name,
        subscription_status: subscription.status,
        price_id: plan.id,
        amount: plan.unit_amount,
        currency: plan.currency,
        interval: plan.recurring?.interval,
      });
    } catch (error) {
      console.error('Failed to track PostHog event:', error);
      // Continue anyway
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error handling successful checkout:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
