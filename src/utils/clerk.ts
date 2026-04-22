import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "~/config/i18n-config";

const noRedirectRoute = ["/api(.*)", "/trpc(.*)"];
const noNeedProcessRoute = [".*\\.png", ".*\\.jpg", ".*\\.opengraph-image.png", ".*\\.html"];

export const isPublicRoute = createRouteMatcher([
  "/",
  new RegExp("^/(\\w{2}(/.*)?)$"),
  new RegExp("^/api/(.*)$"),
  new RegExp("^/trpc/(.*)$"),
]);

export function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales = Array.from(i18n.locales);
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, i18n.defaultLocale);
}

// Needed for middleware
function matchLocale(languages: string[], locales: readonly string[], defaultLocale: string): string | undefined {
  // Simple implementation
  for (const lang of languages) {
    if (locales.includes(lang as any)) return lang;
  }
  return defaultLocale;
}

// Needed for middleware
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

  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.search;

  // 1. Handle root redirect
  if (pathname === "/") {
    const locale = getLocale(req);
    return NextResponse.redirect(new URL(`/${locale}/generator${searchParams}`, req.url));
  }

  // 2. Handle missing locale for non-API routes
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (!isNoRedirect(req) && pathnameIsMissingLocale) {
    const locale = getLocale(req);
    const targetPath = pathname === "/" ? "/generator" : pathname;
    return NextResponse.redirect(
      new URL(
        `/${locale}${targetPath.startsWith("/") ? "" : "/"}${targetPath}${searchParams}`,
        req.url,
      ),
    );
  }

  // 3. Handle root locale redirect (e.g. /en or /en/) to /en/generator
  const isRootLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname === `/${locale}/`
  );

  if (isRootLocale) {
    const locale = pathname.split("/")[1] || i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/generator${searchParams}`, req.url));
  }

  // 4. Check if the current route is public
  if (isPublicRoute(req)) {
    return null;
  }

  // 5. Protect all other routes
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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
