"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, Sparkles, Lightbulb, CheckCircle2, Circle, Palette, Zap, QrCode, Smartphone } from "lucide-react";

// 使用 dynamic import 并禁用 SSR
const RealisticPhoneMockup = dynamic(
  () => import("~/components/realistic-phone-mockup").then(mod => mod.RealisticPhoneMockup),
  { ssr: false, loading: () => <div className="w-48 aspect-[9/19] bg-white/5 animate-pulse rounded-[2rem] mx-auto" /> }
);

const PricingComparisonTable = dynamic(
  () => import("~/components/pricing-comparison-table").then(mod => mod.PricingComparisonTable),
  { ssr: false }
);

const InspirationPanel = dynamic(
  () => import("~/components/inspiration-panel").then(mod => mod.InspirationPanel),
  { ssr: false }
);

// 强力显眼的锁屏样板组件
const ShowcaseWallpaper = () => (
  <div className="relative h-full w-full bg-[#050508] overflow-hidden flex flex-col items-center pt-16 px-5 font-sans">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent opacity-50" />
    
    <div className="relative z-10 text-center space-y-0.5 mb-14 opacity-80">
      <div className="text-white/50 text-[9px] font-bold tracking-[0.4em] uppercase">Wednesday, April 22</div>
      <div className="text-white text-5xl font-medium tracking-tight">09:41</div>
    </div>

    <div className="relative z-10 w-full space-y-3.5">
      {[
        { id: 1, text: "Finish V2 Stress Test", done: true },
        { id: 2, text: "Review Marketing Assets", done: false },
        { id: 3, text: "Prepare for Launch", done: false },
      ].map((task) => (
        <div 
          key={task.id} 
          className={`p-4 rounded-2xl border-2 transition-all shadow-2xl ${
            task.done 
            ? "bg-white/5 border-white/5 opacity-40 scale-95" 
            : "bg-white/15 border-white/20 shadow-indigo-500/20 scale-100"
          }`}
        >
          <div className="flex items-center gap-4">
            {task.done ? (
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-white/40 shrink-0" />
            )}
            <div className={`text-[13px] font-bold tracking-wide truncate ${task.done ? "text-white/40 line-through" : "text-white"}`}>
              {task.text}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="absolute bottom-12 flex gap-12 text-white/20">
      <div className="p-3 rounded-full bg-white/5 border border-white/5"><Sparkles className="w-5 h-5" /></div>
      <div className="p-3 rounded-full bg-white/5 border border-white/5"><Lightbulb className="w-5 h-5" /></div>
    </div>
  </div>
);

export default function LocaleHomePage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en";
  const [isInspirationOpen, setIsInspirationOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] text-white/90 selection:bg-white/10 font-light tracking-tight antialiased">
      
      {/* 结构化数据 SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Lockscreen Todo",
            "operatingSystem": "iOS, Android",
            "applicationCategory": "ProductivityApplication",
            "description": "Minimalist lockscreen todo wallpaper generator."
          })
        }}
      />

      {/* Hero Section - 已彻底清理背景阴影层 */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            <div className="flex-1 space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 text-[9px] font-bold tracking-[0.3em] uppercase text-white/30 border-b border-white/10 pb-1 mx-auto lg:mx-0">
                <Sparkles className="w-2.5 h-2.5" />
                <span>The Focus Engine</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Your Tasks. <br/>
                On Your Lockscreen.
              </h1>
              
              <p className="text-base text-slate-500 max-w-sm leading-relaxed mx-auto lg:mx-0">
                Stay focused without unlocking your phone. A minimal, precise workflow for your daily goals.
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-2">
                <Link href={`/${lang}/generator`}>
                  <Button variant="outline" className="h-12 px-8 text-[12px] font-bold tracking-widest uppercase border-white/20 hover:bg-white hover:text-black rounded-none transition-all shadow-xl shadow-white/5">
                    Start Now
                  </Button>
                </Link>
                <Link href="#pricing" className="text-[11px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-[320px] relative">
              {/* 这里原本那个碍眼的“不规则阴影背景层”已被旺财彻底铲除 */}
              <div className="relative">
                <RealisticPhoneMockup>
                  <ShowcaseWallpaper />
                </RealisticPhoneMockup>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Use Cases */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap justify-center lg:justify-between gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
             {["Students", "Fitness", "Medication", "Reminders", "Habit Building"].map((tag, i) => (
               <span key={i} className="hover:text-white/40 transition-colors cursor-default">{tag}</span>
             ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-32 border-b border-white/5">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { icon: Palette, title: "Design", desc: "Minimal style." },
              { icon: Zap, title: "Build", desc: "HD Render." },
              { icon: QrCode, title: "Scan", desc: "Safe delivery." },
              { icon: Smartphone, title: "Set", desc: "Done." },
            ].map((step, i) => (
              <div key={i} className="space-y-4 group text-center lg:text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all mx-auto lg:mx-0">
                  <step.icon className="w-5 h-5" />
                </div>
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/60">{step.title}</h4>
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.15em]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-40 bg-white/[0.01]">
        <div className="container mx-auto max-w-2xl px-6 text-center lg:text-left">
          <h2 className="text-[10px] font-black mb-24 tracking-[0.6em] uppercase text-white/20 italic mx-auto lg:mx-0">Question & Answer</h2>
          <div className="space-y-12">
            {[
              { q: "Setup Guide", a: "Generate your custom wallpaper, scan the secure QR code on your mobile device, and set the saved image as your lockscreen via Settings." },
              { q: "Privacy First", a: "Your tasks are processed in a temporary environment and are never stored on our servers. We value your focus and your data." },
              { q: "HD Quality", a: "Our rendering engine ensures pixel-perfect clarity for all modern iPhone and Android screen resolutions." }
            ].map((faq, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400/80">{faq.q}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-40 border-t border-white/5">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center mb-20 space-y-3 opacity-40">
             <h2 className="text-xl font-bold tracking-[0.3em] uppercase">Pricing</h2>
             <div className="w-12 h-px bg-white/30 mx-auto" />
          </div>
          <div className="scale-95 lg:scale-100 origin-top opacity-90 hover:opacity-100 transition-opacity duration-700">
            <PricingComparisonTable />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 text-center opacity-30 border-t border-white/5">
          <p className="text-[9px] font-bold tracking-[0.6em] uppercase">© 2026 Lockscreen Todo • Built for Focus</p>
      </footer>

      {isInspirationOpen && (
        <InspirationPanel 
          isEnglish={lang === 'en'} 
          onClose={() => setIsInspirationOpen(false)} 
        />
      )}
    </div>
  );
}
