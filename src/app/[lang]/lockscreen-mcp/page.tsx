import type { Metadata } from "next";

import { buildPageMetadata } from "~/lib/page-metadata";
import LockscreenMcpPage from "../../lockscreen-mcp/page";

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang = params.lang === "zh" ? "zh" : "en";
  return buildPageMetadata(lang, "/lockscreen-mcp", {
    title: "Lockscreen MCP Debug - LockscreenTodo",
    description:
      "Debug console for agent-created lock screen reminders.",
    robots: { index: false, follow: false },
  });
}

export default LockscreenMcpPage;
