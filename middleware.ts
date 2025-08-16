import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isVerified = token?.isVerified;

  if (!isAuthenticated && isAuthPage(pathname)) {
    return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};
