'use client';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lock Screen Todo</h1>
          <p className="text-slate-400">Create your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <SignUp
            fallbackRedirectUrl="/en/generator"
            afterSignInUrl="/en/generator"
          />
        </div>
      </div>
    </div>
  );
}
