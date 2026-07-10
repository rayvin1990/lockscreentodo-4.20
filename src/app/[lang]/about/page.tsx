import type { Metadata } from "next";
import Script from "next/script";

import { siteConfig } from "~/config/site";
import { AboutContent } from "~/components/about-content";

const NOTION_INTEGRATION_URL = "https://www.notion.com/integrations/lockscreen-todo";
const PRODUCT_HUNT_URL = "https://www.producthunt.com/products/lockscreen-todo";
const GITHUB_URL = "https://github.com/rayvin1990/lockscreentodo-4.20";
const PAGE_PATH = "/about";

const copy = {
  en: {
    seoTitle: "About Lockscreen Todo — A solo project for Notion users who keep forgetting",
    seoDescription:
      "Lockscreen Todo is a small, independent web app made by a single developer. We turn Notion tasks into a phone lock screen wallpaper, no app install. Honest founder story, what we don't do, and how to reach us.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "About",
    heroEyebrow: "About Lockscreen Todo",
    heroTitle: "One developer. One problem. No app.",
    heroSubtitle:
      "Lockscreen Todo is a small, independent web app that turns Notion tasks into a phone lock screen wallpaper. I built it for myself, then made it available for anyone who has the same problem.",
    sectionStoryTitle: "Why this exists",
    sectionStoryBody:
      "I kept forgetting what I had to do. Apple's Reminders widget on the lock screen is fine but small, and it can't show my Notion tasks. I tried three commercial lock screen note apps. Each had the same flaw: they wanted me to re-enter my tasks inside their app, which meant my real source of truth (Notion) was out of sync with the wallpaper I was staring at all day.",
    sectionStoryBody2:
      "I built Lockscreen Todo on a Sunday in 2024. The first version read from a Notion database, generated a 1080x1920 PNG with the tasks on a semi-transparent pill, and pushed it to my phone. I have used it every day since. The version you're looking at is the same idea, cleaned up for other people to use.",
    sectionStoryQuote:
      "I wanted my real source of truth (Notion) to be the thing on my lock screen, not a copy of it.",
    sectionFounderTitle: "Who built it",
    sectionFounderBody:
      "Lockscreen Todo is built and maintained by Ray, a solo developer based in Asia. There is no team, no investors, no agency. The codebase is open on GitHub; the only reason it has not been more publicly released is that I wanted to make sure the Notion OAuth flow is robust before exposing it to more users.",
    sectionFounderName: "Ray",
    sectionFounderRole: "Solo developer",
    sectionFounderLinkLabel: "GitHub profile",
    sectionFounderLinkUrl: GITHUB_URL,
    sectionPrivacyTitle: "What we don't do",
    sectionPrivacyIntro:
      "Most lock screen wallpaper apps do at least one of the following. Lockscreen Todo does none of them.",
    privacyItems: [
      "We do not require an app install. The whole product runs in a browser.",
      "We do not track which tasks you put on your wallpaper. The generator is fully client-side; the image is generated in your browser and only uploaded to R2 when you explicitly click Generate.",
      "We do not run third-party analytics on the generator. There are no Facebook pixels or Google Analytics tags in the flow that handles your tasks.",
      "We do not read or store your Notion content beyond the task titles you choose. The OAuth token is held in your session; we do not keep a long-lived Notion connection.",
      "We do not show ads.",
    ],
    sectionContactTitle: "How to reach us",
    sectionContactIntro:
      "If you have a question, a feature request, or you want to tell me the wallpaper approach didn't work for you, the best way to reach me is:",
    contactItems: [
      { label: "Notion integration listing (for feedback / feature requests)", url: NOTION_INTEGRATION_URL },
      { label: "GitHub issues (for code-level bugs)", url: GITHUB_URL },
      { label: "Product Hunt reviews (for public feedback)", url: PRODUCT_HUNT_URL },
    ],
    sectionContactClosing:
      "If the lock screen approach doesn't work for you, the comparison page at /lock-screen-widget-vs-wallpaper tells you when widgets are a better fit. I am not affiliated with any of the widget apps; the page is honest.",
    sectionCtaTitle: "Try it",
    sectionCtaBody:
      "Lockscreen Todo is free to preview. No account, no app install. Connect Notion, see your tasks on a sample lock screen, and decide if it works for you.",
    ctaPrimary: "Preview my lock screen",
    ctaSecondary: "Read the comparison guide",
  },
  zh: {
    seoTitle: "关于 Lockscreen Todo —— 一个给「总忘事」的 Notion 用户做的小项目",
    seoDescription:
      "Lockscreen Todo 是一个独立的小 web app，单人开发。我们把 Notion 任务变成手机锁屏壁纸，无需安装 app。诚实的创始人故事、我们不做什么、怎么联系我们。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "关于",
    heroEyebrow: "关于 Lockscreen Todo",
    heroTitle: "一个开发者。一个问题。不用装 app。",
    heroSubtitle:
      "Lockscreen Todo 是一个独立的小 web app，把 Notion 任务变成手机锁屏壁纸。先给我自己做的，后来开放给有同样问题的人。",
    sectionStoryTitle: "为什么有这个项目",
    sectionStoryBody:
      "我老忘该做什么。Apple 的提醒事项小组件在锁屏上能用，但太小，而且没法显示我的 Notion 任务。我试过 3 款商业锁屏便签 app，每个都有同样的问题：要我重新在他们 app 里输入任务，结果我的真实源（Notion）跟我盯一天的壁纸是脱节的。",
    sectionStoryBody2:
      "我在 2024 年某个周日开始做 Lockscreen Todo。第一版读 Notion 数据库，生成 1080x1920 的 PNG，任务叠在半透明 pill 上，推到手机。我从那以后每天在用。你现在看到的是同一思路的清理版，给别人也能用。",
    sectionStoryQuote:
      "我希望我的真实源（Notion）就是锁屏上的东西，而不是它的复制。",
    sectionFounderTitle: "谁做的",
    sectionFounderBody:
      "Lockscreen Todo 由 Ray 一个人开发和维护，base 在亚洲。没有团队，没有投资人，没有代理。代码在 GitHub 开源；之前没更大范围公开，是想先把 Notion OAuth 流程做稳。",
    sectionFounderName: "Ray",
    sectionFounderRole: "独立开发者",
    sectionFounderLinkLabel: "GitHub 个人页",
    sectionFounderLinkUrl: GITHUB_URL,
    sectionPrivacyTitle: "我们不做什么",
    sectionPrivacyIntro:
      "大多数锁屏壁纸 app 至少会做以下一种。Lockscreen Todo 一样都不做。",
    privacyItems: [
      "不要求装 app。整个产品在浏览器里跑。",
      "不追踪你放哪些任务到壁纸。生成器全在客户端，点 Generate 之前图片根本不上传。",
      "生成器流程里没有第三方 analytics。没有 Facebook pixel 或 Google Analytics。",
      "不读也不存你 Notion 内容，只读你选的任务标题。OAuth token 在 session 里，不长期持有 Notion 连接。",
      "不展示广告。",
    ],
    sectionContactTitle: "怎么联系我们",
    sectionContactIntro: "有问题、功能请求、或者想告诉我壁纸方式不适合你，最佳途径是：",
    contactItems: [
      { label: "Notion 集成页（反馈 / 功能请求）", url: NOTION_INTEGRATION_URL },
      { label: "GitHub issues（代码层 bug）", url: GITHUB_URL },
      { label: "Product Hunt 评论（公开反馈）", url: PRODUCT_HUNT_URL },
    ],
    sectionContactClosing:
      "如果锁屏方式不适合你，/lock-screen-widget-vs-wallpaper 上的对比页告诉你什么时候用小组件更好。我跟那些小组件 app 都没关系，页面是诚实的。",
    sectionCtaTitle: "试试",
    sectionCtaBody: "Lockscreen Todo 免费预览，不要账号，不装 app。接 Notion，看一眼你的任务在样例锁屏上的样子，再决定适不适合你。",
    ctaPrimary: "预览我的锁屏",
    ctaSecondary: "看对比指南",
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
      type: "profile",
    },
  };
}

