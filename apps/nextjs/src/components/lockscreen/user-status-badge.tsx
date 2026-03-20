"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Crown, AlertCircle, Loader2 } from "lucide-react";
import { differenceInDays } from "date-fns";

interface UserStatus {
  canGenerate: boolean;
  isPro: boolean;
  trialEndsAt: string | null;
  daysRemaining: number;
  message: string;
}

export function UserStatusBadge() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch user status
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchUserStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/generate/check-limit");
        if (response.ok) {
          const data = await response.json();
          console.log("📊 UserStatusBadge: 收到API数据", data);
          setUserStatus(data);
        }
      } catch (error) {
        console.error("Failed to fetch user status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, [isLoaded, isSignedIn]);

  // Not logged in
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <a
        href={`/${window.location.pathname.split('/')[1]}/sign-in`}
        className="flex items-center gap-2 px-3 py-1.5 bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/30 rounded-lg transition-all hover:scale-105"
      >
        <Crown className="w-3.5 h-3.5 text-brand-green" />
        <span className="text-brand-green font-semibold text-xs">
          Sign in
        </span>
      </a>
    );
  }

  // Logged in - Loading
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking...</span>
      </div>
    );
  }

  // Logged in - Show status
  if (!userStatus) {
    return null;
  }

  // Pro trial active
  if (userStatus.isPro && userStatus.daysRemaining > 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-green/10 to-emerald-600/10 border border-brand-green/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Crown className="w-3.5 h-3.5 text-brand-green" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">
              {user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
            </span>
            <span className="text-xs font-semibold text-brand-green">
              {userStatus.daysRemaining}d
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Trial expired
  if (userStatus.isPro && userStatus.daysRemaining <= 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
        <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">
            {user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
          </span>
          <span className="text-xs font-semibold text-orange-400">
            Expired
          </span>
        </div>
      </div>
    );
  }

  // Non-Pro user
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-green/10 border border-brand-green/30 rounded-lg">
      <Crown className="w-3.5 h-3.5 text-brand-green" />
      <span className="text-brand-green font-semibold text-xs">
        Free
      </span>
    </div>
  );
}
