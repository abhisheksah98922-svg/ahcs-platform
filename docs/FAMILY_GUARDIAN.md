# AHCS — Family & Guardian Module

## 1. Architectural Model
- **Independent Identity**: Every individual within AHCS (adult, minor, or senior dependent) receives an independent, unique Client ID (`AHCS-YYYY-IND-XXXXXX`) and individual encryption keys.
- **Zero Inferred Access**: Merely establishing a family connection does NOT grant clinical access to medical records by default.
- **Granular Permissions**:
  - `LIMITED_READ`: View demographic card and emergency contact information only.
  - `MEDICAL_RECORD`: View clinical summaries, lab reports, and medication schedules.
  - `APPOINTMENT_MANAGE`: Book, reschedule, and manage doctor appointments on behalf of the family member.
  - `FULL_ACCESS`: Full health record, prescription, and appointment management (typically granted by legal guardians for minors or elderly parents).

## 2. Guardian & Minor Controls
- Minors (under 18 years of age) are linked to a verified adult guardian during KYC verification.
- Guardians can book appointments, upload pediatric vaccination records, and view growth timeline charts.
- Upon reaching legal adulthood, accounts can independently decouple from guardian supervision.

## 3. Instant Revocation
- Either party may immediately revoke or modify granted family permissions at any time via `POST /api/v1/family/revoke`.
- All access requests by linked members generate audit log entries visible in the patient's Security Center.
