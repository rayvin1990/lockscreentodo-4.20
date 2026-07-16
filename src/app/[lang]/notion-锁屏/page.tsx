import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { siteConfig } from "~/config/site";

const PAGE_PATH = "/notion-锁屏";

const copy = {
  zh: {
    seoTitle: "Notion 锁屏教程 — 把 Notion 任务显示在手机锁屏上",
    seoDescription:
      "Notion 用户看这里。把你的 Notion 数据库转成锁屏壁纸,每天 50+ 次被动曝光,不用每天打开 Notion app。Read-only OAuth,无需装 App,支持 iPhone 和 Android。",
    seoKeywords: [
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
      "Notion 安卓 锁屏",
      "Notion 怎么 提醒",
      "Notion 提醒 任务",
      "Notion 任务 不做 提醒",
      "iPhone 锁屏 待办",
      "iOS 锁屏 任务",
      "安卓 锁屏 任务",
      "锁屏 待办清单",
      "锁屏 任务清单",
      "锁屏 提醒 任务",
      "Notion 每天 任务",
    ],
    breadcrumbHome: "首页",
    breadcrumbCurrent: "Notion 锁屏教程",
    heroEyebrow: "Notion 锁屏",
    heroTitle: "把 Notion 任务放在锁屏上",
    heroSubtitle:
      "每天解锁手机 50+ 次,任务终于能被看到了。无需装 App,3 分钟搞定。",
    section1Title: "为什么要把 Notion 任务放在锁屏上",
    section1Body:
      "Notion 是写任务最好的工具之一,但有个问题:**你不会主动打开它**。大多数人每天打开 Notion 4-10 次,但解锁手机 50-150 次。锁屏是每天最高频的视觉位置,但 Notion 任务永远不会出现在那里 —— 除非你主动打开 app。Lockscreen Todo 把 Notion 任务直接渲染到锁屏壁纸上,被动曝光,不依赖你的记忆或习惯。",
    section2Title: "怎么把 Notion 任务变成锁屏壁纸",
    section2Steps: [
      { num: "01", title: "授权 Notion", desc: "在 LockscreenTodo 点 Connect Notion,OAuth 一次。只读权限,你的任务不会被保存到我们的服务器。" },
      { num: "02", title: "选任务", desc: "应用自动从你的 Notion 数据库里挑出今天(或明天)要做的任务,默认 5 条。" },
      { num: "03", title: "生成壁纸", desc: "点 Generate,LockscreenTodo 把任务渲染到 1170x2532 的锁屏壁纸上。" },
      { num: "04", title: "保存到相册", desc: "下载 JPG 到手机相册。" },
      { num: "05", title: "设成锁屏", desc: "iPhone 选 Settings > Wallpaper > Add New > Choose Photo;Android 选 Wallpaper > Gallery。30 秒搞定。" },
    ],
    section3Title: "Notion 数据库需要什么结构",
    section3Body:
      "LockscreenTodo 会自动检测你的数据库,只要它有: 1) 一个 title 类型的属性(标题)、2) 一个 date 类型的属性(截止日期)。其他属性(Status、Priority、Assignee 等)不影响导入。",
    section4Title: "iPhone 和 Android 都能用吗",
    section4iOS: "iOS 16+ 完美支持。锁屏壁纸分辨率 1170x2532(iPhone 14/15)。保存到相册后,Settings > Wallpaper > Add New > Choose Photo 即可。",
    section4Android: "Android 11+ 支持。锁屏壁纸分辨率根据设备。设置 > 壁纸 > 相册。",
    section5Title: "数据安全吗",
    section5Body:
      "只读 OAuth scope —— 我们**不会**写入你的 Notion。你的任务**不会**保存在我们服务器上 —— 每次你点 Generate,我们实时从 Notion API 拉。OAuth token 加密存储在 Supabase,只用于下次你点 Generate 时鉴权。",
    section6Title: "常见问题",
    section6Faqs: [
      { q: "我的 Notion 是中文界面也能用吗?", a: "能。LockscreenTodo 通过 Notion API 读取你的 database,跟你用什么语言界面无关。中文 / 英文 / 日文 / 韩文 任务都能正确显示。" },
      { q: "能支持多个 Notion database 吗?", a: "目前一个连接对应一个 database。如果想切换 database,断开重连 Notion 即可。" },
      { q: "我的 Notion 是 free plan 还是 paid?", a: "两种都行。LockscreenTodo 只读你的 database,跟你 Notion 的 plan 无关。" },
      { q: "任务过多会怎样?", a: "默认只显示今天到期的 5 条。如果你想显示更多,生成壁纸后可以再选一次。" },
      { q: "每天要重新生成壁纸吗?", a: "不是必须的。壁纸是静态图。但每次 Notion 任务变化后,重新生成会反映新任务。" },
    ],
    ctaTitle: "试试看,3 分钟搞定",
    ctaButton: "开始使用",
  },
  en: {
    seoTitle: "Notion lock screen tutorial — put your Notion tasks on your iPhone or Android lock screen",
    seoDescription:
      "Notion power users: turn your Notion database into a lock screen wallpaper. Read-only OAuth, no app install, iOS + Android. 50+ passive views per day.",
    seoKeywords: [
      "notion lock screen",
      "notion on lock screen",
      "notion tasks lock screen",
      "notion reminders lock screen",
      "notion lock screen widget",
      "notion iphone lock screen",
      "notion android lock screen",
    ],
  },
};

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang: "en" | "zh" = params.lang === "zh" ? "zh" : "en";
  const seo = copy[lang];
  const baseUrl = siteConfig.url;
  const path =
    lang === "zh" ? `${PAGE_PATH}` : "/en/notion-锁屏-tutorial";
  return {
    title: seo.seoTitle,
    description: seo.seoDescription,
    keywords: seo.seoKeywords,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        "en-US": `${baseUrl}/en/notion-锁屏-tutorial`,
        "zh-Hans": `${baseUrl}/zh/notion-锁屏`,
        "x-default": `${baseUrl}/zh/notion-锁屏`,
      },
    },
    openGraph: {
      type: "article",
      title: seo.seoTitle,
      description: seo.seoDescription,
      url: `${baseUrl}${path}`,
    },
  };
}

