import { redirect } from "next/navigation";

export default function LocaleHomePage({ params }: { params: { lang: string } }) {
  // 强制进入生成器
  redirect(`/${params.lang}/generator`);
}
