"use client";

import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserStatus {
  isPro: boolean;
  daysRemaining: number;
}

export function UserStatusBadge() {
  const { user } = useUser();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/generate/check-limit");
        if (response.ok) {
          const data = await response.json();
          setUserStatus(data);
        }
      } catch (e) {
        console.warn("Status check failed, but that's okay.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserStatus();
  }, [user]);

  return (
    <div className="flex items-center gap-3">
      {/* 1. 只有登录了，才显示状态勋章 */}
      <SignedIn>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
          userStatus?.isPro 
          ? "bg-indigo-500/10 border-indigo-500/30" 
          : "bg-white/5 border-white/10"
        }`}>
          <Crown className={`w-3.5 h-3.5 ${userStatus?.isPro ? "text-indigo-400" : "text-white/20"}`} />
          {loading && !userStatus ? (
             <Loader2 className="w-3 h-3 animate-spin text-white/20" />
          ) : (
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              {userStatus?.isPro ? "Pro" : "Free"}
            </span>
          )}
        </div>
        
        {/* 原汁原味的用户头像菜单 - 绝对核心！ */}
        <div className="p-0.5 rounded-full border border-white/10 hover:border-white/20 transition-all bg-white/5 shadow-lg">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>

      {/* 2. 未登录态 - 引导按钮 */}
      <SignedOut>
        <Link href="/sign-in">
           <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-500 font-bold text-[10px] uppercase tracking-widest px-4 h-8">
             Sign In
           </Button>
        </Link>
      </SignedOut>
    </div>
  );
}
