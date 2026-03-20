"use client";

import React, { useState } from "react";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn, useSignUp } from "@clerk/nextjs";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";
import { cn } from "@saasfly/ui";
import { Mail, Globe } from "lucide-react";

import { Modal } from "~/components/modal";
import { siteConfig } from "~/config/site";
import { useSigninModal } from "~/hooks/use-signin-modal";

interface OAuthProvider {
  id: OAuthStrategy;
  name: string;
  icon: any;
  gradient: string;
  hoverGradient: string;
}

const oauthProviders: OAuthProvider[] = [
  {
    id: "oauth_google",
    name: "Google",
    icon: Globe,
    gradient: "bg-white hover:bg-gray-50 text-gray-900 border-gray-300",
    hoverGradient: "hover:bg-gray-50",
  },
  // Apple and Microsoft removed to simplify OAuth setup
  // Only Google OAuth is enabled
];

export const EnhancedSignInModal = ({
  dict,
  lang = "en",
}: {
  dict: Record<string, string>;
  lang?: string;
}) => {
  const signInModal = useSigninModal();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const handleOAuthSignIn = async (strategy: OAuthStrategy, providerName: string) => {
    if (!signIn || !signUp) {
      console.error("Clerk: signIn or signUp not available");
      return;
    }

    setLoadingProvider(providerName);

    try {
      const protocol = window.location.protocol;
      const host = window.location.host;

      // Try to sign in first
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: `${protocol}//${host}/${lang}/generator`,
      });

      // Close modal after successful redirect
      setTimeout(() => {
        signInModal.onClose();
        setLoadingProvider(null);
      }, 1000);
    } catch (error: any) {
      console.error(`OAuth sign in with ${providerName} failed:`, error);

      // If sign in fails, try sign up
      try {
        const protocol = window.location.protocol;
        const host = window.location.host;

        await signUp.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sign-up/sso-callback",
          redirectUrlComplete: `${protocol}//${host}/${lang}/generator`,
        });

        setTimeout(() => {
          signInModal.onClose();
          setLoadingProvider(null);
        }, 1000);
      } catch (signUpError: any) {
        console.error(`OAuth sign up with ${providerName} failed:`, signUpError);
        setLoadingProvider(null);
      }
    }
  };

  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-4 border-b border-neutral-200 dark:border-neutral-800 bg-background px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-urban text-2xl font-bold text-foreground">
            {dict.welcome_back || "Welcome Back"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {dict.privacy || "Sign in to access your dashboard"}
          </p>

          {/* Trial Promo Banner */}
          <div className="w-full max-w-sm mx-auto bg-gradient-to-r from-brand-green/20 to-emerald-600/20 border-2 border-brand-green/50 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🎁</span>
              <span className="font-bold text-brand-green text-lg">
                {lang === "zh" ? "感谢您的信任" : "Thank You for Your Trust"}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2 text-center leading-relaxed">
              {lang === "zh" ? (
                <>
                  我们只保存您的邮箱和头像，<span className="text-brand-green font-bold">7 天免费试用</span>已为您开启～
                </>
              ) : (
                <>
                  We've prepared a <span className="text-brand-green font-bold">7-day free trial</span> for you
                </>
              )}
            </p>
            {lang === "zh" && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center">
                让家人每天安心，立即登录开始体验
              </p>
            )}
            <div className="mt-2 inline-flex items-center gap-1.5 bg-brand-green text-white text-sm font-bold px-4 py-2 rounded-full">
              <span>✨</span>
              <span>{lang === "zh" ? "立即登录领取" : "Sign In Now to Claim"}</span>
            </div>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col space-y-3 px-4 py-6 md:px-16">
          <div className="space-y-3">
            {oauthProviders.map((provider) => {
              const Icon = provider.icon;
              const isLoading = loadingProvider === provider.name;

              return (
                <Button
                  key={provider.id}
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => handleOAuthSignIn(provider.id, provider.name)}
                  className={cn(
                    "w-full h-12 text-base font-medium transition-all duration-200",
                    "flex items-center justify-center gap-3",
                    "border-2 hover:scale-[1.02]",
                    provider.gradient
                  )}
                >
                  {isLoading ? (
                    <Icons.Spinner className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  <span>
                    {isLoading
                      ? `Connecting with ${provider.name}...`
                      : `Continue with ${provider.name}`}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {dict.or || "Or continue with email"}
              </span>
            </div>
          </div>

          {/* Email Sign In Link */}
          <a
            href={`/${lang}/login-clerk`}
            className="inline-flex items-center justify-center w-full h-12 px-4 py-2 text-base font-medium transition-all duration-200 border-2 rounded-lg hover:scale-[1.02] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Mail className="mr-2 h-5 w-5" />
            {dict.signup_email || "Continue with Email"}
          </a>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground px-4">
            {dict.terms_text ||
              "By continuing, you agree to our Terms of Service and Privacy Policy"}
          </p>

          {/* Skip Button */}
          <button
            onClick={signInModal.onClose}
            className="mt-4 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors underline underline-offset-4"
          >
            {lang === "zh" ? "暂不登录，继续浏览" : "Skip for now, continue browsing"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
