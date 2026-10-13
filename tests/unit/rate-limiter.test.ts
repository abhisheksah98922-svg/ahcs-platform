import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkRateLimit,
  resetRateLimitKey,
  RATE_LIMIT_RULES,
} from '@/lib/security/rate-limiter';

describe('Sliding Window Rate Limiter', () => {
  const testKey = 'test-client-ip-127.0.0.1';

  beforeEach(() => {
    resetRateLimitKey(testKey);
  });

  it('allows requests within threshold', async () => {
    const res1 = await checkRateLimit(testKey, { maxRequests: 3, windowMs: 1000 });
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = await checkRateLimit(testKey, { maxRequests: 3, windowMs: 1000 });
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = await checkRateLimit(testKey, { maxRequests: 3, windowMs: 1000 });
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('blocks requests exceeding threshold', async () => {
    for (let i = 0; i < 3; i++) {
      await checkRateLimit(testKey, { maxRequests: 3, windowMs: 5000 });
    }

    const blocked = await checkRateLimit(testKey, { maxRequests: 3, windowMs: 5000 });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });

  it('has calibrated healthcare presets', () => {
    expect(RATE_LIMIT_RULES.OTP_SEND.maxRequests).toBe(3);
    expect(RATE_LIMIT_RULES.OTP_VERIFY.maxRequests).toBe(5);
    expect(RATE_LIMIT_RULES.BREAK_GLASS_ACCESS.maxRequests).toBe(5);
  });
});
