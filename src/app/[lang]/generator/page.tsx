import type { Metadata } from "next";

import { buildPageMetadata } from "~/lib/page-metadata";
import GeneratorClient from "~/components/generator-client";

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang = params.lang === "zh" ? "zh" : "en";
  return buildPageMetadata(lang, "/generator", {
    title:
      lang === "zh"
        ? "锁屏壁纸生成器 - Lockscreen Todo"
        : "Lock Screen Wallpaper Generator - Lockscreen Todo",
    description:
      lang === "zh"
        ? "把今天的任务生成手机锁屏壁纸，免费、无需安装 App。"
        : "Turn today's tasks into a phone lock screen wallpaper. Free, no app install.",
  });
}

export default function GeneratorPage() {
  return <GeneratorClient />;
}
