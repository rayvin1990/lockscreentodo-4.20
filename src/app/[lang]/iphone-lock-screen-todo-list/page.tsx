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
  BatteryFull,
  LayoutGrid,
  ListChecks,
  Circle
} from "lucide-react";
import dynamic from "next/dynamic";

const RealisticPhoneMockup = dynamic(
  () => import("~/components/realistic-phone-mockup").then(mod => mod.RealisticPhoneMockup),
  { ssr: false, loading: () => <div className="w-72 h-[580px] bg-white/5 animate-pulse rounded-[3rem] mx-auto" /> }
);

const PAGE_PATH = "/iphone-lock-screen-todo-list";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const title = "iPhone Lock Screen To-Do List: Best Way to Put Tasks on Your Lock Screen";
  const description =
    "The best way to make a to-do list on your iPhone lock screen: generate a custom task wallpaper in your browser. No app install, no widget slot limits, works on iOS 16 and later. Free.";
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
        { id: 1, text: "Ship pricing page by 4 PM", done: true },
        { id: 2, text: "Follow up with 2 beta users", done: false },
        { id: 3, text: "Plan tomorrow's top 3", done: false },
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

const steps = [
  {
    step: "01",
    title: "Create your list",
    desc: "Open the generator and type your tasks, or sync today's list from Notion with read-only OAuth.",
  },
  {
    step: "02",
    title: "Save the wallpaper",
    desc: "Scan the QR code with your iPhone, then long-press the image in Safari and tap Save to Photos.",
  },
  {
    step: "03",
    title: "Set it as your lock screen",
    desc: "Long-press your lock screen, tap Customize (or go to Settings > Wallpaper), choose the saved image, and position your tasks below the clock.",
  },
];

const faqData = [
  {
    q: "What is the best way to make a to-do list on my iPhone lock screen?",
    a: "A custom task wallpaper. Lock screen widgets on iOS are capped at four small rectangles plus one square, and each widget shows only one or two words. A wallpaper uses the full screen, fits a real list, needs no app install, and drains zero battery. Generate it here, save the image, and set it as your lock screen wallpaper.",
  },
  {
    q: "Does this work with iPhone lock screen widgets?",
    a: "Yes. A task wallpaper and iOS lock screen widgets coexist fine. A common setup is widgets for live data like calendar and weather, with the wallpaper carrying your actual to-do list. See our widget vs wallpaper comparison for details.",
  },
  {
    q: "Which iOS versions does this work on?",
    a: "Any iPhone that can set a lock screen wallpaper, including every iOS version with the modern lock screen editor (iOS 16 and later). The generated image is a standard high-resolution PNG sized for your device.",
  },
  {
    q: "Will the to-do list on my lock screen update automatically?",
    a: "Not yet. iOS does not allow websites to change your lock screen for you, so the workflow is manual: regenerate the wallpaper when priorities change and re-set it. It takes under a minute, and we are exploring Shortcuts integration for automatic rotation.",
  },
  {
    q: "Is it free?",
    a: "Yes. You can create and download a basic to-do list wallpaper for free, no account required. A Pro plan adds Notion sync, premium backgrounds, and advanced styling.",
  },
];

export default function IphoneLockScreenTodoListPage({ params }: { params: { lang: string } }) {
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
      "Generate a custom to-do list wallpaper and set it as your iPhone lock screen. No app install required.",
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
                <span>iPhone Lock Screen Todo List</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                iPhone Lock Screen <br/>
                <span className="text-indigo-500">To-Do List</span> <br/>
                That You Actually See
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The best way to make a to-do list on your iPhone lock screen: a custom task wallpaper. No app install, no widget slot limits, no battery drain. Works on iOS 16 and later.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href={`/${lang}/generator`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-indigo-50 rounded-full font-bold px-10 h-14 text-base shadow-2xl shadow-white/5 transition-all hover:scale-105 active:scale-95">
                    Create Your iPhone List
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                  Free • No App Install
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

      {/* Why wallpaper beats widgets */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">Why a Wallpaper Beats an iPhone Lock Screen Widget for To-Do Lists</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              iOS lock screen widgets are great for live data, but they were never designed to hold a list.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: LayoutGrid,
                title: "No slot limits",
                desc: "iOS caps the lock screen at four rectangular widgets plus one square. A wallpaper uses the entire screen, so your full list fits.",
                color: "text-amber-400",
                bg: "bg-amber-400/5"
              },
              {
                icon: ListChecks,
                title: "Real lists, not two words",
                desc: "A widget renders one or two short words. A wallpaper shows 5-8 complete tasks with typography you control.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/5"
              },
              {
                icon: BatteryFull,
                title: "Zero battery, zero install",
                desc: "A wallpaper is a static image. No background app, no polling, no App Store download, no account required to preview.",
                color: "text-blue-400",
                bg: "bg-blue-400/5"
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 group">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={`/${lang}/lock-screen-widget-vs-wallpaper`} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4">
              Read the full widget vs wallpaper comparison
            </Link>
          </div>
        </div>
      </section>

      {/* How to set it up on iPhone */}
      <section className="py-24 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">How to Put a To-Do List on Your iPhone Lock Screen</h2>
            <p className="text-slate-400">Three steps, under a minute, no App Store involved.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block -translate-y-1/2" />
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#020205] border border-white/10 flex items-center justify-center mx-auto text-indigo-500 font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center space-y-6">
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Tip: keep your tasks in the lower two-thirds of the image so the clock never covers them. On Android? See the{" "}
              <Link href={`/${lang}/android-lock-screen-todo-list`} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                Android lock screen to-do list guide
              </Link>.
            </p>
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
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">Your tasks, every time <br/> you pick up your iPhone.</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Generate a free lock screen to-do list wallpaper in under a minute.</p>
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
                <li><Link href={`/${lang}/how-to-put-todo-list-on-lock-screen`} className="text-sm text-slate-400 hover:text-white transition-colors">How-To Guide</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">Guides</h4>
              <ul className="space-y-2">
                <li><Link href={`/${lang}/android-lock-screen-todo-list`} className="text-sm text-slate-400 hover:text-white transition-colors">Android Lock Screen Todo List</Link></li>
                <li><Link href={`/${lang}/lock-screen-widget-vs-wallpaper`} className="text-sm text-slate-400 hover:text-white transition-colors">Widget vs Wallpaper</Link></li>
                <li><Link href={`/${lang}/notion-task-lock-screen`} className="text-sm text-slate-400 hover:text-white transition-colors">Notion Task Lock Screen</Link></li>
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
