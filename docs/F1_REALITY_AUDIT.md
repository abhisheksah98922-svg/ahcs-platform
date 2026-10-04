# AHCS Phase F1: Comprehensive Reality & Architectural Audit
**Platform Domain:** https://ahcs.in  
**Audit Executed:** October 2, 2026  
**Repository:** `abhisheksah98922-svg/ahcs-platform`  
**Standard:** Strict Production Reality (Zero Mock Authority, Zero Frontend Security, Zero Exaggeration)

---

## Executive Summary

A forensic code audit of the entire AHCS platform codebase was performed across all 43 API routes, 21 application pages, database schemas, authentication layers, security handlers, and documentation.

The core visual interface, Tailwind styling, digital health mesh aesthetics, and Next.js frontend architecture are solid and modern. However, underneath the interface lies a **critical architectural bifurcation**:
1. **Neon Serverless PostgreSQL** has been provisioned and 30 relational tables were generated via Prisma, but **42 out of 43 API routes still execute against an in-memory/JSON store (`lib/db/store.ts` and `data/ahcs_production.json`)**. In a serverless production environment (Vercel), state is ephemeral and partitioned across lambdas, causing data loss and synchronization failures.
2. Several production features previously described as "Live" or "Verified" are in reality **partially implemented, mock-reliant, or frontend-only simulations**. For example:
   - Payment verification in `app/api/v1/payments/verify/route.ts` skips signature checks if `RAZORPAY_KEY_SECRET` is unset, and the frontend sends simulated mock signatures.
   - Document "upload" in `app/apply/page.tsx` transmits only the file name string and size; no actual binary document is stored in private cloud object storage.
   - Test OTP bypass (`999999`) was hardcoded for specific phone numbers regardless of production environment settings.
   - The Verification Officer workflow lacked a self-approval check, allowing an officer account to approve its own identity application.
   - Marketing claims on public pages referenced "Free treatment everywhere" and ambiguous government/e-KYC terms that conflict with AHCS's true status as an independent, private healthcare platform.

Below is the definitive classification and forensic inspection of every major platform component.

---

## Classification Standard
Every component is classified as exactly one of:
- `REAL_PRODUCTION`: Backed by genuine server-side logic, database persistence, verified authentication, and audit logs.
- `PARTIALLY_REAL`: Core logic exists but depends on unpersisted state, mock dependencies, or missing edge handling.
- `UI_ONLY`: Interface exists, but backend processing is completely non-existent or simulated.
- `MOCK`: Hardcoded data or simulated responses masquerading as real services.
- `DEMO`: Built purely for demonstration; unsuitable for production.
- `TEST_ONLY`: Functional only under `NODE_ENV === 'test'`.
- `BROKEN`: Code fails or throws errors during normal execution.
- `MISSING`: Required feature is completely absent from the codebase.
- `INSECURE`: Introduces security vulnerabilities (IDOR, authentication bypass, data leakage).

---

## Forensic Feature Audit Matrix

### 1. Authoritative Database & Data Persistence
- **Classification:** `PARTIALLY_REAL` / `INSECURE`
- **Current Implementation:** `lib/db/store.ts` instantiates a singleton `PersistentDataStore` that reads from and writes to `data/ahcs_production.json` (or `/tmp/ahcs_data/ahcs_production.json` on Vercel). Async fire-and-forget writes to Prisma exist for a few models, but reads always hit the in-memory array.
- **Actual Backend:** In-memory Node.js process state + local JSON file.
- **Actual Database:** Neon PostgreSQL (`DATABASE_URL`) exists, but 42 API routes read from `store.ts`.
- **Production Dependency:** Node.js filesystem (`fs.writeFileSync`).
- **Security State:** High Risk. Serverless instances on Vercel do not share memory or filesystem; writes in one lambda are invisible to other lambdas.
- **What is Missing:** Full migration of all repository methods to direct, transactional Prisma Client operations against PostgreSQL. Complete deprecation of `ahcs_production.json` as an operational authority.
- **Exact Fix:** Rewire all database access methods in `lib/db/` to call `prisma.*` directly. Deprecate `PersistentDataStore`. Use JSON purely for offline backup/export scripts.

