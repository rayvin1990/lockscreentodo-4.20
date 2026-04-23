import { ClerkProvider } from "@clerk/nextjs";
import {
  Inter,
  Roboto,
  Poppins,
  Montserrat,
  Open_Sans,
  Lato,
  Source_Code_Pro,
  Fira_Code,
  JetBrains_Mono,
  Noto_Sans_SC,
} from "next/font/google";

import "~/styles/globals.css";

import { cn } from "~/components/ui/utils/cn";
import { Toaster } from "~/components/ui/toaster";

import { ThemeProvider } from "~/components/theme-provider";
import { i18n } from "~/config/i18n-config";
import { siteConfig } from "~/config/site";

const clerkConfig = {
  telemetry: {
    disabled: false,
  },
  development: process.env.NODE_ENV === 'development',
};

const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";

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
    "lockscreen todo",
    "lockscreen reminder wallpaper",
    "custom lockscreen",
    "daily tasks reminder",
    "medication reminder",
    "habit building",
    "elderly care",
    "锁屏待办",
    "锁屏提醒壁纸",
    "todo wallpaper",
    "daily task reminder",
    "锁屏壁纸生成器",
    "生产力工具",
    "手机壁纸",
    "任务提醒",
    "待办事项",
    "new year resolution",
    "新年目标",
    "productivity app",
    "study planner",
    "fitness reminder",
    "pregnancy tracker",
    "emergency contacts",
    "pet care reminder",
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
        alt: "Lockscreen Todo - 锁屏待办提醒壁纸生成器",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon", type: "image/x-icon", sizes: "any" },
      { url: "/icon.png", rel: "icon", type: "image/png", sizes: "984x984" },
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
  // Defensive: If no publishable key is found and we're not in dev, 
  // we still need to render the html/body structure, but maybe skip Clerk features.
  const content = (
    <html lang="en" suppressHydrationWarning>
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NODE_ENV === 'production') {
    return content;
  }

  return (
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
      {content}
    </ClerkProvider>
  );
}
