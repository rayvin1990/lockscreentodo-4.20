import type { MetadataRoute } from "next";

import { siteConfig } from "~/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/debug", "/audit"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
