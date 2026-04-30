import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoScenarioPage } from "~/components/seo-scenario-page";
import { siteConfig } from "~/config/site";
import { getSeoScenario, seoScenarios } from "~/lib/seo-scenarios";

type PageProps = {
  params: {
    scenario: string;
  };
};

export function generateStaticParams() {
  return seoScenarios.map((scenario) => ({ scenario: scenario.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const scenario = getSeoScenario(params.scenario);

  if (!scenario) {
    return {};
  }

  const canonical = `${siteConfig.url}/use-cases/${scenario.slug}`;

  return {
    title: scenario.title.en,
    description: scenario.description.en,
    keywords: scenario.keywords,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        zh: `${siteConfig.url}/zh/${scenario.slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: scenario.title.en,
      description: scenario.description.en,
      url: canonical,
    },
  };
}

export default function UseCasePage({ params }: PageProps) {
  const scenario = getSeoScenario(params.scenario);

  if (!scenario) {
    notFound();
  }

  return <SeoScenarioPage lang="en" scenario={scenario} />;
}
