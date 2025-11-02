'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import { inviteTeamMember } from '@/lib/modules/team/actions';
import { useUser } from '../hooks/useUser';
import { useTeam } from '../hooks/useTeam';
import { useActionState } from 'react';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';

interface DashboardTranslations {
  teamSettings: {
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

function InviteFormSkeleton({ title }: { title: string }) {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export function InviteForm() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');
  const { data: user } = useUser();
  const { data: teamData } = useTeam();
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, {});

  // Check if user is owner by checking their team member role
  const currentMember = teamData?.teamMembers?.find(m => m.profile_id === user?.id);
  const isOwner = currentMember?.role === 'owner' || currentMember?.role === 'admin';

  if (!t) return <InviteFormSkeleton title="Invite Team Member" />;

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

