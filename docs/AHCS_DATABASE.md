# AHCS — Database Architecture Specification

## 1. Database Principles
* **Engine**: PostgreSQL 16+
* **Integrity**: Enforced relational foreign keys (`ON DELETE RESTRICT` for financial and clinical records; `ON DELETE CASCADE` for temporary sessions and draft tokens).
* **Primary Keys**: UUIDv7 (time-ordered, collision-resistant, high B-Tree indexing efficiency).
* **Auditing**: Append-only `audit_logs` table capturing every state mutation, identity change, and document access.
* **Sensitive Field Encryption**: Client-side / application-level AES-256-GCM for critical identifiers prior to persistence.

---

## 2. Relational Schema Details

### 2.1 Identity & Authentication Tier
* **`users`**:
  * `id` (UUIDv7, PK)
  * `mobile_number` (VARCHAR(20), UNIQUE, NOT NULL)
  * `mobile_verified_at` (TIMESTAMPTZ, NULL)
  * `email` (VARCHAR(255), UNIQUE, NULL)
  * `email_verified_at` (TIMESTAMPTZ, NULL)
  * `password_hash` (VARCHAR(255), NULL)
  * `auth_provider` (ENUM: `MOBILE_OTP`, `GOOGLE`, `HYBRID`)
  * `google_sub` (VARCHAR(255), UNIQUE, NULL)
  * `role` (ENUM: `PATIENT`, `VERIFICATION_OFFICER`, `ADMIN`, `SUPER_ADMIN`, `PROVIDER_ADMIN`, `DOCTOR`)
  * `status` (ENUM: `PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `LOCKED`)
  * `created_at`, `updated_at` (TIMESTAMPTZ)

* **`user_sessions`**:
  * `id` (UUIDv7, PK)
  * `user_id` (UUIDv7, FK -> `users.id`, ON DELETE CASCADE)
  * `session_token_hash` (CHAR(64), UNIQUE, INDEX)
  * `ip_address` (INET)
  * `user_agent` (TEXT)
  * `expires_at` (TIMESTAMPTZ)
  * `revoked_at` (TIMESTAMPTZ, NULL)
  * `created_at` (TIMESTAMPTZ)

* **`otp_requests`**:
  * `id` (UUIDv7, PK)
  * `target` (VARCHAR(100), INDEX) — Mobile number or email
  * `target_type` (ENUM: `MOBILE`, `EMAIL`)
  * `code_hash` (CHAR(64)) — Argon2 or SHA-256 hash of 6-digit OTP
  * `purpose` (ENUM: `REGISTRATION`, `LOGIN`, `CARD_ACTIVATION`, `EMERGENCY_CONSENT`)
  * `attempts_count` (INT, DEFAULT 0)
  * `expires_at` (TIMESTAMPTZ)
  * `consumed_at` (TIMESTAMPTZ, NULL)
  * `created_at` (TIMESTAMPTZ)

---

### 2.2 Account & Profile Tier
* **`accounts`**:
  * `id` (UUIDv7, PK)
  * `user_id` (UUIDv7, FK -> `users.id`, UNIQUE)
  * `account_number` (VARCHAR(32), UNIQUE, INDEX)
  * `state` (ENUM: `REGISTERED`, `PROFILE_COMPLETED`, `VERIFICATION_PENDING`, `APPROVED_FOR_ID_GENERATION`, `CLIENT_ID_ACTIVE`, `SUSPENDED`)
  * `created_at`, `updated_at` (TIMESTAMPTZ)

* **`profiles`**:
  * `id` (UUIDv7, PK)
  * `account_id` (UUIDv7, FK -> `accounts.id`, UNIQUE)
  * `full_name` (VARCHAR(255), NOT NULL)
  * `date_of_birth` (DATE, NOT NULL)
  * `gender` (ENUM: `MALE`, `FEMALE`, `NON_BINARY`, `OTHER`, `PREFER_NOT_TO_SAY`)
  * `blood_group` (ENUM: `A_POS`, `A_NEG`, `B_POS`, `B_NEG`, `AB_POS`, `AB_NEG`, `O_POS`, `O_NEG`, `UNKNOWN`)
  * `blood_group_source` (ENUM: `USER_DECLARED`, `DOCUMENT_VERIFIED`, `LAB_VERIFIED`, `PROVIDER_VERIFIED`, `UNKNOWN`)
  * `address_line_1`, `address_line_2` (VARCHAR(255))
  * `district` (VARCHAR(100), NOT NULL)
  * `state_province` (VARCHAR(100), NOT NULL)
  * `pin_code` (VARCHAR(20), NOT NULL)
  * `country_code` (CHAR(2), DEFAULT 'IN')
  * `emergency_contact_name` (VARCHAR(255), NOT NULL)
  * `emergency_contact_phone` (VARCHAR(20), NOT NULL)
  * `emergency_contact_relation` (VARCHAR(50), NOT NULL)
  * `created_at`, `updated_at` (TIMESTAMPTZ)

---

### 2.3 Identity Verification Tier
* **`verification_requests`**:
  * `id` (UUIDv7, PK)
  * `account_id` (UUIDv7, FK -> `accounts.id`)
  * `status` (ENUM: `DRAFT`, `SUBMITTED`, `PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `EXPIRED`, `RE_VERIFICATION_REQUIRED`)
  * `assigned_officer_id` (UUIDv7, FK -> `users.id`, NULL)
  * `duplicate_check_result` (ENUM: `NO_MATCH`, `POSSIBLE_DUPLICATE`, `CONFIRMED_DUPLICATE`)
  * `duplicate_match_details` (JSONB)
  * `review_notes` (TEXT)
  * `reviewed_at` (TIMESTAMPTZ)
  * `created_at`, `updated_at` (TIMESTAMPTZ)

