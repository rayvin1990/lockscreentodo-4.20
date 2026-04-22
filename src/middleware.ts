import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 极简逻辑：不做任何事情，只打印日志并放行
  console.log('Middleware debug hit:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
