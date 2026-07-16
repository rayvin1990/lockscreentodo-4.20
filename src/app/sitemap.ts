import type { MetadataRoute } from "next";

import { siteConfig } from "~/config/site";
import { seoScenarios } from "~/lib/seo-scenarios";

const baseRoutes: { route: string; lastModified?: string }[] = [
  { route: "" },
  { route: "/en" },
  { route: "/zh" },
  { route: "/en/generator", lastModified: "2026-07-12" },
  { route: "/zh/generator", lastModified: "2026-07-12" },
  { route: "/en/lock-screen-todo", lastModified: "2026-07-12" },
  { route: "/zh/lock-screen-todo", lastModified: "2026-07-12" },
  { route: "/en/lock-screen-widget-vs-wallpaper", lastModified: "2026-07-12" },
  { route: "/zh/lock-screen-widget-vs-wallpaper", lastModified: "2026-07-12" },
  { route: "/en/lock-screen-productivity", lastModified: "2026-07-12" },
  { route: "/zh/lock-screen-productivity", lastModified: "2026-07-12" },
  { route: "/en/about", lastModified: "2026-07-12" },
  { route: "/zh/about", lastModified: "2026-07-12" },
  { route: "/en/reminder-wallpaper", lastModified: "2026-07-12" },
  { route: "/zh/reminder-wallpaper", lastModified: "2026-07-12" },
  { route: "/en/pricing", lastModified: "2026-07-12" },
  { route: "/zh/pricing", lastModified: "2026-07-12" },
  { route: "/en/privacy" },
  { route: "/zh/privacy" },
  { route: "/en/terms" },
  { route: "/zh/terms" },
  { route: "/en/agent-demo", lastModified: "2026-07-12" },
  { route: "/en/desktop-todo", lastModified: "2026-07-12" },
  { route: "/zh/desktop-todo", lastModified: "2026-07-12" },
  { route: "/en/developers", lastModified: "2026-07-12" },
  { route: "/zh/developers", lastModified: "2026-07-12" },
  { route: "/en/press", lastModified: "2026-07-15" },
  { route: "/zh/press", lastModified: "2026-07-15" },
  { route: "/zh/notion-锁屏", lastModified: "2026-07-15" },
  { route: "/llms.txt" },
  { route: "/llms-full.txt" },
];

type ScenarioEntry = { slug: string; lastModified?: string };

const scenarioRoutes: ScenarioEntry[] = seoScenarios.flatMap((scenario) => [
  { slug: `use-cases/${scenario.slug}`, lastModified: scenario.lastModified },
  { slug: `en/${scenario.slug}`, lastModified: scenario.lastModified },
  { slug: `zh/${scenario.slug}`, lastModified: scenario.lastModified },
]);

const isScenarioRoute = (route: string) =>
  route.startsWith("/use-cases/") || scenarioRoutes.some((s) => s.slug === route.replace(/^\//, ""));

export default function sitemap(): MetadataRoute.Sitemap {
  const scenarioPaths = new Set(scenarioRoutes.map((s) => `/${s.slug}`));

  const baseEntries: MetadataRoute.Sitemap = baseRoutes.map(({ route, lastModified }) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency: route.includes("/generator") ? "weekly" : "monthly",
    priority: route === "/en" || route === "/zh"
      ? 1
      : isScenarioRoute(route)
        ? 0.9
        : (route.includes("/generator") || route.includes("/lock-screen-todo") || route.includes("/reminder-wallpaper") || route.includes("/lock-screen-widget-vs-wallpaper") || route.includes("/lock-screen-productivity") || route.includes("/about"))
          ? 0.9
          : 0.6,
  }));

  const scenarioEntries: MetadataRoute.Sitemap = scenarioRoutes.map(({ slug, lastModified }) => {
    const route = `/${slug}`;
    return {
      url: `${siteConfig.url}${route}`,
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    };
  });

  return [...baseEntries, ...scenarioEntries];
}
