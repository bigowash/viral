'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { removeTeamMember } from '@/lib/modules/team/actions';
import { useTeam } from '../hooks/useTeam';
import { useActionState } from 'react';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['profiles']['Row'];

interface DashboardTranslations {
  teamSettings: {
    teamMembers: {
      title: string;
      noMembers: string;
      remove: string;
      removing: string;
      unknownUser: string;
    };
  };
}

type ActionState = {
  error?: string;
  success?: string;
};

function MembersTableSkeleton({ title }: { title: string }) {
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

export function MembersTable() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');
  const { data: teamData } = useTeam();
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, {});

  if (!t) return <MembersTableSkeleton title="Team Members" />;

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

