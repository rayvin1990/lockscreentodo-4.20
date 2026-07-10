import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Apple,
  ArrowRight,
  BatteryCharging,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  ListChecks,
  Moon,
  RefreshCw,
  Settings,
  Smartphone,
  Sparkles,
  Timer,
  TrendingUp,
  Wifi,
  X,
  Zap,
} from "lucide-react";

import { Button } from "~/components/ui/button";

type TocItem = { id: string; label: string };

type UseCase = {
  key: string;
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Copy = {
  seoTitle: string;
  seoDescription: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  updated: string;
  tocTitle: string;
  toc: readonly TocItem[];
  sectionWhatTitle: string;
  sectionWhatBody: string;
  sectionWhatNote: string;
  sectionWhatCite: string;
  sectionWhyTitle: string;
  sectionWhyBody: string;
  sectionWhyWhyTitle: string;
  sectionWhyWhyBody: string;
  sectionWhyAppsTitle: string;
  sectionWhyAppsBody: string;
  sectionWhyPassiveTitle: string;
  sectionWhyPassiveBody: string;
  sectionSurfacesTitle: string;
  sectionSurfacesIntro: string;
  surfaceWidgetTitle: string;
  surfaceWidgetBody: string;
  surfaceWidgetBest: string;
  surfaceWidgetWeak: string;
  surfaceWallpaperTitle: string;
  surfaceWallpaperBody: string;
  surfaceWallpaperBest: string;
  surfaceWallpaperWeak: string;
  surfaceLiveTitle: string;
  surfaceLiveBody: string;
  surfaceLiveBest: string;
  surfaceLiveWeak: string;
  surfaceStandByTitle: string;
  surfaceStandByBody: string;
  surfaceStandByBest: string;
  surfaceStandByWeak: string;
  sectionVsTitle: string;
  sectionVsBody: string;
  sectionVsLink: string;
  sectionHowtoTitle: string;
  sectionHowtoIntro: string;
  howto1Title: string;
  howto1Body: string;
  howto2Title: string;
  howto2Body: string;
  howto3Title: string;
  howto3Body: string;
  howto4Title: string;
  howto4Body: string;
  howto5Title: string;
  howto5Body: string;
  howto6Title: string;
  howto6Body: string;
  sectionUsecasesTitle: string;
  sectionUsecasesIntro: string;
  usecaseStudents: string;
  usecaseStudentsBody: string;
  usecaseAdhd: string;
  usecaseAdhdBody: string;
  usecasePros: string;
  usecaseProsBody: string;
  usecaseParents: string;
  usecaseParentsBody: string;
  usecaseFitness: string;
  usecaseFitnessBody: string;
  usecaseMedication: string;
  usecaseMedicationBody: string;
  usecaseNotion: string;
  usecaseNotionBody: string;
  sectionNotionTitle: string;
  sectionNotionBody: string;
  sectionNotionLink: string;
  sectionMistakesTitle: string;
  sectionMistakesIntro: string;
  mistake1Title: string;
  mistake1Body: string;
  mistake2Title: string;
  mistake2Body: string;
  mistake3Title: string;
  mistake3Body: string;
  mistake4Title: string;
  mistake4Body: string;
  mistake5Title: string;
  mistake5Body: string;
  sectionMeasureTitle: string;
  sectionMeasureBody: string;
  measure1: string;
  measure2: string;
  measure3: string;
  sectionMeasureClosing: string;
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
  widgetsVsWallpaperUrl: string;
  widgetPageSlug: string;
  rescuetimeSourceUrl: string;
  appleScreenTimeUrl: string;
};

const useCaseConfig: {
  key: keyof Pick<Copy, "usecaseStudents" | "usecaseAdhd" | "usecasePros" | "usecaseParents" | "usecaseFitness" | "usecaseMedication" | "usecaseNotion">;
  titleKey: keyof Copy;
  bodyKey: keyof Copy;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "usecaseStudents", titleKey: "usecaseStudents", bodyKey: "usecaseStudentsBody", icon: Calendar },
  { key: "usecaseAdhd", titleKey: "usecaseAdhd", bodyKey: "usecaseAdhdBody", icon: Brain },
  { key: "usecasePros", titleKey: "usecasePros", bodyKey: "usecaseProsBody", icon: ListChecks },
  { key: "usecaseParents", titleKey: "usecaseParents", bodyKey: "usecaseParentsBody", icon: HeartPulse },
  { key: "usecaseFitness", titleKey: "usecaseFitness", bodyKey: "usecaseFitnessBody", icon: Activity },
  { key: "usecaseMedication", titleKey: "usecaseMedication", bodyKey: "usecaseMedicationBody", icon: Timer },
  { key: "usecaseNotion", titleKey: "usecaseNotion", bodyKey: "usecaseNotionBody", icon: Sparkles },
];

