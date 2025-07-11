import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";

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
  const isVerified = token?.isVerified;
  const isAuthenticated = !!token;
  const isAuthPage = authPages.some(
    (path) => pathname === path || pathname.startsWith(path)
  );
  const isProtectedPage = protectedPages.some((path) =>
    pathname.startsWith(path)
  );
  const isVerifyPage = pathname === verifyPage;

  if (!isAuthenticated && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/notes", request.url));
  } else if (!isAuthenticated && isVerifyPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (isAuthenticated && !isVerified && isProtectedPage) {
    return NextResponse.redirect(new URL("/askToVerify", request.url));
  } else if (isAuthenticated && isVerified && isVerifyPage) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
