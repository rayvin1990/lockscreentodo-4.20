"use client";

import React from "react";
import Link from "next/link";

import { trackEvent } from "~/lib/analytics";

type ScenarioAnalyticsPayload = {
  scenario: string;
  lang: string;
  template: string;
};

function getCampaignProperties() {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };
}

export function SeoScenarioAnalytics({
  scenario,
  lang,
  template,
  hasScenarioFaqs,
}: ScenarioAnalyticsPayload & {
  hasScenarioFaqs: boolean;
}) {
  const hasTracked = React.useRef(false);

  React.useEffect(() => {
    if (hasTracked.current) return;

    trackEvent("seo_scenario_view", {
      scenario,
      lang,
      template,
      hasScenarioFaqs,
      ...getCampaignProperties(),
    });
    hasTracked.current = true;
  }, [hasScenarioFaqs, lang, scenario, template]);

  return null;
}

export function SeoScenarioTrackedLink({
  href,
  children,
  className,
  event,
  scenario,
  lang,
  template,
  target,
}: ScenarioAnalyticsPayload & {
  href: string;
  children: React.ReactNode;
  className?: string;
  event: "seo_scenario_cta_click" | "seo_scenario_secondary_click";
  target: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent(event, {
          scenario,
          lang,
          template,
          target,
          ...getCampaignProperties(),
        });
      }}
    >
      {children}
    </Link>
  );
}
