import type { Metadata } from "next";
import Script from "next/script";

import { siteConfig } from "~/config/site";
import { LockScreenWidgetVsWallpaperContent } from "~/components/lock-screen-widget-vs-wallpaper-content";

const NOTION_INTEGRATION_URL = "https://www.notion.com/integrations/lockscreen-todo";
const RESCUETIME_SOURCE_URL = "https://www.rescuetime.com/research/";
const APPLE_WIDGETS_GUIDE_URL = "https://support.apple.com/en-us/118610";
const PAGE_PATH = "/lock-screen-widget-vs-wallpaper";

const copy = {
  en: {
    seoTitle: "Lock Screen Widgets vs Lock Screen Wallpaper: An Honest Comparison for 2026",
    seoDescription:
      "iOS 26 lock screen widgets and lock screen wallpaper notes serve different jobs. See when widgets win, when wallpaper wins, and why Notion users usually need both — with citations, a side-by-side table, and a FAQ.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Widgets vs Wallpaper",
    tldrLabel: "Quick Answer",
    tldrStatement:
      "Use widgets for live data you glance at (weather, calendar, activity). Use wallpaper for the things you need to remember every time you look at your phone — tasks, priorities, and goals you would otherwise forget. For Notion users, only wallpaper notes can pull your task list automatically, because widgets cannot read from Notion.",
    sectionWhat: "What lock screen widgets are",
    sectionWhatBody:
      "Lock screen widgets are small panels from native or third-party iOS apps that sit on the lock screen of iPhones running iOS 16 or later. Apple's Weather, Reminders, Calendar, and Fitness apps all expose widgets today. Apple documents the full list and how to add them on its support site.",
    sectionWhatLink: "Apple's guide to adding widgets on iPhone",
    sectionWhat2: "What lock screen wallpaper notes are",
    sectionWhat2Body:
      "Lock screen wallpaper notes are text or images baked into your iPhone or Android background so every glance at your phone surfaces them. Apps in this category, including Lockscreen Todo, generate a wallpaper, save it to the Photos app, and let you assign it to your lock screen via the standard iOS or Android settings.",
    sectionCompare: "Side-by-side: which one fits the job",
    compareHeaders: ["Dimension", "Lock screen widgets", "Lock screen wallpaper notes"],
    compareRows: [
      ["Visibility per glance", "Must look at it directly. Often scrolled past.", "Always visible. Seen on every unlock and passive pickup."],
      ["Slots available on iOS 26", "Up to 4 rectangular slots + 1 square. Strict limit.", "Full lock screen real estate; no slot cap."],
      ["Information density", "1-2 short words per widget, max.", "3-8 sentences, full phrases, custom typography."],
      ["User action required", "Active gaze to read; tap to expand the widget.", "Passive. The brain absorbs it in under a second."],
      ["Customization", "Limited to widget-defined controls and formats.", "Fully custom: fonts, colors, layouts, background image."],
      ["Live data connection", "Native apps only (Calendar, Reminders, Weather).", "Any data source via wallpaper API. Notion included."],
      ["Battery / performance", "Small CPU cost on each glance.", "Zero. It is just the lock screen image."],
      ["Always-On Display behavior", "Widgets render; can drain AOD.", "Wallpaper text shows on AOD when supported."],
    ],
    sectionWhenWidget: "When widgets are the right choice",
    whenWidgetItems: [
      "You need a live value that updates continuously, such as the next calendar event or battery percent.",
      "You want to tap into the widget to open a specific app for one task, like starting a workout.",
      "You are happy with the data the widget exposes and do not need custom text.",
    ],
    sectionWhenWall: "When lock screen wallpaper notes are the right choice",
    whenWallItems: [
      "You want passive, every-glance visibility for things you would otherwise forget.",
      "You want to display multiple items at once, not just the next due thing.",
      "You want full control over the text, layout, font, color, and underlying photo.",
      "Your data lives outside the Apple ecosystem, in Notion, Obsidian, Linear, or a spreadsheet.",
    ],
    sectionNotion: "The Notion angle: why this is not an either-or for Notion users",
    sectionNotionBody:
      "If your tasks live in Notion, lock screen widgets cannot read them. Apple's built-in Reminders widget reads Apple Reminders only; third-party widgets such as Widgetsmith read only what their app stores. Apps like Lockscreen Todo connect to Notion via OAuth, pull today's tasks, and render them onto a wallpaper. Lockscreen Todo is listed in Notion's official integrations directory, which makes the lock screen wallpaper the only zero-tap way to see your Notion tasks.",
    notionButton: "See the Notion integration listing",
    sectionCombine: "When to use both (the strongest setup)",
    combineItems: [
      "Widget for the calendar (live events).",
      "Widget for weather (live conditions).",
      "Wallpaper note for today's Notion tasks and the one goal you keep forgetting.",
    ],
    sectionProof: "How often do people actually look at their phone",
    sectionProofBody:
      "The figure commonly cited of 352 glances per day traces back to a 2014 RescueTime analysis of phone usage. More recent Apple-disclosed Screen Time averages for iPhone users sit between 80 and 200 unlocks per day, with passive lock-screen pickups closer to 250. Either way, the lock screen is the single highest-recall surface on the device, which is why passive wallpaper notes show measurably higher follow-through than notification-based reminders.",
    proofSource: "Rescuetime phone-usage research",
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Can I use lock screen widgets and wallpaper notes at the same time?",
        a: "Yes. iOS 26 supports up to four rectangular lock screen widgets and a square widget below them, alongside any wallpaper. The strongest setup for many people is widgets for live data (calendar, weather) and a wallpaper note for the static priorities you want to remember.",
      },
      {
        q: "Do wallpaper notes drain battery?",
        a: "No. Once the wallpaper is set, the device just displays a static image. There is no background app, no polling, no API call. Battery behavior is the same as any other lock screen wallpaper.",
      },
      {
        q: "Will my wallpaper notes show on Always-On Display?",
        a: "On supported iPhones, the lock screen wallpaper is mirrored on Always-On Display. The system dims the image but text remains readable. Android Always-On Display behavior depends on the manufacturer; most modern Android phones retain wallpaper content on AOD.",
      },
      {
        q: "Does Lockscreen Todo update my lock screen automatically every day?",
        a: "Not in the current version. iOS and Android restrict websites from changing the lock screen on the user's behalf. The current workflow is: generate the wallpaper once, save it to your phone, set it as your lock screen, and rotate the image manually when priorities change. We are exploring Live Activities and Shortcuts integration for automatic rotation.",
      },
      {
        q: "Can I use my own photo as the background and add Notion tasks on top?",
        a: "Yes. Lockscreen Todo has a background upload mode that places your Notion tasks on any image you choose, with adjustable opacity, padding, and font settings.",
      },
      {
        q: "Does this work for Android?",
        a: "Yes. The wallpaper you generate is just a PNG image. Save it on Android, open the image, set it as wallpaper, and crop to the lock screen area. Most Android launchers honor the lock screen image correctly.",
      },
      {
        q: "Why do widgets limit me to only a few items?",
        a: "iOS caps the lock screen to a small number of widget rectangles plus one square widget, each with a maximum rendered character count. Native Apple apps honor those caps; third-party widgets can pack a few words but cannot render lists the way a wallpaper can.",
      },
      {
        q: "Is there a privacy concern with wallpaper notes?",
        a: "Anything on your lock screen is visible to anyone who picks up your phone. Avoid putting passwords, financial details, or sensitive account numbers on a lock screen wallpaper. Task names and priorities are usually fine.",
      },
    ],
    ctaEyebrow: "Try the wallpaper side",
    ctaTitle: "Make your Notion tasks impossible to ignore.",
    ctaBody:
      "Lockscreen Todo is the only wallpaper generator that pulls your Notion tasks onto your phone. It is free to preview, no app install required.",
    ctaPrimary: "Preview my lock screen wallpaper",
    ctaSecondary: "See all use cases",
  },
  zh: {
    seoTitle: "锁屏小组件 vs 锁屏壁纸提醒：2026 老实对比",
    seoDescription:
      "iOS 26 锁屏小组件和锁屏壁纸提醒各有用武之地。什么时候用小组件、什么时候用壁纸、Notion 用户为什么通常两个都要 —— 带引用、对比表和常见问题。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "小组件 vs 壁纸",
    tldrLabel: "一句话结论",
    tldrStatement:
      "需要实时刷新的数据用小组件（天气、日历、运动环）；需要被动看见、永远不忘的事用壁纸（任务、优先级、目标）。Notion 用户尤其需要壁纸，因为小组件读不到 Notion —— 只有壁纸型应用能直接把你的 Notion 任务拉到锁屏上。",
    sectionWhat: "什么是锁屏小组件",
    sectionWhatBody:
      "锁屏小组件是 iOS 16 之后出现在 iPhone 锁屏上的小块，由原生或第三方应用提供。Apple 自家的天气、提醒事项、日历和健身 app 都已经支持小组件。Apple 官方的支持文档有完整添加说明。",
    sectionWhatLink: "Apple 官方：如何在 iPhone 加小组件",
    sectionWhat2: "什么是锁屏壁纸提醒",
    sectionWhat2Body:
      "锁屏壁纸提醒是把文字或图片烧进手机壁纸背景的方案，每次亮屏手机自动看见。这类应用（包括 Lockscreen Todo）生成一张壁纸，存到相册，然后你在 iOS 或 Android 设置里把它指定为锁屏。",
    sectionCompare: "对比表：哪个适合你的场景",
    compareHeaders: ["维度", "锁屏小组件", "锁屏壁纸提醒"],
    compareRows: [
      ["每次亮屏可见性", "需要主动看。经常被滑过。", "永远可见。每次解锁和被动拿起手机都看到。"],
      ["iOS 26 可放位置", "最多 4 个矩形 + 1 个方形。严格上限。", "整个锁屏画布，不限数量。"],
      ["信息密度", "每个小组件最多 1-2 个短词。", "3-8 句话，完整短语，自定义字体。"],
      ["用户操作成本", "需要主动注视；点击展开。", "被动。大脑一秒钟内自动吸收。"],
      ["可定制程度", "受限于小组件本身的设计。", "完全自定义：字体、颜色、排版、背景图。"],
      ["实时数据源", "只接原生 app（日历、提醒、天气）。", "任何数据源，包括 Notion。"],
      ["耗电 / 性能", "每次查看有微小 CPU 开销。", "零开销。就是一张壁纸。"],
      ["Always-On Display 行为", "会渲染，长期可能耗电。", "壁纸文字正常显示（AOD 支持时）。"],
    ],
    sectionWhenWidget: "什么时候用小组件",
    whenWidgetItems: [
      "你需要持续更新的实时数值，比如下一个日历事件或电量百分比。",
      "你想点开小组件直接打开某个 app 干一件事，比如开始锻炼。",
      "你对小组件暴露的数据满意，不需要自定义文字。"],
    sectionWhenWall: "什么时候用壁纸提醒",
    whenWallItems: [
      "你想每次亮屏都看见、不需要主动操作。",
      "想一次显示好几条，而不是只看下一条。",
      "想完全控制文字、排版、字体、颜色和背景照片。",
      "你的数据不在 Apple 生态里，而在 Notion、Obsidian、Linear 或表格里。"],
    sectionNotion: "Notion 视角：为什么对 Notion 用户不是二选一",
    sectionNotionBody:
      "如果你的任务在 Notion 里，锁屏小组件根本读不到。Apple 自带的提醒事项小组件只能读 Apple Reminders；Widgetsmith 等第三方小组件也只能读自己 app 里存的数据。Lockscreen Todo 这类壁纸应用通过 OAuth 连接 Notion，把今天的任务拉出来渲染成壁纸。它在 Notion 官方 integrations 目录里有收录 —— 这让壁纸成为让 Notion 任务零点击上锁屏的唯一途径。",
    notionButton: "看 Notion 集成页",
    sectionCombine: "什么时候两个一起用（最强组合）",
    combineItems: [
      "小组件放日历（实时事件）。",
      "小组件放天气（实时状况）。",
      "壁纸提醒放今天的 Notion 任务和你总忘的那一个目标。"],
    sectionProof: "人真的多久看一次手机？",
    sectionProofBody:
      "常被引用的「每天 352 次」来自 RescueTime 2014 年的研究。Apple 近年披露的 Screen Time 平均值在每天 80-200 次解锁之间，被动拾起手机接近 250 次。无论按哪个数字，锁屏都是设备上**回忆频率最高**的界面 —— 这正是为什么壁纸提醒在「被记住」这件事上明显胜过通知类提醒。",
    proofSource: "Rescuetime 手机使用研究",
    faqTitle: "常见问题",
    faqs: [
      {
        q: "锁屏小组件和壁纸提醒能同时用吗？",
        a: "可以。iOS 26 锁屏支持最多 4 个矩形加 1 个方形小组件，同时可以放任意壁纸。许多人的最强组合是：小组件放实时数据（日历、天气），壁纸提醒放你想永远记住的静态优先级。",
      },
      {
        q: "壁纸提醒会耗电吗？",
        a: "不会。壁纸设好之后，设备就是显示一张静态图。没有后台进程，没有轮询，没有 API 调用。耗电行为和任何其他锁屏壁纸一样。",
      },
      {
        q: "我的壁纸提醒在 Always-On Display 上能看见吗？",
        a: "支持 AOD 的 iPhone 上，锁屏壁纸会镜像到 Always-On Display 上。系统会调暗图像，但文字仍然可读。Android 行为看厂商；大多数现代 Android 手机会把壁纸内容保留到 AOD。",
      },
      {
        q: "Lockscreen Todo 能每天自动更新锁屏吗？",
        a: "目前版本不能。iOS 和 Android 都限制网站替用户改锁屏。现有流程是：生成一次壁纸，保存到手机，设为锁屏，优先级变化时手动换图。我们正在研究用 Live Activities 和 Shortcuts 实现自动轮换。",
      },
      {
        q: "我能用自己的照片当背景，再叠 Notion 任务上去吗？",
        a: "可以。Lockscreen Todo 有「上传背景」模式，能把 Notion 任务叠到任何你选的图上，可调透明度、边距和字体。",
      },
      {
        q: "Android 能用吗？",
        a: "可以。你生成的壁纸就是一张 PNG 图。Android 上保存图片，打开，设为壁纸，裁剪到锁屏区域。大部分 Android 启动器都能正确处理锁屏图。",
      },
      {
        q: "为什么小组件只能放这么点东西？",
        a: "iOS 锁屏限制为少数矩形 + 1 个方形小组件，每个还有最大字数限制。Apple 自家 app 遵守这些限制；第三方小组件能塞几个词，但渲染不了列表形式。",
      },
      {
        q: "壁纸提醒有什么隐私顾虑？",
        a: "锁屏上的任何内容对拿走你手机的人都是可见的。不要放密码、财务信息或敏感账号。任务名和优先级通常没事。",
      },
    ],
    ctaEyebrow: "试试壁纸这边",
    ctaTitle: "让你的 Notion 任务无法忽视。",
    ctaBody:
      "Lockscreen Todo 是唯一一个能把 Notion 任务拉到手机锁屏的壁纸生成器。免费预览，无需安装 app。",
    ctaPrimary: "预览我的锁屏壁纸",
    ctaSecondary: "看全部场景",
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
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
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
      { "@type": "Thing", name: locale === "zh" ? "iOS 锁屏小组件" : "iOS lock screen widgets" },
      { "@type": "Thing", name: locale === "zh" ? "锁屏壁纸" : "Lock screen wallpaper" },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lockscreen Todo",
    applicationCategory: "LifestyleApplication",
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
    sameAs: [
      NOTION_INTEGRATION_URL,
      "https://www.producthunt.com/products/lockscreen-todo",
    ],
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

  return [articleSchema, softwareSchema, faqSchema, breadcrumbSchema];
};

export default function LockScreenWidgetVsWallpaperPage({ params }: PageProps) {
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
      <LockScreenWidgetVsWallpaperContent
        lang={lang}
        copy={t}
        notionIntegrationUrl={NOTION_INTEGRATION_URL}
        appleWidgetsGuideUrl={APPLE_WIDGETS_GUIDE_URL}
        rescuetimeSourceUrl={RESCUETIME_SOURCE_URL}
      />
    </>
  );
}
