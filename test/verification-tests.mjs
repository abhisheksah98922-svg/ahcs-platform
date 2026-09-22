import assert from 'assert';
import { generateAhcsClientId, validateAhcsClientId } from '../lib/client-id.ts';
import { evaluateDuplicateProbability, hashDocumentNumber } from '../lib/duplicate-detector.ts';
import { generateSecureAccessToken, buildQrResolutionUrl } from '../lib/tokens.ts';

console.log('=====================================================');
console.log('🧪 RUNNING AHCS CORE AUTOMATED ENGINE VERIFICATION');
console.log('=====================================================');

// 1. Permanent Client ID Test
console.log('\n[TEST 1] Testing AHCS Permanent Client ID Generator & Checksum...');
const { clientId, checksum } = generateAhcsClientId('IN');
console.log(`Generated Client ID: ${clientId} (Check Digit: ${checksum})`);

const validResult = validateAhcsClientId(clientId);
assert.strictEqual(validResult.isValid, true, 'Newly generated Client ID must pass checksum validation');
console.log('✓ Valid Client ID passed checksum test');

// Test corruption detection
const corrupted = clientId.slice(0, -1) + (clientId.slice(-1) === 'A' ? 'B' : 'A');
const invalidResult = validateAhcsClientId(corrupted);
assert.strictEqual(invalidResult.isValid, false, 'Tampered Client ID must fail checksum validation');
console.log(`✓ Tampered Client ID ${corrupted} correctly flagged as invalid: "${invalidResult.reason}"`);

// 2. Duplicate Account Detection Engine Test
console.log('\n[TEST 2] Testing Duplicate Account Detection Engine...');
const existingProfiles = [
  {
    id: 'ACC-001',
    accountId: 'ACC-001',
    fullName: 'Rahul Sharma',
    dateOfBirth: '1990-05-15',
    mobileNumber: '+919876543210',
    email: 'rahul@example.com',
    documentNumberHash: hashDocumentNumber('PASSPORT', 'P8491028'),
    district: 'Bengaluru Urban',
  },
];

// Exact Document Hash Match => CONFIRMED_DUPLICATE
const exactDocMatch = evaluateDuplicateProbability(
  {
    fullName: 'R. Sharma',
    dateOfBirth: '1990-05-15',
    mobileNumber: '+919999999999',
    documentType: 'PASSPORT',
    documentNumber: 'P8491028',
    district: 'Bengaluru Urban',
  },
  existingProfiles
);
assert.strictEqual(exactDocMatch.status, 'CONFIRMED_DUPLICATE', 'Exact document number match must be CONFIRMED_DUPLICATE');
console.log(`✓ Exact document match correctly flagged: ${exactDocMatch.status} (Score: ${exactDocMatch.score})`);

// Completely New Applicant => NO_MATCH
const cleanApplicant = evaluateDuplicateProbability(
  {
    fullName: 'Priya Narayanan',
    dateOfBirth: '1995-10-20',
    mobileNumber: '+919111122222',
    documentType: 'DRIVING_LICENSE',
    documentNumber: 'DL0420210099',
    district: 'Mysuru',
  },
  existingProfiles
);
assert.strictEqual(cleanApplicant.status, 'NO_MATCH', 'Clean applicant must be NO_MATCH');
console.log(`✓ Clean applicant correctly cleared: ${cleanApplicant.status} (Score: ${cleanApplicant.score})`);

// 3. Cryptographic Token & QR URL Test
console.log('\n[TEST 3] Testing Cryptographic Token & Dynamic QR Resolution URL...');
const token = generateSecureAccessToken();
assert.strictEqual(token.length, 64, '256-bit token hex must be 64 characters long');
const qrUrl = buildQrResolutionUrl(token, 'https://ahcs.in');
assert.strictEqual(qrUrl, `https://ahcs.in/e/${token}`, 'QR URL must construct standard dynamic route');
console.log(`✓ Generated dynamic QR URL: ${qrUrl}`);

console.log('\n=====================================================');
console.log('🎉 ALL AUTOMATED ENGINE VERIFICATION TESTS PASSED');
console.log('=====================================================');
