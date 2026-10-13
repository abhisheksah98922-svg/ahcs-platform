export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

// In-memory sliding log store (ideal for dev/test/fallback)
const memoryStore = new Map<string, number[]>();

// Standard presets for critical healthcare and security workflows
export const RATE_LIMIT_RULES: Record<string, RateLimitConfig> = {
  OTP_SEND: { maxRequests: 3, windowMs: 10 * 60 * 1000 }, // 3 requests per 10 mins
  OTP_VERIFY: { maxRequests: 5, windowMs: 10 * 60 * 1000 }, // 5 verify attempts per 10 mins
  LOGIN_ATTEMPT: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 login tries per 15 mins
  CARD_VERIFY_SCAN: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 scans per minute
  BREAK_GLASS_ACCESS: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 break-glass actions per hour
};

/**
 * Sliding-window rate limiter evaluating timestamps in-memory.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  const timestamps = memoryStore.get(key) || [];
  // Filter out timestamps outside the active sliding window
  const validTimestamps = timestamps.filter((t) => t > windowStart);

  if (validTimestamps.length >= config.maxRequests) {
    const oldest = validTimestamps[0];
    const resetMs = Math.max(0, oldest + config.windowMs - now);

    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetMs,
    };
  }

  // Record this attempt
  validTimestamps.push(now);
  memoryStore.set(key, validTimestamps);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - validTimestamps.length,
    resetMs: config.windowMs,
  };
}

/**
 * Reset rate limit key (used for tests or after successful verification)
 */
export function resetRateLimitKey(key: string): void {
  memoryStore.delete(key);
}
