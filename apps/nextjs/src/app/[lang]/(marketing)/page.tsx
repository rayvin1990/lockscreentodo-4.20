'use client';

import Link from 'next/link';
import { ArrowRight, Check, Crown, LogOut, Settings, User } from 'lucide-react';
import { useAuth, useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useSigninModal } from '~/hooks/use-signin-modal';
import WallpaperCarousel from '~/components/WallpaperCarousel';
import { CosmicBackground } from '~/components/cosmic-background';
import { useState, useEffect } from 'react';

export default function IndexPage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const signInModal = useSigninModal();
  const [currentLang, setCurrentLang] = useState('en');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [trialInfo, setTrialInfo] = useState<any>(null);

  // Get current language
  useEffect(() => {
    const path = window.location.pathname;
    const lang = path.split('/')[1] || 'en';
    setCurrentLang(lang);
  }, []);

  // Fetch trial info for logged in users
  useEffect(() => {
    if (!isLoaded || !userId) return;

    fetch("/api/generate/check-limit")
      .then((res) => res.json())
      .then((data) => {
        setTrialInfo(data);
      })
      .catch((err) => console.error("Failed to fetch trial info:", err));
  }, [isLoaded, userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleCreateClick = () => {
    // 如果已登录，直接跳转到generator
    if (isLoaded && userId) {
      router.push('/generator');
      return;
    }

    // 如果未登录，打开登录弹窗
    signInModal.onOpen();
  };

  const dict = {
    welcome_back: 'Welcome Back',
    privacy: 'Sign in to access your dashboard',
    signup_google: 'Continue with Google',
    signup_apple: 'Continue with Apple',
    signup_microsoft: 'Continue with Outlook',
    signup_github: 'Continue with GitHub',
    or: 'Or continue with email',
    signup_email: 'Continue with Email',
    terms_text: 'By continuing, you agree to our Terms of Service and Privacy Policy',
  };

  return (
    <div className="min-h-screen bg-brand-bg relative">
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-brand-bg/90 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Logo */}
            <Link href={`/${currentLang}`} className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-brand-green" />
              <span className="text-lg font-bold text-white">Lockscreen Todo</span>
            </Link>

            {/* User Menu */}
            <div className="relative">
              {!isLoaded ? (
                <div className="text-gray-400 text-sm">Loading...</div>
              ) : !userId ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      console.log('Sign In button clicked');
                      signInModal.onOpen();
                    }}
                    className="px-4 py-1.5 bg-brand-green hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg text-sm"
                  >
                    Sign In
                  </button>
                  <Link
                    href={`/${currentLang}/register`}
                    className="px-4 py-1.5 bg-transparent hover:bg-gray-800 border border-brand-green text-brand-green hover:text-white font-semibold rounded-lg transition-all text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-card hover:bg-gray-800 border border-gray-700 rounded-lg transition-all"
                  >
                    <User className="w-4 h-4 text-brand-green" />
                    <span className="text-white font-medium text-sm">
                      {user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'}
                    </span>
                    {trialInfo?.isPro && trialInfo?.daysRemaining > 0 && (
                      <span className="text-xs text-brand-green">
                        ({trialInfo.daysRemaining}d left)
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-brand-card border border-gray-700 rounded-xl shadow-xl py-2">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm text-white font-medium truncate">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Navigate to settings page
                          window.location.href = `/${currentLang}/dashboard/settings`;
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Manage Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push('/generator');
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 transition-colors"
                      >
                        <Crown className="w-4 h-4" />
                        <span className="text-sm">Go to Generator</span>
                      </button>

                      <button
                        onClick={() => signOut()}
                        className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-gray-800 flex items-center gap-2 transition-colors border-t border-gray-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-bg/80 to-brand-card/60" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-green rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-brand-blue rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Your to-do list shouldn't be hidden in an app, but visible at first glance when you pick up your phone.
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-200 mb-4 leading-relaxed">
                <span className="block text-brand-green font-semibold">
                  Create personalized lockscreen wallpapers that keep you on track.
                </span>
              </p>

              {/* Unlocks Reminder */}
              <p className="text-base text-gray-400 mb-3 max-w-2xl">
                150 unlocks a day → 150 chances to stay on track.
              </p>

              {/* Features */}
              <p className="text-base text-gray-400 mb-8 max-w-2xl">
                200+ styles for productivity, study, fitness, habits, and more.
                Fully customizable. No app needed.
              </p>

              {/* CTA Button */}
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center gap-3 bg-lime-400 hover:bg-lime-500 text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Generate Your First Lock Screen Wallpaper
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Trust Badge */}
              <p className="text-sm text-gray-500 mt-4">
                Unlimited wallpapers • All 200+ styles • Scan & download instantly
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="relative w-64 h-[500px] sm:w-72 sm:h-[560px] lg:w-80 lg:h-[620px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800">
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                    <WallpaperCarousel />
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-green to-brand-blue rounded-[3.5rem] opacity-20 blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section */}
      <section className="relative z-20 py-24 px-4 sm:px-6 lg:px-8 bg-brand-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Lockscreen Todo: Transform Your Lock Screen Into a Daily Reminder
          </h2>

          <div className="bg-brand-card rounded-3xl p-8 sm:p-12 border border-gray-800">
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-6">
              Lockscreen Todo is a personalized lockscreen wallpaper generator (<span className="text-brand-green font-semibold">limited time free</span>) that turns your phone's most viewed screen into a gentle, constant reminder. No app download needed — create custom wallpapers for productivity tasks, fitness goals, study plans, medication reminders, pet care routines, or anything you want to stay on top of.
            </p>

            <p className="text-base text-gray-400 leading-relaxed mb-8">
              Simply customize your wallpaper with your tasks, scan the QR code to download it instantly, and set it as your lockscreen. Every time you unlock your phone, you'll see your priorities front and center.
            </p>

            <button
              onClick={handleCreateClick}
              className="w-full inline-flex items-center justify-center gap-3 bg-lime-400 hover:bg-lime-500 text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl mb-6"
            >
              Start Creating Your Free Lock Screen Wallpaper Now
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-sm text-gray-400">
              200+ styles • Full customization • Instant QR code download
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
