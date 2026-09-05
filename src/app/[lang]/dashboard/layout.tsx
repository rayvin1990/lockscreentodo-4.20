import type { Metadata } from "next";

// 登录后区域：不需要也不应该被搜索引擎收录（GSC 已出现 /en/dashboard/settings 曝光）
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
