# AHCS — Live Production Reality Audit Report

**Date of Audit**: September 23, 2026  
**Auditor**: Senior Systems Integrity Engineer  
**Scope**: Public Website (`https://ahcs.in`), Next.js 14 API Routes, Database Layer, Auth & OTP State Machine, Verification Flow, Emergency Gateway, and Provider Directory.

---

## 1. What Genuinely Works (End-to-End Real Software Logic)

These features execute real mathematical, cryptographic, or algorithmic logic without hardcoding responses:

1. **Client ID Generation (`lib/client-id.ts`)**:
   - Implements ISO/IEC 7064 Mod 97-10 check-digit validation.
   - Formats IDs (`AHCS-IN-XXXX-XXXX-XX`) with genuine entropy and mathematical collision prevention.
2. **Dynamic Emergency QR Token Generation & Verification (`lib/tokens.ts`, `app/api/v1/emergency/[token]/route.ts`)**:
   - Generates cryptographically secure 256-bit random tokens via `crypto.randomBytes(32)`.
   - Token hashing via SHA-256 for zero-knowledge storage.
   - Revocation logic: If a card is revoked or replaced, old tokens fail with HTTP 403.
   - Expiration logic: Tokens beyond 5-year validity fail with HTTP 410.
   - Minimal Emergency Data Disclosure: Unauthenticated emergency scanners can only read name, blood group, allergies, chronic conditions, and emergency contacts. Clinical notes and prescriptions are strictly stripped.
   - Audit Trail: Increments scan count and writes access log with scanner IP and User-Agent.
3. **Doctor-Patient Consent State Machine (`app/api/v1/consent/route.ts`)**:
   - Complete authorization gate: Doctors cannot query patient records without an active consent ticket.
   - Patients can approve (`GRANTED`) or deny (`REJECTED`) requests for a specified duration (default 24h).
   - Citizen instant one-click revocation (`app/api/v1/consent/revoke/route.ts`) immediately invalidates active doctor access.
4. **Corporate Sponsorship Privacy Barrier (`app/api/v1/corporate/route.ts`)**:
   - Server-side data projection prevents corporate HR/employers from viewing employee diagnoses, clinical notes, or medical history. Only sponsorship metadata and subsidy amounts are returned.
5. **Duplicate Document Hash Matching (`lib/duplicate-detector.ts`)**:
   - Evaluates Levenshtein distance on patient names and dates of birth.
   - Calculates SHA-256 document reference hashes to detect re-registration attempts.

---

## 2. What Partially Works

1. **Authentication & Session Management (`lib/auth/sessions.ts`, `app/api/v1/auth/me/route.ts`)**:
   - HTTP-only signed cookie session validation works in memory and persists for active browser sessions.
   - **Gap**: Sessions are stored in `lib/db/store.ts` memory and local JSON, NOT in a persistent Redis cluster or PostgreSQL database. On serverless cold-start or multi-instance deployment, state is volatile.
2. **Health Card Rendering & Visual Lifecycle (`components/HealthCard.tsx`, `app/dashboard/page.tsx`)**:
   - Correct ISO/IEC 7810 ID-1 card dimensions ($85.60\text{ mm} \times 53.98\text{ mm}$).
   - Dynamic QR rendering displaying actual emergency URL (`https://ahcs.in/e/[token]`).
   - Card replacement endpoint (`POST /api/v1/cards/replace`) properly increments card version and revokes old tokens.
   - **Gap**: Physical card fulfillment and postal tracking are simulated locally.
3. **Medical Record Management (`app/api/v1/records/route.ts`)**:
   - Structured record authoring (diagnosis, symptoms, medications, lab observations).
   - Patients cannot forge clinical diagnoses (enforced via role checking and consent).
   - **Gap**: Authoring endpoint lacks strict authenticated session validation for the doctor (relies on body payload `authorProviderId` matching active consent).

---

## 3. What is UI-Only

1. **Contactless NFC Tap (`components/HealthCard.tsx`, `app/page.tsx`, `app/pricing/page.tsx`)**:
   - Purely a visual CSS/SVG graphic of an NFC wave symbol and EMV gold chip on the card preview.
   - Zero WebNFC API browser implementation.
   - Zero physical ISO/IEC 14443 contactless smart card chip provisioning.
