import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Define which paths are protected
  const protectedPaths = ["/dashboard", "/profile", "/admin"];
  const isPathProtected = protectedPaths.some((protectedPath) => 
    path.startsWith(protectedPath)
  );
  
  if (!isPathProtected) {
    return NextResponse.next();
  }
  
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirect to login if no token and accessing a protected route
  if (!token) {
    const url = new URL('/auth/login', req.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }
  
  // Optional: Add role-based protection for specific routes
  if (path.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/user-dashboard/:path*', '/profile/:path*', '/admin/:path*'],
};