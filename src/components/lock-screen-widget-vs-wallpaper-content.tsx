import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, Circle, Clock, ExternalLink, Eye, Image as ImageIcon, Layers, Shield, Smartphone, Sparkles, Wifi } from "lucide-react";

import { Button } from "~/components/ui/button";

type Copy = {
  seoTitle: string;
  seoDescription: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  tldrLabel: string;
  tldrStatement: string;
  sectionWhat: string;
  sectionWhatBody: string;
  sectionWhatLink: string;
  sectionWhat2: string;
  sectionWhat2Body: string;
  sectionCompare: string;
  compareHeaders: readonly [string, string, string];
  compareRows: readonly (readonly [string, string, string])[];
  sectionWhenWidget: string;
  whenWidgetItems: readonly string[];
  sectionWhenWall: string;
  whenWallItems: readonly string[];
  sectionNotion: string;
  sectionNotionBody: string;
  notionButton: string;
  sectionCombine: string;
  combineItems: readonly string[];
  sectionProof: string;
  sectionProofBody: string;
  proofSource: string;
  faqTitle: string;
  faqs: readonly { readonly q: string; readonly a: string }[];
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

type Props = {
  lang: "en" | "zh";
  copy: Copy;
  notionIntegrationUrl: string;
  appleWidgetsGuideUrl: string;
  rescuetimeSourceUrl: string;
};

const sectionAnchor = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function LockScreenWidgetVsWallpaperContent({
  lang,
  copy,
  notionIntegrationUrl,
  appleWidgetsGuideUrl,
  rescuetimeSourceUrl,
}: Props) {
  const generatorHref = `/${lang}/generator`;
  const homeHref = `/${lang}`;
  const iconForDimension = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("visibility") || l.includes("visible") || l.includes("可见")) return <Eye className="h-4 w-4" />;
    if (l.includes("slot") || l.includes("widget") || l.includes("widget") || l.includes("位置")) return <Layers className="h-4 w-4" />;
    if (l.includes("density") || l.includes("信息")) return <BookOpen className="h-4 w-4" />;
    if (l.includes("action") || l.includes("operate") || l.includes("操作") || l.includes("主动")) return <Sparkles className="h-4 w-4" />;
    if (l.includes("custom") || l.includes("定制")) return <ImageIcon className="h-4 w-4" />;
    if (l.includes("live") || l.includes("data") || l.includes("实时") || l.includes("数据")) return <Wifi className="h-4 w-4" />;
    if (l.includes("battery") || l.includes("performance") || l.includes("耗电")) return <Shield className="h-4 w-4" />;
    if (l.includes("always") || l.includes("aod")) return <Clock className="h-4 w-4" />;
    return <Circle className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020205]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href={homeHref} className="flex items-center gap-2">
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
              {lang === "zh" ? "生成器" : "Generator"}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        <section className="relative overflow-hidden px-6 pb-20 pt-12 lg:pb-28 lg:pt-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.14),transparent_55%)]" />
          <div className="container relative z-10 mx-auto max-w-4xl">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300">
              <Calendar className="h-3 w-3" />
              <span>{copy.breadcrumbCurrent}</span>
            </div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
              {copy.seoTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 lg:text-lg">
              {copy.seoDescription}
            </p>
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-2xl border-2 border-indigo-500/40 bg-indigo-500/[0.08] p-6 shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)]">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300">
                <Sparkles className="h-3 w-3" />
                <span>{copy.tldrLabel}</span>
              </div>
              <p className="text-lg leading-relaxed text-white">{copy.tldrStatement}</p>
            </div>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="container mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.07]">
                  <Layers className="h-5 w-5 text-indigo-300" />
                </div>
                <h2 className="text-xl font-bold">{copy.sectionWhat}</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{copy.sectionWhatBody}</p>
              <a
                href={appleWidgetsGuideUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 hover:text-indigo-200"
              >
                {copy.sectionWhatLink}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15">
                  <ImageIcon className="h-5 w-5 text-indigo-300" />
                </div>
                <h2 className="text-xl font-bold">{copy.sectionWhat2}</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{copy.sectionWhat2Body}</p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02] px-6 py-20" id={sectionAnchor(copy.sectionCompare)}>
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight">{copy.sectionCompare}</h2>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                    <th className="px-5 py-4 font-bold">{copy.compareHeaders[0]}</th>
                    <th className="px-5 py-4 font-bold text-white/70">{copy.compareHeaders[1]}</th>
                    <th className="px-5 py-4 font-bold text-indigo-300">{copy.compareHeaders[2]}</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.compareRows.map((row, index) => (
                    <tr key={row[0]} className={index % 2 === 0 ? "bg-white/[0.02]" : undefined}>
                      <td className="px-5 py-4 align-top font-bold text-white/90">
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-300">{iconForDimension(row[0])}</span>
                          <span>{row[0]}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-slate-400">{row[1]}</td>
                      <td className="px-5 py-4 align-top text-white">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="container mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Layers className="h-5 w-5 text-white/60" />
                {copy.sectionWhenWidget}
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed text-slate-400">
                {copy.whenWidgetItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/40" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-indigo-500/40 bg-indigo-500/[0.06] p-7">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <ImageIcon className="h-5 w-5 text-indigo-300" />
                {copy.sectionWhenWall}
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed text-slate-300">
                {copy.whenWallItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02] px-6 py-20" id="notion-angle">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.08] via-[#020205] to-transparent p-8 lg:p-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-200">
                <Smartphone className="h-3 w-3" />
                <span>Notion</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight lg:text-3xl">{copy.sectionNotion}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">{copy.sectionNotionBody}</p>
              <a
                href={notionIntegrationUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
              >
                {copy.notionButton}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight">{copy.sectionCombine}</h2>
            <p className="mt-3 text-sm text-slate-400">{lang === "zh" ? "推荐组合：" : "The strongest setup combines both. Typically you want:"}</p>
            <ul className="mt-6 space-y-3">
              {copy.combineItems.map((item, index) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-300">
                    {index + 1}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-white/5 bg-white/[0.01] px-6 py-20" id="research-evidence">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <Eye className="h-5 w-5 text-indigo-300" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{copy.sectionProof}</h2>
            </div>
            <p className="text-base leading-relaxed text-slate-300">{copy.sectionProofBody}</p>
            <a
              href={rescuetimeSourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 hover:text-indigo-200"
            >
              <span>{copy.proofSource}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </section>

        <section className="px-6 py-20" id={sectionAnchor(copy.faqTitle)}>
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">{copy.faqTitle}</h2>
            <div className="space-y-4">
              {copy.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] open:border-indigo-500/30 open:bg-white/[0.05]"
                >
                  <summary className="cursor-pointer list-none px-6 py-5 font-bold text-white transition-colors hover:text-indigo-200 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      <span>{faq.q}</span>
                      <span className="text-indigo-400 transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm leading-relaxed text-slate-400">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#020205] via-indigo-950/15 to-[#020205] px-6 py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_55%)]" />
          <div className="container relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-200">
              <Smartphone className="h-3 w-3" />
              <span>{copy.ctaEyebrow}</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight lg:text-4xl">{copy.ctaTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">{copy.ctaBody}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-full bg-white px-8 font-bold text-black hover:bg-indigo-50">
                <Link href={generatorHref}>
                  {copy.ctaPrimary}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link
                href={`${homeHref}#use-cases`}
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
