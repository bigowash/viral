import { Suspense } from 'react';
import { Pricing } from '@/components/Pricing';

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Pricing />
    </Suspense>
  );
}
