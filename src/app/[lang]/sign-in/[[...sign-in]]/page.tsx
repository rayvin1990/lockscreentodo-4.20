'use client';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
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
        redirectUrl="/api/auth/google-callback"
      />
    </div>
  );
}
