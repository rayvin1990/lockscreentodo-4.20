import { ClerkProvider } from "@clerk/nextjs";
import {
  Fira_Code,
  Inter,
  JetBrains_Mono,
  Lato,
  Montserrat,
  Noto_Sans_SC,
  Open_Sans,
  Poppins,
  Roboto,
  Source_Code_Pro,
} from "next/font/google";

import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";
import { cn } from "~/components/ui/utils/cn";
import { i18n } from "~/config/i18n-config";
import { siteConfig } from "~/config/site";
import { ClerkLocalFallbackProvider } from "~/components/clerk-local-fallback-provider";
import { ThemeProvider } from "~/components/theme-provider";

const clerkConfig = {
  telemetry: {
    disabled: false,
  },
  signInUrl: "/en/sign-in",
  signUpUrl: "/en/sign-up",
  defaultRedirectUrl: "/en/generator",
  allowedRedirectOrigins: [
    "https://lockscreentodo.com",
    "https://www.lockscreentodo.com",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || null;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
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
    "wallpaper todo",
    "Notion task lock screen",
    "Notion todo lock screen",
    "Notion tasks on lock screen",
    "Notion task wallpaper",
    "Notion lock screen todo",
    "study lock screen wallpaper",
    "exam countdown wallpaper",
    "habit tracker lock screen",
    "ADHD reminder wallpaper",
    "custom lockscreen",
    "daily tasks reminder",
    "medication reminder",
    "habit building",
    "todo wallpaper",
    "daily task reminder",
    "productivity app",
    "study planner",
    "fitness reminder",
    "iPhone lock screen wallpaper",
    "Android lock screen wallpaper",
    "锁屏待办",
    "锁屏提醒壁纸",
    "锁屏壁纸生成器",
    "锁屏任务",
    "锁屏待办清单",
    "生产力工具",
    "手机壁纸",
    "任务提醒",
    "待办事项",
  ],
  authors: [
    {
      name: "saasfly",
    },
  ],
  creator: "Saasfly",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Lockscreen Todo - AI lock screen task wallpaper generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon", type: "image/x-icon", sizes: "any" },
      { url: "/icon.png", rel: "icon", type: "image/png", sizes: "1182x1182" },
    ],
    apple: "/apple-icon.png",
  },
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );

  const clerkWrappedApp = clerkPublishableKey ? (
    <ClerkProvider
      {...clerkConfig}
      publishableKey={clerkPublishableKey}
      appearance={{
        elements: {
          logoBox: "hidden",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          navbar: "hidden",
          navbarMobile: "hidden",
          footer: "hidden",
          footerActionLink: "hidden",
          card: {
            boxShadow: "none",
            background: "transparent",
          },
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
        },
        layout: {
          shimmer: true,
        },
      }}
    >
      {app}
    </ClerkProvider>
  ) : (
    <ClerkLocalFallbackProvider>{app}</ClerkLocalFallbackProvider>
  );

  return (
    <html lang={i18n.defaultLocale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          roboto.variable,
          poppins.variable,
          montserrat.variable,
          openSans.variable,
          lato.variable,
          sourceCodePro.variable,
          firaCode.variable,
          jetbrainsMono.variable,
          notoSansSC.variable,
        )}
      >
        {clerkWrappedApp}
      </body>
    </html>
  );
}
