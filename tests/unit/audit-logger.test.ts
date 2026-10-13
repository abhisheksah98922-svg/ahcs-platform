import { describe, it, expect } from 'vitest';
import { sanitizeAuditMetadata } from '@/lib/audit/audit-logger';

describe('Audit Logger Metadata Sanitization', () => {
  it('redacts sensitive fields like passwords, OTPs, and secrets', () => {
    const raw = {
      userPhone: '+919876543210',
      password: 'PlainSecretPassword123!',
      otp: '492819',
      sessionSecret: 'secret-token-value',
      authorizationHeader: 'Bearer xyz',
    };

    const sanitized = sanitizeAuditMetadata(raw) as Record<string, unknown>;

    expect(sanitized.userPhone).toBe('+919876543210');
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.otp).toBe('[REDACTED]');
    expect(sanitized.sessionSecret).toBe('[REDACTED]');
    expect(sanitized.authorizationHeader).toBe('[REDACTED]');
  });

  it('masks standalone 12-digit numbers resembling Aadhaar', () => {
    const raw = {
      clientIdentifierInput: '123456789012',
    };

    const sanitized = sanitizeAuditMetadata(raw) as Record<string, unknown>;
    expect(sanitized.clientIdentifierInput).toBe('XXXX-XXXX-9012');
  });

  it('redacts standalone 6-digit OTP codes inside values', () => {
    const raw = {
      attemptValue: '992812',
    };

    const sanitized = sanitizeAuditMetadata(raw) as Record<string, unknown>;
    expect(sanitized.attemptValue).toBe('[REDACTED_OTP]');
  });

  it('handles nested objects recursively', () => {
    const raw = {
      event: 'LOGIN',
      details: {
        attempt: 1,
        creds: {
          pin: '1234',
          valid: false,
        },
      },
    };

    const sanitized = sanitizeAuditMetadata(raw) as any;
    expect(sanitized.details.attempt).toBe(1);
    expect(sanitized.details.creds.pin).toBe('[REDACTED]');
    expect(sanitized.details.creds.valid).toBe(false);
  });
});