function HeartPulse({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

const sectionAnchor = (label: string) =>
  label
    .replace(/^\d+\.\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function LockScreenProductivityContent({
  lang,
  copy,
  notionIntegrationUrl,
  widgetsVsWallpaperUrl,
  widgetPageSlug,
  rescuetimeSourceUrl,
  appleScreenTimeUrl,
}: Props) {
  const generatorHref = `/${lang}/generator`;
  const homeHref = `/${lang}`;
  const isZh = lang === "zh";

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
              {isZh ? "生成器" : "Generator"}
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
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <a
                href={notionIntegrationUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200 transition-colors hover:bg-indigo-500/25"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
                  <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.933.653.933 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.448-1.632z" />
                </svg>
                <span>{isZh ? "Notion 官方集成" : "Official Notion Integration"}</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                {copy.updated}
              </span>
            </div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 lg:text-lg">
              {copy.heroSubtitle}
            </p>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02] px-6 py-10">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300">
              <ListChecks className="h-3 w-3" />
              <span>{copy.tocTitle}</span>
            </div>
            <ul className="grid gap-1.5 text-sm text-slate-300 sm:grid-cols-2">
              {copy.toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block rounded-lg px-3 py-1.5 transition-colors hover:bg-white/[0.04] hover:text-indigo-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <article className="px-6 py-16">
          <div className="container mx-auto max-w-3xl space-y-20 text-base leading-relaxed text-slate-300">
            <section id="what">
              <SectionHeading number="01" title={copy.sectionWhatTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionWhatBody}</p>
              <div className="mt-6 rounded-2xl border-l-4 border-indigo-500 bg-white/[0.03] p-5 text-base text-slate-300">
                <p>{copy.sectionWhatNote}</p>
                <a
                  href={rescuetimeSourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 hover:text-indigo-200"
                >
                  <span>{copy.sectionWhatCite}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </section>

            <section id="why">
              <SectionHeading number="02" title={copy.sectionWhyTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionWhyBody}</p>

              <h3 className="mt-10 text-2xl font-bold text-white">{copy.sectionWhyWhyTitle}</h3>
              <p className="mt-3">{copy.sectionWhyWhyBody}</p>

              <h3 className="mt-10 text-2xl font-bold text-white">{copy.sectionWhyAppsTitle}</h3>
              <p className="mt-3">{copy.sectionWhyAppsBody}</p>

              <h3 className="mt-10 text-2xl font-bold text-white">{copy.sectionWhyPassiveTitle}</h3>
              <p className="mt-3">{copy.sectionWhyPassiveBody}</p>
            </section>

            <section id="surfaces">
              <SectionHeading number="03" title={copy.sectionSurfacesTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionSurfacesIntro}</p>

              <div className="mt-10 grid gap-5">
                <SurfaceCard
                  title={copy.surfaceWidgetTitle}
                  icon={<Layers className="h-5 w-5 text-indigo-300" />}
                  body={copy.surfaceWidgetBody}
                  best={copy.surfaceWidgetBest}
                  weak={copy.surfaceWidgetWeak}
                />
                <SurfaceCard
                  title={copy.surfaceWallpaperTitle}
                  icon={<ImageIcon className="h-5 w-5 text-indigo-300" />}
                  body={copy.surfaceWallpaperBody}
                  best={copy.surfaceWallpaperBest}
                  weak={copy.surfaceWallpaperWeak}
                  highlight
                />
                <SurfaceCard
                  title={copy.surfaceLiveTitle}
                  icon={<Activity className="h-5 w-5 text-indigo-300" />}
                  body={copy.surfaceLiveBody}
                  best={copy.surfaceLiveBest}
                  weak={copy.surfaceLiveWeak}
                />
                <SurfaceCard
                  title={copy.surfaceStandByTitle}
                  icon={<Moon className="h-5 w-5 text-indigo-300" />}
                  body={copy.surfaceStandByBody}
                  best={copy.surfaceStandByBest}
                  weak={copy.surfaceStandByWeak}
                />
              </div>
            </section>

            <section id="vs">
              <SectionHeading number="04" title={copy.sectionVsTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionVsBody}</p>
              <Link
                href={widgetPageSlug}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.08] px-5 py-3 text-sm font-bold text-indigo-200 transition-colors hover:bg-indigo-500/15"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{copy.sectionVsLink}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <section id="howto">
              <SectionHeading number="05" title={copy.sectionHowtoTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionHowtoIntro}</p>
              <ol className="mt-8 space-y-5">
                <HowtoStep n={1} title={copy.howto1Title} body={copy.howto1Body} />
                <HowtoStep n={2} title={copy.howto2Title} body={copy.howto2Body} />
                <HowtoStep n={3} title={copy.howto3Title} body={copy.howto3Body} />
                <HowtoStep n={4} title={copy.howto4Title} body={copy.howto4Body} />
                <HowtoStep n={5} title={copy.howto5Title} body={copy.howto5Body} />
                <HowtoStep n={6} title={copy.howto6Title} body={copy.howto6Body} />
              </ol>
            </section>

            <section id="usecases">
              <SectionHeading number="06" title={copy.sectionUsecasesTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionUsecasesIntro}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {useCaseConfig.map((cfg) => {
                  const title = copy[cfg.titleKey] as string;
                  const body = copy[cfg.bodyKey] as string;
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={cfg.key}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15">
                        <Icon className="h-4 w-4 text-indigo-300" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                      <p className="text-sm leading-relaxed text-slate-400">{body}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="notion">
              <SectionHeading number="07" title={copy.sectionNotionTitle} />
              <div className="mt-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.08] via-[#020205] to-transparent p-7">
                <p className="text-lg text-slate-200">{copy.sectionNotionBody}</p>
                <a
                  href={notionIntegrationUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
                >
                  {copy.sectionNotionLink}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </section>

            <section id="mistakes">
              <SectionHeading number="08" title={copy.sectionMistakesTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionMistakesIntro}</p>
              <ol className="mt-8 space-y-5">
                <HowtoStep n={1} title={copy.mistake1Title} body={copy.mistake1Body} variant="mistake" />
                <HowtoStep n={2} title={copy.mistake2Title} body={copy.mistake2Body} variant="mistake" />
                <HowtoStep n={3} title={copy.mistake3Title} body={copy.mistake3Body} variant="mistake" />
                <HowtoStep n={4} title={copy.mistake4Title} body={copy.mistake4Body} variant="mistake" />
                <HowtoStep n={5} title={copy.mistake5Title} body={copy.mistake5Body} variant="mistake" />
              </ol>
            </section>

            <section id="measure">
              <SectionHeading number="09" title={copy.sectionMeasureTitle} />
              <p className="mt-6 text-lg text-slate-200">{copy.sectionMeasureBody}</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
                  <span>{copy.measure1}</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
                  <span>{copy.measure2}</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
                  <span>{copy.measure3}</span>
                </li>
              </ul>
              <p className="mt-6 text-slate-400">{copy.sectionMeasureClosing}</p>
            </section>

            <section id="faq" className="scroll-mt-24">
              <SectionHeading number="10" title={copy.faqTitle} />
              <div className="mt-8 space-y-3">
                {copy.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] open:border-indigo-500/30 open:bg-white/[0.05]"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white transition-colors hover:text-indigo-200 [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-4">
                        <span className="text-base">{faq.q}</span>
                        <span className="text-xl text-indigo-400 transition-transform group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{faq.a}</div>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </article>

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

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="scroll-mt-24">
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-mono text-sm font-bold text-indigo-400">{number}</span>
        <h2 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">{title}</h2>
      </div>
      <div className="h-px w-12 bg-gradient-to-r from-indigo-500 to-transparent" />
    </div>
  );
}

function SurfaceCard({
  title,
  icon,
  body,
  best,
  weak,
  highlight = false,
}: {
  title: string;
  icon: React.ReactNode;
  body: string;
  best: string;
  weak: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlight
          ? "border-indigo-500/40 bg-indigo-500/[0.06]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            highlight ? "bg-indigo-500/20" : "bg-white/[0.06]"
          }`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {highlight && (
          <span className="ml-auto rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-200">
            {highlight ? "Our focus" : ""}
          </span>
        )}
      </div>
      <p className="text-slate-300">{body}</p>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Best for</p>
          <p className="mt-1 text-slate-200">{best}</p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Weakness</p>
          <p className="mt-1 text-slate-200">{weak}</p>
        </div>
      </div>
    </div>
  );
}

function HowtoStep({
  n,
  title,
  body,
  variant = "step",
}: {
  n: number;
  title: string;
  body: string;
  variant?: "step" | "mistake";
}) {
  const isStep = variant === "step";
  const numberBg = isStep ? "bg-indigo-500/15 text-indigo-300" : "bg-amber-500/15 text-amber-300";
  return (
    <li className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${numberBg}`}
      >
        {n}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 text-slate-300">{body}</p>
      </div>
    </li>
  );
}
