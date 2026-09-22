# AHCS — Master Architecture Specification
## Advanced Health Care System (AHCS)

---

## 1. System Vision & Paradigm

The **Advanced Health Care System (AHCS)** is an independent, private healthcare identity, healthcare membership, health-record management, emergency-access, and healthcare-network platform.

### What AHCS Is
* A private, cryptographically verified healthcare identity platform.
* An issuer of physical and digital health cards conforming to international dimensions (ISO/IEC 7810 ID-1).
* A privacy-first break-glass emergency medical profile directory.
* A granular patient consent and federated medical record gateway.
* A verified healthcare provider and network benefit directory.

### What AHCS Is NOT
* Not a Hospital Management Software (HMS) or EHR/EMR replacement.
* Not an official government identity or healthcare portal (Not Aadhaar, Not ABHA, Not Ayushman Bharat).
* Not an insurance underwriter unless licensed and integrated under dedicated enterprise benefit settlement modules.

---

## 2. Technology Stack & Rationale

| Tier | Technology | Production Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router) + React | High-performance server rendering for public pages (`/`, `/about`, `/pricing`), client-side reactivity for authenticated dashboards, and native mobile-responsive layouts. |
| **Backend & API** | Next.js Server Actions & Route Handlers / NestJS Core | Standardized RESTful APIs, strict schema validation, type-safe RPC, and secure server-to-server operations. |
| **Primary Database** | PostgreSQL 16+ | ACID compliance for sensitive health and verification state machines, strict foreign keys, native `JSONB` support for audit logs, and row-level security. |
| **ORM & Migrations** | Prisma ORM | End-to-end type safety across client and server, automated database migrations, zero raw-SQL mapping errors. |
| **Caching & Queues** | Redis 7+ | Fast TTL storage for OTP requests, token resolution for QR/NFC scans, and distributed job queue (`BullMQ`) for background verification tasks. |
| **Object Storage** | S3-Compatible Storage (AWS S3 / MinIO) | Encrypted storage for uploaded identity documents and medical attachments. Private access only via temporary signed URLs. |
| **Cryptography** | Node.js `crypto` & WebCrypto API | AES-256-GCM for field-level sensitive data, SHA-256 for document fingerprinting, Crockford Base32 + Mod 37 for client ID check digits. |
| **Styling** | Tailwind CSS + Radix UI (shadcn/ui) | Accessible, WCAG 2.1 AA compliant, custom healthcare-focused design tokens. |

---

## 3. High-Level System Architecture

```
[Public Users / Patients / First Responders / Providers / Admins]
                             │
                             ▼
                    [Edge Gateway / CDN]
               (WAF, DDoS Protection, TLS 1.3)
                             │
                             ▼
            ┌───────────────────────────────────┐
            │       AHCS Core Platform          │
            ├───────────────────────────────────┤
            │  • Auth & Session Engine          │
            │  • Verification & Review Queue    │
            │  • Duplicate Account Matcher      │
            │  • Client ID & Card Minting       │
            │  • Cryptographic QR/NFC Router    │
            │  • Break-Glass Emergency Gateway  │
            │  • Patient Consent Manager        │
            │  • Health Record Vault            │
            │  • Provider Network Directory     │
            │  • Membership & Billing Engine    │
            │  • Immutable Audit Log Engine     │
            └───────────────────────────────────┘
                 │            │            │
                 ▼            ▼            ▼
          [PostgreSQL 16]  [Redis 7]  [Private S3]
```

---

## 4. Core Verification-to-Card Pipeline

```
Person
  │
  ▼
Create Account (Mobile OTP Verification)
  │
  ▼
Complete AHCS Profile (Address, Emergency Contacts, Blood Group)
  │
  ▼
Submit Identity Document (Encrypted Upload + Hash Fingerprint)
  │
  ▼
Duplicate Account Detection Engine (Exact & Fuzzy Scoring)
  │
  ▼
Verification Officer Review (Approve / Reject / Correction)
  │
  ▼
Permanent AHCS Client ID Issued (e.g., AHCS-IN-7F3K9Q2L)
  │
  ▼
AHCS Health Card Generated (Front & Back ISO/IEC 7810 ID-1)
  │
  ▼
Card Activation (Authenticated OTP / Activation Code)
  │
  ▼
Card ACTIVE (Operational via Cryptographic QR & NFC)
```

---

## 5. Security & Privacy Guarantees

1. **Zero Clinical Data on Physical Media**: Cards, QR codes, and NFC tags store strictly opaque cryptographic tokens—never medical records, diagnosis summaries, or passwords.
2. **Break-Glass Minimal Disclosure**: Emergency scans reveal only vital life-saving parameters (blood group, emergency contacts, critical allergies). All full medical records remain locked.
3. **Purpose-Limited Consent**: Providers receive explicit, time-bounded, revocable data access for specific purposes (e.g., consultation or lab review).
4. **Permanent Client Identifier**: The AHCS Client ID never changes upon mobile update, address change, subscription renewal, or card replacement.
