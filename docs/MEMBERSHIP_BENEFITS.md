# AHCS — Membership & Benefits Engine

## 1. Overview
The AHCS Benefits Engine provides deterministic, rule-based cost-sharing and discount calculations across all network healthcare providers. It strictly rejects deceptive claims such as "100% free treatment without conditions", substituting clear, transparent copayments, network discounts, and subsidy rules.

## 2. Benefit Rule Structure
Every benefit rule is defined by:
- `serviceCategory`: `OPD_CONSULTATION`, `DIAGNOSTIC_TEST`, `PHARMACY`, `INPATIENT_SURGERY`, `EMERGENCY_CARE`
- `discountPercentage`: e.g. 15% to 30% reduction on gross bill
- `maxCap`: Maximum allowable financial discount per clinical transaction
- `copayPercentage`: Mandated patient out-of-pocket responsibility
- `preAuthRequired`: Boolean requiring medical officer pre-authorization for high-value surgical procedures

## 3. Calculation Formula
```typescript
discount = Math.min(grossAmount * (discountPercentage / 100), maxCap);
copayAmount = (grossAmount - discount) * (copayPercentage / 100);
netPayable = grossAmount - discount;
```

## 4. API Endpoints
- `POST /api/v1/benefits/calculate`: Computes net payable amounts, active benefit rules applied, and itemized copay splits in real-time before patient payment or claim submission.
