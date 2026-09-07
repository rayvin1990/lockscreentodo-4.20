import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoScenarioPage } from "~/components/seo-scenario-page";
import { siteConfig } from "~/config/site";
import { getSeoScenario, seoScenarios } from "~/lib/seo-scenarios";

type PageProps = {
  params: {
    lang: string;
    scenario: string;
  };
};

export function generateStaticParams() {
  return seoScenarios.flatMap((scenario) => [
    { lang: "en", scenario: scenario.slug },
    { lang: "zh", scenario: scenario.slug },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = params.lang === "zh" ? "zh" : "en";
  const scenario = getSeoScenario(params.scenario);

  if (!scenario) {
    return {};
  }

  // Canonical differs per language: the English scenario page is canonical at
  // /use-cases/<slug>, while the Chinese page is distinct Chinese content and
  // must be canonical at /zh/<slug> (otherwise Google treats /zh pages as
  // duplicates of the English URL and never indexes the Chinese content).
  const canonical =
    lang === "zh"
      ? `${siteConfig.url}/zh/${scenario.slug}`
      : `${siteConfig.url}/use-cases/${scenario.slug}`;
  const langPath = lang === "zh" ? "/zh" : "/en";

  return {
    title: scenario.title[lang],
    description: scenario.description[lang],
    keywords: lang === "zh" && scenario.keywordsZh ? scenario.keywordsZh : scenario.keywords,
    alternates: {
      canonical,
      languages: {
        en: `${siteConfig.url}/use-cases/${scenario.slug}`,
        "zh-Hans": `${siteConfig.url}/zh/${scenario.slug}`,
        "x-default": `${siteConfig.url}/use-cases/${scenario.slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: scenario.title[lang],
      description: scenario.description[lang],
      url: `${siteConfig.url}${langPath}/${scenario.slug}`,
    },
  };
}

export default function ScenarioPage({ params }: PageProps) {
  const lang = params.lang === "zh" ? "zh" : "en";
  const scenario = getSeoScenario(params.scenario);

  if (!scenario) {
    notFound();
  }

  return <SeoScenarioPage lang={lang} scenario={scenario} />;
}
