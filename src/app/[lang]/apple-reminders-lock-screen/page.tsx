import type { Metadata } from "next";
import Script from "next/script";

import { siteConfig } from "~/config/site";
import { AppleRemindersLockScreenContent } from "~/components/apple-reminders-lock-screen-content";

const NOTION_INTEGRATION_URL = "https://www.notion.com/integrations/lockscreen-todo";
const APPLE_REMINDERS_WIDGET_GUIDE_URL = "https://support.apple.com/en-us/118610";
const PAGE_PATH = "/apple-reminders-lock-screen";

const copy = {
  en: {
    seoTitle: "Apple Reminders on Your Lock Screen: 3 Ways That Actually Work",
    seoDescription:
      "How to show Apple Reminders on your iPhone lock screen: the native Reminders widget, Shortcut-based wallpaper apps like LockTodo, and no-install wallpaper generators. Compare all three methods side by side and pick the one that fits your workflow.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Apple Reminders Lock Screen",
    tldrLabel: "Quick Answer",
    tldrStatement:
      "There are three working ways to see reminders on your lock screen: the native iOS Reminders widget (live but tiny), a Shortcuts-based wallpaper app such as LockTodo (automatic but iOS-only and app-required), or a wallpaper generator like LockscreenTodo (no app install, works on iPhone and Android, but manual refresh). Pick based on where your tasks live and how much automation you need.",
    sectionMethod1: "Method 1: The native Reminders lock screen widget",
    sectionMethod1Body:
      "Since iOS 16, Apple's Reminders app ships a lock screen widget. Long-press your lock screen, tap Customize, and add the Reminders widget below the clock. It shows your next due reminder or a list summary, updates live, and costs nothing. The catch: lock screen widgets are limited to a few small slots, each showing one or two short words — a reminder count or a single upcoming item, never your actual to-do list.",
    sectionMethod1Link: "Apple's guide to adding lock screen widgets",
    sectionMethod2: "Method 2: Shortcuts-based wallpaper apps (e.g. LockTodo)",
    sectionMethod2Body:
      "Apps like LockTodo read your Apple Reminders directly and render them into a lock screen wallpaper. Paired with an iOS Shortcut automation, the wallpaper refreshes on a schedule, at a location, or per Focus mode. Everything runs on-device with no account and no tracking. The trade-offs: it requires iOS 17 or later, an app install plus a one-time Shortcut setup, and it only works inside the Apple Reminders ecosystem — tasks in Notion or other apps are invisible to it.",
    sectionMethod3: "Method 3: A wallpaper generator with no app install (LockscreenTodo)",
    sectionMethod3Body:
      "LockscreenTodo takes a different route: instead of reading Apple Reminders, you type the tasks yourself — or connect Notion via read-only OAuth — and it generates a designed lock screen wallpaper in the browser. No app install, no iOS version requirement, and the same image works on Android. The trade-off: websites cannot change your lock screen automatically, so you regenerate and re-save the image when priorities change, which takes about a minute.",
    sectionCompare: "Side-by-side: which method fits you",
    compareHeaders: ["Dimension", "Reminders widget", "Shortcuts wallpaper app", "LockscreenTodo"],
    compareRows: [
      ["What you actually see", "A count or one upcoming reminder", "Your chosen tasks as wallpaper text", "Your chosen tasks on a designed wallpaper"],
      ["Live sync with Apple Reminders", "Yes, automatic", "Yes, via Shortcut automation", "No — manual entry or Notion sync"],
      ["App install", "None (built into iOS)", "Required", "None — runs in the browser"],
      ["Platform", "iPhone only, iOS 16+", "iPhone only, iOS 17+", "iPhone and Android"],
      ["Information density", "1-2 short words", "A short task list", "A task list with full custom layout"],
      ["Design control", "None", "Limited", "Templates, gradients, Unsplash, custom photos"],
      ["Account required", "None", "None", "None for manual entry; Notion OAuth for sync"],
      ["Data leaves your device", "No", "No", "No — read-only, tasks never stored"],
    ],
    sectionWhich: "Which one should you pick?",
    whichItems: [
      "Pick the Reminders widget if you only need to see the next due item at a glance and already live in Apple Reminders.",
      "Pick a Shortcuts wallpaper app like LockTodo if you want your real Reminders list on the wallpaper with automatic refreshes, and you are iOS-only.",
      "Pick LockscreenTodo if you don't want to install anything, use Android, want a designed wallpaper, or your tasks actually live in Notion.",
    ],
    sectionNotion: "If your tasks live in Notion instead",
    sectionNotionBody:
      "None of the Apple Reminders methods can see Notion tasks. If Notion is where you plan, LockscreenTodo is the only lock screen wallpaper tool in Notion's official integration gallery: connect with read-only OAuth, pull today's tasks, and generate the wallpaper in under a minute.",
    notionButton: "See the Notion integration listing",
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Can Apple Reminders show on the iPhone lock screen?",
        a: "Yes. The built-in Reminders widget works on iOS 16 and later, and Shortcuts-based apps like LockTodo can render your reminders into the lock screen wallpaper on iOS 17 and later.",
      },
      {
        q: "Can I put my full Reminders list on the lock screen without installing an app?",
        a: "Not with live sync — reading Apple Reminders requires an app with system permission. The no-install route is a wallpaper generator like LockscreenTodo: you type the tasks (or pull them from Notion), generate the wallpaper in the browser, and set it as your lock screen manually.",
      },
      {
        q: "Why does the Reminders widget only show one item?",
        a: "iOS limits lock screen widgets to a few small slots with strict character budgets. A widget can surface a count or the next due reminder, but it cannot render a readable list. Wallpaper-based methods exist precisely because the whole lock screen is available as canvas.",
      },
      {
        q: "Does LockscreenTodo sync with Apple Reminders?",
        a: "No, and we say that plainly. If you want automatic Apple Reminders sync with offline processing, LockTodo is built for exactly that. LockscreenTodo is for people who plan in Notion, prefer manual entry, use Android, or want a fully custom wallpaper design.",
      },
      {
        q: "Do these methods work on Android?",
        a: "The Reminders widget and Shortcuts apps are iOS-only. A generated wallpaper is just an image, though — LockscreenTodo's output works on any Android phone: save the PNG, set it as the lock screen, done.",
      },
      {
        q: "Is it safe to show reminders on my lock screen?",
        a: "Anything on the lock screen is visible to whoever picks up your phone. Task names and priorities are usually fine; avoid passwords, financial details, or sensitive personal information.",
      },
    ],
    ctaEyebrow: "No install needed",
    ctaTitle: "Turn your to-do list into a lock screen wallpaper.",
    ctaBody:
      "Type your tasks or connect Notion, and generate a designed lock screen wallpaper in under a minute. Free preview, works on iPhone and Android.",
    ctaPrimary: "Generate my wallpaper",
    ctaSecondary: "See all use cases",
  },
  zh: {
    seoTitle: "把 Apple 提醒事项放到锁屏上：3 种真正可行的方法",
    seoDescription:
      "如何在 iPhone 锁屏上显示 Apple 提醒事项：原生提醒事项小组件、LockTodo 这类快捷指令壁纸应用、以及免安装的壁纸生成器。三种方法正面对比，帮你选最适合自己工作流的那个。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "Apple 提醒事项锁屏",
    tldrLabel: "一句话结论",
    tldrStatement:
      "在锁屏上看到提醒事项有三条可行路线：iOS 原生提醒事项小组件（实时但极小）、LockTodo 这类快捷指令壁纸应用（自动但仅限 iOS 且需装 App）、或者 LockscreenTodo 这类壁纸生成器（免安装、iPhone 和 Android 通用，但需手动刷新）。选哪个取决于你的任务存在哪里、需要多少自动化。",
    sectionMethod1: "方法一：原生提醒事项锁屏小组件",
    sectionMethod1Body:
      "从 iOS 16 开始，Apple 提醒事项自带锁屏小组件。长按锁屏，点「自定」，在时钟下方添加提醒事项小组件。它能显示下一个到期提醒或清单摘要，实时更新，完全免费。问题是：锁屏小组件只有几个很小的位置，每个只能显示一两个短词——一个数量或一条即将到来的提醒，永远不是你真正的待办清单。",
    sectionMethod1Link: "Apple 官方：如何添加锁屏小组件",
    sectionMethod2: "方法二：快捷指令壁纸应用（如 LockTodo）",
    sectionMethod2Body:
      "LockTodo 这类应用直接读取 Apple 提醒事项，把任务渲染进锁屏壁纸。配合 iOS 快捷指令自动化，壁纸可以按时间、地点或专注模式自动刷新。一切都在设备本地运行，无账号、无追踪。代价是：要求 iOS 17 及以上，需要安装 App 并完成一次性的快捷指令设置，而且只在 Apple 提醒事项生态内有效——Notion 或其他应用里的任务它看不见。",
    sectionMethod3: "方法三：免安装的壁纸生成器（LockscreenTodo）",
    sectionMethod3Body:
      "LockscreenTodo 走了另一条路：不读 Apple 提醒事项，而是你自己输入任务——或者用只读 OAuth 连接 Notion——然后在浏览器里生成一张有设计感的锁屏壁纸。不用装 App，没有 iOS 版本要求，同一张图 Android 也能用。代价是：网页无法自动修改锁屏，优先级变化时需要重新生成并保存图片，大约一分钟。",
    sectionCompare: "正面对比：哪种方法适合你",
    compareHeaders: ["维度", "提醒事项小组件", "快捷指令壁纸应用", "LockscreenTodo"],
    compareRows: [
      ["实际能看到什么", "一个数量或一条到期提醒", "你选的任务以壁纸文字呈现", "你选的任务呈现在设计好的壁纸上"],
      ["与 Apple 提醒事项实时同步", "是，自动", "是，通过快捷指令自动化", "否——手动输入或 Notion 同步"],
      ["需要装 App", "不需要（iOS 内置）", "必须安装", "不需要，浏览器运行"],
      ["平台", "仅 iPhone，iOS 16+", "仅 iPhone，iOS 17+", "iPhone 和 Android"],
      ["信息密度", "1-2 个短词", "一个简短任务列表", "完整自定义排版的任务列表"],
      ["设计控制", "无", "有限", "模板、渐变、Unsplash 图库、自定义照片"],
      ["账号要求", "无", "无", "手动输入无需账号；同步需 Notion OAuth"],
      ["数据离开设备", "不会", "不会", "不会——只读，任务绝不存储"],
    ],
    sectionWhich: "到底该选哪个？",
    whichItems: [
      "只需要扫一眼下一条到期事项、本来就用 Apple 提醒事项 → 选原生小组件。",
      "想把真正的提醒事项清单放到壁纸上并自动刷新、且只用 iPhone → 选 LockTodo 这类快捷指令应用。",
      "不想装任何东西、用 Android、想要有设计感的壁纸、或任务其实在 Notion 里 → 选 LockscreenTodo。",
    ],
    sectionNotion: "如果你的任务在 Notion 里",
    sectionNotionBody:
      "以上所有 Apple 提醒事项路线都看不到 Notion 任务。如果你用 Notion 做计划，LockscreenTodo 是 Notion 官方集成目录里唯一的锁屏壁纸工具：只读 OAuth 连接，拉取今天的任务，一分钟内生成壁纸。",
    notionButton: "查看 Notion 官方集成页",
    faqTitle: "常见问题",
    faqs: [
      {
        q: "Apple 提醒事项能显示在 iPhone 锁屏上吗？",
        a: "能。iOS 16 及以上可以用内置提醒事项小组件；iOS 17 及以上还可以用 LockTodo 这类快捷指令应用把提醒事项渲染进锁屏壁纸。",
      },
      {
        q: "不装 App 能把完整提醒事项清单放到锁屏上吗？",
        a: "做不到实时同步——读取 Apple 提醒事项必须有系统权限的 App。免安装的路线是 LockscreenTodo 这类壁纸生成器：手动输入任务（或从 Notion 拉取），在浏览器里生成壁纸，再手动设为锁屏。",
      },
      {
        q: "为什么提醒事项小组件只能显示一条？",
        a: "iOS 把锁屏小组件限制在几个很小的位置，字数预算严格。小组件能显示数量或下一条到期提醒，但渲染不了可读的清单。壁纸方案之所以存在，正是因为整个锁屏都是画布。",
      },
      {
        q: "LockscreenTodo 能同步 Apple 提醒事项吗？",
        a: "不能，这点我们明说。如果你想要自动同步 Apple 提醒事项、完全离线处理，LockTodo 正是为此而生。LockscreenTodo 面向的是用 Notion 做计划、偏好手动输入、使用 Android、或想要完全自定义壁纸设计的人。",
      },
      {
        q: "这些方法在 Android 上能用吗？",
        a: "提醒事项小组件和快捷指令应用都是 iOS 独占。但生成的壁纸只是一张图——LockscreenTodo 的产出在任何 Android 手机上都能用：保存 PNG，设为锁屏，完成。",
      },
      {
        q: "把提醒事项放在锁屏上安全吗？",
        a: "锁屏上的内容对拿到手机的人可见。任务名称和优先级通常没问题，但不要放密码、财务信息或敏感个人信息。",
      },
    ],
    ctaEyebrow: "无需安装",
    ctaTitle: "把你的待办清单变成锁屏壁纸。",
    ctaBody: "手动输入任务或连接 Notion，一分钟内生成设计好的锁屏壁纸。免费预览，iPhone 和 Android 通用。",
    ctaPrimary: "立即生成我的壁纸",
    ctaSecondary: "查看全部场景",
  },
} as const;