---

### 2. Multi-Channel Authentication (OTP & Sessions)
- **Classification:** `PARTIALLY_REAL`
- **Current Implementation:** Mobile number and Email OTP supported. Gmail SMTP (`nodemailer` over port 465 SSL) is configured and dispatches real 6-digit verification codes to applicant email addresses. SMS providers (Fast2SMS, Twilio) are implemented in `lib/auth/otp.ts` but lack active production API keys.
- **Actual Backend:** `nodemailer` with Gmail SMTP for email; in-memory `otpStore` (Map) for code tracking.
- **Actual Database:** Sessions stored in in-memory `store.ts` (`data/ahcs_production.json`), dual-written to `UserSession` table.
- **Production Dependency:** Gmail SMTP credentials (`SMTP_USER`, `SMTP_PASS`).
- **Security State:** Moderate Risk. Session tokens are hashed with SHA-256 and stored in HTTP-only cookies (`ahcs_session`), but `otpStore` is memory-bound (lost on lambda recycling).
- **What is Missing:** Database-backed or Redis-backed OTP challenge persistence with rate limiting per IP and per identifier.
- **Exact Fix:** Persist OTP challenges in PostgreSQL/Redis with strict TTL; enforce strict rate limits; explicitly alert users when SMS gateway is unconfigured rather than silent fallbacks.

---

### 3. Master Test OTP & Bypass Security
- **Classification:** `INSECURE`
- **Current Implementation:** In `lib/auth/otp.ts` (lines 241-247 & 263), test code `999999` is accepted for numbers `+919999900001` and `+919999900002` regardless of `NODE_ENV`.
- **Actual Backend:** Hardcoded conditional checks in `requestOtp` and `verifyOtp`.
- **Actual Database:** None.
- **Production Dependency:** Hardcoded mobile numbers.
- **Security State:** High Vulnerability. Violates Rule 10 ("NO MASTER OTP IN PRODUCTION"). Anyone submitting `999999` against these numbers can authenticate as an Officer or Super Admin.
- **What is Missing:** Strict environment gating: test bypasses must only execute when `NODE_ENV !== 'production'` AND `ALLOW_TEST_OTP === 'true'`.
- **Exact Fix:** Delete the static bypass in production mode. Gate all test accounts behind `NODE_ENV === 'test'`. Require real OTP verification even for administrative and officer logins in production.

---

### 4. KYC Document Upload & Storage
- **Classification:** `UI_ONLY` / `INSECURE`
- **Current Implementation:** `app/apply/page.tsx` takes a user-selected file from an `<input type="file">`, extracts `file.name` and `file.size`, and sends JSON `{ fileName, docNumber, docType }` to `/api/v1/verification/submit`.
- **Actual Backend:** No file payload is sent or stored. `verification_documents` receives a simulated path string `vault/documents/${account.id}/${Date.now()}_doc.pdf`.
- **Actual Database:** Metadata saved in `store.ts` and `VerificationDocument`.
- **Production Dependency:** None (No active AWS S3, Cloudflare R2, or GCP Cloud Storage client configured).
- **Security State:** Misleading. No actual document binary is preserved for the officer to review.
- **What is Missing:** Genuine multipart/form-data upload, MIME/magic-byte validation, file size enforcement (max 10MB), and encrypted private storage in object storage (or local protected vault).
- **Exact Fix:** Implement real file upload endpoint receiving `FormData`, validating magic bytes (PDF/PNG/JPEG), calculating SHA-256 of file bytes, and storing the binary payload securely.

---

