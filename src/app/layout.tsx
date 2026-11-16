import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Noto_Sans_SC } from "next/font/google";

import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";
import { siteConfig } from "~/config/site";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  weight: ["400", "600"],
  display: "swap",
});

const clerkConfig = {
  appearance: {
    elements: {
      formButtonPrimary: "bg-black hover:bg-gray-800 text-white font-medium",
      card: "shadow-none border border-gray-200",
    },
  },
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || null;

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    // English keywords
    "lock screen to do list",
    "to do list on lock screen",
    "to do list lock screen",
    "lock screen todo",
    "lock screen todo wallpaper",
    "lockscreen todo",
    "reminders for lockscreen",
    "how to put reminders on lock screen",
    "how to get reminders to show on lock screen",
    "lock screen task wallpaper",
    "lock screen reminder wallpaper",
    "lock screen generator",
    "lockscreen generator",
    "lock screen prompt",
    "todo wallpaper generator",
    "task wallpaper for phone",
    "iPhone lock screen todo",
    "Android lock screen task list",
    "free lock screen wallpaper generator",
    "custom lock screen todo",
    // Chinese keywords
    "锁屏待办",
    "锁屏待办清单",
    "锁屏任务壁纸",
    "手机锁屏待办",
    "锁屏提醒壁纸",
    "锁屏生成器",
    "待办壁纸生成器",
    "手机任务壁纸",
    "iPhone 锁屏待办",
    "安卓锁屏任务清单",
    "免费锁屏壁纸生成器",
    "自定义锁屏待办",
    "锁屏待办壁纸",
    "手机锁屏任务",
    "锁屏提醒",
    "待办清单 锁屏",
  ],
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.organization.name,
  description: siteConfig.organization.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon.png`,
  foundingDate: siteConfig.organization.foundingDate,
  founder: {
    "@type": "Person",
    name: siteConfig.organization.founderName,
    url: siteConfig.organization.founderGithub,
  },
  sameAs: [
    siteConfig.links.notionIntegration,
    siteConfig.links.productHunt,
    siteConfig.links.github,
  ],
  knowsAbout: [
    "Lock screen productivity",
    "Notion integrations",
    "iPhone lock screen widgets",
    "Lock screen wallpaper design",
    "Passive reminder systems",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // GA4 measurement id is a public identifier (not a secret). Override with
  // NEXT_PUBLIC_GA_MEASUREMENT_ID if the property ever changes.
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-SMC0X3CK76";
  // Only load GA in production builds so local dev and CI don't pollute data.
  const gaEnabled = process.env.NODE_ENV === "production";

  const app = (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <Script
        id="ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {gaEnabled ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
      {children}
      <Toaster />
      <Analytics />
    </ThemeProvider>
  );

  const clerkWrappedApp = clerkPublishableKey ? (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={clerkConfig.appearance}
    >
      {app}
    </ClerkProvider>
  ) : (
    app
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansSC.variable} min-h-screen bg-background font-sans antialiased`}
      >
        {clerkWrappedApp}
      </body>
    </html>
  );
}
