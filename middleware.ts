import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { addSecurityHeaders, applyRateLimit } from "./lib/security";

const authPages = [
  "/",
  "/login",
  "/signup",
  "/forgotPassword",
  "/resetPassword",
  "/verifyEmail",
];

const isAuthPage = (path: string) => {
  return authPages.includes(path);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create response
  let response = NextResponse.next();

  // Apply security headers
  response = addSecurityHeaders(response);

  // Apply rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    try {
      response = await applyRateLimit(request, response);
    } catch (error) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
  }

  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isVerified = token?.isVerified;

  if (!isAuthenticated && isAuthPage(pathname)) {
    return response;
  }

  if (!isAuthenticated && !isAuthPage(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && !isVerified && pathname !== "/verifyEmail") {
    return NextResponse.redirect(new URL("/verifyEmail", request.url));
  }

  if (isAuthenticated && isVerified && pathname === "/verifyEmail") {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  if (isAuthenticated && isVerified && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|opengraph-image|twitter-image).*)",
  ],
};
