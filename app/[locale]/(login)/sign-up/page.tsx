import { Suspense } from 'react';
import { Login } from '@/components/Login';

export default function SignUpPage() {
  return (
    <Suspense>
      <Login mode="signup" />
    </Suspense>
  );
}
