# AHCS — Permanent Client ID Architecture

## 1. Core Principles

The **AHCS Client ID** is the central, permanent identifier for an individual within the AHCS healthcare network.

### Inviolable Rules
1. **Never a Government ID**: Must never mimic or claim to be an Aadhaar, ABHA, SSN, or state ID.
2. **Zero Embedded PII**: Must not contain phone numbers, dates of birth, geographic codes, or sequential database serials.
3. **Enumeration Resistance**: An attacker cannot predict or increment an ID to discover neighboring patients.
4. **Permanent & Immutable**: Does not change if the user updates their phone number, email address, physical address, marital status, or healthcare subscription.
5. **Separation of Concerns**:
   * `User ID` = Authentication account
   * `Account ID` = Patient membership account
   * `Client ID` = Permanent healthcare network identifier
   * `Card ID` = Physical/digital card token (can be replaced/revoked)
   * `QR Token ID` = Ephemeral/rotatable lookup token

---

## 2. Format Specification

The recommended AHCS Client ID format is:
$$\mathbf{AHCS}\text{-}\mathbf{IN}\text{-}\mathbf{7F3K9Q2L}$$

* **Prefix (`AHCS`)**: Namespace identifier (4 characters).
* **Country Code (`IN`)**: ISO 3166-1 alpha-2 standard (2 characters).
* **Delimiter (`-`)**: Visual separator for high readability and phone/manual transcription.
* **Identifier (`7F3K9Q2L`)**: 8-character token composed of:
  * 7 alphanumeric characters generated using **Crockford's Base32** alphabet (`0123456789ABCDEFGHJKMNPQRSTVWXYZ`, excluding visually confusing characters `I`, `O`, `L`, `U`).
  * 1 terminal check character computed using the **ISO/IEC 7064 Mod 37,36** or **Damm Check Digit** algorithm.

---

## 3. Mathematical Properties & Entropy

* Available combinations for 7 characters in Crockford's Base32:
  $$32^7 = 34,359,738,368 \text{ (over 34.3 billion unique combinations per country)}$$
* Check character detects $100\%$ of single-character transcription mistakes and $>98\%$ of adjacent transposition errors (e.g., typing `7F3K...` as `7FK3...`).
* Generated via cryptographically secure pseudo-random number generator (`crypto.randomBytes`).

---

## 4. Database Indexing & Uniqueness

```sql
CREATE TABLE client_ids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL UNIQUE REFERENCES accounts(id),
    client_id VARCHAR(32) NOT NULL UNIQUE,
    checksum CHAR(1) NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX idx_client_ids_lookup ON client_ids(client_id);
```

Generation occurs inside an atomic database transaction with retry logic (exponential backoff) upon collision detection.
