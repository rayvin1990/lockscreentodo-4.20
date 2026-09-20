import type { Metadata } from "next";

import { buildPageMetadata } from "~/lib/page-metadata";
import AgentDemoPage from "../../agent-demo/page";

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang = params.lang === "zh" ? "zh" : "en";
  return buildPageMetadata(lang, "/agent-demo", {
    title: "Describe your task, get a lockscreen wallpaper - LockscreenTodo",
    description:
      "Turn real-world tasks into a calm phone lockscreen reminder, with an AI agent preparing the structured payload behind the scenes.",
  });
}

export default AgentDemoPage;
