# AHCS — Business & Technical Decisions Log

This document tracks unresolved policy questions and architectural decisions. Items requiring explicit organizational confirmation are marked with `BUSINESS DECISION REQUIRED`.

---

## 1. Unresolved Business Decisions

### 1.1 Acceptance of Standalone PAN Card for Health Card Issuance
* **Status**: `BUSINESS DECISION REQUIRED`
* **Context**: In India, PAN cards lack address and date-of-birth verification rigor compared to Passports, Voter IDs, or Driving Licences.
* **Options**:
  1. Accept PAN only for billing/tax invoices, but require an official photo ID (Passport / DL / Voter ID) for AHCS Health Card issuance. (Recommended)
  2. Accept PAN as an identity document with mandatory secondary utility bill for address verification.

### 1.2 Card Issuance & Shipping Pricing Model
* **Status**: `BUSINESS DECISION REQUIRED`
* **Context**: Physical card production with ISO/IEC 7810 PVC printing and embedded NFC chip incurs manufacturing and courier costs.
* **Options**:
  1. Free digital card included; nominal physical card issuance fee (e.g. ₹199 / $9.99).
  2. Physical card bundled into premium membership subscription tiers.

### 1.3 Emergency Break-Glass Automated Notifications
* **Status**: `BUSINESS DECISION REQUIRED`
* **Context**: When a bystander or paramedic scans the emergency QR code, should the system automatically send an SMS with approximate GPS coordinates to the patient's emergency contacts?
* **Recommendation**: Yes, opt-in with high-visibility privacy disclaimer on registration.

### 1.4 Healthcare Benefit Co-Payment Limits
* **Status**: `BUSINESS DECISION REQUIRED`
* **Context**: For members visiting partner clinics, how are discounts or covered benefits settled with clinics?
* **Options**:
  1. Direct discount at counter (e.g. 20% off consultation) paid by member without AHCS cash settlement.
  2. Cashless claim model where AHCS reimburses partner clinic monthly based on electronic claim vouchers.

---

## 2. Technical Decisions Adopted

* **Client ID Format**: `AHCS-IN-XXXXXXXX` using Crockford Base32 + Mod 37 check character to eliminate transcription errors.
* **Card Dimensions**: ISO/IEC 7810 ID-1 standard ($85.60\text{ mm} \times 53.98\text{ mm}$).
* **QR Payload**: Pure random 256-bit token; zero clinical records or patient identifiers embedded in the QR image.
* **Database Primary Keys**: UUIDv7 (combines 48-bit millisecond timestamp with 74 bits of cryptographically strong randomness).
