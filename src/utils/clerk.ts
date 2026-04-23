import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "~/config/i18n-config";

const noRedirectRoute = ["/api(.*)", "/trpc(.*)"];
const noNeedProcessRoute = [".*\\.png", ".*\\.jpg", ".*\\.opengraph-image.png", ".*\\.html", "^/_next/"];

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
  "/en/generator",
  "/zh/generator",
]);

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

// 实战修正：恢复被注释的中间件逻辑，并确保它重定向到首页而不是工具页
// 限额接口允许未登录访问（返回明确的错误而不是重定向）
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
    return NextResponse.redirect(new URL(`/${locale}${searchParams}`, req.url));
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (!isNoRedirect(req) && pathnameIsMissingLocale) {
    const locale = getLocale(req);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${searchParams}`,
        req.url,
      ),
    );
  }

  if (isPublicRoute(req)) {
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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
