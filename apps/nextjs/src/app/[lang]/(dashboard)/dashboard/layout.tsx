import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { i18n, type Locale } from "~/config/i18n-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: {
    lang: Locale;
  };
}

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function DashboardLayout({
  children,
  params: { lang },
}: DashboardLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect(`/${lang}/login-clerk?redirectUrl=${encodeURIComponent(`/${lang}/dashboard`)}`);
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {children}
    </div>
  );
}
