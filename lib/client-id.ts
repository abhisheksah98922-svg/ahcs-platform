import crypto from 'crypto';

/**
 * Crockford's Base32 Alphabet (excluding I, L, O, U to avoid human transcription confusion and profanities)
 */
const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Computes an ISO/IEC 7064 Mod 37,36 or Damm-style check character for Crockford's Base32 string
 */
export function calculateCheckCharacter(input: string): string {
  const clean = input.toUpperCase().replace(/[^0-9A-Z]/g, '');
  let factor = 2;
  let sum = 0;
  const n = CROCKFORD_BASE32.length; // 32

  for (let i = clean.length - 1; i >= 0; i--) {
    const char = clean[i];
    const codePoint = CROCKFORD_BASE32.indexOf(char);
    if (codePoint === -1) continue;

    const addend = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    sum += Math.floor(addend / n) + (addend % n);
  }

  const remainder = sum % n;
  const checkCodePoint = (n - remainder) % n;
  return CROCKFORD_BASE32[checkCodePoint];
}

/**
 * Generates an official AHCS Client ID:
 * Format: AHCS-IN-XXXXXXXX
 * - Prefix: AHCS
 * - Country: IN
 * - 7 random Crockford Base32 characters
 * - 1 terminal check character
 */
export function generateAhcsClientId(countryCode: string = 'IN'): {
  clientId: string;
  checksum: string;
  rawToken: string;
} {
  const country = countryCode.toUpperCase().slice(0, 2);
  const randomBytes = crypto.randomBytes(7);
  let raw7 = '';

  for (let i = 0; i < 7; i++) {
    const index = randomBytes[i] % CROCKFORD_BASE32.length;
    raw7 += CROCKFORD_BASE32[index];
  }

  const checksum = calculateCheckCharacter(`${country}${raw7}`);
  const formattedToken = `${raw7}${checksum}`;
  const clientId = `AHCS-${country}-${formattedToken}`;

  return {
    clientId,
    checksum,
    rawToken: formattedToken,
  };
}

/**
 * Validates the structure and checksum of an AHCS Client ID
 */
export function validateAhcsClientId(clientId: string): {
  isValid: boolean;
  reason?: string;
} {
  const parts = clientId.trim().toUpperCase().split('-');
  if (parts.length !== 3) {
    return { isValid: false, reason: 'Invalid format. Expected AHCS-CC-XXXXXXXX' };
  }

  const [prefix, country, token] = parts;
  if (prefix !== 'AHCS') {
    return { isValid: false, reason: 'Invalid prefix. Must start with AHCS' };
  }

  if (country.length !== 2) {
    return { isValid: false, reason: 'Invalid country code. Must be 2 characters' };
  }

  if (token.length !== 8) {
    return { isValid: false, reason: 'Invalid token length. Must be 8 characters' };
  }

  const raw7 = token.slice(0, 7);
  const checkChar = token.slice(7);

  // Validate characters belong to Crockford Base32
  for (const c of token) {
    if (!CROCKFORD_BASE32.includes(c)) {
      return { isValid: false, reason: `Invalid character ${c} in identifier` };
    }
  }

  const expectedChecksum = calculateCheckCharacter(`${country}${raw7}`);
  if (checkChar !== expectedChecksum) {
    return { isValid: false, reason: 'Checksum verification failed (transcription error detected)' };
  }

  return { isValid: true };
}

export function validateClientIdChecksum(clientId: string): boolean {
  return validateAhcsClientId(clientId).isValid;
}