type Locale = "en" | "zh";

function pickLocale(value: string | undefined): Locale {
  return value === "zh" ? "zh" : "en";
}

type PageProps = {
  params: { lang: string };
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "zh" }];
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = pickLocale(params.lang);
  const t = copy[lang];
  const canonical = `${siteConfig.url}${lang === "zh" ? "/zh" : "/en"}${PAGE_PATH}`;

  return {
    title: t.seoTitle,
    description: t.seoDescription,
    alternates: {
      canonical,
      languages: {
        en: `${siteConfig.url}/en${PAGE_PATH}`,
        zh: `${siteConfig.url}/zh${PAGE_PATH}`,
      },
    },
    openGraph: {
      title: t.seoTitle,
      description: t.seoDescription,
      url: canonical,
      type: "article",
    },
  };
}

const jsonLdForLocale = (locale: Locale) => {
  const t = copy[locale];
  const pageUrl = `${siteConfig.url}${locale === "zh" ? "/zh" : "/en"}${PAGE_PATH}`;
  const inLanguage = locale === "zh" ? "zh-Hans" : "en-US";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.seoTitle,
    description: t.seoDescription,
    inLanguage,
    datePublished: "2026-08-10",
    dateModified: "2026-08-10",
    author: {
      "@type": "Organization",
      name: "Lockscreen Todo",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: "Lockscreen Todo",
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/og-image.jpg`,
      },
    },
    mainEntityOfPage: pageUrl,
    sameAs: [NOTION_INTEGRATION_URL],
    about: [
      { "@type": "Thing", name: "Apple Reminders" },
      { "@type": "Thing", name: locale === "zh" ? "iPhone 锁屏" : "iPhone lock screen" },
      { "@type": "Thing", name: locale === "zh" ? "锁屏壁纸" : "Lock screen wallpaper" },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t.seoTitle,
    description: t.seoDescription,
    inLanguage,
    step: [
      { "@type": "HowToStep", position: 1, name: t.sectionMethod1, text: t.sectionMethod1Body },
      { "@type": "HowToStep", position: 2, name: t.sectionMethod2, text: t.sectionMethod2Body },
      { "@type": "HowToStep", position: 3, name: t.sectionMethod3, text: t.sectionMethod3Body },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lockscreen Todo",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "iOS, Android, Web",
    description: t.seoDescription,
    url: siteConfig.url,
    inLanguage,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    sameAs: [NOTION_INTEGRATION_URL, "https://www.producthunt.com/products/lockscreen-todo"],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    mainEntity: t.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.breadcrumbHome,
        item: `${siteConfig.url}${locale === "zh" ? "/zh" : "/en"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.breadcrumbCurrent,
        item: pageUrl,
      },
    ],
  };

  return [articleSchema, howToSchema, softwareSchema, faqSchema, breadcrumbSchema];
};

export default function AppleRemindersLockScreenPage({ params }: PageProps) {
  const lang = pickLocale(params.lang);
  const t = copy[lang];
  const schemas = jsonLdForLocale(lang);

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`ld-${lang}-${index}`}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <AppleRemindersLockScreenContent
        lang={lang}
        copy={t}
        notionIntegrationUrl={NOTION_INTEGRATION_URL}
        appleWidgetGuideUrl={APPLE_REMINDERS_WIDGET_GUIDE_URL}
      />
    </>
  );
}
