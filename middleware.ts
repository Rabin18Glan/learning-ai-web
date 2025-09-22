import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Block logged-in users from accessing login/register pages
  if (path.startsWith("/auth/login") || path.startsWith("/auth/signup")|| path.startsWith("/auth/forgot-password")|| path.startsWith("/auth/reset-password")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    if (token) {
      // Redirect to callbackUrl if present, otherwise homepage
      const redirectTo = req.nextUrl.searchParams.get("callbackUrl") ||   new URL("/", req.url);;
      return NextResponse.redirect(redirectTo);
    }

    return NextResponse.next();
  }

  // Define protected paths
  const protectedPaths = [
    "/learnings",
    "/profile",
    "/settings",
    "/admin",
    "/subscription"
  ];

  const isPathProtected = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );

  if (!isPathProtected) {
    return NextResponse.next();
  }

  // Get JWT token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  if (!token.isActive) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", "AccountInactive");
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Admin route check
  if (path.startsWith("/admin")) {
    const userRole = token.role || token.user?.role;
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }



  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path",
    "/learnings/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/subscription/:path*",
  ],
};
