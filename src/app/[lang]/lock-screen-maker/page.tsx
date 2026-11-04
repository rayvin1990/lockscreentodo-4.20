import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  Lock,
  Smartphone,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { buildPageMetadata } from "~/lib/page-metadata";

type Lang = "en" | "zh";

const copy = {
  en: {
    nav: "Lock Screen Maker",
    launch: "Open the maker",
    eyebrow: "Lock screen maker for to-do lists",
    h1: "Lock Screen Maker: turn your to-do list into the screen you see 100 times a day",
    sub:
      "Type your tasks or import them from Notion, pick a layout, and download a ready-to-use lock screen wallpaper. No app install, no account required to try it, works on iPhone and Android.",
    ctaPrimary: "Make my lock screen",
    ctaSecondary: "See how it works",
    heroCardTitle: "Today",
    heroTasks: ["Ship the landing page", "Call the supplier back", "30 min walk"],
    heroHint: "Generated wallpaper — read-only, always visible",
    whatTitle: "What this maker actually makes",
    whatBody:
      "Most tools called a lock screen maker are wallpaper designers: they help you build a pretty picture. This one is narrower and more useful. It takes a real list of tasks and renders it as a vertical wallpaper, sized for a phone, with the clock area kept clear. You are not decorating a screen, you are putting your plan on it.",
    points: [
      {
        title: "Built for text, not artwork",
        body: "Layouts are tuned for short task lines that stay legible at arm's length in bad light.",
      },
      {
        title: "Clock-safe by default",
        body: "Task rows start below the clock and date area, so nothing important hides behind the time.",
      },
      {
        title: "One image, zero battery cost",
        body: "The wallpaper is a static image. Nothing runs in the background and nothing drains the battery.",
      },
      {
        title: "No app on your phone",
        body: "You generate the image in a browser and set it with the system wallpaper picker you already have.",
      },
    ],
    howTitle: "How it works",
    steps: [
      {
        title: "Add your tasks",
        body: "Type three to five items, or connect Notion once and pull today's tasks automatically.",
      },
      {
        title: "Pick a layout",
        body: "Choose a template and a background. The preview updates instantly at real phone resolution.",
      },
      {
        title: "Download and set it",
        body: "Save the PNG, open it in Photos, and choose Use as Wallpaper. On Android, Set as lock screen.",
      },
    ],
    compareTitle: "Lock screen maker vs widget vs habit app",
    compareHead: ["", "This maker", "Lock screen widget", "Dedicated app"],
    compareRows: [
      ["Install required", "No", "Yes", "Yes"],
      ["How many tasks fit", "5 to 7 readable", "1 to 3, sized by the OS", "Depends on the app"],
      ["Can you tick items off", "No (image)", "Yes on newer iOS", "Yes"],
      ["Updates itself", "On your schedule", "Live", "Live"],
      ["Battery cost", "None", "Low", "Low to moderate"],
      ["Best for", "Seeing the whole plan", "One next action", "Managing a backlog"],
    ],
    whoTitle: "Who it is for",
    who: [
      "People who plan in Notion or a notes app and then never look at the plan again.",
      "Students with an exam countdown who need the date in front of them, not inside an app.",
      "Anyone building a habit who wants the streak visible without another tracker.",
      "People who tried a lock screen widget and found one line too little room.",
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Is this a free lock screen maker?",
        a: "You can generate and download a wallpaper without paying. A free account unlocks Notion sync and saving your layouts; the maker itself does not require a credit card to try.",
      },
      {
        q: "Do I need to install an app?",
        a: "No. The maker runs in your mobile or desktop browser, and you set the downloaded PNG with the wallpaper picker built into iOS or Android.",
      },
      {
        q: "Does it work on iPhone and Android?",
        a: "Yes. The export is a standard vertical PNG. On iPhone use Settings, Wallpaper, Add New Wallpaper, Photos. On Android use Gallery, Set as wallpaper, Lock screen.",
      },
      {
        q: "How many tasks should I put on the lock screen?",
        a: "Three to seven. A lock screen is read in about a second, so keep the backlog in your task app and show only what belongs to today.",
      },
      {
        q: "Will the wallpaper update when I finish a task?",
        a: "Not automatically, because it is a static image. Regenerate it when your list changes, which takes a few seconds and needs no re-installation.",
      },
      {
        q: "Can I use my own photo as the background?",
        a: "Yes. Upload a photo and the maker keeps a readable text layer over it, with a dimmed area behind the task rows so the words stay legible.",
      },
    ],
    relatedTitle: "Related guides",
    related: [
      { label: "Lock screen to-do list", href: "/lock-screen-todo" },
      { label: "How to put a to-do list on your lock screen", href: "/how-to-put-todo-list-on-lock-screen" },
      { label: "iPhone lock screen to-do list", href: "/iphone-lock-screen-todo-list" },
      { label: "Android lock screen to-do list", href: "/android-lock-screen-todo-list" },
      { label: "Habit tracker lock screen", href: "/use-cases/habit-tracker-lock-screen" },
    ],
    footerProduct: "Product",
    footerGuides: "Guides",
    footerLegal: "Legal",
    footerGenerator: "Maker",
    footerPricing: "Pricing",
    footerDevelopers: "Developers",
    footerTerms: "Terms of Service",
    footerPrivacy: "Privacy Policy",
    footerNote: "Built for focus, not for another feed",
  },
  zh: {
    nav: "锁屏制作器",
    launch: "打开制作器",
    eyebrow: "把待办放到锁屏的制作器",
    h1: "锁屏制作器：把今天的待办，做成你一天看一百次的锁屏",
    sub:
      "手动输入任务或从 Notion 导入，选一个版式，下载可以直接用的锁屏壁纸。不用装 App，试用不需要账号，iPhone 和安卓都能用。",
    ctaPrimary: "生成我的锁屏",
    ctaSecondary: "看看怎么用",
    heroCardTitle: "今天",
    heroTasks: ["上线落地页", "回电话给供应商", "走 30 分钟"],
    heroHint: "生成的是图片，只读，但一直在眼前",
    whatTitle: "这个制作器到底做出什么",
    whatBody:
      "大多数叫锁屏制作器的工具其实是壁纸设计器，帮你做一张好看的图。这个更窄，也更有用：它拿一份真实的任务清单，渲染成手机竖屏壁纸，并且刻意留出时钟区。你不是在装饰屏幕，你是在把计划放上去。",
    points: [
      {
        title: "为文字排版，不是为画",
        body: "版式按短任务行设计，在手伸直的距离、光线不好的情况下也能读清。",
      },
      {
        title: "默认避开时钟区",
        body: "任务从时钟和日期下方开始，重要内容不会被时间挡住。",
      },
      {
        title: "一张图，零耗电",
        body: "壁纸是静态图片，后台不跑任何东西，不额外耗电。",
      },
      {
        title: "手机不用装 App",
        body: "在浏览器里生成图片，用系统自带的壁纸设置就能换上。",
      },
    ],
    howTitle: "怎么用",
    steps: [
      { title: "填任务", body: "手输三到五条，或者连接一次 Notion，自动拉取今天的任务。" },
      { title: "选版式", body: "挑模板和背景，预览按真实手机分辨率即时更新。" },
      { title: "下载并设置", body: "保存 PNG，在相册里选择用作壁纸；安卓选设为锁屏。" },
    ],
    compareTitle: "锁屏制作器 vs 锁屏小组件 vs 习惯 App",
    compareHead: ["", "这个制作器", "锁屏小组件", "专门的 App"],
    compareRows: [
      ["需要安装", "不需要", "需要", "需要"],
      ["能放几条", "5 到 7 条可读", "1 到 3 条，系统决定", "看 App"],
      ["能否勾选完成", "不能（是图片）", "新系统可以", "可以"],
      ["自动更新", "按你的节奏重生成", "实时", "实时"],
      ["耗电", "无", "低", "低到中"],
      ["适合", "看到整天的计划", "看到下一个动作", "管理全部积压"],
    ],
    whoTitle: "适合谁",
    who: [
      "在 Notion 或备忘录里认真做计划，然后从来不看的人。",
      "有考试倒计时的学生，需要日期一直在眼前，而不是藏在 App 里。",
      "正在养成习惯，希望打卡记录可见、又不想再装一个追踪器的人。",
      "试过锁屏小组件，但觉得一行位太少的人。",
    ],
    faqTitle: "常见问题",
    faqs: [
      {
        q: "这个锁屏制作器免费吗？",
        a: "生成和下载壁纸不需要付费。注册免费账号可以解锁 Notion 同步和保存版式，试用制作器本身不需要信用卡。",
      },
      {
        q: "需要安装 App 吗？",
        a: "不需要。制作器在手机或电脑浏览器里运行，下载的 PNG 用 iOS 或安卓自带的壁纸设置换上即可。",
      },
      {
        q: "iPhone 和安卓都能用吗？",
        a: "都能用。导出的是标准竖屏 PNG。iPhone 用「设置 - 墙纸 - 添加新墙纸 - 照片」，安卓用「相册 - 设为壁纸 - 锁屏」。",
      },
      {
        q: "锁屏上放几条任务合适？",
        a: "三到七条。锁屏大约一秒就被读完，积压的任务留在任务 App 里，屏幕上只放今天要做的。",
      },
      {
        q: "完成一条任务后壁纸会自动更新吗？",
        a: "不会，因为它是静态图片。清单变化时重新生成一次，几秒钟就好，不用重装任何东西。",
      },
      {
        q: "可以用自己的照片当背景吗？",
        a: "可以。上传照片后，制作器会在文字后面压一层暗色区域，保证任务文字依然清晰。",
      },
    ],
    relatedTitle: "相关指南",
    related: [
      { label: "锁屏待办", href: "/lock-screen-todo" },
      { label: "怎么把待办放到锁屏上", href: "/how-to-put-todo-list-on-lock-screen" },
      { label: "iPhone 锁屏待办清单", href: "/iphone-lock-screen-todo-list" },
      { label: "安卓锁屏待办清单", href: "/android-lock-screen-todo-list" },
      { label: "习惯打卡锁屏", href: "/use-cases/habit-tracker-lock-screen" },
    ],
    footerProduct: "产品",
    footerGuides: "指南",
    footerLegal: "法律",
    footerGenerator: "制作器",
    footerPricing: "价格",
    footerDevelopers: "开发者",
    footerTerms: "服务条款",
    footerPrivacy: "隐私政策",
    footerNote: "为专注而生，不是又一个信息流",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang: Lang = params.lang === "zh" ? "zh" : "en";
  const isZh = lang === "zh";

  return buildPageMetadata(lang, "/lock-screen-maker", {
    title: isZh
      ? "锁屏制作器：把待办清单做成锁屏壁纸（免费）"
      : "Lock Screen Maker — Turn Your To-Do List Into a Lock Screen",
    description: isZh
      ? "把待办清单做成手机锁屏壁纸，一分钟搞定。不用装 App，iPhone 和安卓都能用，支持从 Notion 导入任务。"
      : "Create a lock screen with your to-do list in under a minute. No app install, works on iPhone and Android, and can import tasks from Notion.",
    keywords: isZh
      ? ["锁屏制作器", "锁屏待办", "待办壁纸生成器", "Notion 锁屏", "手机锁屏壁纸"]
      : [
          "lock screen maker",
          "lock screen to do list maker",
          "to do list wallpaper maker",
          "lock screen wallpaper generator",
          "todo list lock screen",
        ],
    openGraph: {
      title: isZh
        ? "锁屏制作器：把待办清单做成锁屏壁纸"
        : "Lock Screen Maker — Turn Your To-Do List Into a Lock Screen",
      description: isZh
        ? "把待办清单做成手机锁屏壁纸，不用装 App。"
        : "Turn your to-do list into a phone lock screen wallpaper. No app install.",
    },
  });
}

