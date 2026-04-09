import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // No token and trying to access a protected route → send to sign-in
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Has token but visiting auth pages → send to dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|icons|images).*)"],
};
