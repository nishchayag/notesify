import { NextResponse } from "next/server";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

// Simple in-memory rate limiting (for production, use Redis)
const cache = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: Options) {
  const maxRequests = options.uniqueTokenPerInterval || 500;
  const windowMs = options.interval || 60000;

  return {
    check: (res: Response | NextResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now();
        const key = `${token}`;

        // Clean up expired entries
        for (const [k, v] of cache.entries()) {
          if (now > v.resetTime) {
            cache.delete(k);
          }
        }

        const record = cache.get(key);

        if (!record) {
          cache.set(key, { count: 1, resetTime: now + windowMs });
          resolve();
          return;
        }

        if (now > record.resetTime) {
          cache.set(key, { count: 1, resetTime: now + windowMs });
          resolve();
          return;
        }

        if (record.count >= limit) {
          reject();
          return;
        }

        record.count++;
        resolve();
      }),
  };
}
