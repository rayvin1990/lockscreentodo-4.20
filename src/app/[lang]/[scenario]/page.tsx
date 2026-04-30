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

  const canonical = `${siteConfig.url}/use-cases/${scenario.slug}`;

  return {
    title: scenario.eyebrow[lang],
    description: scenario.description[lang],
    keywords: scenario.keywords,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        zh: `${siteConfig.url}/zh/${scenario.slug}`,
      },
    },
    robots: lang === "zh"
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: scenario.title[lang],
      description: scenario.description[lang],
      url: canonical,
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
