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

  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isVerified = token?.isVerified;

  console.log("🧪 Middleware", {
    pathname,
    isAuthenticated,
    isVerified,
  });

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

  return NextResponse.next();
}

// ✅ Only run middleware on non-static, non-api routes
export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
