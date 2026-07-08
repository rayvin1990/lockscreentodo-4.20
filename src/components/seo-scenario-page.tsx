import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, QrCode, Smartphone, Wand2 } from "lucide-react";

import { SeoScenarioAnalytics, SeoScenarioTrackedLink } from "~/components/seo-scenario-analytics";
import { Button } from "~/components/ui/button";
import { getScenarioGeneratorHref, type SeoScenario } from "~/lib/seo-scenarios";

export function SeoScenarioPage({
  lang,
  scenario,
}: {
  lang: "en" | "zh";
  scenario: SeoScenario;
}) {
  const isZh = lang === "zh";
  const tasks = scenario.tasks[lang];
  const Icon = scenario.icon;
  const generatorHref = getScenarioGeneratorHref(lang, scenario);
  const scenarioFaqs = scenario.faqs?.map((faq) => ({
    q: faq.q[lang],
    a: faq.a[lang],
  }));

  const copy = isZh
    ? {
        brand: "Lockscreen Todo",
        generator: "生成器",
        pricing: "定价",
        create: "用这个模板生成",
        secondary: "查看全部场景",
        how: "怎么用",
        steps: [
          { title: "填写", desc: "使用这个场景的示例任务，也可以换成自己的内容。" },
          { title: "生成", desc: "渲染成适合手机锁屏的高清壁纸。" },
          { title: "设置", desc: "扫码保存到手机，然后在相册里设为锁屏。" },
        ],
        examples: "示例锁屏内容",
        bestFor: "适合人群",
        faqTitle: "常见问题",
        daysLeft: "天后",
        faqs: [
          {
            q: "需要安装 App 吗？",
            a: "不需要。网页生成壁纸，手机扫码保存，再手动设为锁屏。",
          },
          {
            q: "可以改成自己的任务吗？",
            a: "可以。进入生成器后，你可以编辑任务、字体、颜色、背景和排版。",
          },
          {
            q: "能自动更新锁屏吗？",
            a: "当前版本不能。iOS 和 Android 对网页自动修改锁屏有限制，所以我们先把手动保存和设置流程打磨稳定。",
          },
        ],
      }
    : {
        brand: "Lockscreen Todo",
        generator: "Generator",
        pricing: "Pricing",
        create: "Create this template",
        secondary: "Browse use cases",
        how: "How it works",
        steps: [
          { title: "Write", desc: "Start from the example tasks or replace them with your own." },
          { title: "Generate", desc: "Render a clean HD wallpaper made for a phone lock screen." },
          { title: "Set", desc: "Scan the QR code, save the image, and set it as your lock screen." },
        ],
        examples: "Example lock screen content",
        bestFor: "Best for",
        faqTitle: "FAQ",
        daysLeft: "days left",
        faqs: [
          {
            q: "Do I need to install an app?",
            a: "No. Generate the wallpaper in your browser, scan it on your phone, then set it as your lock screen manually.",
          },
          {
            q: "Can I edit the tasks?",
            a: "Yes. The generator lets you change tasks, fonts, colors, backgrounds, and layout.",
          },
          {
            q: "Can it update my lock screen automatically?",
            a: "Not in the current version. iOS and Android restrict automatic lock screen changes from websites, so this version keeps setup manual and reliable.",
          },
        ],
      };

  const faqs = scenarioFaqs && scenarioFaqs.length > 0 ? scenarioFaqs : copy.faqs;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30">
      <SeoScenarioAnalytics
        scenario={scenario.slug}
        lang={lang}
        template={scenario.template}
        hasScenarioFaqs={Boolean(scenarioFaqs?.length)}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020205]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">{copy.brand}</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/generator`} className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white">
              {copy.generator}
            </Link>
            <Link href={`/${lang}#pricing`} className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white">
              {copy.pricing}
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden px-6 pb-24 pt-36 lg:pb-32 lg:pt-44">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_55%)]" />
          <div className="container relative z-10 mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8 text-center lg:text-left">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 lg:mx-0">
                <Icon className="h-3.5 w-3.5" />
                <span>{scenario.eyebrow[lang]}</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
                {scenario.title[lang]}
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400 lg:mx-0 lg:text-lg">
                {scenario.description[lang]}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <SeoScenarioTrackedLink
                  href={generatorHref}
                  event="seo_scenario_cta_click"
                  scenario={scenario.slug}
                  lang={lang}
                  template={scenario.template}
                  target="generator_template"
                >
                  <Button className="h-12 rounded-full bg-white px-8 font-bold text-black hover:bg-indigo-50">
                    {copy.create}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SeoScenarioTrackedLink>
                <SeoScenarioTrackedLink
                  href={`/${lang}`}
                  className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                  event="seo_scenario_secondary_click"
                  scenario={scenario.slug}
                  lang={lang}
                  template={scenario.template}
                  target="home_use_cases"
                >
                  {copy.secondary}
                </SeoScenarioTrackedLink>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[320px]">
              <PhonePreview scenario={scenario} tasks={tasks} lang={lang} daysLeft={copy.daysLeft} />
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02] px-6 py-20">
          <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">{copy.bestFor}</h2>
              <p className="text-2xl font-semibold leading-snug text-white">{scenario.audience[lang]}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-indigo-300">{copy.examples}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {tasks.map((task) => (
                  <div key={task} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                    {task}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-28">
          <div className="container mx-auto max-w-5xl">
            <h2 className="mb-16 text-center text-3xl font-bold">{copy.how}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[Wand2, QrCode, Smartphone].map((StepIcon, index) => (
                <div key={copy.steps[index].title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{copy.steps[index].title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{copy.steps[index].desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-white/[0.01] px-6 py-28">
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-12 text-3xl font-bold">{copy.faqTitle}</h2>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="mb-2 font-bold text-indigo-300">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PhonePreview({
  scenario,
  tasks,
  lang,
  daysLeft,
}: {
  scenario: SeoScenario;
  tasks: string[];
  lang: "en" | "zh";
  daysLeft: string;
}) {
  const isLarge = scenario.template === "large-reminder";
  const isCountdown = scenario.template === "countdown";
  const isInterruption = scenario.template === "interruption";
  const isOps = scenario.template === "ops-alert";
  const isUrgent = scenario.template === "urgent";
  const isFitness = scenario.template === "fitness";

  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-black p-3 shadow-2xl shadow-indigo-500/10">
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] px-5" style={{ background: scenario.gradient }}>
        <div className="absolute inset-0 bg-black/10" />

        {isCountdown ? (
          <div className="relative z-10 flex h-full flex-col justify-center">
            <div className="text-center">
              <div className="text-[92px] font-black leading-none text-white">{scenario.heroMetric?.[lang] || "30"}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.35em] text-white/60">{daysLeft}</div>
            </div>
            <div className="mt-12 space-y-3">
              {tasks.slice(1, 4).map((task) => (
                <TaskPill key={task} text={task} />
              ))}
            </div>
          </div>
        ) : isLarge || isInterruption || isOps || isUrgent ? (
          <div className="relative z-10 flex h-full flex-col justify-center">
            <div className={`rounded-[28px] border p-5 text-center shadow-2xl ${isOps ? "border-red-300/40 bg-red-950/55" : "border-white/20 bg-black/30"}`}>
              {isOps || isUrgent ? <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-200" /> : null}
              <div className={`${isInterruption ? "text-2xl" : "text-3xl"} font-black leading-tight text-white`}>
                {tasks[0]}
              </div>
            </div>
            <div className="mt-8 space-y-3">
              {tasks.slice(1, 4).map((task) => (
                <TaskPill key={task} text={task} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex h-full flex-col justify-center">
            <div className="space-y-3">
              {tasks.slice(0, 4).map((task, index) => (
                <div
                  key={task}
                  className={`rounded-2xl border p-3.5 shadow-xl ${
                    index === 0 && !isFitness
                      ? "border-white/10 bg-white/5 opacity-45"
                      : "border-white/20 bg-white/15"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && !isFitness ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-white/50" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-white/40" />
                    )}
                    <span className={`truncate text-xs font-bold ${index === 0 && !isFitness ? "text-white/45 line-through" : "text-white"}`}>
                      {task}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskPill({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 text-sm font-bold text-white shadow-xl">
      {text}
    </div>
  );
}
