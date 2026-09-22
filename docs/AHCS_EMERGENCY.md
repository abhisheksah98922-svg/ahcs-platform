# AHCS — Emergency Break-Glass Architecture

## 1. Objective & Philosophy

In life-threatening medical emergencies (unconscious patient, road traffic accident, trauma), paramedics and first responders require instantaneous access to vital information. 

However, medical privacy dictates that complete clinical histories (psychiatric evaluations, sexual health, routine doctor consultations) must not be broadcast to anyone who points a smartphone camera at an unattended card.

**AHCS solves this through the "Break-Glass Minimal Disclosure Protocol".**

---

## 2. Emergency Dataset (Minimal Necessary Disclosure)

When an emergency QR code is scanned or NFC tag is tapped by an unauthenticated first responder:

### Information Disclosed
* **Member Full Name**: Confirms patient identity.
* **AHCS Client ID**: Permanent unique reference for hospital admission.
* **Verified Blood Group**: Clearly badged with verification status (`VERIFIED BY LAB` vs `USER DECLARED`).
* **Emergency Contacts**:
  * Primary Contact (Name, Relationship, Click-to-Call Phone).
  * Secondary Contact (Name, Relationship, Phone).
* **Critical Medical Alerts (Explicitly Configured by Patient)**:
  * Severe Allergies (e.g., *Severe Anaphylaxis to Penicillin, Latex*).
  * Chronic High-Risk Conditions (e.g., *Type 1 Insulin-Dependent Diabetes, Epilepsy, Cardiac Pacemaker*).
  * Ongoing Anticoagulant Therapy (e.g., *Warfarin / Blood Thinners*).
* **Organ Donor Status**: Opt-in boolean flag.
* **Preferred Emergency Hospital**: Optional indication of patient's preferred hospital network.

### Information Strictly Withheld & Encrypted
* ❌ Full diagnostic PDFs, lab reports, and doctor clinical notes.
* ❌ Home residential address and government identification numbers.
* ❌ Payment history, family relationships, or insurance account numbers.

---

## 3. Break-Glass Logging & Notifications

Every emergency access event triggers an automated security cascade:
1. **Audit Record**: Logged to `audit_logs` with action `EMERGENCY_ACCESS_TRIGGERED`, scanner IP address, and browser headers.
2. **Patient Alert**: Immediate SMS & Email notification dispatched to patient: *"Emergency access was requested on your AHCS Card at [Time] from [IP/Location]."*
3. **Emergency Contact SMS**: Automated SMS dispatched to designated emergency contacts with a notification that emergency services have accessed the card profile.
