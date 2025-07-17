import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = [
  "/",
  "/signup",
  "/login",
  "/forgotPassword",
  "/resetEmailSent",
  "/resetpassword",
];
const protectedPages = [
  "/notes",
  "/createNote",
  "/editNote",
  "/deleteNote",
  "/dashboard",
];
const verifyPage = "/askToVerify";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isVerified = token?.isVerified;

  const isAuthPage = authPages.some(
    (path) => pathname === path || pathname.startsWith(path)
  );
  const isProtectedPage = protectedPages.some((path) =>
    pathname.startsWith(path)
  );
  const isVerifyPage = pathname === verifyPage;

  // Case 1: Not authenticated, accessing protected or verify page
  if (!isAuthenticated && (isProtectedPage || isVerifyPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Case 2: Authenticated, verified or not, accessing auth pages (login/signup)
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  // Case 3: Authenticated but not verified, accessing a protected page (but not the verify page)
  if (isAuthenticated && !isVerified && isProtectedPage && !isVerifyPage) {
    return NextResponse.redirect(new URL("/askToVerify", request.url));
  }

  // Case 4: Authenticated AND verified, but trying to access /askToVerify
  if (isAuthenticated && isVerified && isVerifyPage) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  // All good — allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
