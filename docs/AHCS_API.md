# AHCS — REST API Specifications

## 1. Standards & Conventions

* **Base URL**: `/api/v1`
* **Transport**: HTTPS with TLS 1.3 enforced.
* **Content-Type**: `application/json` (except `multipart/form-data` for document uploads).
* **Authentication**: Cookie session header or `Authorization: Bearer <token>` for programmatic API clients.
* **Standard Response Envelope**:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2026-09-21T16:20:00.000Z"
}
```

---

## 2. Core API Endpoints

### 2.1 Authentication & Profile
* `POST /api/v1/auth/otp/send`: Initiate mobile OTP request.
* `POST /api/v1/auth/otp/verify`: Validate code and issue authenticated session cookie.
* `POST /api/v1/auth/logout`: Revoke active session.
* `GET /api/v1/me`: Retrieve currently authenticated user context and profile status.
* `POST /api/v1/profile`: Complete personal demographic details and emergency contacts.

### 2.2 Verification Engine
* `POST /api/v1/verification/documents`: Upload identity document (MIME validated, S3 encrypted).
* `POST /api/v1/verification/submit`: Transition request from `DRAFT` to `SUBMITTED`.
* `GET /api/v1/officer/verification/queue`: Fetch assigned pending verification requests (Verification Officer only).
* `POST /api/v1/officer/verification/:id/decision`: Approve, reject, or request correction on a verification ticket.

### 2.3 Client ID & Health Card
* `POST /api/v1/cards/activate`: Submit 6-digit activation code to transition card to `ACTIVE`.
* `GET /api/v1/cards/current`: Retrieve active physical/digital card metadata and front/back assets.
* `POST /api/v1/cards/replace`: Request replacement for lost/stolen card (revokes old QR/NFC tokens).

### 2.4 Emergency & Public Access
* `GET /api/v1/emergency/:token`: Public break-glass endpoint resolving dynamic QR/NFC token to minimal emergency dataset.
* `GET /api/v1/providers/search`: Search verified clinics/hospitals by radius, coordinates, and specialty.

### 2.5 Consent & Records
* `POST /api/v1/consent/request`: Healthcare provider requests access to patient records.
* `POST /api/v1/consent/:id/grant`: Patient approves consent with expiration and scope.
* `POST /api/v1/consent/:id/revoke`: Patient immediately terminates access.
