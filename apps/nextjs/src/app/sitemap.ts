import type { MetadataRoute } from "next";
import { siteConfig } from "~/config/site";
import { i18n } from "~/config/i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Generate routes for all locales
  const routes = [
    "",
    "/lockscreen-generator",
  ];

  // Create sitemap entries for each locale and route
  const sitemapEntries: MetadataRoute.Sitemap = [];

  i18n.locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: route === "" ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
