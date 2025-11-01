'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { customerPortalAction } from '@/lib/payments/actions';
import { useActionState } from 'react';
import { Database } from '@/types/supabase';
import { TeamDataWithMembers } from '@/lib/auth/middleware';

type User = Database['public']['Tables']['profiles']['Row'];
import { removeTeamMember, inviteTeamMember } from '@/app/[locale]/(login)/actions';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';

interface DashboardTranslations {
  teamSettings: {
    title: string;
    subscription: {
      title: string;
      currentPlan: string;
      free: string;
      billedMonthly: string;
      trialPeriod: string;
      noActiveSubscription: string;
      manageSubscription: string;
    };
    teamMembers: {
      title: string;
      noMembers: string;
      remove: string;
      removing: string;
      unknownUser: string;
    };
    inviteMember: {
      title: string;
      email: string;
      emailPlaceholder: string;
      role: string;
      member: string;
      owner: string;
      inviteButton: string;
      inviting: string;
      mustBeOwner: string;
    };
  };
}

type ActionState = {
  error?: string;
  success?: string;
};

const USER_QUERY_KEY = ['/api/user'] as const;
const TEAM_QUERY_KEY = ['/api/team'] as const;

// Fetcher functions for React Query
const fetchUser = async (): Promise<User | null> => {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as User;
    }
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

const fetchTeam = async (): Promise<TeamDataWithMembers | null> => {
  try {
    const res = await fetch('/api/team');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as TeamDataWithMembers;
    }
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

function SubscriptionSkeleton({ title }: { title: string }) {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function ManageSubscription() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');
  const { data: teamData } = useQuery<TeamDataWithMembers | null>({
    queryKey: TEAM_QUERY_KEY,
    queryFn: fetchTeam,
    // Inherits staleTime and other defaults from QueryClient
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // initialData is set by QueryProvider from server-side prefetching
  });

  if (!t) return <SubscriptionSkeleton title="Team Subscription" />;

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

function TeamMembersSkeleton({ title }: { title: string }) {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4 mt-1">
          <div className="flex items-center space-x-4">
            <div className="size-8 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-14 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');
  const { data: teamData } = useQuery<TeamDataWithMembers | null>({
    queryKey: TEAM_QUERY_KEY,
    queryFn: fetchTeam,
    // Inherits staleTime and other defaults from QueryClient
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // initialData is set by QueryProvider from server-side prefetching
  });
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, {});

  if (!t) return <TeamMembersSkeleton title="Team Members" />;

  const getUserDisplayName = (user: Pick<User, 'id' | 'display_name' | 'primary_email'> | null) => {
    if (!user) return t.teamSettings.teamMembers.unknownUser;
    return user.display_name || user.primary_email || t.teamSettings.teamMembers.unknownUser;
  };

  if (!teamData?.teamMembers?.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t.teamSettings.teamMembers.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t.teamSettings.teamMembers.noMembers}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t.teamSettings.teamMembers.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {teamData.teamMembers.map((member, index) => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  {/* 
                    This app doesn't save profile images, but here
                    is how you'd show them:

                    <AvatarImage
                      src={member.user.image || ''}
                      alt={getUserDisplayName(member.user)}
                    />
                  */}
                  <AvatarFallback>
                    {getUserDisplayName(member.user)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {getUserDisplayName(member.user)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {member.role}
                  </p>
                </div>
              </div>
              {index > 1 ? (
                <form action={removeAction}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={isRemovePending}
                  >
                    {isRemovePending ? t.teamSettings.teamMembers.removing : t.teamSettings.teamMembers.remove}
                  </Button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {removeState?.error && (
          <p className="text-red-500 mt-4">{removeState.error}</p>
        )}
      </CardContent>
    </Card>
  );
}

function InviteTeamMemberSkeleton({ title }: { title: string }) {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function InviteTeamMember() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');
  const { data: user } = useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUser,
    // Inherits staleTime and other defaults from QueryClient
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // initialData is set by QueryProvider from server-side prefetching
  });
  // Check if user is owner by checking their team member role
  const { data: teamData } = useQuery<TeamDataWithMembers | null>({
    queryKey: TEAM_QUERY_KEY,
    queryFn: fetchTeam,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  
  const currentMember = teamData?.teamMembers?.find(m => m.profile_id === user?.id);
  const isOwner = currentMember?.role === 'owner' || currentMember?.role === 'admin';
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, {});

  if (!t) return <InviteTeamMemberSkeleton title="Invite Team Member" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.teamSettings.inviteMember.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              {t.teamSettings.inviteMember.email}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t.teamSettings.inviteMember.emailPlaceholder}
              required
              disabled={!isOwner}
            />
          </div>
          <div>
            <Label>{t.teamSettings.inviteMember.role}</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">{t.teamSettings.inviteMember.member}</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">{t.teamSettings.inviteMember.owner}</Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && (
            <p className="text-red-500">{inviteState.error}</p>
          )}
          {inviteState?.success && (
            <p className="text-green-500">{inviteState.success}</p>
          )}
          <Button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white"
            disabled={isInvitePending || !isOwner}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.teamSettings.inviteMember.inviting}
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t.teamSettings.inviteMember.inviteButton}
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {t.teamSettings.inviteMember.mustBeOwner}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

export default function SettingsPage() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">
        {t?.teamSettings.title || 'Team Settings'}
      </h1>
      <Suspense fallback={<SubscriptionSkeleton title={t?.teamSettings.subscription.title || 'Team Subscription'} />}>
        <ManageSubscription />
      </Suspense>
      <Suspense fallback={<TeamMembersSkeleton title={t?.teamSettings.teamMembers.title || 'Team Members'} />}>
        <TeamMembers />
      </Suspense>
      <Suspense fallback={<InviteTeamMemberSkeleton title={t?.teamSettings.inviteMember.title || 'Invite Team Member'} />}>
        <InviteTeamMember />
      </Suspense>
    </section>
  );
}
