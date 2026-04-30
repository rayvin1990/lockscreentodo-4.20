"use client";

import React, { useEffect, useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { User, CreditCard, Bell, LogOut, ArrowLeft, Zap, Clock, Download, Image, Calendar, TrendingUp, CheckCircle2, XCircle, Smartphone, Volume2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AgentDevice {
  id: string;
  agent_api_key: string;
  device_name: string;
  device_id: string | null;
  notification_provider: string | null;
  tts_enabled: boolean;
  tts_quiet_hours_start: string | null;
  tts_quiet_hours_end: string | null;
}

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
  const [agentDevice, setAgentDevice] = useState<AgentDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingDevice, setSavingDevice] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch('/api/user/dashboard').then(res => res.json()),
        fetch('/api/user/agent-devices').then(res => res.json())
      ])
        .then(([payload, devicePayload]) => {
          if (payload.error) throw new Error(payload.error);
          setData(payload);
          if (devicePayload.devices && devicePayload.devices.length > 0) {
            setAgentDevice(devicePayload.devices[0]);
          }
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

  const handleCreateDevice = async () => {
    setSavingDevice(true);
    try {
      const res = await fetch('/api/user/agent-devices?action=create', { method: 'POST' });
      const { device, error } = await res.json();
      if (error) throw new Error(error);
      setAgentDevice(device);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating device");
    } finally {
      setSavingDevice(false);
    }
  };

  const handleUpdateDevice = async (updates: Partial<AgentDevice>) => {
    if (!agentDevice) return;
    setSavingDevice(true);
    // optimistic update
    const prev = { ...agentDevice };
    setAgentDevice({ ...agentDevice, ...updates });
    try {
      const payload = { ...agentDevice, ...updates };
      const res = await fetch('/api/user/agent-devices?action=update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const { device, error } = await res.json();
      if (error) throw new Error(error);
      setAgentDevice(device);
    } catch (err) {
      setAgentDevice(prev);
      alert(err instanceof Error ? err.message : "Error updating device");
    } finally {
      setSavingDevice(false);
    }
  };

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

        {/* Lockscreen Agent & Push Configuration */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 opacity-30">
            <Smartphone className="w-4 h-4" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em]">{lang === "en" ? "Agent Push & Lockscreen" : "Agent 推送与锁屏"}</h2>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
            {!agentDevice ? (
              <div className="text-center py-6">
                <Smartphone className="w-12 h-12 mx-auto text-slate-500 mb-4 opacity-50" />
                <h3 className="text-lg font-bold mb-2">{lang === "en" ? "Enable Lockscreen Agent" : "启用锁屏 Agent"}</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
                  {lang === "en" 
                    ? "Connect AI agents (like OpenClaw or Zapier) to push critical tasks directly to your phone lock screen."
                    : "连接 AI Agent (如 OpenClaw 或 Zapier)，将紧急任务直接推送到手机锁屏。"}
                </p>
                <Button onClick={handleCreateDevice} disabled={savingDevice} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold px-8">
                  {savingDevice ? "..." : (lang === "en" ? "Generate API Key" : "生成 API Key")}
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">1. API Key</h4>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center">
                    <code className="text-xs text-slate-300 font-mono">{agentDevice.agent_api_key}</code>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-slate-400 hover:text-white" onClick={() => navigator.clipboard.writeText(agentDevice.agent_api_key)}>
                      {lang === "en" ? "COPY" : "复制"}
                    </Button>
                  </div>
                  <p className="text-[10px] text-slate-500">{lang === "en" ? "Use this key in OpenClaw or your Webhook settings." : "在 OpenClaw 或 Webhook 中使用此 Key。"}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">2. iOS Shortcut Setup</h4>
                  <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {lang === "en" 
                        ? "To automatically update your wallpaper when an agent pushes a task, you need to set up an iOS Shortcut."
                        : "为了在 Agent 推送任务时自动更新壁纸，你需要设置一个 iOS 快捷指令。"}
                    </p>
                    <a href={`/api/lockscreen/shortcut?key=${agentDevice.agent_api_key}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-bold text-indigo-400 hover:text-indigo-300">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {lang === "en" ? "Test Shortcut Endpoint" : "测试快捷指令接口"}
                    </a>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">3. Push Notifications</h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-slate-500">Provider</label>
                      <select 
                        value={agentDevice.notification_provider || "bark"} 
                        onChange={(e) => handleUpdateDevice({ notification_provider: e.target.value })}
                        disabled={savingDevice}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      >
                        <option value="none">None (Silent)</option>
                        <option value="bark">Bark</option>
                        <option value="pushcut">Pushcut</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-slate-500">Device Key (Bark Key / Pushcut Secret)</label>
                      <input 
                        type="text" 
                        value={agentDevice.device_id || ""}
                        onChange={(e) => setAgentDevice({ ...agentDevice, device_id: e.target.value })}
                        onBlur={(e) => handleUpdateDevice({ device_id: e.target.value })}
                        placeholder="e.g. Y7xxxxx"
                        disabled={savingDevice}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">4. Siri TTS (Read Aloud)</h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={agentDevice.tts_enabled}
                        onChange={(e) => handleUpdateDevice({ tts_enabled: e.target.checked })}
                        disabled={savingDevice}
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                  
                  {agentDevice.tts_enabled && (
                    <div className="grid gap-4 sm:grid-cols-2 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500">Quiet Hours Start</label>
                        <input 
                          type="time" 
                          value={agentDevice.tts_quiet_hours_start || "22:00"}
                          onChange={(e) => setAgentDevice({ ...agentDevice, tts_quiet_hours_start: e.target.value })}
                          onBlur={(e) => handleUpdateDevice({ tts_quiet_hours_start: e.target.value })}
                          disabled={savingDevice}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white [color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500">Quiet Hours End</label>
                        <input 
                          type="time" 
                          value={agentDevice.tts_quiet_hours_end || "08:00"}
                          onChange={(e) => setAgentDevice({ ...agentDevice, tts_quiet_hours_end: e.target.value })}
                          onBlur={(e) => handleUpdateDevice({ tts_quiet_hours_end: e.target.value })}
                          disabled={savingDevice}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white [color-scheme:dark]"
                        />
                      </div>
                      <p className="sm:col-span-2 text-[10px] text-slate-500 leading-relaxed">
                        {lang === "en" 
                          ? "During quiet hours, only 'Critical' priority alerts will be spoken aloud."
                          : "在免打扰时段内，只有“紧急(Critical)”级别的提醒会被 Siri 播报。"}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
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
