import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { siteConfig } from "~/config/site";

const PAGE_PATH = "/press";

const copy = {
  en: {
    seoTitle: "Press kit — Lockscreen Todo",
    seoDescription:
      "Brand assets, screenshots, boilerplate copy, and contact information for reviewers covering Lockscreen Todo. Public domain logos, official product descriptions, and founder bio.",
    heroEyebrow: "Press kit",
    heroTitle: "Cover Lockscreen Todo",
    heroSubtitle:
      "Everything you need to write about Lockscreen Todo: brand assets, screenshots, boilerplate copy, and founder bio. All assets are public domain or CC0; reuse freely.",
    sectionBoilerplateTitle: "Boilerplate copy",
    sectionBoilerplateSub: "Copy-paste into your article. No attribution required, but a link is appreciated.",
    boilerplateShort:
      "Lockscreen Todo is a free web app that turns Notion tasks into a phone lock screen wallpaper. Read-only OAuth, no app install. https://lockscreentodo.com",
    boilerplateLong:
      "Lockscreen Todo is a free, open-source web app that pulls tasks from a user's Notion workspace and renders them as a phone lock screen wallpaper. The product was created in 2024 by a single developer who wanted his Notion tasks to appear on his phone lock screen instead of being trapped inside a task app. Lockscreen Todo is listed as an official Notion public integration and works on iOS and Android via JPG export. The product has no mobile app, no analytics tracker beyond Vercel Web Analytics, and stores no task data on its servers.",
    sectionBioTitle: "About the founder",
    founderName: "Ray",
    founderBio:
      "Ray is a solo developer based in Asia. He built Lockscreen Todo after forgetting one too many deadlines. He does not pretend this is a startup, will not raise funding, and ships updates when they are needed rather than on a marketing calendar. He maintains the open-source repository at github.com/rayvin1990/lockscreentodo-4.20.",
    sectionAssetsTitle: "Brand assets",
    sectionAssetsSub: "Right-click to save. All assets are released under CC0.",
    assetLogoTitle: "Wordmark",
    assetLogoDesc: "Full-color, on dark background. Use in headers.",
    assetScreensTitle: "Screenshots",
    assetScreensDesc: "Generator UI and example wallpaper. Use in features or product shots.",
    sectionContactTitle: "Contact",
    sectionContactBody:
      "For review units, interview requests, or partnership inquiries, message the founder on GitHub or open an issue on the public repository. Press inquiries get a response within a week.",
    sectionEmbedTitle: "Embed the generator",
    sectionEmbedSub:
      "If you write about Lockscreen Todo, you can embed the live generator on your own page. The generator is a single page at /generator that does not require any backend setup.",
  },
  zh: {
    seoTitle: "媒体资料 — Lockscreen Todo",
    seoDescription:
      "Lockscreen Todo 的品牌素材、截图、官方介绍文案、创始人简介。所有素材采用公有领域授权,自由使用。",
    heroEyebrow: "媒体资料",
    heroTitle: "报道 Lockscreen Todo",
    heroSubtitle: "Logo、截图、官方介绍、创始人信息,所有素材可自由使用。",
    sectionBoilerplateTitle: "官方介绍",
    sectionBoilerplateSub: "复制粘贴到你的文章里,无需署名,但加个链接会更友好。",
    boilerplateShort:
      "Lockscreen Todo 是一个免费 web 应用,把 Notion 任务转成手机锁屏壁纸。OAuth 只读,无需装 App。https://lockscreentodo.com",
    boilerplateLong:
      "Lockscreen Todo 是一个免费、开源的 web 应用,把你 Notion 工作区里的任务转成手机锁屏壁纸。2024 年由一位独立开发者创建,他想让 Notion 任务出现在锁屏上,而不是被困在 task app 里。这是 Notion 官方公开集成,在 iOS 和 Android 上都能用,导出 JPG 即可。不需要装 mobile app,没有额外 analytics,服务器不存储你的任务。",
    sectionBioTitle: "创始人",
    founderName: "Ray",
    founderBio:
      "Ray 是一位独立开发者,做这个产品是因为他老忘 deadline。他不假装这是 startup,不会融资,需要的时候才发版。开源代码在 github.com/rayvin1990/lockscreentodo-4.20。",
    sectionAssetsTitle: "品牌素材",
    sectionAssetsSub: "右键保存。所有素材 CC0 协议。",
    assetLogoTitle: "Logo",
    assetLogoDesc: "深色背景。",
    assetScreensTitle: "截图",
    assetScreensDesc: "生成器界面和示例壁纸。",
    sectionContactTitle: "联系",
    sectionContactBody: "采访、合作,请通过 GitHub 联系。",
    sectionEmbedTitle: "嵌入生成器",
    sectionEmbedSub: "如果你写关于 Lockscreen Todo 的文章,可以直接嵌入生成器。",
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
  const path = lang === "zh" ? "/zh/press" : "/en/press";
  return {
    title: seo.seoTitle,
    description: seo.seoDescription,
    alternates: { canonical: `${baseUrl}${path}` },
    openGraph: {
      type: "article",
      title: seo.seoTitle,
      description: seo.seoDescription,
      url: `${baseUrl}${path}`,
    },
  };
}

export default function PressPage({ params }: { params: { lang: string } }) {
  const lang: "en" | "zh" = params.lang === "zh" ? "zh" : "en";
  const c = copy[lang];
  const baseUrl = siteConfig.url;
  const notFoundTitle = lang === "zh" ? "未找到该语言" : "Not found";
  if (lang !== "en" && lang !== "zh") {
    return <div>{notFoundTitle}</div>;
  }
  const homePath = lang === "zh" ? "/zh" : "/en";

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: c.seoTitle,
    description: c.seoDescription,
    url: `${baseUrl}${PAGE_PATH}`,
    inLanguage: lang === "zh" ? "zh-Hans" : "en-US",
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: baseUrl },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Script
        id="ld-press"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-slate-600">
          <Link href={homePath} className="hover:text-slate-900">
            {lang === "zh" ? "首页" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{c.heroEyebrow}</span>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 mb-4">
            {c.heroEyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {c.heroTitle}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            {c.heroSubtitle}
          </p>
        </header>

        <Section title={c.sectionBoilerplateTitle} subtitle={c.sectionBoilerplateSub}>
          <CopyBlock label={lang === "zh" ? "短介绍 (一句话)" : "Short version (one sentence)"}>
            {c.boilerplateShort}
          </CopyBlock>
          <CopyBlock label={lang === "zh" ? "完整介绍 (三段)" : "Long version (three paragraphs)"}>
            {c.boilerplateLong}
          </CopyBlock>
        </Section>

        <Section title={c.sectionBioTitle}>
          <p className="font-bold text-lg mb-2">{c.founderName}</p>
          <p className="text-slate-700 leading-relaxed">{c.founderBio}</p>
        </Section>

        <Section title={c.sectionAssetsTitle} subtitle={c.sectionAssetsSub}>
          <div className="grid md:grid-cols-2 gap-6">
            <AssetCard title={c.assetLogoTitle} desc={c.assetLogoDesc}>
              <div className="bg-slate-900 text-white p-8 rounded flex items-center justify-center min-h-[120px]">
                <div className="text-center">
                  <div className="text-2xl font-bold tracking-tight">Lockscreen</div>
                  <div className="text-2xl font-bold tracking-tight text-emerald-400">Todo</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                <a href="/api/og?lang=en" className="text-emerald-600 hover:underline" target="_blank">
                  /api/og
                </a>{" "}
                (1200x630 PNG via /api/og)
              </p>
            </AssetCard>

            <AssetCard title={c.assetScreensTitle} desc={c.assetScreensDesc}>
              <div className="bg-slate-100 p-4 rounded text-center min-h-[120px] flex items-center justify-center">
                <Link
                  href={`${homePath}/generator`}
                  className="text-emerald-600 hover:underline font-medium"
                >
                  {lang === "zh" ? "访问生成器截图" : "Open generator for screenshots"} ↗
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {lang === "zh"
                  ? "截图前自己生成更真实,Notion 数据连接后可看到真实任务"
                  : "Generate fresh ones — connect your Notion for real screenshots"}
              </p>
            </AssetCard>
          </div>
        </Section>

        <Section title={c.sectionContactTitle}>
          <p className="text-slate-700 leading-relaxed mb-4">{c.sectionContactBody}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">GitHub:</span>{" "}
              <a
                href="https://github.com/rayvin1990"
                className="text-emerald-600 hover:underline"
              >
                github.com/rayvin1990
              </a>
            </li>
            <li>
              <span className="font-medium">Repository:</span>{" "}
              <a
                href="https://github.com/rayvin1990/lockscreentodo-4.20"
                className="text-emerald-600 hover:underline"
              >
                github.com/rayvin1990/lockscreentodo-4.20
              </a>
            </li>
            <li>
              <span className="font-medium">Notion listing:</span>{" "}
              <a
                href="https://www.notion.com/integrations/lockscreen-todo"
                className="text-emerald-600 hover:underline"
              >
                notion.com/integrations/lockscreen-todo
              </a>
            </li>
          </ul>
        </Section>

        <Section title={c.sectionEmbedTitle} subtitle={c.sectionEmbedSub}>
          <p className="text-slate-700 leading-relaxed">
            {lang === "zh"
              ? "读者可以从你的文章直接进入生成器,无需注册或安装任何东西。"
              : "Readers can launch the generator directly from your article — no signup, no install."}
          </p>
          <Link
            href={`${homePath}/generator`}
            className="inline-block mt-4 px-6 py-3 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition-colors"
          >
            {lang === "zh" ? "试用生成器 →" : "Try the generator →"}
          </Link>
        </Section>
      </article>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-slate-600 mb-6">{subtitle}</p>}
      {children}
    </section>
  );
}

function CopyBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </p>
      <pre className="bg-slate-50 border border-slate-200 p-4 rounded text-sm whitespace-pre-wrap font-mono text-slate-800">
        {children}
      </pre>
    </div>
  );
}

function AssetCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-200 rounded p-4">
      <p className="font-medium mb-1">{title}</p>
      <p className="text-sm text-slate-600 mb-3">{desc}</p>
      {children}
    </div>
  );
}