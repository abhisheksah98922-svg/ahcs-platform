import crypto from 'crypto';

export interface ProfileMatchInput {
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  mobileNumber: string;
  email?: string;
  documentType: string;
  documentNumber: string;
  district: string;
}

export interface ExistingProfileCandidate {
  id: string;
  accountId: string;
  fullName: string;
  dateOfBirth: string;
  mobileNumber: string;
  email?: string;
  documentNumberHash: string;
  district: string;
}

export interface DuplicateCheckResult {
  status: 'NO_MATCH' | 'POSSIBLE_DUPLICATE' | 'CONFIRMED_DUPLICATE';
  score: number;
  matchedFields: string[];
  candidateId?: string;
}

/**
 * Normalizes strings for comparison: lowercase, trim, remove multiple spaces
 */
function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Standard Levenshtein distance for fuzzy name matching
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Similarity ratio between 0 and 1
 */
function similarityRatio(s1: string, s2: string): number {
  const n1 = normalizeString(s1);
  const n2 = normalizeString(s2);
  const maxLen = Math.max(n1.length, n2.length);
  if (maxLen === 0) return 1.0;
  const distance = levenshteinDistance(n1, n2);
  return (maxLen - distance) / maxLen;
}

/**
 * Compute SHA-256 hash of document type + document number for indexed duplicate lookup
 */
export function hashDocumentNumber(docType: string, docNumber: string): string {
  const clean = `${docType.toUpperCase()}_${docNumber.toUpperCase().replace(/\s+/g, '')}`;
  return crypto.createHash('sha256').update(clean).digest('hex');
}

/**
 * Evaluates duplicate probability against candidate profiles
 */
export function evaluateDuplicateProbability(
  input: ProfileMatchInput,
  candidates: ExistingProfileCandidate[]
): DuplicateCheckResult {
  let highestScore = 0;
  let detectedStatus: DuplicateCheckResult['status'] = 'NO_MATCH';
  let bestMatchedFields: string[] = [];
  let bestCandidateId: string | undefined = undefined;

  const inputDocHash = hashDocumentNumber(input.documentType, input.documentNumber);

  for (const candidate of candidates) {
    let score = 0;
    const matched: string[] = [];

    // 1. Exact Document Hash Match (Weight: 100 - Instant Confirmed Duplicate)
    if (candidate.documentNumberHash === inputDocHash) {
      score += 100;
      matched.push('DOCUMENT_REFERENCE_EXACT');
    }

    // 2. Mobile Phone Match (Weight: 80)
    if (candidate.mobileNumber && candidate.mobileNumber === input.mobileNumber) {
      score += 80;
      matched.push('MOBILE_EXACT');
    }

    // 3. Email Match (Weight: 60)
    if (input.email && candidate.email && input.email.toLowerCase() === candidate.email.toLowerCase()) {
      score += 60;
      matched.push('EMAIL_EXACT');
    }

    // 4. Exact Date of Birth Match (Weight: 35)
    if (candidate.dateOfBirth === input.dateOfBirth) {
      score += 35;
      matched.push('DOB_EXACT');
    }

    // 5. Fuzzy Name Similarity (Weight: up to 45)
    const nameSim = similarityRatio(input.fullName, candidate.fullName);
    if (nameSim >= 0.85) {
      score += Math.round(nameSim * 45);
      matched.push(`NAME_SIMILARITY_${Math.round(nameSim * 100)}%`);
    }

    // 6. District Match (Weight: 10)
    if (candidate.district && input.district && normalizeString(candidate.district) === normalizeString(input.district)) {
      score += 10;
      matched.push('DISTRICT_EXACT');
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatchedFields = matched;
      bestCandidateId = candidate.id;
    }
  }

  // Classification Thresholds
  if (highestScore >= 90) {
    detectedStatus = 'CONFIRMED_DUPLICATE';
  } else if (highestScore >= 45) {
    detectedStatus = 'POSSIBLE_DUPLICATE';
  } else {
    detectedStatus = 'NO_MATCH';
  }

  return {
    status: detectedStatus,
    score: highestScore,
    matchedFields: bestMatchedFields,
    candidateId: bestCandidateId,
  };
}