export default function NotionLockScreenPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: "en" | "zh" = params.lang === "zh" ? "zh" : "en";
  if (lang === "en") {
    return <EnglishFallback lang={lang} />;
  }
  return <ChinesePage />;
}

function ChinesePage() {
  const c = copy.zh;
  const baseUrl = siteConfig.url;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.seoTitle,
    description: c.seoDescription,
    inLanguage: "zh-Hans",
    author: {
      "@type": "Person",
      name: siteConfig.organization.founderName,
      url: siteConfig.organization.founderGithub,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      logo: `${baseUrl}/icon.png`,
    },
    mainEntityOfPage: `${baseUrl}${PAGE_PATH}`,
    keywords: c.seoKeywords.join(", "),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: c.seoTitle,
    step: c.section2Steps.map((s) => ({
      "@type": "HowToStep",
      position: s.num,
      name: s.title,
      text: s.desc,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.section6Faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Script id="ld-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Script id="ld-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <Script id="ld-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-slate-600">
          <Link href="/zh" className="hover:text-slate-900">{c.breadcrumbHome}</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{c.breadcrumbCurrent}</span>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 mb-4">{c.heroEyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">{c.heroTitle}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">{c.heroSubtitle}</p>
        </header>

        <Section title={c.section1Title}><p className="text-slate-700 leading-relaxed text-lg">{c.section1Body}</p></Section>

        <Section title={c.section2Title}>
          <ol className="space-y-6">
            {c.section2Steps.map((s) => (
              <li key={s.num} className="flex gap-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">{s.num}</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title={c.section3Title}><p className="text-slate-700 leading-relaxed text-lg">{c.section3Body}</p></Section>

        <Section title={c.section4Title}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded p-5">
              <h3 className="font-bold mb-2">iOS</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{c.section4iOS}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-5">
              <h3 className="font-bold mb-2">Android</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{c.section4Android}</p>
            </div>
          </div>
        </Section>

        <Section title={c.section5Title}><p className="text-slate-700 leading-relaxed text-lg">{c.section5Body}</p></Section>

        <Section title={c.section6Title}>
          <div className="space-y-3">
            {c.section6Faqs.map((f) => (
              <details key={f.q} className="bg-slate-50 border border-slate-200 rounded">
                <summary className="cursor-pointer p-4 font-medium hover:bg-slate-100">{f.q}</summary>
                <p className="px-4 pb-4 text-slate-700 leading-relaxed text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <div className="mt-16 text-center bg-emerald-600 text-white p-10 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{c.ctaTitle}</h2>
          <Link href="/zh/generator" className="inline-block bg-white text-emerald-700 font-bold px-8 py-3 rounded hover:bg-emerald-50 transition-colors">
            {c.ctaButton} →
          </Link>
        </div>
      </article>
    </div>
  );
}

function EnglishFallback({ lang }: { lang: "en" | "zh" }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500">
      <p>English content coming soon. <Link href="/en/lock-screen-todo" className="underline">See English version</Link>.</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 border-l-4 border-emerald-500 pl-4">{title}</h2>
      {children}
    </section>
  );
}