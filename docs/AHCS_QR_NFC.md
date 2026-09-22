# AHCS — QR & NFC Architecture

## 1. Zero Clinical Data Rule

**Strict Architecture Rule**: The QR code and NFC tag MUST NEVER store medical records, clinical notes, patient diagnosis, passwords, or raw personal identifiers.

The physical media stores only an opaque, cryptographically random, revocable token that points to the AHCS edge gateway.

---

## 2. Dynamic QR Code Specification

### 2.1 Payload Format
```text
https://ahcs.in/e/t_982f1b4a0e4c63d82a17b5f2c81e90ac
```
* **Protocol**: Strict HTTPS (HSTS enforced).
* **Route**: `/e/:token` (Emergency and verification endpoint).
* **Token**: 256-bit entropy represented as a 32-character hexadecimal or URL-safe Base64 string generated via `crypto.randomBytes(16)`.

### 2.2 QR Scan Resolution Sequence

```
1. Scanner opens camera / QR reader and follows URL
                    │
                    ▼
2. HTTP GET https://ahcs.in/e/<token>
                    │
                    ▼
3. Edge Gateway validates Token in Redis Cache
   - If Token does not exist or expired ──> Render "Invalid / Expired QR"
   - If Associated Card is SUSPENDED or LOST ──> Render "Card Suspended"
                    │
                    ▼
4. Identity / Access Evaluation:
   ┌────────────────────────────────────────────────────────┐
   │ Is scanner an Authenticated Healthcare Provider?       │
   └───────────────────────────┬────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │ NO (Public / First Responder)        │ YES (Verified Doctor / Clinic)
            ▼                                     ▼
   Serve "Emergency Break-Glass View"     Challenge for Patient Consent / OTP
   (Name, Blood Group, Contacts,          (Unlock Full Permitted Clinical Records)
    Critical Allergies Only)
                    │
                    ▼
5. Audit Log Recorded: `QR_SCANNED` (Timestamp, Scanner IP, Geo-velocity, User-Agent)
```

---

## 3. Contactless NFC Architecture

* **Chip Standard**: NXP NTAG213 / NTAG215 / NTAG216 (ISO/IEC 14443-A standard, 13.56 MHz).
* **Data Format**: NDEF (NFC Data Exchange Format) URI record containing the exact same secure dynamic token URL as the card's QR code.
* **Security Modes**:
  * Chip memory write-locked at the time of personalization to prevent malicious overwriting or redirect attacks.
  * In future hardware iterations: Dual-interface cryptographic Java Card applets supporting symmetric challenge-response authentication.

---

## 4. Token Rotation & Revocation

If a card is reported lost, stolen, or compromised:
1. Card state is marked `LOST` or `REVOKED`.
2. The active token mapping in Redis is instantly purged.
3. Subsequent scans immediately fail with: *"This health card has been deactivated. Please contact AHCS support."*
4. Upon replacement card issuance, a completely new token is generated and bound to the member's permanent Client ID.
