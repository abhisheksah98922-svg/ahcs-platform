# AHCS — Developer API Platform & Cryptographic Scopes

## 1. Overview
The AHCS Developer API platform allows authorized hospital Hospital Information Systems (HIS), electronic medical records (EMR) software, and pathology laboratory analyzers to interface with AHCS services via scoped API credentials.

## 2. Key Architecture & Security
- **Format**: `ahcs_live_<48_char_hex_token>`
- **Storage**: Raw keys are displayed only once upon creation. The server stores only the SHA-256 digest (`keyHash`), preventing key exposure even in the event of database compromise.
- **Key Prefix**: First 14 characters (`ahcs_live_xxxx`) are preserved for identification in audit logs and management consoles.

## 3. Scoped Permissions
- `patient.read`: Demographic and card status lookups.
- `records.read`: Clinical encounter and diagnosis history (requires active patient consent).
- `records.write`: Upload authorized clinical encounter notes.
- `appointment.read`: Query facility OPD token rosters.
- `appointment.write`: Book and reschedule appointments.
- `lab.write`: Upload diagnostic laboratory reports and auto-attach to patient vaults.

## 4. Endpoints
- `GET /api/v1/developer/keys`: Lists active developer API key prefixes and scopes.
- `POST /api/v1/developer/keys`: Generates a new cryptographically hashed API key with specified permission scopes.
