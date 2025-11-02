import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';
import { getUser } from '@/lib/modules/auth/queries';
import { getTeamByStripeCustomerId } from '@/lib/modules/team/queries';
import { updateTeamSubscription } from '@/lib/modules/billing/queries';
import { trackEvent as trackPostHogEvent } from '@/lib/analytics/posthog-server';

type Team = Database['public']['Tables']['teams']['Row'];

// Lazy initialization to prevent build-time errors when env vars aren't available
let stripeInstance: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY environment variable is not set. Please configure it in your environment variables.'
      );
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-04-30.basil'
    });
  }
  return stripeInstance;
}

// Proxy to lazy-initialize Stripe instance on first access
// This prevents build-time errors when environment variables aren't available
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripeInstance();
    const value = instance[prop as keyof Stripe];
    // If the value is an object (like webhooks, checkout, etc.), return it as-is
    // If it's a function, bind it to maintain proper context
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  // Also handle property descriptor access for better compatibility
  getOwnPropertyDescriptor(_target, prop) {
    const instance = getStripeInstance();
    const descriptor = Object.getOwnPropertyDescriptor(instance, prop);
    return descriptor;
  },
  ownKeys(_target) {
    const instance = getStripeInstance();
    return Reflect.ownKeys(instance);
  }
});

export async function createCheckoutSession({
  team,
  priceId
}: {
  team: Team | null;
  priceId: string;
}): Promise<never> {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer: team.stripe_customer_id || undefined,
    client_reference_id: user.id,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14
    }
  });

  // Track checkout initiated event (don't fail if this fails)
  try {
    trackPostHogEvent(user.id, 'checkout_initiated', {
      team_id: team.id,
      price_id: priceId,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Failed to track PostHog event:', error);
    // Continue anyway
  }

  redirect(session.url!);
}

export async function createCustomerPortalSession(team: Team) {
  if (!team.stripe_customer_id || !team.stripe_subscription_id) {
    redirect('/pricing');
  }

  // Get subscription to find product
  const subscription = await stripe.subscriptions.retrieve(team.stripe_subscription_id, {
    expand: ['items.data.price.product']
  });

  const price = subscription.items.data[0]?.price;
  const productId = typeof price?.product === 'string' 
    ? price.product 
    : (price?.product as Stripe.Product)?.id;

  if (!productId) {
    throw new Error('No product found for subscription');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(productId);
    if (!product.active) {
      throw new Error("Team's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the team's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription'
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id)
            }
          ]
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other'
            ]
          }
        },
        payment_method_update: {
          enabled: true
        }
      }
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: team.stripe_customer_id,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const team = await getTeamByStripeCustomerId(customerId);

  if (!team) {
    console.error('Team not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.price;
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: subscriptionId,
      planName: typeof plan?.product === 'string' ? null : (plan?.product as Stripe.Product)?.name || null,
      subscriptionStatus: status
    });
  } else if (status === 'canceled' || status === 'unpaid') {
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: null,
      planName: null,
      subscriptionStatus: status
    });
  }
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring'
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id
  }));
}
