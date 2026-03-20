"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { EnhancedSignInModal } from "~/components/enhanced-sign-in-modal";
import { useSigninModal } from "~/hooks/use-signin-modal";

export function AuthButton() {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] || "en";
  const isEnglish = currentLang === "en";
  const signInModal = useSigninModal();

  const dict = {
    welcome_back: isEnglish ? "Welcome Back" : "欢迎回来",
    privacy: isEnglish
      ? "Sign in to access your dashboard"
      : "登录以访问您的仪表板",
    signup_google: isEnglish ? "Continue with Google" : "使用 Google 继续",
    signup_apple: isEnglish ? "Continue with Apple" : "使用 Apple 继续",
    signup_microsoft: isEnglish ? "Continue with Outlook" : "使用 Outlook 继续",
    signup_github: isEnglish ? "Continue with GitHub" : "使用 GitHub 继续",
    or: isEnglish ? "Or continue with email" : "或使用邮箱继续",
    signup_email: isEnglish ? "Continue with Email" : "使用邮箱继续",
    terms_text: isEnglish
      ? "By continuing, you agree to our Terms of Service and Privacy Policy"
      : "继续即表示您同意我们的服务条款和隐私政策",
  };

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <SignedOut>
          <div className="flex gap-3">
            <button
              onClick={signInModal.onOpen}
              className="bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm shadow-lg"
            >
              {isEnglish ? "Sign In" : "登录"}
            </button>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton
            afterSignOutUrl={`/${currentLang}`}
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </SignedIn>
      </div>

      <EnhancedSignInModal dict={dict} lang={currentLang} />
    </>
  );
}
