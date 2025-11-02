import { createServerSupabaseClient } from '@/lib/db/supabase';

/**
 * Update team subscription information.
 */
export async function updateTeamSubscription(
  teamId: string,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId?: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('teams')
    .update({
      stripe_subscription_id: subscriptionData.stripeSubscriptionId,
      plan_name: subscriptionData.planName,
      subscription_status: subscriptionData.subscriptionStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', teamId);

  if (error) {
    throw new Error(`Failed to update team subscription: ${error.message}`);
  }
}