### 5. Document Integrity vs Document Authenticity
- **Classification:** `PARTIALLY_REAL`
- **Current Implementation:** `lib/duplicate-detector.ts` calculates `hashDocumentNumber(docType, docNumber)` using SHA-256 for duplicate matching.
- **Actual Backend:** Node.js `crypto.createHash('sha256')`.
- **Actual Database:** Hash saved in `documentNumberHash` column.
- **Production Dependency:** Internal crypto.
- **Security State:** Good for duplicate detection, but public documentation incorrectly suggested that hashing a document proves document authenticity.
- **What is Missing:** Clear legal and architectural distinction: SHA-256 proves file integrity and enables duplicate detection; it does NOT prove official authenticity. Authenticity requires manual officer verification or official issuer API integration.
- **Exact Fix:** Update application language and audit trail to state: "SHA-256 integrity hash recorded for tamper-detection and duplicate prevention. Official validity verified by authorized officer."

---

### 6. Verification Officer Dashboard & Self-Approval Prevention
- **Classification:** `PARTIALLY_REAL` / `INSECURE`
- **Current Implementation:** Officer portal (`/officer`) displays pending applications, allows viewing document details, and supports `APPROVE`, `REJECT`, `REQUEST_CORRECTION`. Hardcoded officer name "Officer Ananya Sen" was seeded in the system.
- **Actual Backend:** `app/api/v1/officer/decision/route.ts` and `app/api/v1/officer/queue/route.ts`.
- **Actual Database:** `VerificationRequest` and `Account` records in `store.ts`.
- **Production Dependency:** Officer session cookie.
- **Security State:** High Vulnerability. `route.ts` checked `user.role === 'VERIFICATION_OFFICER'`, but lacked a check `if (account.userId === auth.user.id)`. An officer could approve their own verification application.
- **What is Missing:** Self-approval check (`account.userId !== auth.user.id`), generic/dynamic officer profile display (removing hardcoded Ananya Sen), and multi-officer audit trails.
- **Exact Fix:** Add `if (account.userId === auth.user.id) throw Forbidden("Officer cannot approve own account")`. Remove hardcoded officer names from public UI and seed files.

---

### 7. Duplicate Identity Detection Engine
- **Classification:** `REAL_PRODUCTION`
- **Current Implementation:** `lib/duplicate-detector.ts` implements exact document hash matching (`CONFIRMED_DUPLICATE`), Levenshtein distance on full names, exact date-of-birth matching, and district correlation.
- **Actual Backend:** In-memory comparison against candidate profiles.
- **Actual Database:** `store.ts` candidate lists.
- **Production Dependency:** Pure algorithmic scoring.
- **Security State:** Sound. Correctly marks exact matches as `CONFIRMED_DUPLICATE` (scoring 100) and fuzzy matches as `POSSIBLE_DUPLICATE` (triggering manual review).
- **What is Missing:** Query candidates directly from PostgreSQL via indexed SQL queries instead of `getAllProfiles()`.
- **Exact Fix:** Convert candidate lookup to parameterized PostgreSQL SQL query filtering by date of birth, document hash, or name phonetics.

---

### 8. Client ID Generation & Architecture
- **Classification:** `REAL_PRODUCTION`
- **Current Implementation:** `lib/client-id.ts` generates official identifiers in format `AHCS-IN-XXXXXXXX` using 7 Crockford Base32 characters (`0-9, A-Z` excluding `I, L, O, U`) plus 1 ISO/IEC 7064 Mod 32 check character.
- **Actual Backend:** `crypto.randomBytes(7)` and `calculateCheckCharacter()`.
- **Actual Database:** `ClientId` table with unique constraint on `clientId`.
- **Production Dependency:** Pure cryptographic generation.
- **Security State:** Strong. Non-sequential, non-sensitive, high entropy (over 34 billion combinations per region).
- **What is Missing:** Clear distinction between provisional registration (`AHCS REGISTRATION ID`, e.g., `REG-XXXXXXXX`) and verified identity (`AHCS VERIFIED CLIENT ID`).
- **Exact Fix:** Ensure unverified accounts display "PROVISIONAL REGISTRATION ID" in dashboard until the Verification Officer approves the account.

---

