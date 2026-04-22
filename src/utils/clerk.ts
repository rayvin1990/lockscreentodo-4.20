import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "~/config/i18n-config";

const noRedirectRoute = ["/api(.*)", "/trpc(.*)"];
const noNeedProcessRoute = [".*\\.png", ".*\\.jpg", ".*\\.opengraph-image.png", ".*\\.html"];

export const isPublicRoute = createRouteMatcher([
  "/",
  new RegExp("^/(\\w{2})/?$"), // 仅限 /en, /zh 等首页
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

  // 1. 处理根入口 - 去往 Landing Page
  if (pathname === "/") {
    const locale = getLocale(req);
    return NextResponse.redirect(new URL(`/${locale}${searchParams}`, req.url));
  }

  // 2. 补全缺失的语言代码
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

  // 3. 检查是否为公开路由（Landing Page 就在这里）
  if (isPublicRoute(req)) {
    return null;
  }

  // 4. 保护受限路由
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
