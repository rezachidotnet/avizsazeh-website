/**
 * Minimal in-memory, fixed-window rate limiter.
 *
 * Best-effort by design: state lives in the Node process, so on a horizontally
 * scaled / serverless deployment each instance keeps its own window. That is
 * acceptable for basic RFQ spam throttling — it raises the cost of scripted
 * abuse without external infrastructure. For hard guarantees, back this with a
 * shared store (e.g. Upstash/Redis) keyed the same way.
 */

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

// Bound the map so a flood of unique IPs can't grow memory without limit.
const MAX_BUCKETS = 10_000;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Returns whether `key` is allowed another hit under a `limit`-per-`windowMs`
 * fixed window, and how long to wait if not.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    if (buckets.size >= MAX_BUCKETS) {
      // Drop expired windows before inserting a new key.
      for (const [k, w] of buckets) {
        if (now >= w.resetAt) buckets.delete(k);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

/** Best-effort client IP from standard proxy headers (Vercel sets these). */
export function clientIpFrom(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return headers.get('x-real-ip')?.trim() || 'unknown';
}
