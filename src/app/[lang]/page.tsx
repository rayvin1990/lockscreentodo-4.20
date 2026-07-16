"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Palette, QrCode, Sparkles, Smartphone, Zap } from "lucide-react";

import { Button } from "~/components/ui/button";
import { siteConfig } from "~/config/site";
import { trackEvent } from "~/lib/analytics";
import { seoScenarios } from "~/lib/seo-scenarios";

import { RealisticPhoneMockup } from "~/components/realistic-phone-mockup";

const PricingComparisonTable = dynamic(
  () => import("~/components/pricing-comparison-table").then((mod) => mod.PricingComparisonTable),
  { ssr: false },
);

const copy = {
  en: {
    navGenerator: "Generator",
    navPricing: "Pricing",
    navDashboard: "Dashboard",
    eyebrow: "Notion on your lock screen",
    title: "Your Notion tasks aren't on your lock screen. Why not?",
    subtitle:
      "Connect your Notion once. Your tasks appear on your lock screen automatically. No app. No new habit.",
    metricStrip: [
      { value: "50+", label: "passive views per day" },
      { value: "0", label: "active taps needed" },
      { value: "30s", label: "to set up" },
      { value: "OAuth only", label: "Zero data stored" },
    ],
    primaryCta: "Generate my wallpaper",
    secondaryCta: "See how it works",
    useCases: ["Notion tasks", "Today's priorities", "Daily tasks", "Habit tracking", "ADHD reminders", "Medication notes"],
    beforeLabel: "Without LockscreenTodo",
    afterLabel: "With LockscreenTodo",
    beforeBullets: [
      "Tasks hide in an app you forget to open",
      "You see your wallpaper 50+ times a day, but only your tasks when you remember to check",
      "Missed deadlines. Forgotten medications. A separate habit to remember to check Notion.",
    ],
    afterBullets: [
      "Your Notion tasks show up where you already look — your lock screen",
      "Zero taps. Tasks are visible the moment you glance at your phone",
      "Read-only OAuth. We don't store your tasks. Notion stays the source of truth.",
    ],
    workflowTitle: "Three steps. That's it.",
    workflow: [
      { icon: Zap, title: "Connect Notion", desc: "OAuth, one click. We only read your tasks." },
      { icon: Palette, title: "Pick your tasks", desc: "Today's agenda pulled automatically. Tomorrow as fallback if today is empty." },
      { icon: Smartphone, title: "Set as lock screen", desc: "Scan the QR, save the image, done." },
    ],
    faqTitle: "Question & Answer",
    faqs: [
      {
        q: "Do I need to install an app?",
        a: "No. Generate the wallpaper in your browser, scan the QR code on your phone, save the image, and set it as your lock screen.",
      },
      {
        q: "Can I use my Notion tasks?",
        a: "Yes. You can preview the wallpaper first, then connect Notion and import tasks into the generator when you are ready.",
      },
      {
        q: "Who is this for?",
        a: "Notion users, students, habit builders, ADHD users, and anyone who wants a visible daily task list without opening another app.",
      },
      {
        q: "Does it update my lock screen automatically?",
        a: "Not yet. iOS and Android limit automatic lock screen changes from websites, so the current workflow is manual but reliable.",
      },
    ],
    pricing: "Pricing",
    product: "Product",
    solutions: "Use Cases",
    legal: "Legal",
    footerTagline: "Built for focused lock screens",
    useCaseTitle: "Use Cases",
    useCaseSubtitle: "Start from a specific situation, then customize the wallpaper in the generator.",
    links: {
      lockScreenTodo: "Lock Screen Todo",
      reminderWallpaper: "Reminder Wallpaper",
      generator: "Generator",
      developers: "Developers",
      dailyTasks: "Daily Tasks",
      study: "Study Wallpaper",
      habits: "Habit Tracker",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
    sampleTasks: [
      { id: 1, text: "Notion: ship landing page", done: true },
      { id: 2, text: "Today: follow up with 2 users", done: false },
      { id: 3, text: "Tonight: plan tomorrow's top 3", done: false },
    ],
  },
  zh: {
    navGenerator: "生成器",
    navPricing: "定价",
    navDashboard: "仪表盘",
    eyebrow: "把 Notion 搬到锁屏",
    title: "你的 Notion 任务没在锁屏上,为什么不?",
    subtitle: "连接一次 Notion,任务自动出现在锁屏。无需安装 App,无需培养新习惯。",
    metricStrip: [
      { value: "50+", label: "每天被动曝光次数" },
      { value: "0", label: "主动点击" },
      { value: "30 秒", label: "即可设置" },
      { value: "OAuth 只读", label: "数据零存储" },
    ],
    primaryCta: "立即生成我的壁纸",
    secondaryCta: "了解使用流程",
    useCases: ["Notion 任务", "今日重点", "每日待办", "习惯打卡", "注意力提醒", "用药备注"],
    beforeLabel: "不用 LockscreenTodo",
    afterLabel: "用 LockscreenTodo",
    beforeBullets: [
      "任务藏在 App 里,你经常忘记打开",
      "每天看锁屏 50+ 次,但任务只有想起来才会去查",
      "错过截止日期、忘记吃药、要另外养成「打开 Notion」的习惯",
    ],
    afterBullets: [
      "Notion 任务直接出现在你已经会看的锁屏上",
      "零点击。抬手看手机时任务就在眼前",
      "只读 OAuth,不存储你的任务,Notion 仍是数据源头",
    ],
    workflowTitle: "三步,搞定。",
    workflow: [
      { icon: Zap, title: "连接 Notion", desc: "OAuth 一键,我们只读取你的任务。" },
      { icon: Palette, title: "选择任务", desc: "自动拉取今日 agenda,今日为空时 fallback 到明天。" },
      { icon: Smartphone, title: "设为锁屏", desc: "扫码,保存图片,搞定。" },
    ],
    faqTitle: "常见问题",
    faqs: [
      {
        q: "需要安装 App 吗？",
        a: "不需要。在浏览器生成壁纸，用手机扫码保存图片，然后在系统相册里设为锁屏。",
      },
      {
        q: "可以使用 Notion 里的任务吗？",
        a: "可以。你可以先预览壁纸效果，准备好后再连接 Notion，把任务导入到生成器里。",
      },
      {
        q: "适合哪些人用？",
        a: "更适合 Notion 用户、学生、习惯打卡用户、注意力管理用户，以及想把当天重点任务放到锁屏上的人。",
      },
      {
        q: "国内能用吗？需要科学上网吗？",
        a: "能。LockscreenTodo 部署在 Vercel 全球 CDN,中国大陆无需翻墙直接访问 https://lockscreentodo.com 即可。Notion 官方在国内可用,OAuth 流程不受影响。如果你需要微信小程序版本(扫码即用),目前在做前期调研,可以加我们的公众号或邮件订阅接收通知。",
      },
      {
        q: "能自动更新锁屏吗？",
        a: "暂时不能。iOS 和 Android 都限制网页自动修改锁屏，所以当前流程是手动保存和设置，但更稳定。",
      },
    ],
    pricing: "定价",
    product: "产品",
    solutions: "场景",
    legal: "法律",
    footerTagline: "为专注锁屏而做",
    useCaseTitle: "具体场景",
    useCaseSubtitle: "先从一个明确场景开始，再到生成器里改成自己的内容。",
    links: {
      lockScreenTodo: "锁屏待办",
      reminderWallpaper: "提醒壁纸",
      generator: "生成器",
      developers: "开发者",
      dailyTasks: "每日任务",
      study: "学习壁纸",
      habits: "习惯打卡",
      privacy: "隐私政策",
      terms: "服务条款",
    },
    sampleTasks: [
      { id: 1, text: "Notion：发布首页文案", done: true },
      { id: 2, text: "今天：跟进 2 个用户", done: false },
      { id: 3, text: "今晚：写下明天 Top 3", done: false },
    ],
  },
} as const;

function ShowcaseWallpaper({ lang }: { lang: "en" | "zh" }) {
  const content = copy[lang];

  return (
    <div className="relative h-full w-full bg-[#050508] overflow-hidden flex flex-col items-center pt-[190px] px-5 font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent opacity-50" />

      <div className="relative z-10 w-full space-y-3.5">
        {content.sampleTasks.map((task) => (
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
        <div className="p-3 rounded-full bg-white/5 border border-white/5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="p-3 rounded-full bg-white/5 border border-white/5">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function LocaleHomePage({ params }: { params: { lang: string } }) {
  const lang = params.lang === "zh" ? "zh" : "en";
  const content = copy[lang];

  React.useEffect(() => {
    trackEvent("home_view", { lang });
  }, [lang]);

  const NOTION_INTEGRATION_URL = "https://www.notion.com/integrations/lockscreen-todo";
  const inLanguage = lang === "zh" ? "zh-Hans" : "en-US";
  const pageUrl = `${siteConfig.url}${lang === "zh" ? "/zh" : "/en"}`;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: pageUrl,
    inLanguage,
    publisher: { "@type": "Organization", name: siteConfig.organization.name, url: siteConfig.url },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}${lang === "zh" ? "/zh" : "/en"}/use-cases/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lockscreen Todo",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "iOS, Android, Web",
    description: content.subtitle,
    url: pageUrl,
    inLanguage,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    sameAs: [NOTION_INTEGRATION_URL, siteConfig.links.productHunt, siteConfig.links.github],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "zh" ? "首页" : "Home", item: pageUrl },
    ],
  };

  const homepageSchemas = [websiteJsonLd, softwareApplicationJsonLd, faqJsonLd, breadcrumbJsonLd];

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] text-white/90 selection:bg-white/10 font-light tracking-tight antialiased">
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020205]/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Lockscreen Todo</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/generator`} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              {content.navGenerator}
            </Link>
            <Link href="#pricing" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              {content.navPricing}
            </Link>
            <Link href={`/${lang}/dashboard/settings`} className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              {content.navDashboard}
            </Link>
          </div>
        </div>
      </nav>

      {homepageSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative pt-40 pb-32 px-6">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            <div className="flex-1 space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 text-[9px] font-bold tracking-[0.3em] uppercase text-white/30 border-b border-white/10 pb-1 mx-auto lg:mx-0">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{content.eyebrow}</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                {content.title}
              </h1>

              <p className="text-base text-slate-500 max-w-md leading-relaxed mx-auto lg:mx-0">
                {content.subtitle}
              </p>

              {content.metricStrip && content.metricStrip.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  {content.metricStrip.map((m) => (
                    <div key={m.label} className="border border-white/10 bg-white/[0.02] p-3 text-center lg:text-left">
                      <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none">
                        {m.value}
                      </div>
                      <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mt-2">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href={`/${lang}/generator`} onClick={() => trackEvent("home_cta_click", { target: "generator", lang })}>
                  <Button variant="outline" className="h-12 px-8 text-[12px] font-bold tracking-widest uppercase border-white/20 hover:bg-white hover:text-black rounded-none transition-all shadow-xl shadow-white/5">
                    {content.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link
                  href="#pricing"
                  className="text-[11px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors"
                  onClick={() => trackEvent("home_pricing_click", { lang })}
                >
                  {content.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-[320px] relative">
              <RealisticPhoneMockup>
                <ShowcaseWallpaper lang={lang} />
              </RealisticPhoneMockup>
            </div>
          </div>
        </div>
      </section>

      {content.beforeBullets && content.beforeBullets.length > 0 && content.afterBullets && (
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-white/10 bg-white/[0.02] p-8">
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4">
                  {content.beforeLabel}
                </div>
                <ul className="space-y-3">
                  {content.beforeBullets.map((b) => (
                    <li key={b} className="text-sm text-slate-400 leading-relaxed flex">
                      <span className="text-white/20 mr-3">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-brand-green/40 bg-brand-green/[0.04] p-8">
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-green mb-4">
                  {content.afterLabel}
                </div>
                <ul className="space-y-3">
                  {content.afterBullets.map((b) => (
                    <li key={b} className="text-sm text-white/80 leading-relaxed flex">
                      <span className="text-brand-green mr-3">+</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap justify-center lg:justify-between gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
            {content.useCases.map((tag) => (
              <span key={tag} className="hover:text-white/40 transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-b border-white/5">
        <div className="container mx-auto max-w-4xl px-6">
          <h2 className="sr-only">{content.workflowTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
            {content.workflow.map((step) => (
              <div key={step.title} className="space-y-4 group text-center lg:text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all mx-auto lg:mx-0">
                  <step.icon className="w-5 h-5" />
                </div>
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/60">{step.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-b border-white/5 bg-white/[0.015]">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-14 space-y-3 text-center">
            <h2 className="text-3xl font-bold tracking-tight">{content.useCaseTitle}</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500">{content.useCaseSubtitle}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {seoScenarios.map((scenario) => {
              const Icon = scenario.icon;

              return (
                <Link
                  key={scenario.slug}
                  href={lang === "en" ? `/use-cases/${scenario.slug}` : `/${lang}/${scenario.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">{scenario.eyebrow[lang]}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{scenario.description[lang]}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="py-40 bg-white/[0.01]">
        <div className="container mx-auto max-w-2xl px-6 text-center lg:text-left">
          <h2 className="text-[10px] font-black mb-24 tracking-[0.6em] uppercase text-white/20 italic mx-auto lg:mx-0">
            {content.faqTitle}
          </h2>
          <div className="space-y-12">
            {content.faqs.map((faq) => (
              <div key={faq.q} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400/80">{faq.q}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-40 border-t border-white/5">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center mb-20 space-y-3 opacity-40">
            <h2 className="text-xl font-bold tracking-[0.3em] uppercase">{content.pricing}</h2>
            <div className="w-12 h-px bg-white/30 mx-auto" />
          </div>
          <div className="scale-95 lg:scale-100 origin-top opacity-90 hover:opacity-100 transition-opacity duration-700">
            <PricingComparisonTable lang={lang} />
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-16">
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">{content.product}</h4>
              <ul className="space-y-2">
                <li><Link href={`/${lang}/generator`} className="text-sm text-slate-400 hover:text-white transition-colors">{content.links.generator}</Link></li>
                <li><Link href={`/${lang}/lock-screen-todo`} className="text-sm text-slate-400 hover:text-white transition-colors">{content.links.lockScreenTodo}</Link></li>
                <li><Link href={`/${lang}/reminder-wallpaper`} className="text-sm text-slate-400 hover:text-white transition-colors">{content.links.reminderWallpaper}</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">{content.solutions}</h4>
              <ul className="space-y-2">
                <li><Link href={`/${lang}/lock-screen-todo`} className="text-sm text-slate-400 hover:text-white transition-colors">{content.links.dailyTasks}</Link></li>
                <li><Link href={`/${lang}/reminder-wallpaper`} className="text-sm text-slate-400 hover:text-white transition-colors">{content.links.study}</Link></li>
                <li><Link href={`/${lang}/lock-screen-todo`} className="text-sm text-slate-400 hover:text-white transition-colors">{content.links.habits}</Link></li>
                <li><Link href={`/${lang}/developers`} className="text-sm text-slate-500 hover:text-white transition-colors">{content.links.developers}</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50">{content.legal}</h4>
              <ul className="space-y-2">
                <li><Link href={`/${lang}/terms`} className="text-sm text-slate-400 hover:text-white transition-colors">{content.links.terms}</Link></li>
                <li><Link href={`/${lang}/privacy`} className="text-sm text-slate-400 hover:text-white transition-colors">{content.links.privacy}</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center opacity-30 pt-8 border-t border-white/5">
            <p className="text-[9px] font-bold tracking-[0.6em] uppercase">2026 Lockscreen Todo - {content.footerTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
