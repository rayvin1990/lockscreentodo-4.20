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
  Circle,
  Image,
  Settings,
  QrCode,
} from "lucide-react";
import dynamic from "next/dynamic";

const RealisticPhoneMockup = dynamic(
  () => import("~/components/realistic-phone-mockup").then(mod => mod.RealisticPhoneMockup),
  { ssr: false, loading: () => <div className="w-72 h-[580px] bg-white/5 animate-pulse rounded-[3rem] mx-auto" /> }
);

const PAGE_PATH = "/how-to-put-todo-list-on-iphone-lock-screen";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const title = "How to Put a To-Do List on Your iPhone Lock Screen (2026 Guide)";
  const description =
    "Step-by-step: put a to-do list on your iPhone lock screen using widgets, screenshots, or a custom wallpaper. Free method that works on any iPhone — no app install required.";
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
        { id: 1, text: "Review pull requests", done: true },
        { id: 2, text: "3 PM: dentist appointment", done: false },
        { id: 3, text: "Buy groceries for dinner", done: false },
        { id: 4, text: "Call mom back", done: false },
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
    title: "1. Custom task wallpaper (recommended)",
    verdict: "Best overall",
    desc: "Generate an image with your to-do list and set it as your lock screen wallpaper. Works on every iPhone model, fits a full list, no app install, zero battery drain. Re-generate when priorities change — takes under a minute.",
    ios: "All iPhones",
  },
  {
    icon: Smartphone,
    title: "2. Lock screen widget (iOS 16+)",
    verdict: "Best for one live item",
    desc: "On iOS 16 and later, you can add small widgets below the clock. They're limited to a few slots and show one or two words each — great for a single next task or a habit streak, but not a real list.",
    ios: "iOS 16+",
  },
  {
    icon: BellRing,
    title: "3. Pinned notification",
    verdict: "Best for time-based reminders",
    desc: "Apple Reminders can pin a notification to your lock screen. It works, but notifications are designed to be dismissed — and your priorities get mixed in with every other alert competing for attention.",
    ios: "All iPhones",
  },
  {
    icon: Image,
    title: "4. Screenshot method",
    verdict: "Quick but manual",
    desc: "Write your to-do list in any notes app, take a screenshot, and set it as your lock screen. Works instantly but looks plain, and you have to re-screenshot every time a task changes.",
    ios: "All iPhones",
  },
];

const steps = [
  {
    step: "01",
    icon: PencilLine,
    title: "Add your tasks",
    desc: "Open the generator in Safari or any browser. Type your to-do items, or connect Notion with read-only OAuth to pull today's list automatically.",
  },
  {
    step: "02",
    icon: Settings,
    title: "Design the wallpaper",
    desc: "Pick a background, font style, and layout. Keep tasks in the lower two-thirds so the clock never covers them. Preview it live before generating.",
  },
  {
    step: "03",
    icon: QrCode,
    title: "Save to your iPhone",
    desc: "If you're on desktop, scan the QR code to open the wallpaper on your iPhone. Long-press the image and tap \"Save to Photos.\" If you're already on your iPhone, just save directly.",
  },
  {
    step: "04",
    icon: Smartphone,
    title: "Set as lock screen",
    desc: "Open Settings > Wallpaper > Add New Wallpaper, select the image you just saved, pinch to position it, and tap \"Set as Wallpaper Pair\" or \"Customize Home Screen\" to use it only on the lock screen.",
  },
];

const faqData = [
  {
    q: "Can I put a to-do list on my iPhone lock screen?",
    a: "Yes. The simplest method that works on any iPhone is a custom task wallpaper: type your tasks (or sync them from Notion), generate the image, and set it as your lock screen wallpaper. No app install, no special permissions, and it works on every iPhone model.",
  },
  {
    q: "How do I put a to-do list on my iPhone lock screen without an app?",
    a: "Use a web-based wallpaper generator like Lockscreen Todo. Open it in Safari, type your tasks, generate a wallpaper image, save it to Photos, and set it as your lock screen in Settings > Wallpaper. The entire process takes under a minute and doesn't require installing anything.",
  },
  {
    q: "Is there a to-do list widget for iPhone lock screen?",
    a: "iOS 16+ supports lock screen widgets, but they're limited to small slots below the clock — typically one or two words. They're great for a single next task or habit streak, but can't display a full to-do list. A wallpaper uses the entire screen and fits a real list.",
  },
  {
    q: "Will my to-do list on the lock screen update automatically?",
    a: "Not yet. iOS does not allow websites to change the lock screen automatically, so you regenerate the wallpaper when priorities change and re-set it — under a minute. We're exploring iOS Shortcuts integration for automatic rotation.",
  },
  {
    q: "Is it private? Who can see my tasks on the lock screen?",
    a: "Anything on your lock screen is visible to anyone holding your phone, so avoid passwords or sensitive details. On our side, tasks you type stay on your device, and Notion sync is read-only — we never store your task data.",
  },
  {
    q: "What iPhone models does this work on?",
    a: "All of them. The wallpaper method works on every iPhone that can set a custom wallpaper — iPhone 8 through iPhone 16 Pro Max, and every model in between. No iOS version requirement.",
  },
];

export default function HowToPutTodoListOnIphoneLockScreenPage({ params }: { params: { lang: string } }) {
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
    name: "How to put a to-do list on your iPhone lock screen",
    description:
      "Create a custom to-do list wallpaper and set it as your iPhone lock screen. No app install required.",
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
                <Smartphone className="w-3 h-3" />
                <span>iPhone Guide</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                How to Put a <br/>
                <span className="text-indigo-500">To-Do List</span> <br/>
                on Your iPhone Lock Screen
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Four ways to get your tasks on your iPhone lock screen — from built-in widgets to a custom wallpaper. The best method takes under a minute and works on every iPhone.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href={`/${lang}/generator`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-indigo-50 rounded-full font-bold px-10 h-14 text-base shadow-2xl shadow-white/5 transition-all hover:scale-105 active:scale-95">
                    Make My iPhone Lock Screen List
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                  Free • No app install
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

      {/* Four ways comparison */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">4 Ways to Get a To-Do List on Your iPhone Lock Screen</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              All four work. They differ in how much fits, which iPhones support them, and how much friction they add.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {methods.map((method, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-400/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <method.icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 border border-white/10 rounded-full px-3 py-1">
                    {method.ios}
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/80 mb-2">{method.verdict}</p>
                <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{method.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center space-x-6">
            <Link href={`/${lang}/how-to-put-todo-list-on-lock-screen`} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4">
              Android guide
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
            <p className="text-slate-400">Four steps, under a minute, no App Store involved.</p>
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
                Try the Generator — Free
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
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">Stop unlocking your phone <br/> to check your tasks.</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Your to-do list, on the screen you already check 100+ times a day.</p>
          <Link href={`/${lang}/generator`}>
            <Button size="lg" className="bg-white text-black hover:bg-indigo-50 rounded-full font-bold px-12 h-16 text-lg shadow-2xl transition-all hover:scale-105">
              Create My Lock Screen List
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
                <li><Link href={`/${lang}/how-to-put-todo-list-on-lock-screen`} className="text-sm text-slate-400 hover:text-white transition-colors">How to Put a Todo List on Your Lock Screen</Link></li>
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
            <p className="text-[9px] font-bold tracking-[0.6em] uppercase">&copy; 2026 Lockscreen Todo &bull; Built for Focus</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
