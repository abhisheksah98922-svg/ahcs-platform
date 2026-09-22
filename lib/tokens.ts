import crypto from 'crypto';

/**
 * Generates an opaque, cryptographically random, non-sequential 256-bit token
 * for QR and NFC bindings.
 */
export function generateSecureAccessToken(): string {
  // 32 bytes = 256 bits of entropy
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Constructs the canonical resolution URL for the emergency QR code
 */
export function buildQrResolutionUrl(token: string, baseUrl?: string): string {
  const host = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://ahcs.in';
  return `${host.replace(/\/$/, '')}/e/${token}`;
}

/**
 * Generates a 6-digit numeric activation code for health card physical delivery
 */
export function generateCardActivationCode(): {
  code: string;
  codeHash: string;
} {
  const code = Math.floor(100000 + crypto.randomInt(900000)).toString();
  const codeHash = crypto.createHash('sha256').update(code).digest('hex');
  return { code, codeHash };
}
