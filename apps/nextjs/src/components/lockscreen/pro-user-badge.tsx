"use client";

import React, { useState, useEffect } from "react";

interface ProUserBadgeProps {
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null; // 添加订阅结束时间
  isPro: boolean;
}

export function ProUserBadge({ trialEndsAt, subscriptionEndsAt, isPro }: ProUserBadgeProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
  });

  useEffect(() => {
    // Pro 用户：显示订阅到期倒计时
    if (isPro && subscriptionEndsAt) {
      const updateTimeLeft = () => {
        const now = new Date().getTime();
        const end = new Date(subscriptionEndsAt).getTime();
        const diff = end - now;

        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0 });
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        setTimeLeft({ days, hours });
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000); // 每分钟更新

      return () => clearInterval(interval);
    }

    // 试用用户：显示试用到期倒计时
    if (trialEndsAt) {
      const updateTimeLeft = () => {
        const now = new Date().getTime();
        const trialEnd = new Date(trialEndsAt).getTime();
        const diff = trialEnd - now;

        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0 });
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        setTimeLeft({ days, hours });
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000);

      return () => clearInterval(interval);
    }
  }, [trialEndsAt, subscriptionEndsAt, isPro]);

  // 年付 Pro 用户（没有 subscriptionEndsAt，说明是年付会员）
  if (isPro && !subscriptionEndsAt) {
    return (
      <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/50 text-amber-400 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
        <span className="text-lg">👑</span>
        <span className="text-amber-300">Pro (Yearly)</span>
      </div>
    );
  }

  // 月付 Pro 用户（有 subscriptionEndsAt）
  if (isPro && subscriptionEndsAt) {
    return (
      <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-400/50 text-amber-400 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
        <span className="text-lg">👑</span>
        <span className="text-amber-300">Pro</span>
        <span className="text-amber-300/70 text-xs">
          ({timeLeft.days}d {timeLeft.hours}h left)
        </span>
      </div>
    );
  }

  // 试用用户显示倒计时
  return (
    <div className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-3 backdrop-blur-sm">
      <span className="text-white font-bold">Trial User</span>
      <div className="h-4 w-px bg-white/20" />
      <span className="text-white/70 text-xs">
        {timeLeft.days}d {timeLeft.hours}h left
      </span>
    </div>
  );
}
