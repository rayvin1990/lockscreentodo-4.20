import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "./config/i18n-config";

// 匹配不需要处理的静态资源
const isStaticFile = createRouteMatcher([
  "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
]);

// 匹配公开路由
const isPublicRoute = createRouteMatcher([
  "/",
  "/:locale",
  "/:locale/generator",
  "/:locale/pricing",
  "/:locale/privacy",
  "/:locale/terms",
  "/api/(.*)",
  "/trpc/(.*)",
]);

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return i18n.defaultLocale;

  const locales = i18n.locales as unknown as string[];
  const preferredLocale = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim())
    .find((lang) => locales.includes(lang));

  return preferredLocale || i18n.defaultLocale;
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname, search } = req.nextUrl;

  // 1. 处理根路径 "/"
  if (pathname === "/") {
    const locale = getLocale(req);
    return NextResponse.redirect(new URL(`/${locale}/generator${search}`, req.url));
  }

  // 2. 检查路径是否缺失 locale (且不是 API 路由)
  const isApiRoute = pathname.startsWith("/api") || pathname.startsWith("/trpc");
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (!isApiRoute && pathnameIsMissingLocale) {
    // 排除静态文件
    const isStatic = !isStaticFile(req);
    if (!isStatic) {
      const locale = getLocale(req);
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${search}`, req.url)
      );
    }
  }

  // 3. 处理纯语言路径，如 "/en" -> "/en/generator"
  const isPureLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname === `/${locale}/`
  );
  if (isPureLocale) {
    const locale = pathname.split("/")[1] || i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/generator${search}`, req.url));
  }

  // 4. 如果是公开路由，直接放行
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 5. 保护私有路由
  const session = await auth();
  if (!session.userId) {
    const locale = getLocale(req);
    const from = encodeURIComponent(pathname + search);
    return NextResponse.redirect(new URL(`/${locale}/sign-in?from=${from}`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
