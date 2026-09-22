# AHCS — Interoperability & HL7 / FHIR R4 Specification

## 1. Overview
AHCS natively maps and transforms internal clinical and demographic records to standard **HL7 FHIR Release 4 (R4)** resources to enable seamless integration with the Ayushman Bharat Digital Mission (ABDM), national health registries, and international EHR platforms.

## 2. Resource Mappings
- **Patient (`Patient`)**:
  - `identifier`: System `https://ahcs.gov.in/client-id`, Value: `AHCS-YYYY-IND-XXXXXX`
  - `name`: Given, family, and full text official names
  - `telecom`: Verified mobile and email
  - `address`: Line, city, state, postal code
- **Organization (`Organization`)**:
  - Facility classification (Hospital, Clinic, Diagnostic Lab, Pharmacy)
  - State Medical Council registration identifiers
  - Verified geographical coordinates (GIS latitude and longitude)
- **Encounter (`Encounter`)**:
  - Outpatient consultation, inpatient admission, or emergency trauma admission
  - Participant attending physician
  - Reason code and clinical diagnosis
- **Consent (`Consent`)**:
  - ABDM-aligned consent artifact mapping purpose, validity period, data categories, and custodian facility.
