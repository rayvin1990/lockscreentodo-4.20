"use client";

import React, { useEffect, useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { User, CreditCard, Bell, LogOut, ArrowLeft, Zap, Clock, Download, Image, Calendar, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  user: {
    email: string;
    name: string | null;
    image: string | null;
    subscriptionPlan: string;
    isPro: boolean;
    trialEndsAt: string | null;
    subscriptionEndsAt: string | null;
    notionConnected: boolean;
  };
  stats: {
    today: { generateCount: number; downloadCount: number };
    thisWeek: { generateCount: number; downloadCount: number };
    thisMonth: { generateCount: number; downloadCount: number };
  };
  usageHistory: Array<{ date: string; count: number; downloadCount: number }>;
  daysRemaining: number;
  error?: string;
}

export default function SettingsPage({ params }: { params: { lang: string } }) {
  const { user, isLoaded } = useUser();
  const lang = params.lang || "en";
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch('/api/user/dashboard')
        .then(async (res) => {
          const payload = await res.json();
          if (!res.ok || !payload.user) {
            throw new Error(payload.error || "Failed to load dashboard");
          }
          return payload as DashboardData;
        })
        .then((payload) => {
          setData(payload);
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        })
        .finally(() => setLoading(false));
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getPlanBadge = () => {
    if (!data?.user) return null;
    const { subscriptionPlan, isPro, trialEndsAt } = data.user;
    const isTrialActive = trialEndsAt && new Date(trialEndsAt) > new Date();

    if (isPro || subscriptionPlan === 'PRO') {
      if (isTrialActive) {
        return <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[9px] font-bold border border-indigo-500/30">7-DAY TRIAL</span>;
      }
      return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold border border-amber-500/30">PRO</span>;
    }
    return <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold border border-white/10 text-slate-400">FREE</span>;
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white/90 font-light tracking-tight pb-20">
      {/* Header */}
      <header className="px-6 py-12 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <Link href={`/${lang}/generator`} className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back to Design</span>
          </Link>
          <h1 className="text-lg font-bold tracking-widest uppercase text-white/40">Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-6 pt-16 space-y-16">
        {/* Account Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 opacity-30">
            <User className="w-4 h-4" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em]">{lang === "en" ? "Account" : "账号设置"}</h2>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <User className="text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{user?.primaryEmailAddress?.emailAddress || "Loading..."}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 italic">Personal Account</p>
            </div>
            {getPlanBadge()}
          </div>
        </section>

        {/* Subscription Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 opacity-30">
            <CreditCard className="w-4 h-4" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em]">{lang === "en" ? "Subscription" : "订阅计划"}</h2>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
                {data?.user.subscriptionPlan || 'FREE'} {lang === "en" ? "Plan" : "计划"}
              </h4>
              {getPlanBadge()}
            </div>

            {/* Days Remaining / Subscription Status */}
            {data && (
              <div className="grid grid-cols-2 gap-4">
                {data.user.trialEndsAt && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                      {lang === "en" ? "Trial Ends" : "试用结束"}
                    </p>
                    <p className="text-sm font-bold text-white">{formatDate(data.user.trialEndsAt)}</p>
                    <p className="text-xs text-indigo-400 mt-1">{data.daysRemaining} {lang === "en" ? "days left" : "天剩余"}</p>
                  </div>
                )}
                {data.user.subscriptionEndsAt && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                      {lang === "en" ? "Pro Expires" : "Pro 到期"}
                    </p>
                    <p className="text-sm font-bold text-white">{formatDate(data.user.subscriptionEndsAt)}</p>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === "en"
                ? data?.user.isPro
                  ? "You are a Pro subscriber with unlimited HD wallpapers."
                  : "You are currently on the free version. Upgrade to Pro for unlimited HD wallpapers."
                : data?.user.isPro
                ? "您是 Pro 订阅用户，享受无限高清壁纸。"
                : "您目前使用的是免费版。升级 Pro 以获取无限高清壁纸。"}
            </p>

            {!data?.user.isPro && (
              <Button className="w-full h-10 text-[11px] font-black uppercase tracking-widest bg-white hover:bg-slate-200 text-black rounded-xl">
                <Zap className="w-3 h-3 mr-2 fill-current" />
                {lang === "en" ? "Upgrade to Pro" : "升级 Pro"}
              </Button>
            )}
          </div>
        </section>

        {/* Generation Stats Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 opacity-30">
            <TrendingUp className="w-4 h-4" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em]">{lang === "en" ? "Generation Stats" : "生成统计"}</h2>
          </div>

          {loading ? (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-slate-500">{lang === "en" ? "Loading..." : "加载中..."}</p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{lang === "en" ? "Today" : "今日"}</p>
                  <p className="text-xl font-bold text-white mt-1">{data.stats.today.generateCount}</p>
                  <p className="text-[9px] text-slate-500"><Download className="w-3 h-3 inline mr-1" />{data.stats.today.downloadCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{lang === "en" ? "This Week" : "本周"}</p>
                  <p className="text-xl font-bold text-white mt-1">{data.stats.thisWeek.generateCount}</p>
                  <p className="text-[9px] text-slate-500"><Download className="w-3 h-3 inline mr-1" />{data.stats.thisWeek.downloadCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{lang === "en" ? "This Month" : "本月"}</p>
                  <p className="text-xl font-bold text-white mt-1">{data.stats.thisMonth.generateCount}</p>
                  <p className="text-[9px] text-slate-500"><Download className="w-3 h-3 inline mr-1" />{data.stats.thisMonth.downloadCount}</p>
                </div>
              </div>

              {/* Usage History */}
              {data.usageHistory.length > 0 && (
                <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {lang === "en" ? "Recent Usage History" : "最近使用记录"}
                    </p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {data.usageHistory.slice(0, 7).reverse().map((record: any, i: number) => (
                      <div key={i} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-400">{formatDate(record.date)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-slate-500">
                            <Image className="w-3 h-3 inline mr-1" />{record.count || 0}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            <Download className="w-3 h-3 inline mr-1" />{record.downloadCount || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* Notion Connection Status */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 opacity-30">
            <Bell className="w-4 h-4" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em]">{lang === "en" ? "Integrations" : "集成"}</h2>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data?.user.notionConnected ? 'bg-green-500/20' : 'bg-slate-500/20'}`}>
                  {data?.user.notionConnected ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Notion</p>
                  <p className="text-[10px] text-slate-500">
                    {data?.user.notionConnected
                      ? (lang === "en" ? "Connected" : "已连接")
                      : (lang === "en" ? "Not connected" : "未连接")}
                  </p>
                </div>
              </div>
              {!data?.user.notionConnected && (
                <Button
                  variant="outline"
                  className="h-8 text-[10px] font-bold uppercase tracking-widest border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                >
                  {lang === "en" ? "Connect" : "连接"}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Security / Legal */}
        <section className="pt-10 border-t border-white/5">
          <div className="flex flex-col gap-4">
            <Link href={`/${lang}/privacy`} className="text-xs text-slate-600 hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link href={`/${lang}/terms`} className="text-xs text-slate-600 hover:text-indigo-400 transition-colors">Terms of Service</Link>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-12">
          <SignOutButton>
            <button className="flex items-center gap-2 text-red-500/50 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest">
              <LogOut className="w-3 h-3" />
              {lang === "en" ? "Sign Out" : "退出登录"}
            </button>
          </SignOutButton>
        </section>
      </main>

      <footer className="mt-40 text-center opacity-10">
        <p className="text-[8px] font-bold tracking-[0.5em] uppercase">Lockscreen Todo Dashboard v1.0</p>
      </footer>
    </div>
  );
}
