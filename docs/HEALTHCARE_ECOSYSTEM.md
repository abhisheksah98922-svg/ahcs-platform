# AHCS — Healthcare Ecosystem & Geospatial Directory

## 1. Overview
The Advanced Health Care System (AHCS) provides a unified, verified healthcare directory and geospatial mapping interface across India. Every healthcare facility (Hospitals, Clinics, Diagnostic Laboratories, and 24x7 Pharmacies) is registered with accredited regulatory authorities (State Medical Councils, Pharmacy Council of India, NABH, NABL).

## 2. Provider Categories & Data Architecture
- **HOSPITAL**: Tertiary and secondary hospitals offering inpatient admissions, ICU care, and 24x7 trauma centers.
- **CLINIC**: Primary healthcare and specialist outpatient consultation centers.
- **LAB**: Accredited diagnostic centers performing clinical biochemistry, pathology, digital X-rays, and MRI/CT imaging.
- **PHARMACY**: Licensed retail and hospital-attached pharmacies with cold-chain insulin storage and first aid.
- **DOCTOR**: Registered medical practitioners (MBBS, MD, MS, DNB).

## 3. Geospatial Coordinates & Distance Calculation
- Every facility in the directory contains real geographic coordinates (`latitude`, `longitude`).
- Distance computation uses the spherical Haversine formula:
  \[
  d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)
  \]
  where \(R = 6371\text{ km}\).
- Facilities are filtered in real-time by category, city, radius (5 km to 100 km), and 24x7 emergency trauma status.

## 4. Permission-Safe Provider Profiles
- Public profiles display accredited council registration numbers, contact information, operational hours, verified departments, and attending physician schedules.
- Medical records and internal patient logs are strictly separated on the server side and never exposed via public directory endpoints.

## 5. Endpoints
- `GET /api/v1/providers`: Lists verified healthcare providers with category, emergency, and coordinate filters.
- `GET /api/v1/providers/[id]`: Returns detailed facility profiles, operational metrics, and physician rosters.
- `POST /api/v1/providers`: Allows healthcare institutions to submit accreditation credentials for verification officer adjudication.
