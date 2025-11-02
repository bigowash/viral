'use client';

import { Suspense } from 'react';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';
import { SubscriptionCard } from './components/SubscriptionCard';
import { MembersTable } from './components/MembersTable';
import { InviteForm } from './components/InviteForm';

interface DashboardTranslations {
  teamSettings: {
    title: string;
    subscription: {
      title: string;
    };
    teamMembers: {
      title: string;
    };
    inviteMember: {
      title: string;
    };
  };
}

function SubscriptionCardSkeleton({ title }: { title: string }) {
  return (
    <div className="mb-8 h-[140px] border rounded-lg p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

function TeamMembersSkeleton({ title }: { title: string }) {
  return (
    <div className="mb-8 h-[140px] border rounded-lg p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

function InviteFormSkeleton({ title }: { title: string }) {
  return (
    <div className="h-[260px] border rounded-lg p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

export default function SettingsPage() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">
        {t?.teamSettings.title || 'Team Settings'}
      </h1>
      <Suspense fallback={<SubscriptionCardSkeleton title={t?.teamSettings.subscription.title || 'Team Subscription'} />}>
        <SubscriptionCard />
      </Suspense>
      <Suspense fallback={<TeamMembersSkeleton title={t?.teamSettings.teamMembers.title || 'Team Members'} />}>
        <MembersTable />
      </Suspense>
      <Suspense fallback={<InviteFormSkeleton title={t?.teamSettings.inviteMember.title || 'Invite Team Member'} />}>
        <InviteForm />
      </Suspense>
    </section>
  );
}