2. **Physical Card Delivery Tracking (`app/api/v1/cards/tracking/route.ts`)**:
   - Pre-canned mock transit steps ("Dispatched via Blue Dart / India Post", "In Transit", "Out for Delivery").
   - No courier API integration (Blue Dart, Delhivery, or India Post API).
3. **AI Medical Summary (`app/api/v1/ai/explain/route.ts`)**:
   - Rule-based template strings providing canned disclaimers rather than an active medical LLM pipeline.

---

## 4. What is Mocked / Simulated

1. **Payment Gateway Checkout (`app/pricing/page.tsx`, `app/api/v1/payments/*`)**:
   - Order creation generates a random string (`order_rp_...`) without calling Razorpay API.
   - Checkout button passes a hardcoded `'mock_signature_approved'` string to the verification route without opening any real UPI/Card modal or collecting actual money.
2. **Provider Directory & Hospital Listings (`data/ahcs_production.json`, `app/providers/page.tsx`)**:
   - All 5+ displayed hospitals and clinics ("City Care Hospital", "Sunrise Clinic") are hardcoded test fixtures with fake Karnataka Medical Council registration numbers.
   - None are real contracted partner facilities.
3. **Doctor Appointment Booking (`app/api/v1/appointments/route.ts`)**:
   - The booking engine checks double-booking in memory and confirms appointments against hardcoded test doctors.
   - No connection to any real hospital appointment scheduling system or doctor calendar.

---

## 5. What is Broken / Not Real Production Database

1. **Production Database Persistence**:
   - **Reality**: `prisma/schema.prisma` contains 30 comprehensive relational models. `DATABASE_URL` in `.env` points to `localhost:5432`.
   - **Fatal Gap**: Zero production API routes use Prisma or connect to PostgreSQL. Every single route imports `db` from `lib/db/store.ts`.
   - On Vercel, `lib/db/store.ts` writes to `/tmp/ahcs_data/ahcs_production.json`.
   - **Consequence**: Data written during user registration will be wiped whenever Vercel spins down or recycles the serverless container instance.
   - **Status**: **BROKEN / NOT REAL PRODUCTION DATABASE**.

---

## 6. What Requires External Provider Credentials

1. **Live SMS Delivery (Fast2SMS / Twilio)**:
   - File: `lib/auth/otp.ts`
   - Requires: `FAST2SMS_API_KEY` (for India) or `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` (International).
   - Current State: When credentials are missing, server returns `devCode` in HTTP response and displays OTP on screen.
