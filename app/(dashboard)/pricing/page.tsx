import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { theme } from '@/lib/theme';

const { palette, gradients } = theme;

export default async function PricingPage() {
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
              Pricing
            </p>
            <h1 className="max-w-3xl text-[2.75rem] font-heading leading-[1.05] sm:text-[3.25rem] md:text-[3.75rem]">
              Simple,{' '}
              <span
                className="font-accent italic"
                style={{ color: palette.accent }}
              >
                transparent
              </span>{' '}
              pricing
            </h1>
            <p
              className="max-w-2xl text-lg sm:text-xl"
              style={{ color: palette.textSecondary }}
            >
              Choose the plan that works for you. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              name="For Creators"
              price={0}
              isFree={true}
              features={[
                'Free Forever',
                'Post your content',
                'Connect with brands',
                'Get paid for collaborations',
              ]}
            />
            <PricingCard
              name="For Brands"
              price={0}
              isFreeTrial={true}
              features={[
                'Free Trial Available',
                'Pay per post',
                'Pay per impression',
                'Flexible pricing model',
                'No monthly subscription',
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
  isFree,
  isFreeTrial,
  features,
  priceId,
}: {
  name: string;
  price: number;
  isFree?: boolean;
  isFreeTrial?: boolean;
  features: string[];
  priceId?: string;
}) {
  return (
    <div
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
        {isFreeTrial && (
          <p
            className="text-xs font-heading uppercase tracking-[0.18em]"
            style={{ color: palette.textSecondary }}
          >
            Start with a free trial
          </p>
        )}
      </div>

      <div className="mb-8">
        <p
          className="text-5xl font-heading mb-2"
          style={{ color: palette.textPrimary }}
        >
          {isFree ? 'Free' : 'Free Trial'}
        </p>
        <p
          className="text-base"
          style={{ color: palette.textSecondary }}
        >
          {isFree ? (
            'Forever'
          ) : (
            'Then pay per post & impression'
          )}
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

      {priceId && (
        <form action={checkoutAction} className="mt-auto">
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton />
        </form>
      )}
    </div>
  );
}
