'use client';
import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/zh/generator';

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            form: 'hidden',
            formFooter: 'hidden',
            cardHeader: 'hidden',
            divider: 'hidden',
          },
        }}
        redirectUrl={from}
        afterSignInUrl={from}
      />
    </div>
  );
}
