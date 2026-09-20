import type { Metadata } from "next";

import { buildPageMetadata } from "~/lib/page-metadata";
import DesktopTodoClient from "~/components/desktop-todo-client";

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang = params.lang === "zh" ? "zh" : "en";
  return buildPageMetadata(lang, "/desktop-todo", {
    title: "Desktop Todo - Lockscreen Todo",
    description:
      "Prepare and manage your lock screen wallpapers from your desktop browser.",
  });
}

export default function DesktopTodoPage() {
  return <DesktopTodoClient />;
}
