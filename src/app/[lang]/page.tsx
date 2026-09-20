import type { Metadata } from "next";

import { buildPageMetadata } from "~/lib/page-metadata";
import HomeClient from "~/components/home-client";

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang = params.lang === "zh" ? "zh" : "en";
  return buildPageMetadata(lang, "");
}

export default function LocaleHomePage({
  params,
}: {
  params: { lang: string };
}) {
  return <HomeClient params={params} />;
}
