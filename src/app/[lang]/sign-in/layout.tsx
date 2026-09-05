import type { Metadata } from "next";

// 登录页无搜索价值，避免收录稀释权重
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
