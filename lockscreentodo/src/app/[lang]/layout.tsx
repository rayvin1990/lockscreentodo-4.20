import { i18n } from "~/config/i18n-config";

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return <>{children}</>;
}
