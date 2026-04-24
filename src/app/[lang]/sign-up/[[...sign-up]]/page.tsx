'use client';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp
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