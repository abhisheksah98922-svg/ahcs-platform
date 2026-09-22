# AHCS — Health Card Specification

## 1. Physical Specifications (ISO/IEC 7810 ID-1)

The physical AHCS Health Card strictly adheres to international standard dimensions used for banking and identity credentials:
* **Width**: 85.60 mm (3.370 inches)
* **Height**: 53.98 mm (2.125 inches)
* **Thickness**: 0.76 mm (0.030 inches)
* **Corner Radius**: 3.18 mm

---

## 2. Card Visual Layout & Content

### 2.1 Front Face
* **AHCS Brand Header**: Logo + "Advanced Health Care System" typography.
* **Member Name**: Legal cardholder name (as verified by official document).
* **Permanent AHCS Client ID**: e.g., `AHCS-IN-7F3K9Q2L` (embossed or high-contrast sans-serif font).
* **Card Reference Number**: Distinct operational identifier (e.g., `CRD-1029-4820-9182`).
* **Validity Period**: `VALID THRU: 12/2030`.
* **Dynamic QR Code**: Cryptographically sealed lookup URL.
* **NFC Contactless Wave Symbol**: Indicator of embedded ISO/IEC 14443 contactless chip.

### 2.2 Back Face
* **Emergency Break-Glass Instructions**: *"In medical emergency, scan QR or tap NFC for critical blood group, emergency contacts, and vital medical alerts."*
* **Emergency Helpline / Support**: Direct contact numbers (`1800-XXX-XXXX`) and official portal URL (`https://ahcs.in/support`).
* **Security & Privacy Disclaimer**: *"Strictly private healthcare card. Client ID does not represent government identification. Clinical records are securely encrypted on AHCS servers and never stored on this card."*

### Prohibited On Card Face
* ❌ Full medical history or diagnostic summaries.
* ❌ Passwords, PINs, or raw API keys.
* ❌ Aadhaar or government identification numbers.
* ❌ Full residential address.

---

## 3. Card Lifecycle State Machine

```
   ┌───────────┐
   │ GENERATED │ (Card minted by system upon profile approval)
   └─────┬─────┘
         │ User activation challenge (OTP / Activation Code)
         ▼
   ┌──────────┐
   │  ACTIVE  │ (In daily operational use)
   └─────┬────┘
         ├────────────────────────┬─────────────────────────┐
         │ User reports Lost      │ Suspicious activity     │ Card reaches expiry
         ▼                        ▼                         ▼
    ┌──────────┐            ┌───────────┐             ┌─────────┐
    │   LOST   │            │ SUSPENDED │             │ EXPIRED │
    └────┬─────┘            └─────┬─────┘             └─────────┘
         │ Replacement requested  │ Re-activated / Revoked
         ▼                        ▼
   ┌─────────────┐          ┌─────────┐
   │   REPLACED  │          │ REVOKED │
   └─────────────┘          └─────────┘
```

---

## 4. Card Activation Flow

When a physical or digital card is minted, it is created with status `PENDING_ACTIVATION`.
1. User receives physical card or views digital card preview in portal.
2. User enters the 6-digit Card Activation Code (or completes Mobile OTP challenge).
3. System confirms session authenticity and updates status to `ACTIVE`.
4. Event recorded in `audit_logs` and `card_events` with timestamp, user ID, and IP address.
