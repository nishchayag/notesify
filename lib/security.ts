import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./rate-limit";

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
});

// API routes that need rate limiting
const rateLimitedRoutes = [
  "/api/auth/signup",
  "/api/auth/signin",
  "/api/auth/forgotPassword",
  "/api/auth/resetPassword",
];

// Security headers
export function addSecurityHeaders(response: NextResponse) {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Referrer policy
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.resend.com;"
  );

  return response;
}

// Rate limiting middleware
export async function applyRateLimit(
  request: NextRequest,
  response: NextResponse
) {
  const pathname = request.nextUrl.pathname;

  if (rateLimitedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      await limiter.check(response, 10, getIP(request)); // 10 requests per minute per IP
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
  }

  return response;
}

// Get client IP address
function getIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (real) {
    return real.trim();
  }

  return "127.0.0.1";
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password) && password.length <= 128;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}
