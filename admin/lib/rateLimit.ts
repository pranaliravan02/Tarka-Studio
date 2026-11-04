/**
 * Small in-memory limiter for login attempts. Per-instance only:
 * for multi-instance/serverless production swap the store for Redis/Upstash.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function checkLimit(key: string, max: number) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) return { allowed: true as const };
  return entry.count >= max
    ? { allowed: false as const, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
    : { allowed: true as const };
}

export function recordFailure(key: string, windowMs: number) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) hits.set(key, { count: 1, resetAt: now + windowMs });
  else entry.count += 1;
}

export const clearLimit = (key: string) => hits.delete(key);
export const resetAllLimits = () => hits.clear();
