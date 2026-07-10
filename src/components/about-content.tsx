import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Github,
  Mail,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { Button } from "~/components/ui/button";

type Copy = {
  seoTitle: string;
  seoDescription: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  sectionStoryTitle: string;
  sectionStoryBody: string;
  sectionStoryBody2: string;
  sectionStoryQuote: string;
  sectionFounderTitle: string;
  sectionFounderBody: string;
  sectionFounderName: string;
  sectionFounderRole: string;
  sectionFounderLinkLabel: string;
  sectionFounderLinkUrl: string;
  sectionPrivacyTitle: string;
  sectionPrivacyIntro: string;
  privacyItems: readonly string[];
  sectionContactTitle: string;
  sectionContactIntro: string;
  contactItems: readonly { readonly label: string; readonly url: string }[];
  sectionContactClosing: string;
  sectionCtaTitle: string;
  sectionCtaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

type Props = {
  lang: "en" | "zh";
  copy: Copy;
};

const NOTION_INTEGRATION_URL = "https://www.notion.com/integrations/lockscreen-todo";

export function AboutContent({ lang, copy }: Props) {
  const generatorHref = `/${lang}/generator`;
  const widgetPageSlug = `/${lang}/lock-screen-widget-vs-wallpaper`;
  const isZh = lang === "zh";

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020205]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Lockscreen Todo</span>
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href={generatorHref}
              className="rounded-full bg-white px-4 py-1.5 font-bold uppercase tracking-widest text-black transition-colors hover:bg-indigo-50"
            >
              {isZh ? "生成器" : "Generator"}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        <section className="relative overflow-hidden px-6 pb-16 pt-12 lg:pb-24 lg:pt-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.14),transparent_55%)]" />
          <div className="container relative z-10 mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300">
              <User className="h-3 w-3" />
              <span>{copy.breadcrumbCurrent}</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 lg:text-lg">
              {copy.heroSubtitle}
            </p>
          </div>
        </section>

        <article className="px-6 pb-16">
          <div className="container mx-auto max-w-3xl space-y-16 text-base leading-relaxed text-slate-300">
            <section>
              <SectionHeading title={copy.sectionStoryTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionStoryBody}</p>
              <p className="mt-4">{copy.sectionStoryBody2}</p>
              <blockquote className="mt-8 rounded-r-2xl border-l-4 border-indigo-500 bg-white/[0.03] px-6 py-5 text-lg italic text-slate-200">
                {copy.sectionStoryQuote}
              </blockquote>
            </section>

            <section>
              <SectionHeading title={copy.sectionFounderTitle} />
              <p className="mt-6">{copy.sectionFounderBody}</p>
              <div className="mt-6 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white">
                  {copy.sectionFounderName.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{copy.sectionFounderName}</div>
                  <div className="text-sm text-slate-400">{copy.sectionFounderRole}</div>
                  <a
                    href={copy.sectionFounderLinkUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 hover:text-indigo-200"
                  >
                    <Github className="h-3 w-3" />
                    {copy.sectionFounderLinkLabel}
                  </a>
                </div>
              </div>
            </section>

            <section>
              <SectionHeading title={copy.sectionPrivacyTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionPrivacyIntro}</p>
              <ul className="mt-6 space-y-3">
                {copy.privacyItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="mt-1 h-4 w-4 flex-shrink-0 text-rose-400/80" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionHeading title={copy.sectionContactTitle} />
              <p className="mt-6">{copy.sectionContactIntro}</p>
              <ul className="mt-6 space-y-3">
                {copy.contactItems.map((item) => (
                  <li key={item.url} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center justify-between gap-3 text-sm text-indigo-200 hover:text-indigo-100"
                    >
                      <span className="flex items-center gap-2">
                        {item.url.includes("notion") ? (
                          <Sparkles className="h-4 w-4" />
                        ) : item.url.includes("github") ? (
                          <Github className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        {item.label}
                      </span>
                      <span className="text-xs text-indigo-400">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-slate-400">{copy.sectionContactClosing}</p>
            </section>
          </div>
        </article>

        <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#020205] via-indigo-950/15 to-[#020205] px-6 py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_55%)]" />
          <div className="container relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold leading-tight lg:text-4xl">{copy.sectionCtaTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">{copy.sectionCtaBody}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-full bg-white px-8 font-bold text-black hover:bg-indigo-50">
                <Link href={generatorHref}>
                  {copy.ctaPrimary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link
                href={widgetPageSlug}
                className="text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:text-white"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">{title}</h2>
      <div className="mt-2 h-px w-12 bg-gradient-to-r from-indigo-500 to-transparent" />
    </div>
  );
}
