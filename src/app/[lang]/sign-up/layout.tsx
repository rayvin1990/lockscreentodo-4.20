import type { Metadata } from "next";

// 注册页无搜索价值，避免收录稀释权重
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
