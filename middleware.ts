import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = ["/", "signup", "/login"];
const protectedPages = ["/notes", "/createNote", "/editNote", "/deleteNote"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;
  const isAuthPage = authPages.includes(pathname);
  const isProtectedPage = protectedPages.some((path) =>
    pathname.startsWith(path)
  );

  if (!isAuthenticated && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
