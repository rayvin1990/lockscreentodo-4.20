import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "~/components/ui/button";
import { 
  CheckCircle2, 
  Smartphone, 
  Zap, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  Lock,
  Smartphone as PhoneIcon,
  Circle
} from "lucide-react";
import dynamic from "next/dynamic";

const RealisticPhoneMockup = dynamic(
  () => import("~/components/realistic-phone-mockup").then(mod => mod.RealisticPhoneMockup),
  { ssr: false, loading: () => <div className="w-72 h-[580px] bg-white/5 animate-pulse rounded-[3rem] mx-auto" /> }
);

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return {
    title: "Lock Screen Todo — Turn Your Lock Screen Into a To-Do List",
    description: "Create a personalized lock screen with your tasks, reminders, or habits. No app. No install. Works instantly.",
    openGraph: {
      title: "Lock Screen Todo — Turn Your Lock Screen Into a To-Do List",
      description: "Create a personalized lock screen with your tasks, reminders, or habits. No app. No install. Works instantly.",
    }
  };
}

const ShowcaseWallpaper = () => (
  <div className="relative h-full w-full bg-[#050508] overflow-hidden flex flex-col items-center pt-[190px] px-5 font-sans">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent opacity-50" />

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
      <div className="p-3 rounded-full bg-white/5 border border-white/5"><Clock className="w-5 h-5" /></div>
    </div>
  </div>
);

export default function LockScreenTodoPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "en";

  const faqData = [
    {
      q: "Can I put a to-do list on my phone's lock screen?",
      a: "Yes! Our tool allows you to create a custom wallpaper with your tasks, making them visible every time you look at your phone without needing to unlock it. This helps you stay focused and ensures you never forget your most important tasks."
    },
    {
      q: "Does it work on both iPhone and Android?",
      a: "Absolutely. The generated image is a standard high-resolution wallpaper that works perfectly on all iOS and Android devices. You simply save the image to your gallery and set it as your lock screen wallpaper."
    },
    {
      q: "Do I need to install an app?",
      a: "No app installation is required. Everything works directly in your mobile browser. This saves you storage space and protects your privacy. Just generate, save, and set as wallpaper—it takes less than a minute."
    },
    {
      q: "Is it free to use?",
      a: "We offer a free version that allows you to create basic to-do wallpapers. For advanced features like Notion sync, premium backgrounds, and advanced styling, we offer a Pro plan. No hidden fees or subscriptions unless you choose to upgrade."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                <Sparkles className="w-3 h-3" />
                <span>Productivity Reimagined</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                Lock Screen Todo <br/>
                <span className="text-indigo-500">—</span> <br/>
                Turn Your Lock Screen Into a To-Do List
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Create a personalized lock screen with your tasks, reminders, or habits. No app. No install. Works instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href={`/${lang}/generator`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-indigo-50 rounded-full font-bold px-10 h-14 text-base shadow-2xl shadow-white/5 transition-all hover:scale-105 active:scale-95">
                    Create Your List Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                  100% Secure • No Install
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

      {/* Use Cases */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">Built for Every Goal</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Whether you&apos;re a student, professional, or just want to build better habits, Lockscreen Todo keeps you on track.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "Stay on track", 
                desc: "Never forget your daily goals. Your top tasks are visible every time you check the time.",
                color: "text-amber-400",
                bg: "bg-amber-400/5"
              },
              { 
                icon: ShieldCheck, 
                title: "Build habits", 
                desc: "Perfect for tracking new habits like drinking water, stretching, or reading. Consistency made visual.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/5"
              },
              { 
                icon: Clock, 
                title: "Perfect for reminders", 
                desc: "Great for medication reminders, grocery lists, or urgent errands that you can&apos;t afford to miss.",
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
        </div>
      </section>

      {/* No App Advantage */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">No App. No Install. <br/> Zero Friction.</h2>
              <div className="space-y-6">
                {[
                  { title: "Browser-Based", desc: "Generate your list directly in your mobile browser. No need to visit an App Store." },
                  { title: "Battery Friendly", desc: "Since it&apos;s just a wallpaper, it consumes zero background battery life." },
                  { title: "Privacy First", desc: "Your data stays on your device. We don&apos;t track your tasks or store personal info." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] pointer-events-none" />
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-2xl backdrop-blur-sm">
                 <div className="aspect-square flex items-center justify-center">
                    <div className="relative">
                      <PhoneIcon className="w-32 h-32 text-indigo-500 opacity-20" />
                      <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-indigo-400" />
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                 </div>
                 <div className="mt-8 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">Works Everywhere</p>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-tighter">iOS 16+ • Android 12+ • All Browsers</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">How it Works</h2>
            <p className="text-slate-400">Three simple steps to focus.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block -translate-y-1/2" />
            {[
              { step: "01", title: "Create", desc: "Add your tasks and choose a beautiful background in our generator." },
              { step: "02", title: "Generate", desc: "Our engine renders a pixel-perfect HD wallpaper for your specific phone." },
              { step: "03", title: "Set", desc: "Save the image and set it as your lock screen. You&apos;re done!" }
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#020205] border border-white/10 flex items-center justify-center mx-auto text-indigo-500 font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
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
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">Ready to boost <br/> your focus?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Join thousands of users who are staying organized without unlocking their phones.</p>
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
                <li><Link href={`/${lang}/reminder-wallpaper`} className="text-sm text-slate-400 hover:text-white transition-colors">Reminder Wallpaper</Link></li>
                <li><Link href={`/${lang}/generator`} className="text-sm text-slate-400 hover:text-white transition-colors">Generator</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">Solutions</h4>
              <ul className="space-y-2">
                <li><Link href={`/${lang}/lock-screen-todo`} className="text-sm text-slate-400 hover:text-white transition-colors">Daily Tasks</Link></li>
                <li><Link href={`/${lang}/reminder-wallpaper`} className="text-sm text-slate-400 hover:text-white transition-colors">Medication Reminders</Link></li>
                <li><Link href={`/${lang}/lock-screen-todo`} className="text-sm text-slate-400 hover:text-white transition-colors">Habit Tracker</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
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
