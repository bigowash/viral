'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { updateAccount } from '@/app/[locale]/(login)/actions';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['profiles']['Row'];
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';

interface DashboardTranslations {
  generalSettings: {
    title: string;
    accountInformation: string;
    name: string;
    email: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    saveChanges: string;
    saving: string;
  };
}

const QUERY_KEY = ['/api/user'] as const;

const fetcher = async (): Promise<User | null> => {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    // Ensure we return a proper object or null, never undefined
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as User;
    }
    return null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
};

function AccountForm({
  state,
  nameValue = '',
  emailValue = '',
  t
}: AccountFormProps & { t: DashboardTranslations['generalSettings'] | null }) {
  return (
    <>
      <div>
        <Label htmlFor="name" className="mb-2">
          {t?.name || 'Name'}
        </Label>
        <Input
          id="name"
          name="name"
          placeholder={t?.namePlaceholder || 'Enter your name'}
          defaultValue={state.name || nameValue}
          required
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          {t?.email || 'Email'}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t?.emailPlaceholder || 'Enter your email'}
          defaultValue={emailValue}
          required
        />
      </div>
    </>
  );
}

function AccountFormWithData({ state, t }: { state: ActionState; t: DashboardTranslations['generalSettings'] | null }) {
  const { data: user } = useQuery<User | null>({
    queryKey: QUERY_KEY,
    queryFn: fetcher,
    // Inherits staleTime and other defaults from QueryClient
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // initialData is set by QueryProvider from server-side prefetching
  });
  
  return (
    <AccountForm
      state={state}
      nameValue={user?.display_name ?? ''}
      emailValue={user?.primary_email ?? ''}
      t={t}
    />
  );
}

export default function GeneralPage() {
  const t = useComponentTranslations<DashboardTranslations>('Dashboard');
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        {t?.generalSettings.title || 'General Settings'}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{t?.generalSettings.accountInformation || 'Account Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={formAction}>
            <Suspense fallback={<AccountForm state={state} t={t?.generalSettings || null} />}>
              <AccountFormWithData state={state} t={t?.generalSettings || null} />
            </Suspense>
            {state.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}
            {state.success && (
              <p className="text-green-500 text-sm">{state.success}</p>
            )}
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t?.generalSettings.saving || 'Saving...'}
                </>
              ) : (
                t?.generalSettings.saveChanges || 'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
