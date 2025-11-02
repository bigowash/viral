'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';

interface SubmitButtonTranslations {
  loading: string;
  getStarted: string;
}

export function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useComponentTranslations<SubmitButtonTranslations>('Pricing');

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="w-full rounded-full"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          {t?.loading || 'Loading...'}
        </>
      ) : (
        <>
          {t?.getStarted || 'Get Started'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

