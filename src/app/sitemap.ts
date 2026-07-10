import type { MetadataRoute } from "next";

import { siteConfig } from "~/config/site";
import { seoScenarios } from "~/lib/seo-scenarios";

const baseRoutes = [
  "",
  "/en",
  "/zh",
  "/en/generator",
  "/zh/generator",
  "/en/lock-screen-todo",
  "/zh/lock-screen-todo",
  "/en/lock-screen-widget-vs-wallpaper",
  "/zh/lock-screen-widget-vs-wallpaper",
  "/en/lock-screen-productivity",
  "/zh/lock-screen-productivity",
  "/en/reminder-wallpaper",
  "/zh/reminder-wallpaper",
  "/en/pricing",
  "/zh/pricing",
  "/en/privacy",
  "/zh/privacy",
  "/en/terms",
  "/zh/terms",
  "/en/agent-demo",
  "/en/desktop-todo",
  "/zh/desktop-todo",
  "/en/developers",
  "/zh/developers",
];

const scenarioRoutes = seoScenarios.flatMap((scenario) => [
  `/use-cases/${scenario.slug}`,
  `/en/${scenario.slug}`,
  `/zh/${scenario.slug}`,
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [...baseRoutes, ...scenarioRoutes];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route.includes("/generator") ? "weekly" : "monthly",
    priority: route === "/en" || route === "/zh"
      ? 1
      : scenarioRoutes.includes(route)
        ? 0.85
        : (route.includes("/generator") || route.includes("/lock-screen-todo") || route.includes("/reminder-wallpaper") || route.includes("/lock-screen-widget-vs-wallpaper") || route.includes("/lock-screen-productivity"))
          ? 0.9
          : 0.6,
  }));
}
