# AHCS — Comprehensive Production Repository Audit

**Date**: September 2026  
**Auditor**: Principal Platform Architect & Senior Full-Stack Engineer  
**Status**: Pre-Production Codebase Review

---

## 1. Executive Summary

This audit evaluates the current state of the **AHCS (Advanced Health Care System)** codebase against the strict production rules outlined in the Master Command. The platform has a high-quality visual foundation, validated mathematical algorithms (Client ID checksums, Levenshtein duplicate detection), and a comprehensive relational schema. 

However, critical user flows currently rely on client-side React state rather than server-side, database-backed transactions. This document categorizes what works, what is mock/UI-only, security gaps, production blockers, and the exact remediation roadmap.

---

## 2. Detailed Audit Categories

### A. What Already Works (Production-Ready or Near Ready)
1. **Permanent AHCS Client ID Engine** (`lib/client-id.ts`):
   * Crockford Base32 alphabet generation without ambiguous characters (`I, L, O, U`).
   * ISO/IEC 7064 Mod 37 check-digit validation detecting transposition and transcription errors.
   * Fully covered by passing automated unit tests (`test/verification-tests.mjs`).
2. **Duplicate Account Scoring Engine** (`lib/duplicate-detector.ts`):
   * Exact document reference hashing via SHA-256 (`doc_type + doc_number`).
   * Levenshtein distance and demographic clustering calculations.
3. **Cryptographic Token & Activation Code Minter** (`lib/tokens.ts`):
   * 256-bit CSPRNG token generation (`crypto.randomBytes(32)`).
   * 6-digit numeric activation code generator with SHA-256 hash digests.
4. **Physical & Digital Health Card Presentation** (`components/HealthCard.tsx`):
   * ISO/IEC 7810 ID-1 standard dimensions ($85.60\text{ mm} \times 53.98\text{ mm}$, aspect ratio ~1.586).
   * Front and back faces with 3D flip, gold EMV chip graphic, NFC wave indicator, and dynamic vector QR code.
5. **Next.js 14+ App Router Build**:
   * Compiles cleanly with TypeScript strict mode (`npm run build` exits 0).

---

### B. What is UI-Only (State in React `useState`, Not Persisted)
1. **Card Application Flow** (`app/apply/page.tsx`):
   * Mobile OTP, demographic details, document uploads, and card activation codes exist purely in frontend memory.
   * Refreshing the browser resets the applicant's progress to Step 1.
2. **Verification Officer Queue** (`app/officer/page.tsx`):
   * Displays in-memory `mockTickets`. Officer approve/reject actions mutate local React state rather than PostgreSQL records.
3. **Member Dashboard** (`app/dashboard/page.tsx`):
   * Renders hardcoded member attributes ("Rahul Sharma", "AHCS-IN-7F3K9Q2L") rather than pulling the authenticated session.
4. **Emergency Break-Glass View** (`app/e/[token]/page.tsx`):
   * Extracts attributes from URL `searchParams` rather than querying the database for the active token.

---

### C. What is Backend-Backed
* Currently, **0%** of runtime HTTP requests hit a persistent backend API. 
* The Prisma schema (`prisma/schema.prisma`) is complete and typed, but no database migrations have been executed against a live PostgreSQL database yet.

---

### D. What is Partially Implemented
1. **Prisma Client**: Generated via `npx prisma generate`, but no active database connection string is active.
2. **Docker Compose** (`docker-compose.yml`): Container definitions for PostgreSQL 16 and Redis 7 exist, but the Docker daemon was offline during initial audit.

---

### E. What is Insecure / Vulnerable (Must Be Remedied)
1. **Lack of Server-Side Authorization**:
   * Anyone can visit `/officer` directly without an authenticated `VERIFICATION_OFFICER` session.
   * Anyone can simulate approval in the frontend without authorization checks.
2. **Missing Input Validation & Sanitization**:
   * No backend validation pipes (`zod` or `class-validator`) guarding API endpoints.
3. **Emergency QR Data Leak Risk**:
   * Passing clinical parameters via URL query strings (`?name=...&blood=...`) leaks PII into browser history, proxies, and CDN logs.
4. **Missing Rate Limiting on Token Endpoints**:
   * No Redis-backed rate limiter on emergency token queries or OTP dispatch.

---

### F. What is Fake / Demo (Must Be Replaced)
1. **Hardcoded Development OTP**: `123456` hardcoded in `app/apply/page.tsx`.
2. **Hardcoded Mock Officer Queue**: In `app/officer/page.tsx`.
3. **Hardcoded Member Profile**: In `app/dashboard/page.tsx`.

---

### G. What Needs Replacement
* In-memory form handling in `app/apply/page.tsx`, `app/officer/page.tsx`, and `app/e/[token]/page.tsx` must be replaced with real Next.js Server Actions and REST API route handlers backed by Prisma transactions.

---

### H. What Should Be Preserved
* Visual theme, Royal Blue color scheme, typography, and card dimensions.
* Core algorithmic libraries (`lib/client-id.ts`, `lib/duplicate-detector.ts`, `lib/tokens.ts`).
* Relational ERD and Prisma schema structure.

---

### I. Production Blockers
1. **Database Persistence**: Absence of an active, running PostgreSQL database with executed migrations.
2. **Authentication & Session Cookies**: No server-side session issuance or cookie encryption.
3. **Backend API Layer**: Absence of route handlers under `/api/v1/`.

---

### J. Phased Implementation Priority

| Priority | Phase | Description |
| :---: | :--- | :--- |
| **P0** | **Phase B: Database & Storage Setup** | Stand up PostgreSQL/SQLite fallback, run Prisma migrations, create database client singleton. |
| **P0** | **Phase C: Real Auth & OTP Engine** | Server-side OTP dispatch, hashing, TTL expiration, rate limiting, session cookies. |
| **P0** | **Phase D & E: Profile & Verification API** | Real document metadata persistence, duplicate check queries against DB, officer decision endpoints. |
| **P0** | **Phase F & G: Atomic Client ID & Card Minting** | Concurrency-safe database transactions for Client ID issuance and card generation. |
| **P0** | **Phase H & I: Real Emergency Gateway** | Database token lookup for `/e/[token]`, card status checks, immutable audit logging. |
| **P1** | **Phase J & K: Records, Consent & Providers** | Database-backed medical records, consent grants, provider onboarding. |
| **P2** | **Phase L & N: Billing & Notifications** | Payment gateway abstraction and multi-channel notifications. |
| **P0** | **Phase P & Q: Automated E2E & Hardening** | Complete end-to-end integration tests and production readiness validation. |
