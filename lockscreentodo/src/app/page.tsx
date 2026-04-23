import { redirect } from "next/navigation";

export default function Home() {
  // 实战修正：默认进入带语言后缀的 Landing Page，而不是直接进工具页
  redirect("/en");
}
