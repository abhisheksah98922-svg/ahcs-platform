# AHCS — Provider Partner Portal & Clinical RBAC

## 1. Overview
The AHCS Provider Partner Portal (`/provider/portal`) allows registered doctors, hospital administrators, lab technicians, and pharmacists to securely interact with the national AHCS health network under strict Role-Based Access Control (RBAC).

## 2. Staff Roles & Capabilities
- **DOCTOR**: Query patient records subject to consent, view scheduled OPD tokens, generate clinical consultation notes, and author e-prescriptions.
- **PROVIDER_ADMIN**: Manage institutional profiles, operational hours, verified departments, coordinate staff onboarding, and review facility claim histories.
- **LAB_TECHNICIAN**: Fulfill diagnostic test requisitions, record pathology observations, upload signed diagnostic PDFs, and trigger automatic health vault attachment.
- **PHARMACIST**: Dispense prescribed medications against authenticated Client IDs and record cold-chain verification.

## 3. Zero-Consent Privacy Wall
Doctors attempting to look up patient history via `POST /api/v1/provider/patient-lookup` are strictly barred from viewing clinical documents, allergies, and diagnoses unless the citizen has granted an active, unexpired consent grant for that facility.
