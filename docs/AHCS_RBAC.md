# AHCS — Role-Based Access Control (RBAC) Specification

## 1. System Roles

The platform defines 6 distinct roles with mutually exclusive or hierarchical privileges:

1. **`PATIENT`**: The primary member/consumer. Owns personal profile, emergency dataset, family links, and grants consent.
2. **`VERIFICATION_OFFICER`**: Dedicated back-office staff. Vets identity documents, examines duplicate detection flags, and approves/rejects card issuance.
3. **`DOCTOR`**: Verified healthcare practitioner. Can search patients with consent, view clinical history, and author consultation/prescriptions.
4. **`PROVIDER_ADMIN`**: Clinic or hospital network administrator. Manages clinic staff, operating hours, billing claims, and service catalog.
5. **`ADMIN`**: Operational platform manager. Oversees verification officer queues, reviews audit logs, manages subscription tiers and system settings.
6. **`SUPER_ADMIN`**: Infrastructure administrator. Manages staff credentials, cryptographic keys, system configurations, and high-level compliance exports.

---

## 2. Granular Permissions Matrix

| Permission Key | Description | `PATIENT` | `OFFICER` | `DOCTOR` | `PROV_ADMIN` | `ADMIN` | `SUPER_ADMIN` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `profile:read_self` | View own profile & health data | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `profile:update_self` | Edit personal & emergency contacts | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `document:upload_self` | Upload identity documents | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `document:review_queue` | View pending verification submissions | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `verification:decide` | Approve/reject/request correction | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `client_id:issue` | Trigger generation of permanent ID | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `card:activate_self` | Activate own generated health card | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `emergency:view_breakglass`| Scan QR & view emergency profile | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| `consent:manage_self` | Grant or revoke consent to providers | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `records:author_clinical` | Write consultation or prescription | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `records:view_consented` | View patient records with active consent | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `audit:view_system` | Query append-only audit trail | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `admin:manage_users` | Suspend or manage staff accounts | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