* **`verification_documents`**:
  * `id` (UUIDv7, PK)
  * `verification_request_id` (UUIDv7, FK -> `verification_requests.id`)
  * `document_type` (ENUM: `AADHAAR`, `PASSPORT`, `DRIVING_LICENSE`, `VOTER_ID`, `PAN`, `OTHER_OFFICIAL`)
  * `document_number_hash` (CHAR(64), INDEX)
  * `document_number_masked` (VARCHAR(32))
  * `s3_object_key` (VARCHAR(512), NOT NULL)
  * `file_mime_type` (VARCHAR(64))
  * `file_size_bytes` (INT)
  * `issued_by` (VARCHAR(100))
  * `issue_date` (DATE)
  * `expiry_date` (DATE, NULL)
  * `status` (ENUM: `PENDING`, `VERIFIED`, `REJECTED`, `RE_UPLOAD_REQUIRED`)
  * `verification_notes` (TEXT)
  * `verified_by` (UUIDv7, FK -> `users.id`, NULL)
  * `verified_at` (TIMESTAMPTZ, NULL)
  * `created_at` (TIMESTAMPTZ)

---

### 2.4 Client ID & Health Card Tier
* **`client_ids`**:
  * `id` (UUIDv7, PK)
  * `account_id` (UUIDv7, FK -> `accounts.id`, UNIQUE)
  * `client_id` (VARCHAR(32), UNIQUE, INDEX) — e.g., `AHCS-IN-7F3K9Q2L`
  * `checksum` (CHAR(2))
  * `issued_at` (TIMESTAMPTZ)
  * `is_active` (BOOLEAN, DEFAULT TRUE)