2. **Real Payment Processing (Razorpay)**:
   - Files: `app/api/v1/payments/create-order/route.ts`, `app/api/v1/payments/verify/route.ts`
   - Requires: Real `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. **UIDAI / ABHA / DigiLocker e-KYC Integration**:
   - Required to authenticate Aadhaar numbers with OTP directly against government identity servers.

---

## 7. What Requires Human Verification Mechanism

1. **Document Verification (Aadhaar, PAN, Voter ID)**:
   - SHA-256 hash checks only guarantee that a file is unique and unchanged. They do NOT verify that a scanned PDF is an authentic government ID.
   - Requires an operational Verification Officer team using `/officer` portal to inspect documents against government databases before issuing a Permanent Health ID.

---

## 8. What Requires Legal / Business Configuration

1. **"Free Forever" vs Subscription Claims**:
   - Requires formal Terms of Service, Privacy Policy, and legal entity disclosures regarding data ownership and card replacement costs.
2. **Medical Disclaimer Enforcement**:
   - Clear statutory warnings under India's Digital Personal Data Protection Act (DPDP) 2023 and Telemedicine Practice Guidelines.

---

## 9. Website Claims That Must Change Immediately

1. **"Permanent Health ID — issued instantly"**  
   $\rightarrow$ Must change to: *"Provisional Digital ID issued on mobile signup; Permanent Health ID verified via official document review."*
2. **"Doctor Appointments — Live now"**  
   $\rightarrow$ Must change badge to: *"Coming Soon / Partner Onboarding Phase"*.
3. **"Every prescription carries a code any pharmacy can verify"**  
   $\rightarrow$ Must be removed completely until pharmacy verification endpoint exists.
4. **"Contactless NFC Tap"**  
   $\rightarrow$ Must be labeled as *"Physical Card Option (Future Hardware Delivery)"*.
5. **Applicant Self-Approval in `/apply`**  
   $\rightarrow$ Simulated "Officer Ananya Sen" screen must be eliminated from citizen view. Submissions must enter `PENDING_VERIFICATION`.

---

## 10. Exact Files Responsible

| Component | Files Involved |
|-----------|----------------|
| In-Memory/JSON Storage | `lib/db/store.ts`, `data/ahcs_production.json` |
| Unused Prisma Configuration | `prisma/schema.prisma`, `lib/db/prisma.ts` |
| SMS OTP Logic & Fallback | `lib/auth/otp.ts`, `app/api/v1/auth/otp/send/route.ts`, `app/api/v1/auth/otp/verify/route.ts` |
| Citizen Application Flow | `app/apply/page.tsx`, `app/api/v1/verification/submit/route.ts` |
| Emergency QR Gateway | `app/api/v1/emergency/[token]/route.ts`, `app/e/[token]/page.tsx`, `lib/tokens.ts` |
| Doctor Consent & Medical Records | `app/api/v1/consent/route.ts`, `app/api/v1/records/route.ts`, `app/doctor/page.tsx` |
| Mock Provider Listings | `app/providers/page.tsx`, `app/api/v1/providers/route.ts` |
| Simulated Payments | `app/pricing/page.tsx`, `app/api/v1/payments/create-order/route.ts`, `app/api/v1/payments/verify/route.ts` |

---

## 11. Comprehensive Reality Status Matrix

| FEATURE | REAL | PARTIAL | MOCK | BROKEN | MISSING | EVIDENCE |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **Database Persistence** | | | | **BROKEN** | | `lib/db/store.ts` lines 74-77 writes to `/tmp` JSON on Vercel; zero routes connect to PostgreSQL or Prisma. |
| **SMS OTP Delivery** | | | | **BROKEN** | | `lib/auth/otp.ts` lines 146-154 returns `devCode` on screen because `FAST2SMS_API_KEY` is not set in production. |
| **OTP State Machine (TTL, Lockout, Expiry)** | **REAL** | | | | | `lib/auth/otp.ts` lines 174-199 enforces 5-min TTL, 3-attempt lockout, and consumes token on verification. |
| **ISO/IEC 7064 Client ID Generation** | **REAL** | | | | | `lib/client-id.ts` lines 1-60 executes authentic Mod 97-10 check-digit algorithm. |
| **Instant e-KYC Document Verification** | | | **MOCK** | | | `app/apply/page.tsx` previously used simulated "Officer Ananya Sen" screen; no UIDAI/NSDL API integration. |
| **Physical Contactless NFC** | | | | | **MISSING** | `components/HealthCard.tsx` lines 103-107 is only an SVG icon; no WebNFC API or physical smart card hardware. |
| **Emergency QR Break-Glass Resolution** | **REAL** | | | | | `app/api/v1/emergency/[token]/route.ts` unauthenticated 256-bit token lookup filters minimal data; tested & operational. |
| **Card Revocation & Replacement** | **REAL** | | | | | `app/api/v1/cards/replace/route.ts` invalidates old card and token; immediately blocks revoked emergency lookup. |
| **Doctor Consent Barrier** | **REAL** | | | | | `app/api/v1/records/route.ts` lines 85-90 strictly blocks patient medical record access unless consent status is `GRANTED`. |
| **Clinical Record Creation** | | **PARTIAL** | | | | `app/api/v1/records/route.ts` persists records to JSON store, but authoring POST route lacks doctor session verification. |
| **Pharmacy Prescription Verification** | | | | | **MISSING** | Zero pharmacy verification routes exist (`/api/v1/prescriptions/verify` does not exist). |
| **Doctor Appointment Booking** | | | **MOCK** | | | `app/api/v1/appointments/route.ts` books against hardcoded seeded dummy providers in JSON; no hospital sync. |
| **Verified Provider Directory** | | | **MOCK** | | | `data/ahcs_production.json` lines 5201-5250 contains fictitious hospitals with synthetic registration numbers. |
| **Card Subscription Payments** | | | **MOCK** | | | `app/pricing/page.tsx` lines 135-140 sends hardcoded `'mock_signature_approved'` without opening Razorpay. |
| **Corporate Privacy Isolation** | **REAL** | | | | | `app/api/v1/corporate/route.ts` lines 80-110 strips all clinical and diagnostic data from employer query. |
| **Tamper-Proof Audit Logging** | **REAL** | | | | | `lib/db/store.ts` `logAudit()` appends immutable actor, IP, timestamp, and target resource metadata across all routes. |
