import { describe, it, expect } from 'vitest';
import { getEnv } from '@/lib/env';

describe('Environment Validator', () => {
  it('loads valid environment configuration with defaults', () => {
    const config = getEnv();
    expect(config).toBeDefined();
    expect(config.NEXT_PUBLIC_APP_URL).toBe('https://ahcs.in');
    expect(['development', 'test', 'production']).toContain(config.NODE_ENV);
    expect(config.SESSION_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(config.PEPPER_SECRET.length).toBeGreaterThanOrEqual(16);
  });

  it('allows custom valid overrides', () => {
    const config = getEnv({
      NODE_ENV: 'test',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      SESSION_SECRET: 'a'.repeat(32),
      PEPPER_SECRET: 'b'.repeat(16),
    });

    expect(config.NODE_ENV).toBe('test');
    expect(config.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000');
  });

  it('rejects development placeholders in production mode', () => {
    expect(() => {
      getEnv({
        NODE_ENV: 'production',
        NEXT_PUBLIC_APP_URL: 'https://ahcs.in',
        DATABASE_URL: 'postgresql://prod:prod@prod-host:5432/prod_db',
        SESSION_SECRET: 'development-session-secret-change-in-production-min32chars',
        PEPPER_SECRET: 'development-pepper-secret-minimum16',
      });
    }).toThrow(/Production secrets must not use default development placeholder values/);
  });
});