* **`cards`**:
  * `id` (UUIDv7, PK)
  * `client_id_fk` (UUIDv7, FK -> `client_ids.id`)
  * `card_number` (VARCHAR(32), UNIQUE, INDEX)
  * `version` (INT, DEFAULT 1)
  * `status` (ENUM: `GENERATED`, `PENDING_ACTIVATION`, `ACTIVE`, `SUSPENDED`, `LOST`, `STOLEN`, `EXPIRED`, `REVOKED`, `REPLACEMENT_REQUESTED`, `REPLACED`)
  * `activation_code_hash` (VARCHAR(255))
  * `activated_at` (TIMESTAMPTZ, NULL)
  * `activated_by_user_id` (UUIDv7, FK -> `users.id`, NULL)
  * `expires_at` (DATE)
  * `created_at`, `updated_at` (TIMESTAMPTZ)

* **`qr_tokens` & `nfc_tokens`**:
  * `id` (UUIDv7, PK)
  * `card_id` (UUIDv7, FK -> `cards.id`)
  * `token` (VARCHAR(64), UNIQUE, INDEX)
  * `token_type` (ENUM: `EMERGENCY_QR`, `PORTAL_ACCESS_NFC`)
  * `is_revoked` (BOOLEAN, DEFAULT FALSE)
  * `scan_count` (BIGINT, DEFAULT 0)
  * `last_scanned_at` (TIMESTAMPTZ)
  * `created_at`, `expires_at` (TIMESTAMPTZ)

---

### 2.5 Clinical, Emergency & Consent Tier
* **`emergency_profiles`**:
  * `id` (UUIDv7, PK)
  * `account_id` (UUIDv7, FK -> `accounts.id`, UNIQUE)
  * `is_active` (BOOLEAN, DEFAULT TRUE)
  * `allergies` (TEXT[])
  * `critical_conditions` (TEXT[])
  * `current_medications` (TEXT[])
  * `organ_donor` (BOOLEAN, DEFAULT FALSE)
  * `preferred_hospital` (VARCHAR(255))
  * `updated_at` (TIMESTAMPTZ)

* **`medical_records`**:
  * `id` (UUIDv7, PK)
  * `account_id` (UUIDv7, FK -> `accounts.id`, INDEX)
  * `provider_id` (UUIDv7, FK -> `providers.id`, NULL)
  * `record_type` (ENUM: `CONSULTATION`, `PRESCRIPTION`, `LAB_REPORT`, `DIAGNOSTIC_REPORT`, `IMAGING`, `DISCHARGE_SUMMARY`, `VACCINATION`, `UPLOADED_DOCUMENT`)
  * `title` (VARCHAR(255))
  * `clinical_summary` (TEXT)
  * `s3_object_key` (VARCHAR(512), NULL)
  * `source` (ENUM: `DOCTOR_AUTHORED`, `LAB_INTEGRATED`, `PATIENT_UPLOADED`)
  * `status` (ENUM: `DRAFT`, `FINAL`, `AMENDED`, `ARCHIVED`)
  * `created_at`, `updated_at` (TIMESTAMPTZ)

* **`consents`**:
  * `id` (UUIDv7, PK)
  * `account_id` (UUIDv7, FK -> `accounts.id`, INDEX)
  * `provider_id` (UUIDv7, FK -> `providers.id`)
  * `purpose` (ENUM: `EMERGENCY`, `CONSULTATION`, `LAB_REVIEW`, `TREATMENT_PLAN`)
  * `data_scope` (TEXT[])
  * `status` (ENUM: `REQUESTED`, `GRANTED`, `ACTIVE`, `EXPIRED`, `REVOKED`, `REJECTED`)
  * `valid_from`, `expires_at`, `revoked_at` (TIMESTAMPTZ)

---

### 2.6 Audit Logging
* **`audit_logs`**:
  * `id` (UUIDv7, PK)
  * `actor_id` (UUIDv7, NULL)
  * `actor_role` (VARCHAR(50))
  * `action` (VARCHAR(100), INDEX)
  * `target_resource` (VARCHAR(100))
  * `target_id` (UUIDv7, NULL)
  * `ip_address` (INET)
  * `user_agent` (TEXT)
  * `metadata` (JSONB)
  * `created_at` (TIMESTAMPTZ, DEFAULT NOW())