### 9. Smart Health Card Lifecycle & Token Management
- **Classification:** `PARTIALLY_REAL`
- **Current Implementation:** Health cards are minted in `PENDING_ACTIVATION` upon officer approval. Physical dimensions are standardized to ID-1 ($85.60 \times 53.98$ mm). Activation code is generated using SHA-256 hash. Card replacement revokes old card and old QR tokens, issuing a new card under the same Client ID.
- **Actual Backend:** `app/api/v1/cards/replace/route.ts`, `app/api/v1/cards/activate/route.ts`.
- **Actual Database:** `Card`, `CardEvent`, and `QrToken` in `store.ts`.
- **Production Dependency:** Internal logic.
- **Security State:** Good design; tokens are separate from cards, and card replacement revokes previous tokens.
- **What is Missing:** Migration of card events and token revocation to atomic PostgreSQL transactions.
- **Exact Fix:** Port all card operations to Prisma `$transaction`.

---

### 10. Dynamic Emergency QR / NFC Access Gateway
- **Classification:** `REAL_PRODUCTION`
- **Current Implementation:** `app/api/v1/emergency/[token]/route.ts` and `app/e/[token]/page.tsx`. QR code encodes URL `https://ahcs.in/e/<256-bit-random-token>`.
- **Actual Backend:** Token lookup, revocation check, expiry validation, scan counter increment, and immutable audit logging.
- **Actual Database:** Reads from `store.ts`.
- **Production Dependency:** QR code generator (`qrcode` npm).
- **Security State:** Excellent. Zero clinical history or sensitive documents exposed in URL or QR. Exposes strictly minimal emergency dataset: Name, Client ID, Blood Group (with verification source), Critical Allergies, Emergency Contacts, Organ Donor status, and National Emergency 112 guidance.
- **What is Missing:** Direct Prisma database query and rate limiting on the public endpoint to prevent automated brute-force scanning.
- **Exact Fix:** Port endpoint to Prisma; add IP-based sliding-window rate limit (10 requests/minute).

---

### 11. Medical Records & Document Vault
- **Classification:** `PARTIALLY_REAL`
- **Current Implementation:** Supports Consultations, Diagnoses, Prescriptions, Lab Reports, Discharge Summaries. Records are created via `app/api/v1/records/route.ts`. Patients can view their records in `/dashboard`.
- **Actual Backend:** Records stored in `store.ts`.
- **Actual Database:** `MedicalRecord` and `Prescription` tables in Neon exist but are bypassed by API route.
- **Production Dependency:** In-memory store.
- **Security State:** Medium Risk. Patient can create self-reported records, but provider records lack cryptographic digital signature of the practitioner.
- **What is Missing:** Direct Prisma queries; strict enforcement that only verified providers (`role: DOCTOR | PROVIDER_ADMIN`) can create official clinical records.
- **Exact Fix:** Wire route to `prisma.medicalRecord`; enforce provider credential validation on all non-patient-declared records.

---

### 12. Granular Patient Consent Engine
- **Classification:** `REAL_PRODUCTION`
- **Current Implementation:** `app/api/v1/consent/route.ts` and `app/api/v1/consent/revoke/route.ts`. Patient grants consent to specific providers with defined purpose (`GENERAL_CONSULTATION`, `DIAGNOSIS`, `SECOND_OPINION`), scope (`ALL_RECORDS`, `PRESCRIPTIONS_ONLY`, `LABS_ONLY`), and expiration timestamp (default 24 hours).
- **Actual Backend:** Server-side consent check and immediate revocation.
- **Actual Database:** `Consent` records in `store.ts`.
- **Production Dependency:** Internal logic.
- **Security State:** High. Revocation is immediate and logged in audit trail.
- **What is Missing:** Prisma database backing and provider patient-lookup enforcement.
- **Exact Fix:** Port to Prisma and ensure `/api/v1/provider/patient-lookup` enforces active consent record before returning records.

---

