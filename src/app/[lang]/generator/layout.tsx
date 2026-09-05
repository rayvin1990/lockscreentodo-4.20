import type { Metadata } from "next";

import { siteConfig } from "~/config/site";

// Generator 本体可收录（GSC 已有 /en/generator 曝光），
// 但带 ?tasks= / ?scenario= 等参数的分享态 URL 必须收敛到干净 canonical，
// 避免每个参数组合都被当成独立页面索引。
export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang = params.lang === "zh" ? "zh" : "en";
  const canonical = `${siteConfig.url}/${lang}/generator`;

  return {
    alternates: {
      canonical,
      languages: {
        en: `${siteConfig.url}/en/generator`,
        zh: `${siteConfig.url}/zh/generator`,
      },
    },
  };
}

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
