import { i18n } from "~/config/i18n-config";
import { siteConfig } from "~/config/site";
import type { Metadata } from "next";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

const seoCopy = {
  en: {
    title: "Lockscreen Todo: Your Notion Tasks on Your Lock Screen Wallpaper",
    description:
      "Turn your Notion to-do list into a phone lock screen wallpaper. Free, read-only OAuth, no app install. Today's tasks in your face 50+ times a day, no new habit to build.",
    keywords: [
      "notion lock screen",
      "notion lock screen wallpaper",
      "notion tasks on lock screen",
      "lock screen to do list",
      "lock screen todo wallpaper",
      "iphone lock screen todo",
      "android lock screen tasks",
      "notion to phone wallpaper",
      "daily task wallpaper",
      "notion daily agenda",
      "notion habit tracker wallpaper",
      "lock screen productivity",
      "notion wallpaper generator",
      "notion sticky notes lock screen",
      "todo list wallpaper",
    ],
    ogTitle: "Your Notion tasks aren't on your lock screen. Why not?",
    ogDescription:
      "Connect Notion once. Today's tasks appear on your lock screen automatically. 50+ passive views per day, zero taps.",
  },
  zh: {
    title: "锁屏待办:把 Notion 任务直接放在锁屏上",
    description:
      "把 Notion 待办清单变成手机锁屏壁纸。免费、只读 OAuth、无需装 App。每天 50+ 次被动曝光,不用新习惯。",
    keywords: [
      "锁屏待办",
      "锁屏待办清单",
      "锁屏任务壁纸",
      "手机锁屏待办",
      "Notion 锁屏",
      "Notion 任务 锁屏",
      "Notion 待办 锁屏",
      "Notion 提醒",
      "Notion 任务提醒",
      "Notion 任务墙纸",
      "Notion 任务壁纸",
      "Notion wallpaper",
      "Notion daily agenda 锁屏",
      "Notion 锁屏小组件",
      "Notion iPhone 锁屏",
      "Notion 安卓锁屏",
      "Notion 怎么 提醒",
      "Notion 提醒 任务",
      "Notion 任务 不做 提醒",
      "Notion 每天 任务",
      "iPhone 锁屏 待办",
      "iOS 锁屏 任务",
      "安卓 锁屏 任务",
      "锁屏 待办清单",
      "锁屏 任务清单",
      "锁屏 提醒 任务",
      "待办壁纸生成器",
      "锁屏生成器",
      "免费锁屏壁纸生成器",
      "自定义锁屏待办",
      "锁屏待办壁纸",
      "手机锁屏任务",
      "锁屏提醒",
      "每日任务 锁屏",
      "Notion 时间块",
      "Notion 番茄钟",
      "锁屏任务提醒",
      "壁纸 任务",
      "Notion 模板 锁屏",
    ],
    ogTitle: "你的 Notion 任务没在锁屏上,为什么不?",
    ogDescription:
      "连接一次 Notion,任务自动出现在锁屏。无需装 App,无需培养新习惯。",
  },
};

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang: "en" | "zh" = params.lang === "zh" ? "zh" : "en";
  const seo = seoCopy[lang];
  const baseUrl = siteConfig.url;
  const path = lang === "zh" ? "/zh" : "/en";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        "en-US": `${baseUrl}/en`,
        "zh-Hans": `${baseUrl}/zh`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}${path}`,
      siteName: siteConfig.name,
      images: [
        {
          url: `${baseUrl}/api/og?lang=${lang}`,
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
      locale: lang === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [`${baseUrl}/api/og?lang=${lang}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}