const jsonLdForLocale = (locale: Locale) => {
  const t = copy[locale];
  const pageUrl = `${siteConfig.url}${locale === "zh" ? "/zh" : "/en"}${PAGE_PATH}`;
  const inLanguage = locale === "zh" ? "zh-Hans" : "en-US";

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: t.seoTitle,
    description: t.seoDescription,
    inLanguage,
    url: pageUrl,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/og-image.jpg`,
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: { "@type": "Thing", name: "Lockscreen Todo" },
  };

  const founderSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: t.sectionFounderName,
    jobTitle: t.sectionFounderRole,
    url: t.sectionFounderLinkUrl,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      url: siteConfig.url,
    },
    knowsAbout: [
      "Notion API",
      "Lock screen productivity",
      "iOS widgets",
      "Web wallpaper generation",
    ],
    sameAs: [t.sectionFounderLinkUrl],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.seoTitle,
    description: t.seoDescription,
    inLanguage,
    datePublished: "2024-01-01",
    dateModified: "2026-07-10",
    author: { "@type": "Person", name: t.sectionFounderName, url: t.sectionFounderLinkUrl },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` },
    },
    mainEntityOfPage: pageUrl,
    sameAs: [NOTION_INTEGRATION_URL, PRODUCT_HUNT_URL, GITHUB_URL],
    about: { "@type": "SoftwareApplication", name: "Lockscreen Todo" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.breadcrumbHome, item: `${siteConfig.url}${locale === "zh" ? "/zh" : "/en"}` },
      { "@type": "ListItem", position: 2, name: t.breadcrumbCurrent, item: pageUrl },
    ],
  };

  return [aboutPageSchema, founderSchema, articleSchema, breadcrumbSchema];
};

export default function AboutPage({ params }: PageProps) {
  const lang = pickLocale(params.lang);
  const t = copy[lang];
  const schemas = jsonLdForLocale(lang);

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`ld-about-${lang}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <AboutContent lang={lang} copy={t} />
    </>
  );
}
