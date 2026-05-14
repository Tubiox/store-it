import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/landing"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) =>
    pathname.startsWith(p)
  );

  // 🔥 Step 1: Check if cookie even exists
  const hasCookie = request.cookies.get("access_token");

  // 🚫 No cookie → not authenticated
  if (!hasCookie) {
    if (isPublic) return NextResponse.next();

    return NextResponse.redirect(new URL("/landing", request.url));
  }

  try {
    // 🔥 Step 2: Validate with backend directly (bypass nginx to avoid loops)
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${backendUrl}/auth/me`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/landing", request.url));
    }

    // If logged in and visiting auth pages (except /landing) → redirect
    if (isPublic && pathname !== "/landing") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If logged in and visiting /landing → allow (don't redirect)

    return NextResponse.next();

  } catch {
    return NextResponse.redirect(new URL("/landing", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|icons|images).*)",
  ],
};