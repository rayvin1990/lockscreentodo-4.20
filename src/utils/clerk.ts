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

/*
export const middleware = clerkMiddleware(async (auth, req: NextRequest) => {
... (existing logic)
});
*/

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
