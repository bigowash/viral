'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { customerPortalAction } from '@/lib/modules/billing/actions';
import { useTeam } from '../hooks/useTeam';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';

interface DashboardTranslations {
  teamSettings: {
    subscription: {
      title: string;
      currentPlan: string;
      free: string;
      billedMonthly: string;
      trialPeriod: string;
      noActiveSubscription: string;
      manageSubscription: string;
    };
  };
}

function SubscriptionCardSkeleton({ title }: { title: string }) {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export function SubscriptionCard() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');
  const { data: teamData } = useTeam();

  if (!t) return <SubscriptionCardSkeleton title="Team Subscription" />;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t.teamSettings.subscription.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium">
                {t.teamSettings.subscription.currentPlan}: {teamData?.plan_name || t.teamSettings.subscription.free}
              </p>
              <p className="text-sm text-muted-foreground">
                {teamData?.subscription_status === 'active'
                  ? t.teamSettings.subscription.billedMonthly
                  : teamData?.subscription_status === 'trialing'
                  ? t.teamSettings.subscription.trialPeriod
                  : t.teamSettings.subscription.noActiveSubscription}
              </p>
            </div>
            <form action={customerPortalAction}>
              <Button type="submit" variant="outline">
                {t.teamSettings.subscription.manageSubscription}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

