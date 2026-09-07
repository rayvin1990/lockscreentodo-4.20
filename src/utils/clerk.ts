import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "~/config/i18n-config";
import { seoScenarios } from "~/lib/seo-scenarios";

const noRedirectRoute = ["/api(.*)", "/trpc(.*)", "^/use-cases/"];
const noNeedProcessRoute = [
  ".*\\.png",
  ".*\\.jpg",
  ".*\\.opengraph-image.png",
  ".*\\.html",
  "^/_next/",
  "^/sitemap\\.xml$",
  "^/robots\\.txt$",
  // Any path ending in a static-file extension (.txt/.json/.xml/.svg/.woff2/
  // .css/.js/...). These are either App Router route handlers (llms.txt,
  // manifest, sitemap) or static assets; they must bypass the locale redirect
  // or they 308 to /en/<file> and 404 (GSC "Redirect error" + 404 reports).
  // Page routes never end in a dot-extension, and protected /dashboard routes
  // have no extension, so this never skips auth.
  "\\.[a-zA-Z0-9]{2,12}$",
];

// Legacy scenario slugs that were renamed or removed. 301-redirect every old
// URL form (/use-cases/<old>, /en/<old>, /zh/<old>) to the closest live page
// so Google stops reporting them as 404 and consolidates the signals.
const legacyScenarioRedirects: Record<string, string> = {
  // Renamed (content moved to a new slug)
  "exam-countdown-wallpaper": "exam-countdown-lock-screen",
  "daily-todo-wallpaper": "daily-priority-lock-screen",
  "study-lock-screen-wallpaper": "study-plan-lock-screen",
  "metformin-after-dinner-reminder": "medication-reminder-lock-screen",
  "ai-one-thing-lock-screen": "daily-priority-lock-screen",
  "doomscrolling-blocker-wallpaper": "habit-tracker-lock-screen",
  "stop-doomscrolling-lock-screen": "habit-tracker-lock-screen",
  // Removed scenarios -> closest live equivalent
  "keys-wallet-door-card-reminder": "daily-priority-lock-screen",
  "passport-before-flight-lock-screen": "daily-priority-lock-screen",
  "p0-incident-lock-screen-alert": "caregiver-emergency-lock-screen",
  "n8n-urgent-alerts-lockscreen": "caregiver-emergency-lock-screen",
};

export const isPublicRoute = createRouteMatcher([
  "/",
  "/en",
  "/zh",
  "/en/sign-in",
  "/zh/sign-in",
  "/en/sign-up",
  "/zh/sign-up",
  "/api/:path*",
  "/trpc/:path*",
  "/api/generate/check-limit",
  "/api/download/check-limit",
  "/api/webhooks/lemon-squeezy",
  "/api/auth/google-callback",
  "/en/agent-demo",
  "/zh/agent-demo",
  "/en/developers",
  "/zh/developers",
  "/en/launch-visibility-check",
  "/zh/launch-visibility-check",
  "/en/ai-recommendation-readiness",
  "/zh/ai-recommendation-readiness",
  "/en/generator",
  "/zh/generator",
  "/en/pricing",
  "/zh/pricing",
  "/en/iphone-lock-screen-todo-list",
  "/zh/iphone-lock-screen-todo-list",
  "/en/android-lock-screen-todo-list",
  "/zh/android-lock-screen-todo-list",
  "/en/how-to-put-todo-list-on-lock-screen",
  "/zh/how-to-put-todo-list-on-lock-screen",
  "/en/how-to-put-todo-list-on-iphone-lock-screen",
  "/zh/how-to-put-todo-list-on-iphone-lock-screen",
  "/use-cases/:path*",
  ...seoScenarios.flatMap(s => [
    `/en/${s.slug}`,
    `/zh/${s.slug}`,
  ]),
]);

// The marketing site is PUBLIC by default so every landing/SEO page is crawlable
// without sign-in. Only the signed-in app area (dashboard) requires auth.
// Add a path here ONLY if it must require an authenticated user.
const protectedRouteRe = new RegExp(
  `^/(${i18n.locales.join("|")})/dashboard(/|$)`,
);

export function isProtectedRoute(request: NextRequest): boolean {
  return protectedRouteRe.test(request.nextUrl.pathname);
}

export function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales = Array.from(i18n.locales);
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, i18n.defaultLocale);
}

function matchLocale(languages: string[], locales: readonly string[], defaultLocale: string): string | undefined {
  for (const lang of languages) {
    if (locales.includes(lang as any)) return lang;
  }
  return defaultLocale;
}

class Negotiator {
  headers: Record<string, string>;
  constructor(options: { headers: Record<string, string> }) {
    this.headers = options.headers;
  }
  languages(): string[] {
    const accept = this.headers["accept-language"] || "";
    return accept.split(",").map(l => l.split(";")[0].trim());
  }
}

export function isNoRedirect(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  return noRedirectRoute.some((route) => new RegExp(route).test(pathname));
}

export function isNoNeedProcess(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  return noNeedProcessRoute.some((route) => new RegExp(route).test(pathname));
}

// Allow limit check routes without auth - returns explicit error instead of redirect
const limitCheckRoute = ["/api/generate/check-limit", "/api/download/check-limit"];

export const middleware = clerkMiddleware(async (auth, req: NextRequest) => {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (isNoNeedProcess(req)) {
    return null;
  }

  // 限额接口不需要登录，直接放行
  const pathname = req.nextUrl.pathname;
  if (limitCheckRoute.some(route => pathname === route)) {
    return null;
  }

  const searchParams = req.nextUrl.search;

  if (pathname === "/") {
    const locale = getLocale(req);
    // 308 permanent: consolidate SEO signals from "/" onto "/<locale>" (was 307)
    return NextResponse.redirect(new URL(`/${locale}${searchParams}`, req.url), 308);
  }

  // 301 redirects for renamed/removed scenario slugs (see legacyScenarioRedirects).
  // Handles all three URL forms: /use-cases/<old>, /en/<old>, /zh/<old>.
  const legacyMatch = pathname.match(
    /^\/(?:use-cases|en|zh)\/([a-z0-9-]+)\/?$/,
  );
  if (legacyMatch) {
    const newSlug = legacyScenarioRedirects[legacyMatch[1]];
    if (newSlug) {
      // zh visitors stay on the zh page; everyone else goes to the canonical /use-cases URL.
      const dest = pathname.startsWith("/zh/")
        ? `/zh/${newSlug}`
        : `/use-cases/${newSlug}`;
      return NextResponse.redirect(new URL(dest, req.url), 301);
    }
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (!isNoRedirect(req) && pathnameIsMissingLocale) {
    const locale = getLocale(req);
    // 308 permanent: locale-prefixed URL is the canonical one
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${searchParams}`,
        req.url,
      ),
      308,
    );
  }

  // Marketing site is public by default; only the signed-in app area requires auth.
  if (!isProtectedRoute(req)) {
    return null;
  }

  const { userId } = await auth();

  if (!userId) {
    const locale = getLocale(req);
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(
        `/${locale}/sign-in?from=${encodeURIComponent(from)}`,
        req.url,
      ),
    );
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|json)).*)",
    "/(api|trpc)(.*)",
  ],
};