### 13. Provider Network & Directory
- **Classification:** `PARTIALLY_REAL` / `DEMO`
- **Current Implementation:** `app/api/v1/providers/route.ts` lists hospitals and clinics. In development/test mode, 4 fake hospitals (Max Hospital, Fortis Memorial, Medanta, Apollo) were previously seeded in `store.ts`. In production mode, seed was gated, leaving directory empty unless providers register via `/provider/register`.
- **Actual Backend:** `store.ts` provider array.
- **Actual Database:** `Provider` table in Neon.
- **Production Dependency:** In-memory store.
- **Security State:** Clear status separation (`PENDING_VERIFICATION` vs `VERIFIED`).
- **What is Missing:** Real provider onboarding workflow backed by PostgreSQL; honest public directory displaying verified providers or clear "Onboarding in Progress" state.
- **Exact Fix:** Wire provider registration and directory search to Prisma. Never display fake hospital names in production.

---

### 14. Appointments System
- **Classification:** `MOCK` / `MISSING`
- **Current Implementation:** `app/api/v1/appointments/route.ts` exists in API, but no database model `Appointment` exists in `prisma/schema.prisma`! The API stores appointments in `this.data.appointments` in `store.ts`. No dedicated public `/appointments` booking page exists.
- **Actual Backend:** In-memory array in `store.ts`.
- **Actual Database:** Missing in Prisma schema.
- **Production Dependency:** Ephemeral memory.
- **Security State:** Non-production.
- **What is Missing:** `Appointment` model in `schema.prisma`, slot availability logic, provider confirmation workflow, and clean UI integration in dashboard.
- **Exact Fix:** Add `model Appointment` to `schema.prisma`, run `npx prisma db push`, and wire API to Prisma. Clearly mark external hospital EHR integration as "AHCS Scheduled - Direct Confirmation Required".

---

### 15. Prescription Verification
- **Classification:** `PARTIALLY_REAL`
- **Current Implementation:** `app/api/v1/medications/route.ts` and `Prescription` model exist. Prescriptions include medication items, dosages, duration, and doctor registration references.
- **Actual Backend:** `store.ts` prescriptions array.
- **Actual Database:** `Prescription` table in Neon.
- **Production Dependency:** Ephemeral memory.
- **Security State:** Lacks a public standalone cryptographic verification route (`/verify/rx/[id]`).
- **What is Missing:** Public minimal verification page for pharmacists/patients; direct Prisma queries.
- **Exact Fix:** Add public prescription verification endpoint revealing only validity, issuing doctor name, council reg number, and issue date without leaking unrelated clinical history.

---

### 16. Membership Plans & Payment System
- **Classification:** `MOCK` / `INSECURE`
- **Current Implementation:** `app/pricing/page.tsx` displays plans: Basic (₹0), Premium (₹2,199), Family Shield (₹4,499). Clicking "Pay" calls `/api/v1/payments/create-order` (which generates a random string order ID) and then immediately calls `/api/v1/payments/verify` with `gatewaySignature: 'mock_signature_approved'`.
- **Actual Backend:** In `app/api/v1/payments/verify/route.ts`, if `RAZORPAY_KEY_SECRET` is unset, signature verification is completely bypassed and order is marked `PAID`.
- **Actual Database:** `payment_orders` in `store.ts`.
- **Production Dependency:** Unconfigured Razorpay keys in `.env`.
- **Security State:** Critical Vulnerability. Direct violation of Rule 7 & 24. Anyone can fabricate paid memberships without transferring money.
- **What is Missing:** Real Razorpay SDK order creation (`razorpay.orders.create`), real Razorpay Checkout modal in UI, mandatory server-side HMAC-SHA256 signature verification that strictly errors out if secrets are missing, and webhook reconciliation.
- **Exact Fix:** Enforce `RAZORPAY_KEY_SECRET` requirement; disable mock verification bypass in production; integrate Razorpay standard checkout script; add idempotent webhook handler.

---

