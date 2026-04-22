"use client";

import React from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { User, Shield, CreditCard, Bell, LogOut, ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

export default function SettingsPage({ params }: { params: { lang: string } }) {
  const { user } = useUser();
  const lang = params.lang || "en";

  const sections = [
    {
      title: lang === "en" ? "Account" : "账号设置",
      icon: User,
      content: (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
             <User className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{user?.primaryEmailAddress?.emailAddress || "Loading..."}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 italic">Personal Account</p>
          </div>
        </div>
      )
    },
    {
      title: lang === "en" ? "Subscription" : "订阅计划",
      icon: CreditCard,
      content: (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Free Plan</h4>
            <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold border border-white/10 text-slate-400">Current</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "en" 
              ? "You are currently on the free version. Upgrade to Pro for unlimited HD wallpapers." 
              : "您目前使用的是免费版。升级 Pro 以获取无限高清壁纸。"}
          </p>
          <Button className="w-full h-10 text-[11px] font-black uppercase tracking-widest bg-white hover:bg-slate-200 text-black rounded-xl">
             <Zap className="w-3 h-3 mr-2 fill-current" />
             Upgrade to Pro
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white/90 font-light tracking-tight pb-20">
      {/* Header */}
      <header className="px-6 py-12 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <Link href={`/${lang}/generator`} className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back to Design</span>
          </Link>
          <h1 className="text-lg font-bold tracking-widest uppercase text-white/40">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-6 pt-16 space-y-16">
        {sections.map((section, i) => (
          <section key={i} className="space-y-6">
            <div className="flex items-center gap-3 opacity-30">
              <section.icon className="w-4 h-4" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em]">{section.title}</h2>
            </div>
            {section.content}
          </section>
        ))}

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
                Sign Out
              </button>
            </SignOutButton>
        </section>
      </main>

      <footer className="mt-40 text-center opacity-10">
          <p className="text-[8px] font-bold tracking-[0.5em] uppercase">Lockscreen Todo Settings v1.0</p>
      </footer>
    </div>
  );
}
