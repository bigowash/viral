'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { signIn, signUp } from '@/app/[locale]/(login)/actions';
import { ActionState } from '@/lib/auth/middleware';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';
import { usePostHogClient } from '@/lib/analytics/posthog';
import { PostHogEvents } from '@/lib/analytics/events';

interface LoginTranslations {
  signInTitle: string;
  signUpTitle: string;
  email: string;
  password: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  signInButton: string;
  signUpButton: string;
  loading: string;
  newToPlatform: string;
  alreadyHaveAccount: string;
  createAccount: string;
  signInToExisting: string;
}

function LoginContent({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const posthog = usePostHogClient();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const t = useComponentTranslations<LoginTranslations>('Login');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  // Track form started
  useEffect(() => {
    posthog?.capture(PostHogEvents.FORM_STARTED, {
      form_name: mode === 'signin' ? 'sign_in' : 'sign_up',
      has_redirect: !!redirect,
      has_price_id: !!priceId,
      has_invite_id: !!inviteId,
      locale,
    });
  }, [posthog, mode, redirect, priceId, inviteId, locale]);

  if (!t) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-indigo-700" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' ? t.signInTitle : t.signUpTitle}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form 
          className="space-y-6" 
          action={formAction}
          onSubmit={() => {
            posthog?.capture(PostHogEvents.FORM_SUBMITTED, {
              form_name: mode === 'signin' ? 'sign_in' : 'sign_up',
              locale,
            });
          }}
        >
          <input type="hidden" name="redirect" value={redirect || ''} />
          <input type="hidden" name="priceId" value={priceId || ''} />
          <input type="hidden" name="inviteId" value={inviteId || ''} />
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t.email}
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-700 focus:border-indigo-700 focus:z-10 sm:text-sm"
                placeholder={t.emailPlaceholder}
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t.password}
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-700 focus:border-indigo-700 focus:z-10 sm:text-sm"
                placeholder={t.passwordPlaceholder}
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-red-500 text-sm">{state.error}</div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {t.loading}
                </>
              ) : mode === 'signin' ? (
                t.signInButton
              ) : (
                t.signUpButton
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {mode === 'signin' ? t.newToPlatform : t.alreadyHaveAccount}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`/${locale}${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700"
              onClick={() => {
                posthog?.capture(PostHogEvents.LINK_CLICKED, {
                  link_destination: `/${locale}${mode === 'signin' ? '/sign-up' : '/sign-in'}`,
                  link_text: mode === 'signin' ? t.createAccount : t.signInToExisting,
                  link_location: 'login_form',
                  locale,
                });
              }}
            >
              {mode === 'signin' ? t.createAccount : t.signInToExisting}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex flex-col justify-center bg-gray-50" />}>
      <LoginContent mode={mode} />
    </Suspense>
  );
}