### 17. Corporate Healthcare Infrastructure
- **Classification:** `PARTIALLY_REAL`
- **Current Implementation:** `app/api/v1/corporate/route.ts` and `app/corporate/page.tsx`. Manages corporate account registration, employee roster sponsorship, and subsidy eligibility.
- **Actual Backend:** In-memory array in `store.ts`.
- **Actual Database:** `Company` and `CorporateSponsorship` in Prisma schema.
- **Production Dependency:** Ephemeral memory.
- **Security State:** Good privacy design: corporate admins cannot view private employee clinical records (strict separation between billing/eligibility and medical history).
- **What is Missing:** Direct Prisma database operations.
- **Exact Fix:** Wire `/api/v1/corporate` to `prisma.company` and `prisma.corporateSponsorship`.

---

### 18. Audit Logging Subsystem
- **Classification:** `PARTIALLY_REAL`
- **Current Implementation:** `db.logAudit()` is called across auth, OTP, KYC, cards, emergency scans, and payments. Dual-writes to `prisma.auditLog.create`.
- **Actual Backend:** In-memory array + async Prisma insert.
- **Actual Database:** `AuditLog` table in Neon PostgreSQL.
- **Production Dependency:** PostgreSQL.
- **Security State:** Strong structure: captures actorId, actorRole, action, targetResource, targetId, ipAddress, userAgent, and JSON metadata.
- **What is Missing:** Direct synchronous or queued write to PostgreSQL; immutability enforcement at database level.
- **Exact Fix:** Make audit logging direct to Prisma with fallback logging, ensuring all security events are permanently recorded.

---

### 19. Public Website Marketing Claims & Legal Clarity
- **Classification:** `INSECURE` / `MOCK`
- **Current Implementation:**
  - `app/page.tsx` line 185 and `app/pricing/page.tsx` line 113 contained phrasing implying "Free treatment everywhere" or ambiguous coverage.
  - Several pages used terms like "instant e-KYC" or referenced "government verification" in error messages or headings.
- **Actual Backend:** N/A (Marketing copy).
- **Actual Database:** N/A.
- **Production Dependency:** Frontend text.
- **Security State:** Compliance Risk. Violates prompt rules: "AHCS IS NOT Government software, Aadhaar, ABHA, Ayushman Bharat, or an insurance company. Never say 'free treatment everywhere'."
- **What is Missing:** Clean, honest, authoritative legal disclaimers distinguishing AHCS as an independent, private healthcare platform that provides digital identity, smart cards, emergency access, and verified network benefits.
- **Exact Fix:** Audit and sanitize all public copy in `app/page.tsx`, `app/pricing/page.tsx`, `app/terms/page.tsx`, `app/privacy/page.tsx`, and `components/Navbar.tsx`.

---

## Complete Feature Classification Summary Table

