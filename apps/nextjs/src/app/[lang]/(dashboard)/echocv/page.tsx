import { Metadata } from "next";
import { ProfessionalResumeEditor } from "./resume-editor/components/ProfessionalResumeEditorSimple";

const getDictionary = async (lang: string) => ({
  echocv: {
    title: "EchoCV Pro",
    description: "专业简历编辑器 - STAR 2.0 深度访谈技术，为你量身定制高匹配度的简历",
  },
});

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return {
    title: `${dict.echocv?.title || "EchoCV Pro"} - AI 智能简历助手`,
    description:
      dict.echocv?.description ||
      "通过 STAR 2.0 深度访谈技术，为你量身定制高匹配度的简历",
  };
}

export default function EchoCVPage() {
  return <ProfessionalResumeEditor />;
}
