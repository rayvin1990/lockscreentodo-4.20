"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Clock, Sparkles, Crown, Settings } from "lucide-react";
import Link from "next/link";

interface TrialInfo {
  canGenerate: boolean;
  isPro: boolean;
  trialEndsAt: string | null;
  daysRemaining: number;
}

export function TrialCountdownBadge({ lang = "en" }: { lang?: string }) {
  const { user, isLoaded } = useUser();
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Fetch trial info
    fetch("/api/generate/check-limit")
      .then((res) => res.json())
      .then((data) => {
        console.log('Trial info from API:', data);
        // Always set trialInfo if user is logged in
        setTrialInfo({
          canGenerate: data.canGenerate ?? false,
          isPro: data.isPro ?? false,
          trialEndsAt: data.trialEndsAt ?? null,
          daysRemaining: data.daysRemaining ?? 0,
        });
      })
      .catch((err) => console.error("Failed to fetch trial info:", err));
  }, [isLoaded, user]);

  // Update countdown every minute
  useEffect(() => {
    if (!trialInfo?.trialEndsAt) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = new Date(trialInfo.trialEndsAt).getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining({ days, hours, minutes });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [trialInfo]);

  if (!isLoaded || !user) {
    return null;
  }

  const settingsPath = `/${lang}/dashboard/settings`;

  // Show Pro badge for Pro users without trial
  if (trialInfo?.isPro && !trialInfo.trialEndsAt) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-semibold text-amber-500">
                {lang === "zh" ? "专业版" : "Pro"}
              </span>
              <span className="font-bold text-white">
                ✓
              </span>
            </div>
          </div>
        </div>
        <Link
          href={settingsPath}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  // Show trial countdown or loading state
  return (
    <div className="flex items-center gap-3">
      {!trialInfo?.trialEndsAt || !timeRemaining ? (
        // Loading state - show in navbar
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-semibold text-blue-500 text-sm">
              {lang === "zh" ? "加载中..." : "Loading..."}
            </span>
          </div>
        </div>
      ) : timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0 ? (
        // Trial expired
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-red-500 text-sm">
              {lang === "zh" ? "已过期" : "Expired"}
            </span>
          </div>
        </div>
      ) : (
        // Trial countdown - show days, hours, and minutes
        <div className="bg-gradient-to-r from-brand-green/20 to-emerald-600/20 border-2 border-brand-green/50 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-3.5 h-3.5 text-brand-green" />
              <span className="font-semibold text-brand-green">
                {lang === "zh" ? "试用还剩" : "Trial"}:
              </span>
              <span className="font-bold text-white">
                {timeRemaining.days > 0 && (
                  <>
                    {timeRemaining.days}
                    {lang === "zh" ? "天" : "d"}
                  </>
                )}
                {timeRemaining.days > 0 && timeRemaining.hours > 0 && " "}
                {timeRemaining.hours > 0 && (
                  <>
                    {timeRemaining.hours}
                    {lang === "zh" ? "小时" : "h"}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      <Link
        href={settingsPath}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        title={lang === "zh" ? "用户设置" : "User Settings"}
      >
        <Settings className="w-5 h-5" />
      </Link>
    </div>
  );
}
