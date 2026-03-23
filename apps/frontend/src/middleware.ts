import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_ROUTES,
} from "@/lib/auth/routes";

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value);

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (pathname === "/dashboard") {
    const kbUrl = new URL("/kb", request.url);

    if (search) {
      kbUrl.search = search;
    }

    return NextResponse.redirect(kbUrl);
  }

  if (isAuthRoute(pathname)) {
    return NextResponse.next();
  }

  if (hasAccessToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);

  if (pathname !== "/login") {
    loginUrl.searchParams.set("next", `${pathname}${search}`);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
