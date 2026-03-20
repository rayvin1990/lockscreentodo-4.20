import { PricingPageClient } from "./pricing-page-client";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Pricing",
};

export default async function PricingPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return <PricingPageClient dict={dict} lang={lang} />;
}
