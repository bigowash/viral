import { Suspense } from 'react';
import { HeaderLayout } from '@/components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <HeaderLayout>{children}</HeaderLayout>;
}
