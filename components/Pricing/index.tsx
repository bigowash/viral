'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useComponentTranslations } from '@/lib/i18n/useComponentTranslations';
import { Check } from 'lucide-react';
import { theme } from '@/lib/theme';
import { SubmitButton } from '@/app/[locale]/(dashboard)/pricing/submit-button';
import { checkoutAction } from '@/lib/payments/actions';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { usePostHogClient } from '@/lib/analytics/posthog';
import { PostHogEvents } from '@/lib/analytics/events';

const { palette, gradients } = theme;

interface PricingTranslations {
  eyebrow: string;
  headline: {
    leading: string;
    accent: string;
    trailing: string;
  };
  description: string;
  creators: {
    name: string;
    price: string;
    period: string;
    cta: string;
    features: {
      freeForever: string;
      postContent: string;
      connectBrands: string;
      getPaid: string;
    };
  };
  brands: {
    name: string;
    price: string;
    subtitle: string;
    description: string;
    cta: string;
    features: {
      freeTrial: string;
      payPerPost: string;
      payPerImpression: string;
      flexiblePricing: string;
      noSubscription: string;
    };
  };
}

export function Pricing() {
  const t = useComponentTranslations<PricingTranslations>('Pricing');
  const locale = useLocale();
  const posthog = usePostHogClient();

  // Track pricing page view on mount
  useEffect(() => {
    posthog?.capture(PostHogEvents.PRICING_PAGE_VIEWED, {
      locale,
    });
  }, [posthog, locale]);

  if (!t) return null;

  return (
    <main
      style={{
        backgroundColor: palette.background,
        color: palette.textPrimary
      }}
    >
      <section
        className="relative overflow-hidden py-24 md:py-28"
        style={{ background: gradients.soft }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 text-center mb-16">
            <p
              className="text-xs font-heading uppercase tracking-[0.32em]"
              style={{ color: palette.textSecondary }}
            >
              {t.eyebrow}
            </p>
            <h1 className="max-w-3xl text-[2.75rem] font-heading leading-[1.05] sm:text-[3.25rem] md:text-[3.75rem]">
              {t.headline.leading}
              <span
                className="font-accent italic"
                style={{ color: palette.accent }}
              >
                {t.headline.accent}
              </span>
              {t.headline.trailing}
            </h1>
            <p
              className="max-w-2xl text-lg sm:text-xl"
              style={{ color: palette.textSecondary }}
            >
              {t.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              name={t.creators.name}
              price={t.creators.price}
              period={t.creators.period}
              isFree={true}
              ctaText={t.creators.cta}
              ctaHref={`/sign-up?type=creator`}
              features={[
                t.creators.features.freeForever,
                t.creators.features.postContent,
                t.creators.features.connectBrands,
                t.creators.features.getPaid,
              ]}
            />
            <PricingCard
              name={t.brands.name}
              price={t.brands.price}
              subtitle={t.brands.subtitle}
              description={t.brands.description}
              isFreeTrial={true}
              ctaText={t.brands.cta}
              ctaHref={`/sign-up?type=brand`}
              features={[
                t.brands.features.freeTrial,
                t.brands.features.payPerPost,
                t.brands.features.payPerImpression,
                t.brands.features.flexiblePricing,
                t.brands.features.noSubscription,
              ]}
            />
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-24 h-48"
          style={{
            background: gradients.accent,
            opacity: 0.25
          }}
        />
      </section>
    </main>
  );
}

function PricingCard({
  name,
  price,
  period,
  subtitle,
  description,
  isFree,
  isFreeTrial,
  features,
  priceId,
  ctaText,
  ctaHref,
}: {
  name: string;
  price: string;
  period?: string;
  subtitle?: string;
  description?: string;
  isFree?: boolean;
  isFreeTrial?: boolean;
  features: string[];
  priceId?: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  const locale = useLocale();
  const posthog = usePostHogClient();

  // Track when pricing card is viewed (scroll into view)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            posthog?.capture(PostHogEvents.PRICING_PLAN_VIEWED, {
              plan_name: name,
              is_free: isFree || false,
              locale,
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const card = document.querySelector(`[data-plan="${name}"]`);
    if (card) {
      observer.observe(card);
    }

    return () => observer.disconnect();
  }, [name, isFree, locale, posthog]);

  return (
    <div
      data-plan={name}
      className="flex h-full flex-col rounded-[32px] border px-6 py-8 shadow-sm transition-transform hover:-translate-y-1"
      style={{
        backgroundColor: palette.surface,
        borderColor: palette.border,
        boxShadow: palette.shadow
      }}
    >
      <div className="space-y-4 mb-6">
        <h2
          className="text-2xl font-heading"
          style={{ color: palette.textPrimary }}
        >
          {name}
        </h2>
        {isFreeTrial && subtitle && (
          <p
            className="text-xs font-heading uppercase tracking-[0.18em]"
            style={{ color: palette.textSecondary }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="mb-8">
        <p
          className="text-5xl font-heading mb-2"
          style={{ color: palette.textPrimary }}
        >
          {price}
        </p>
        <p
          className="text-base"
          style={{ color: palette.textSecondary }}
        >
          {isFree ? period : description}
        </p>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check
              className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0"
              style={{ color: palette.accent }}
            />
            <span
              className="text-base"
              style={{ color: palette.textPrimary }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {priceId ? (
          <form action={checkoutAction}>
            <input type="hidden" name="priceId" value={priceId} />
            <SubmitButton />
          </form>
        ) : ctaText && ctaHref ? (
          <Button
            asChild
            className="w-full rounded-full font-heading uppercase tracking-[0.18em] text-sm"
            style={{
              backgroundColor: palette.accent,
              color: palette.textOnAccent,
            }}
            onClick={() => {
              posthog?.capture(PostHogEvents.PRICING_CTA_CLICKED, {
                plan_name: name,
                cta_text: ctaText,
                cta_destination: ctaHref,
                is_free: isFree || false,
                locale,
              });
              posthog?.capture(PostHogEvents.BUTTON_CLICKED, {
                button_name: 'pricing_cta',
                button_text: ctaText,
                plan_name: name,
                locale,
              });
            }}
          >
            <Link 
              href={ctaHref}
              onClick={() => {
                posthog?.capture(PostHogEvents.LINK_CLICKED, {
                  link_destination: ctaHref,
                  link_text: ctaText,
                  link_location: 'pricing_card',
                  plan_name: name,
                  locale,
                });
              }}
            >
              {ctaText}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

