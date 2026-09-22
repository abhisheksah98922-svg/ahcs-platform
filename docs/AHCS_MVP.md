# AHCS — Minimum Viable Product (MVP) Scope

## 1. MVP Purpose

The AHCS MVP delivers the complete, verified, end-to-end healthcare identity and card lifecycle. It proves the platform's core premise: taking a real person through mobile verification, profile completion, document submission, officer review, duplicate detection, permanent Client ID issuance, card generation, and secure emergency QR access.

---

## 2. In-Scope MVP Features (Phases 1–10)

| Module | Core Functionality Included in MVP |
| :--- | :--- |
| **Public Website** | Responsive home page, About, How it Works, Health Card overview, Privacy/Terms, FAQ. |
| **Authentication** | Mobile number entry, 6-digit OTP verification, rate limiting, and secure session management. |
| **Profile Management** | Full name, DOB, gender, address, emergency contact, blood group with source attribution badge. |
| **Document Submission** | Upload official ID document (Passport, Driving Licence, Voter ID, National ID), document hashing, secure storage. |
| **Duplicate Detection** | Hash-matching on document numbers and phones + fuzzy matching on name/DOB; generates duplicate warnings. |
| **Verification Officer Portal** | Queue of pending verification requests, document inspection, approval/rejection with structured notes. |
| **Client ID Generation** | Issuance of collision-free permanent `AHCS-IN-XXXXXXXX` identifier with ISO/IEC 7064 check digit. |
| **Card Generation** | Front & back rendering conforming to ISO/IEC 7810 ID-1 standard with member name, Client ID, and QR. |
| **Card Activation** | Activation challenge via authenticated dashboard / OTP transitioning card from `PENDING_ACTIVATION` to `ACTIVE`. |
| **Emergency QR Break-Glass** | Mobile-responsive view accessible via QR URL showing emergency contacts, verified blood group, and critical alerts. |
| **Audit Logging** | Append-only database logs recording registration, verification, card minting, activation, and emergency scans. |

---

## 3. Features Deferred to Post-MVP Phases

* **Phase 11**: Direct laboratory HL7/FHIR integration and DICOM imaging viewer.
* **Phase 14**: Complex multi-party consent delegations for legal guardianships.
* **Phase 15 & 16**: Enterprise third-party insurance automated claims settlement engine.
* **Phase 17**: Corporate employer HR bulk CSV onboarding and payroll integration.
* **Phase 9 Hardware**: Physical factory automated chip personalization hardware SDK (NFC token architecture is fully implemented in software).
