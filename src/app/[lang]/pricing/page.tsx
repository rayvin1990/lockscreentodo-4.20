import type { Metadata } from "next";

import { buildPageMetadata } from "~/lib/page-metadata";
import PricingClient from "~/components/pricing-client";

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang = params.lang === "zh" ? "zh" : "en";
  return buildPageMetadata(lang, "/pricing", {
    title:
      lang === "zh" ? "价格 - Lockscreen Todo" : "Pricing - Lockscreen Todo",
    description:
      lang === "zh"
        ? "免费开始，随时升级解锁更多生成次数与 Notion 自动同步。"
        : "Start free. Upgrade for more generations and automatic Notion sync.",
  });
}

export default function PricingPage({
  params,
}: {
  params: { lang: string };
}) {
  return <PricingClient params={params} />;
}