function PhonePreview({ t }: { t: (typeof copy)["en"] }) {
  return (
    <div className="relative mx-auto w-[260px] rounded-[2.6rem] border border-white/10 bg-black p-2 shadow-2xl shadow-indigo-500/10">
      <div className="relative overflow-hidden rounded-[2.1rem] bg-[#050508]">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent" />
        <div className="relative px-5 pb-8 pt-12">
          <div className="mb-1 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
            {t.heroCardTitle}
          </div>
          <div className="mb-6 text-center text-4xl font-light text-white/90">07:30</div>
          <div className="space-y-2.5">
            {t.heroTasks.map((task, index) => (
              <div
                key={task}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5"
              >
                {index === 0 ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-white/30" />
                )}
                <span className="truncate text-[12px] font-medium text-white/90">{task}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[10px] text-white/30">{t.heroHint}</p>
        </div>
      </div>
    </div>
  );
}

export default function LockScreenMakerPage({ params }: { params: { lang: string } }) {
  const lang: Lang = params.lang === "zh" ? "zh" : "en";
  const t = copy[lang];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const makerHref = `/${lang}/generator`;
  const resolveHref = (href: string) =>
    href.startsWith("/use-cases/") ? href : `/${lang}${href}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#020205] text-white selection:bg-indigo-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020205]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t.nav}</span>
          </Link>
          <Link href={makerHref} rel="nofollow">
            <Button
              variant="outline"
              className="rounded-full border-white/10 px-6 text-xs font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-black"
            >
              {t.launch}
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        <section className="relative overflow-hidden px-6 pb-20 pt-32">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="container relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
                <Wand2 className="h-3.5 w-3.5" />
                {t.eyebrow}
              </div>
              <h1 className="mb-5 text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl">
                {t.h1}
              </h1>
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-400">{t.sub}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href={makerHref} rel="nofollow">
                  <Button className="h-12 rounded-full bg-indigo-600 px-8 text-sm font-bold text-white hover:bg-indigo-500">
                    {t.ctaPrimary}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                  {t.ctaSecondary}
                </a>
              </div>
            </div>
            <div className="relative">
              <PhonePreview t={t as (typeof copy)["en"]} />
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02] px-6 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{t.whatTitle}</h2>
            <p className="mb-12 max-w-3xl text-base leading-relaxed text-slate-400">{t.whatBody}</p>
            <div className="grid gap-5 md:grid-cols-2">
              {t.points.map((point) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <h3 className="mb-2 text-sm font-bold text-white">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-6 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-12 text-2xl font-bold tracking-tight md:text-3xl">{t.howTitle}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {t.steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600/15 text-sm font-bold text-indigo-300">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02] px-6 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-10 text-2xl font-bold tracking-tight md:text-3xl">
              {t.compareTitle}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    {t.compareHead.map((cell, index) => (
                      <th
                        key={cell || index}
                        className={`px-4 py-3 text-xs font-bold uppercase tracking-widest ${
                          index === 1 ? "text-indigo-300" : "text-slate-500"
                        }`}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.compareRows.map((row) => (
                    <tr key={row[0]} className="border-b border-white/5">
                      {row.map((cell, index) => (
                        <td
                          key={`${row[0]}-${index}`}
                          className={`px-4 py-3 ${
                            index === 0
                              ? "font-medium text-slate-300"
                              : index === 1
                                ? "text-white"
                                : "text-slate-400"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">{t.whoTitle}</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {t.who.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02] px-6 py-20">
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-10 text-2xl font-bold tracking-tight md:text-3xl">{t.faqTitle}</h2>
            <div className="space-y-4">
              {t.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-500">
              {t.relatedTitle}
            </h2>
            <div className="flex flex-wrap gap-3">
              {t.related.map((item) => (
                <Link
                  key={item.href}
                  href={resolveHref(item.href)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/20 px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 grid gap-10 md:grid-cols-3">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/50">
                {t.footerProduct}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href={makerHref} rel="nofollow" className="text-sm text-slate-400 hover:text-white">
                    {t.footerGenerator}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/pricing`} className="text-sm text-slate-400 hover:text-white">
                    {t.footerPricing}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/developers`} className="text-sm text-slate-400 hover:text-white">
                    {t.footerDevelopers}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/50">
                {t.footerGuides}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${lang}/lock-screen-todo`}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    {t.related[0].label}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${lang}/how-to-put-todo-list-on-lock-screen`}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    {t.related[1].label}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${lang}/android-lock-screen-todo-list`}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    {t.related[3].label}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/50">
                {t.footerLegal}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${lang}/terms`} className="text-sm text-slate-400 hover:text-white">
                    {t.footerTerms}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/privacy`} className="text-sm text-slate-400 hover:text-white">
                    {t.footerPrivacy}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
              {t.footerNote}
            </p>
            <div className="flex gap-4 text-white/20">
              <Smartphone className="h-4 w-4" />
              <Lock className="h-4 w-4" />
              <Layers className="h-4 w-4" />
              <Clock className="h-4 w-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
