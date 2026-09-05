import { permanentRedirect } from "next/navigation";

export default function Home() {
  // 308 永久重定向：把 "/" 的 SEO 权重合并到 "/en"（middleware 已先行处理，此为兜底）
  permanentRedirect("/en");
}
