import { Suspense } from "react";

import { ModalProvider } from "~/components/modal-provider";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

// Metadata for wallpaper generator
export const metadata = {
  title: {
    absolute: "Lockscreen Todo - Create Beautiful Phone Wallpapers",
  },
  description: "Generate personalized wallpapers with your daily tasks and inspirations",
};

// Layout override for wallpaper generator - removes NavBar and Footer for cleaner UI
export default async function GeneratorLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      <ModalProvider dict={dict.login} />
      {children}
    </div>
  );
}
