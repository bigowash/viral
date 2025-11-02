import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Mail,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';
import { ActivityType } from '@/lib/constants/activity';
import { getActivityLogs } from '@/lib/modules/activity/queries';
import { getComponentTranslations } from '@/lib/i18n/getComponentTranslations';
import { getLocale } from 'next-intl/server';

interface DashboardTranslations {
  activity: {
    title: string;
    recentActivity: string;
    noActivity: string;
    noActivityDescription: string;
    actions: {
      signedUp: string;
      signedIn: string;
      signedOut: string;
      changedPassword: string;
      deletedAccount: string;
      updatedAccount: string;
      createdTeam: string;
      removedTeamMember: string;
      invitedTeamMember: string;
      acceptedInvitation: string;
      unknown: string;
    };
  };
}

const iconMap: Record<ActivityType, LucideIcon> = {
  [ActivityType.SIGN_UP]: UserPlus,
  [ActivityType.SIGN_IN]: UserCog,
  [ActivityType.SIGN_OUT]: LogOut,
  [ActivityType.UPDATE_PASSWORD]: Lock,
  [ActivityType.DELETE_ACCOUNT]: UserMinus,
  [ActivityType.UPDATE_ACCOUNT]: Settings,
  [ActivityType.CREATE_TEAM]: UserPlus,
  [ActivityType.REMOVE_TEAM_MEMBER]: UserMinus,
  [ActivityType.INVITE_TEAM_MEMBER]: Mail,
  [ActivityType.ACCEPT_INVITATION]: CheckCircle,
};

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType, t: DashboardTranslations['activity']['actions']): string {
  switch (action) {
    case ActivityType.SIGN_UP:
      return t.signedUp;
    case ActivityType.SIGN_IN:
      return t.signedIn;
    case ActivityType.SIGN_OUT:
      return t.signedOut;
    case ActivityType.UPDATE_PASSWORD:
      return t.changedPassword;
    case ActivityType.DELETE_ACCOUNT:
      return t.deletedAccount;
    case ActivityType.UPDATE_ACCOUNT:
      return t.updatedAccount;
    case ActivityType.CREATE_TEAM:
      return t.createdTeam;
    case ActivityType.REMOVE_TEAM_MEMBER:
      return t.removedTeamMember;
    case ActivityType.INVITE_TEAM_MEMBER:
      return t.invitedTeamMember;
    case ActivityType.ACCEPT_INVITATION:
      return t.acceptedInvitation;
    default:
      return t.unknown;
  }
}

export default async function ActivityPage() {
  const locale = await getLocale();
  const t = await getComponentTranslations<DashboardTranslations>('Dashboard', locale);
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        {t.activity.title}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{t.activity.recentActivity}</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = iconMap[log.action as ActivityType] || Settings;
                const formattedAction = formatAction(
                  log.action as ActivityType,
                  t.activity.actions
                );

                return (
                  <li key={log.id} className="flex items-center space-x-4">
                    <div className="bg-indigo-100 rounded-full p-2">
                      <Icon className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formattedAction}
                        {log.metadata && typeof log.metadata === 'object' && 'ipAddress' in log.metadata && (
                          ` from IP ${log.metadata.ipAddress}`
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(new Date(log.timestamp))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-indigo-700 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.activity.noActivity}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {t.activity.noActivityDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
