import type { Metadata } from "next";

import { siteConfig } from "~/config/site";

type Lang = "en" | "zh";

/**
 * Build canonical + hreflang + OpenGraph url metadata for a [lang] page.
 *
 * Why this exists: the [lang] layout used to hard-code `canonical` to the
 * homepage (/en or /zh), so every subpage that didn't override it (terms,
 * privacy, pricing, ...) told Google its canonical was the homepage and was
 * reported as "Alternate page with proper canonical tag". Each page must
 * declare its own path-specific canonical.
 *
 * @param lang  resolved locale ("en" | "zh")
 * @param path  path segment AFTER the locale, with leading slash ("/terms"),
 *              or "" for the locale homepage ("/en", "/zh")
 * @param extra any additional metadata to merge (openGraph/alternates are
 *              deep-merged so the canonical url is never lost)
 */
export function buildPageMetadata(
  lang: Lang,
  path: string,
  extra: Metadata = {},
): Metadata {
  const baseUrl = siteConfig.url;
  const self = `${baseUrl}/${lang}${path}`;
  const { alternates, openGraph, ...rest } = extra;

  return {
    ...rest,
    alternates: {
      canonical: self,
      languages: {
        "en-US": `${baseUrl}/en${path}`,
        "zh-Hans": `${baseUrl}/zh${path}`,
        "x-default": `${baseUrl}/en${path}`,
      },
      ...alternates,
    },
    openGraph: {
      url: self,
      ...openGraph,
    },
  };
}
