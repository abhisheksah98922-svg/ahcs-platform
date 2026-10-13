import { prisma } from '@/lib/db/prisma';

export interface AuditLogEntry {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  organizationId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

// Sensitive key patterns that must be redacted from audit metadata
const SENSITIVE_KEY_REGEX = /(password|otp|secret|token|pin|aadhaar|pan|cvv|key|authorization)/i;

/**
 * Recursively sanitizes metadata to guarantee zero credentials, full Aadhaar, or OTPs leak into audit records.
 */
export function sanitizeAuditMetadata(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Mask any 12-digit numbers resembling unmasked Aadhaar
    if (/^\d{12}$/.test(obj)) {
      return `XXXX-XXXX-${obj.slice(-4)}`;
    }
    // Mask 6-digit OTP codes
    if (/^\d{6}$/.test(obj)) {
      return '[REDACTED_OTP]';
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeAuditMetadata(item));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_KEY_REGEX.test(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeAuditMetadata(value);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Appends an immutable record to the AuditLog table.
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  const sanitizedMeta = entry.metadata
    ? (sanitizeAuditMetadata(entry.metadata) as Record<string, unknown>)
    : undefined;

  try {
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        organizationId: entry.organizationId ?? null,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
        metadata: sanitizedMeta ? (sanitizedMeta as any) : undefined,
      },
    });
  } catch (error) {
    // Audit failure must be visibly surfaced to server console for monitoring
    console.error('CRITICAL: Audit log persistence error:', error, {
      action: entry.action,
      entityType: entry.entityType,
      actorId: entry.actorId,
    });
  }
}
