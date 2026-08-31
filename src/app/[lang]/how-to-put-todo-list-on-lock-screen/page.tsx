import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "~/components/ui/button";
import {
  CheckCircle2,
  Smartphone,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Wallpaper,
  BellRing,
  PencilLine,
  Circle
} from "lucide-react";
import dynamic from "next/dynamic";

const RealisticPhoneMockup = dynamic(
  () => import("~/components/realistic-phone-mockup").then(mod => mod.RealisticPhoneMockup),
  { ssr: false, loading: () => <div className="w-72 h-[580px] bg-white/5 animate-pulse rounded-[3rem] mx-auto" /> }
);

const PAGE_PATH = "/how-to-put-todo-list-on-lock-screen";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const title = "How to Put a To-Do List on Your Lock Screen (iPhone & Android)";
  const description =
    "Yes, you can put a to-do list on your lock screen. Here are the 3 ways — widgets, note apps, and custom wallpapers — plus step-by-step instructions for iPhone and Android. Free, no app install.";
  return {
    title,
    description,
    alternates: { canonical: `https://lockscreentodo.com/en${PAGE_PATH}` },
    openGraph: { title, description },
  };
}

const ShowcaseWallpaper = () => (
  <div className="relative h-full w-full bg-[#050508] overflow-hidden flex flex-col items-center pt-[190px] px-5 font-sans">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent opacity-50" />

    <div className="relative z-10 w-full space-y-3.5">
      {[
        { id: 1, text: "Morning: take meds with breakfast", done: true },
        { id: 2, text: "3 PM: send the revised proposal", done: false },
        { id: 3, text: "Evening: 30 min reading", done: false },
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
      <div className="p-3 rounded-full bg-white/5 border border-white/5"><Clock className="w-5 h-5" /></div>
    </div>
  </div>
);

const methods = [
  {
    icon: Wallpaper,
    title: "1. Task wallpaper (recommended)",
    verdict: "Best for most people",
    desc: "Generate an image with your to-do list and set it as your lock screen wallpaper. Works on every iPhone and Android phone, fits a full list, no app install, zero battery. The only downside: you re-generate it when priorities change.",
  },
  {
    icon: Smartphone,
    title: "2. Lock screen widget",
    verdict: "Best for one live item",
    desc: "On iOS 16+ you can add small widgets below the clock. They are capped at a few slots and one or two words each, so they suit a single next task or a habit streak, not a real list. Many Android skins removed lock screen widgets entirely.",
  },
  {
    icon: BellRing,
    title: "3. Persistent notification",
    verdict: "Best for time-based nags",
    desc: "Apps like Apple Reminders can pin a notification to the lock screen. It works, but notifications are designed to be dismissed — and they mix your priorities in with every other alert competing for attention.",
  },
];

const steps = [
  {
    step: "01",
    title: "Add your tasks",
    desc: "Open the generator in any browser. Type your to-do items, or connect Notion with read-only OAuth to pull today's list automatically.",
  },
  {
    step: "02",
    title: "Design the wallpaper",
    desc: "Pick a template, font style, and background. Keep tasks in the lower two-thirds so the clock never covers them.",
  },
  {
    step: "03",
    title: "Save it to your phone",
    desc: "On desktop, scan the QR code to open the wallpaper on your phone. Long-press the image and save it to Photos or your gallery.",
  },
  {
    step: "04",
    title: "Set it as your lock screen",
    desc: "iPhone: long-press the lock screen > Customize, or Settings > Wallpaper. Android: open the image > Set as wallpaper > Lock screen. Done.",
  },
];

const faqData = [
  {
    q: "Can I put a to-do list on my lock screen?",
    a: "Yes. The simplest way that works on any phone is a custom task wallpaper: type your tasks (or sync them from Notion), generate the image, and set it as your lock screen wallpaper. No app install, no special permissions, and it works on both iPhone and Android.",
  },
  {
    q: "Is a lock screen to-do list free?",
    a: "Yes. Lockscreen Todo lets you create and download a basic to-do list wallpaper for free with no account. A Pro plan adds Notion sync, premium backgrounds, and advanced styling.",
  },
  {
    q: "Will the list on my lock screen update automatically?",
    a: "Not yet. iOS and Android do not let websites change the lock screen for you, so you regenerate the wallpaper when priorities change and re-set it — under a minute. We are exploring iOS Shortcuts integration for automatic rotation.",
  },
  {
    q: "Is it private? Who can see my tasks?",
    a: "Anything on your lock screen is visible to anyone holding your phone, so avoid passwords or sensitive details. On our side, tasks you type stay on your device, and Notion sync is read-only — we never store your task data.",
  },
  {
    q: "What is the difference between a lock screen widget and a wallpaper for to-do lists?",
    a: "Widgets show one or two words in a fixed slot and are great for live data like weather. A wallpaper uses the whole screen, fits a real list, and works identically on every phone. See our full widget vs wallpaper comparison.",
  },
];

export default function HowToPutTodoListOnLockScreenPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to put a to-do list on your lock screen",
    description:
      "Create a custom to-do list wallpaper and set it as your iPhone or Android lock screen. No app install required.",
    totalTime: "PT1M",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020205]/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Lockscreen Todo</span>
          </Link>
          <Link href={`/${lang}/generator`}>
            <Button variant="outline" className="border-white/10 hover:bg-white hover:text-black rounded-full text-xs font-bold uppercase tracking-widest px-6 transition-all">
              Launch App
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto max-w-6xl px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <PencilLine className="w-3 h-3" />
                <span>Step-by-Step Guide</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                How to Put a <br/>
                <span className="text-indigo-500">To-Do List</span> <br/>
                on Your Lock Screen
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Yes, you can put a to-do list on your lock screen — on any iPhone or Android phone. Here are the three ways to do it, and the one that takes under a minute with no app install.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href={`/${lang}/generator`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-indigo-50 rounded-full font-bold px-10 h-14 text-base shadow-2xl shadow-white/5 transition-all hover:scale-105 active:scale-95">
                    Make My Lock Screen List
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                  Free • Works on iPhone & Android
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
              <RealisticPhoneMockup>
                <ShowcaseWallpaper />
              </RealisticPhoneMockup>
            </div>
          </div>
        </div>
      </section>

      {/* Three ways */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">The 3 Ways to Get a To-Do List on Your Lock Screen</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              All three work. They differ in how much fits, which phones support them, and how much friction they add.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {methods.map((method, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-400/5 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <method.icon className="w-7 h-7" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/80 mb-2">{method.verdict}</p>
                <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{method.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center space-x-6">
            <Link href={`/${lang}/iphone-lock-screen-todo-list`} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4">
              iPhone-specific guide
            </Link>
            <Link href={`/${lang}/android-lock-screen-todo-list`} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4">
              Android-specific guide
            </Link>
            <Link href={`/${lang}/lock-screen-widget-vs-wallpaper`} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4">
              Widget vs wallpaper deep dive
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">The Wallpaper Method, Step by Step</h2>
            <p className="text-slate-400">Four steps, under a minute, no App Store or Play Store involved.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 relative">
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#020205] border border-white/10 flex items-center justify-center text-indigo-500 font-bold">
                  {step.step}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <Link href={`/${lang}/generator`}>
              <Button variant="outline" className="h-12 px-8 rounded-full border-white/10 hover:bg-white hover:text-black transition-all">
                Try the Generator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 border-t border-white/5">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-3 mb-16 justify-center lg:justify-start">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-8">
            {faqData.map((faq, i) => (
              <div key={i} className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-lg font-bold text-indigo-400/90">{faq.q}</h4>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none" />
        <div className="container mx-auto max-w-4xl px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">Stop forgetting. <br/> Start seeing.</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Your to-do list, on the one screen you check 100+ times a day.</p>
          <Link href={`/${lang}/generator`}>
            <Button size="lg" className="bg-white text-black hover:bg-indigo-50 rounded-full font-bold px-12 h-16 text-lg shadow-2xl transition-all hover:scale-105">
              Start Your To-Do List
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 bg-black/20 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-16">
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">Product</h4>
              <ul className="space-y-2">
                <li><Link href={`/${lang}/lock-screen-todo`} className="text-sm text-slate-400 hover:text-white transition-colors">Lock Screen Todo</Link></li>
                <li><Link href={`/${lang}/generator`} className="text-sm text-slate-400 hover:text-white transition-colors">Generator</Link></li>
                <li><Link href={`/${lang}/pricing`} className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">Guides</h4>
              <ul className="space-y-2">
                <li><Link href={`/${lang}/iphone-lock-screen-todo-list`} className="text-sm text-slate-400 hover:text-white transition-colors">iPhone Lock Screen Todo List</Link></li>
                <li><Link href={`/${lang}/android-lock-screen-todo-list`} className="text-sm text-slate-400 hover:text-white transition-colors">Android Lock Screen Todo List</Link></li>
                <li><Link href={`/${lang}/lock-screen-widget-vs-wallpaper`} className="text-sm text-slate-400 hover:text-white transition-colors">Widget vs Wallpaper</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">Legal</h4>
              <ul className="space-y-2">
                <li><Link href={`/${lang}/terms`} className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href={`/${lang}/privacy`} className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center opacity-30 pt-8 border-t border-white/5">
            <p className="text-[9px] font-bold tracking-[0.6em] uppercase">© 2026 Lockscreen Todo • Built for Focus</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
