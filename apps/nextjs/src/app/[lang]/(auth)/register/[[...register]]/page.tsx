import Link from "next/link";

import { SignUp } from "@clerk/nextjs";

import type { Locale } from "~/config/i18n-config";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default async function RegisterPage({
  params: { lang, register },
}: {
  params: {
    lang: Locale;
    register: string[];
  };
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Back button */}
        <Link
          href={`/${lang}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors text-sm"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">
            Sign up to get started
          </p>
        </div>

        {/* Sign Up Form - Direct Clerk component without extra wrapper */}
        <SignUp
          signInUrl={`/${lang}/login-clerk`}
          fallbackRedirectUrl={`/${lang}/generator`}
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: {
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                border: "1px solid rgb(229 231 235)",
                background: "white",
              },
              headerTitle: "!text-gray-900 !text-xl !font-bold",
              headerSubtitle: "!text-gray-500 !text-sm",
              socialButtonsBlockButton: "!bg-white !text-gray-700 !border-gray-300 hover:!bg-gray-50",
              formFieldLabel: "!text-gray-700 !text-sm !font-medium",
              formFieldInput: "!text-gray-900 !placeholder:text-gray-400 !bg-white !border-gray-300 !rounded-md !px-3 !py-2 !text-sm",
              formButtonPrimary: "!bg-brand-green !hover:bg-emerald-500 !text-white !font-semibold !rounded-md !px-4 !py-2 !text-sm",
              footerActionText: "!text-gray-600 !text-sm",
              footerActionLink: "!text-brand-green !hover:!underline !text-sm",
              navbar: "!hidden",
              navbarMobile: "!hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
