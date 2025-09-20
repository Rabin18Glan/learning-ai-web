import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define protected paths
  const protectedPaths = [
    "/learnings",
    "/profile",
    "/settings",
    "/admin",
  ];

  const isPathProtected = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );

  // Allow public access to non-protected paths
  if (!isPathProtected) {
    return NextResponse.next();
  }

  // Get the JWT token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production", // Use secure cookies in production
  });

  // Redirect to login if no token
  if (!token) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Check if user is active
  if (!token.isActive) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", "AccountInactive");
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Role-based access for admin routes
  if (path.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Optional: Subscription-based access for premium routes (e.g., learnings, settings)
  if (
    (path.startsWith("/learnings") || path.startsWith("/settings")) &&
    token.subscriptionStatus !== "active" &&
    token.subscriptionPlan !== "pro" &&
    token.subscriptionPlan !== "premium"
  ) {
    return NextResponse.redirect(new URL("/subscription", req.url));
  }

  // Allow access to authorized users
  return NextResponse.next();
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    "/learnings/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};