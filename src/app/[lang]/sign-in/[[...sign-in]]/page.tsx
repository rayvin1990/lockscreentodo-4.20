'use client';
import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/zh/generator';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#12122a] to-[#0d0d20]">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Lock Screen Todo</h1>
          <p className="text-slate-400 text-sm">Sign in to continue</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <SignIn
            appearance={{
              variables: {
                colorBackground: 'transparent',
                colorInputBackground: 'rgba(255,255,255,0.05)',
                colorInputText: 'white',
                colorText: 'white',
                colorTextSecondary: '#94a3b8',
                borderRadius: '12px',
                fontFamily: 'inherit',
              },
              elements: {
                form: 'hidden',
                formFooter: 'hidden',
                cardHeader: 'hidden',
                divider: 'hidden',
                socialButtonsBlock: 'flex flex-col gap-3',
                socialButtonsBlockButton: 'bg-white hover:bg-slate-100 text-gray-800 border border-gray-200 rounded-xl py-3 px-4 w-full flex items-center justify-center gap-3 transition-colors font-medium',
                socialButtonsBlockButtonText: 'text-base font-medium',
                formFieldInput: 'bg-white/5 border border-white/10 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none',
                identityPreview: 'hidden',
                formFieldLabel: 'text-slate-300 text-sm font-medium',
                formFieldRoot: 'mb-4',
              },
            }}
            routing={false}
            redirectUrl={from}
            afterSignInUrl={from}
          />
        </div>
      </div>
    </div>
  );
}
