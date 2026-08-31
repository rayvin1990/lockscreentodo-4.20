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
  ListChecks,
  Circle
} from "lucide-react";
import dynamic from "next/dynamic";

const RealisticPhoneMockup = dynamic(
  () => import("~/components/realistic-phone-mockup").then(mod => mod.RealisticPhoneMockup),
  { ssr: false, loading: () => <div className="w-72 h-[580px] bg-white/5 animate-pulse rounded-[3rem] mx-auto" /> }
);

const PAGE_PATH = "/android-lock-screen-todo-list";

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const title = "Android Lock Screen To-Do List: Put Your Tasks on Your Lock Screen";
  const description =
    "Put a to-do list on your Android lock screen with a custom task wallpaper. No app install, works on Samsung, Pixel, and every Android phone. Free generator.";
  return {
    title,
    description,
    alternates: { canonical: `https://lockscreentodo.com/en${PAGE_PATH}` },
    openGraph: { title, description },
  };
}

const ShowcaseWallpaper = () => (
  <div className="relative h-full w-full bg-[#050508] overflow-hidden flex flex-col items-center pt-[190px] px-5 font-sans">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent opacity-50" />

    <div className="relative z-10 w-full space-y-3.5">
      {[
        { id: 1, text: "Gym: upper body at 7 AM", done: true },
        { id: 2, text: "Reply to urgent emails by 3 PM", done: false },
        { id: 3, text: "Pick up package on way home", done: false },
      ].map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-2xl border-2 transition-all shadow-2xl ${
            task.done
            ? "bg-white/5 border-white/5 opacity-40 scale-95"
            : "bg-white/15 border-white/20 shadow-emerald-500/20 scale-100"
          }`}
        >
          <div className="flex items-center gap-4">
            {task.done ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
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
    desc: "Open the generator in Chrome on your Android phone and type your tasks, or sync today's list from Notion.",
  },
  {
    step: "02",
    title: "Save the wallpaper",
    desc: "Download the generated image. It lands in your gallery like any other picture, sized for your screen.",
  },
  {
    step: "03",
    title: "Set it as your lock screen",
    desc: "Open the image, tap Set as wallpaper, and choose Lock screen. On Samsung: Settings > Wallpaper and style. On Pixel: long-press the home screen > Wallpaper & style.",
  },
];

const faqData = [
  {
    q: "Can I put a to-do list on my Android lock screen?",
    a: "Yes. The most reliable way is a custom task wallpaper: generate an image with your to-do list, save it, and set it as your lock screen wallpaper. It works on every Android phone — Samsung, Pixel, Xiaomi, OnePlus — because it uses the standard wallpaper setting, not a special widget API.",
  },
  {
    q: "Does it work on Samsung Galaxy phones?",
    a: "Yes. Save the generated wallpaper, then go to Settings > Wallpaper and style > Change wallpapers, pick the image, and select Lock screen. Samsung's One UI honors lock screen wallpapers independently from the home screen.",
  },
  {
    q: "Is a wallpaper better than an Android lock screen widget?",
    a: "For to-do lists, usually yes. Android lock screen widgets vary heavily by manufacturer and Android version, and many skins removed them entirely. A wallpaper looks identical on every device, fits a full list, and uses zero battery.",
  },
  {
    q: "Will the to-do list update automatically?",
    a: "Not yet. Android does not allow websites to change your lock screen on your behalf, so you regenerate the wallpaper when priorities change and re-set it. It takes under a minute.",
  },
  {
    q: "Is it free?",
    a: "Yes. Create and download a basic to-do list wallpaper for free, no account required. A Pro plan adds Notion sync, premium backgrounds, and advanced styling.",
  },
];

export default function AndroidLockScreenTodoListPage({ params }: { params: { lang: string } }) {
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
    name: "How to put a to-do list on your Android lock screen",
    description:
      "Generate a custom to-do list wallpaper and set it as your Android lock screen. No app install required.",
    totalTime: "PT1M",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] text-white selection:bg-emerald-500/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020205]/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto max-w-6xl px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Smartphone className="w-3 h-3" />
                <span>Android Lock Screen Todo List</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                Android Lock Screen <br/>
                <span className="text-emerald-500">To-Do List</span> <br/>
                On Any Phone
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Put a to-do list on your Android lock screen with a custom task wallpaper. Samsung, Pixel, Xiaomi, OnePlus — if it can set a wallpaper, it works. No app install.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href={`/${lang}/generator`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-emerald-50 rounded-full font-bold px-10 h-14 text-base shadow-2xl shadow-white/5 transition-all hover:scale-105 active:scale-95">
                    Create Your Android List
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                  Free • No App Install
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
              <RealisticPhoneMockup>
                <ShowcaseWallpaper />
              </RealisticPhoneMockup>
            </div>
          </div>
        </div>
      </section>

      {/* Why wallpaper on Android */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">Why a Wallpaper Is the Reliable Way on Android</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Android lock screen widgets depend on your manufacturer and Android version. A wallpaper does not.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Works on every Android skin",
                desc: "One UI, Pixel UI, MIUI, OxygenOS — many removed lock screen widgets entirely. Every one of them still sets wallpapers.",
                color: "text-amber-400",
                bg: "bg-amber-400/5"
              },
              {
                icon: ListChecks,
                title: "A full list, not a glance strip",
                desc: "Widgets and glance strips show one line. A wallpaper fits 5-8 complete tasks with typography you control.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/5"
              },
              {
                icon: BatteryFull,
                title: "Zero battery, zero permissions",
                desc: "A static image needs no background service, no accessibility permission, and no account. Your tasks stay on your device.",
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
            <Link href={`/${lang}/lock-screen-widget-vs-wallpaper`} className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4">
              Read the full widget vs wallpaper comparison
            </Link>
          </div>
        </div>
      </section>

      {/* How to set it up on Android */}
      <section className="py-24 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">How to Put a To-Do List on Your Android Lock Screen</h2>
            <p className="text-slate-400">Three steps, under a minute, no Play Store involved.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block -translate-y-1/2" />
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#020205] border border-white/10 flex items-center justify-center mx-auto text-emerald-500 font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center space-y-6">
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Tip: when cropping, keep tasks in the lower two-thirds of the image so the clock and fingerprint icon never cover them. On iPhone? See the{" "}
              <Link href={`/${lang}/iphone-lock-screen-todo-list`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
                iPhone lock screen to-do list guide
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
            <HelpCircle className="w-6 h-6 text-emerald-500" />
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-8">
            {faqData.map((faq, i) => (
              <div key={i} className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-lg font-bold text-emerald-400/90">{faq.q}</h4>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/10 pointer-events-none" />
        <div className="container mx-auto max-w-4xl px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">Your tasks, every time <br/> you pick up your phone.</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Generate a free Android lock screen to-do list wallpaper in under a minute.</p>
          <Link href={`/${lang}/generator`}>
            <Button size="lg" className="bg-white text-black hover:bg-emerald-50 rounded-full font-bold px-12 h-16 text-lg shadow-2xl transition-all hover:scale-105">
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
                <li><Link href={`/${lang}/iphone-lock-screen-todo-list`} className="text-sm text-slate-400 hover:text-white transition-colors">iPhone Lock Screen Todo List</Link></li>
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