| Category | Component / Feature | Current State | Authoritative Backend | Status Classification |
| :--- | :--- | :--- | :--- | :--- |
| **Database** | PostgreSQL Connection (Neon) | Connected & 30 tables pushed | Neon PostgreSQL | `REAL_PRODUCTION` |
| **Database** | Runtime API Operations | Handled by `lib/db/store.ts` | In-memory + JSON file | `PARTIALLY_REAL` (Must migrate to Prisma) |
| **Auth** | Email OTP via Gmail SMTP | Real email dispatch (port 465) | Gmail SMTP Transporter | `REAL_PRODUCTION` |
| **Auth** | SMS OTP Gateway | Fast2SMS / Twilio client ready | Unconfigured in `.env` | `PARTIALLY_REAL` (Blocked by SMS API key) |
| **Auth** | Master OTP Bypass | Hardcoded `999999` for 2 numbers | In-memory check in `otp.ts` | `INSECURE` (Must be strictly disabled in prod) |
| **KYC** | Document Submission Flow | 4-step wizard in `/apply` | Sends filename string only | `UI_ONLY` (Needs real multipart file upload) |
| **KYC** | Duplicate Detection Engine | SHA-256 + Levenshtein distance | Node.js crypto in `duplicate-detector.ts` | `REAL_PRODUCTION` |
| **KYC** | Document Authenticity Proof | Claims SHA-256 proves document | Pure integrity hash | `PARTIALLY_REAL` (Clarify integrity vs validity) |
| **Officer** | Officer Review & Decision API | Queues, approve/reject/correct | `app/api/v1/officer/decision` | `PARTIALLY_REAL` (Missing self-approval block) |
| **Identity** | Client ID Generation | `AHCS-IN-XXXXXXXX` (Mod 32) | `lib/client-id.ts` | `REAL_PRODUCTION` |
| **Card** | ID-1 Smart Card Lifecycle | States: PENDING, ACTIVE, REVOKED | `app/api/v1/cards/*` | `PARTIALLY_REAL` (Needs direct Prisma backing) |
| **Emergency**| Dynamic QR Code Gateway | 256-bit token lookup, audit log | `app/api/v1/emergency/[token]` | `REAL_PRODUCTION` |
| **Emergency**| 112 National Helpline Guidance | Clearly labeled as India 112 | Public UI | `REAL_PRODUCTION` |
| **Clinical** | Medical Records Creation & View | Consultations, Prescriptions, Labs | In-memory `store.ts` | `PARTIALLY_REAL` (Needs direct Prisma backing) |
| **Clinical** | Patient-Controlled Consent | Granular purpose, scope, 24h TTL | `app/api/v1/consent/*` | `REAL_PRODUCTION` |
| **Provider** | Directory & Registration | Form & category search | `app/api/v1/providers/*` | `PARTIALLY_REAL` (Remove mock seeds, wire Prisma) |
| **Ecosystem**| Appointments System | API route exists; schema missing | In-memory `store.ts` | `MOCK` / `MISSING` (Add schema model) |
| **Ecosystem**| Prescription Verification | Model exists; no standalone UI | `app/api/v1/medications` | `PARTIALLY_REAL` (Add public verification URL) |
| **Payments** | Order Creation | Mock gateway order string | In-memory `store.ts` | `MOCK` (Need real Razorpay SDK call) |
| **Payments** | Payment Verification | Skips signature check if no secret | In-memory `store.ts` | `INSECURE` (Strict HMAC-SHA256 required) |
| **Corporate**| Company & Subsidy Management | Eligibility & sponsorship rosters | In-memory `store.ts` | `PARTIALLY_REAL` (Wire to Prisma) |
| **Security** | RBAC Enforcement | Checked in route handlers | Route-level `getCurrentUser()` | `PARTIALLY_REAL` (Need global Next.js middleware) |
| **Security** | Audit Trail Logging | Logs all sensitive actions | Neon `audit_logs` + in-memory | `REAL_PRODUCTION` |

---

## Action Plan for Phase F1 Implementation

Based on this audit, the immediate foundational fixes for Phase F1 are:
1. **Prisma Schema Expansion:**
   - Add missing target models: `Appointment`, `BenefitRule`, `ProviderClaim`, `SecurityEvent`.
   - Ensure clear enum mappings for all lifecycle statuses.
   - Run `prisma db push` to synchronize Neon PostgreSQL.
2. **Transition Authority to PostgreSQL (Prisma):**
   - Replace in-memory reads and writes in `lib/db/store.ts` with direct, asynchronous Prisma database calls.
   - Ensure `UserSession`, `Account`, `Profile`, `VerificationRequest`, `ClientId`, `Card`, `QrToken`, and `EmergencyProfile` are permanently queried from and written to Neon.
   - Deprecate operational dependence on `data/ahcs_production.json`.
3. **Identity Standardization:**
   - Standardize `lib/client-id.ts` to clearly document the Crockford Base32 + Mod 32 check algorithm.
   - Introduce provisional status ("AHCS REGISTRATION ID") for unverified accounts vs permanent verified Client ID.
4. **Security Hardening Pre-Flight:**
   - Add global `middleware.ts` for route protection and security headers.
   - Fix officer self-approval vulnerability in `app/api/v1/officer/decision/route.ts`.
   - Gate test OTP bypass strictly so it never executes in production.
   - Sanitize public marketing copy across all pages.
