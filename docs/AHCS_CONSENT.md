# AHCS — Patient Consent Architecture

## 1. Consent Framework & Principles

AHCS treats clinical health records as strictly patient-owned property. A healthcare provider (clinic, doctor, hospital) cannot query a patient's historical records simply by typing their Client ID into a search box.

Every clinical access requires a valid, active, granular **Consent Record**.

---

## 2. Consent Attributes

Every consent instance records:
* **Grantor (`account_id`)**: The patient authorizing access.
* **Grantee (`provider_id` / `doctor_id`)**: The specific doctor or clinic facility.
* **Purpose**: Enumerated healthcare rationale:
  * `EMERGENCY`: Break-glass immediate trauma care.
  * `CONSULTATION`: Outpatient doctor consultation.
  * `LAB_REVIEW`: Diagnostic laboratory report evaluation.
  * `TREATMENT_PLAN`: Long-term disease management.
* **Data Scope**: Specific record types authorized (e.g. `['PRESCRIPTIONS', 'LAB_REPORTS']`, excluding psychiatric or sexual health records unless explicitly selected).
* **Validity Window**: Strict start timestamp and expiration timestamp (e.g., valid for 24 hours, 7 days, or 30 days).
* **Status**: `REQUESTED` -> `GRANTED` -> `ACTIVE` -> `EXPIRED` | `REVOKED` | `REJECTED`.

---

## 3. Consent Workflow & Revocation

```
1. Provider initiates Access Request with Purpose & Scope
                         │
                         ▼
2. Notification delivered to Patient Dashboard & SMS/Push
                         │
                         ▼
3. Patient evaluates request:
   - Accept (Sets status to ACTIVE with expiration)
   - Reject (Terminates request immediately)
                         │
                         ▼
4. During Active Window:
   - Doctor queries patient record through AHCS API
   - System confirms active consent in PostgreSQL & Redis
   - Access event appended to `audit_logs`
                         │
                         ▼
5. Immediate Revocation:
   - Patient clicks "Revoke Access" in Dashboard at any time
   - Status instantly set to REVOKED
   - Redis cache key cleared; subsequent doctor requests immediately 403 Forbidden
```
