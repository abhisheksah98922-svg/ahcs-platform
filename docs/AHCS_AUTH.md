# AHCS — Authentication Architecture

## 1. Authentication Strategy

AHCS supports two primary user authentication vectors:
1. **Mobile Phone + OTP**: The primary vector in accordance with Indian and international mobile-first healthcare delivery.
2. **Google OAuth 2.0 / OpenID Connect**: Convenient federated login.

---

## 2. Mobile OTP Specification

```
User enters Mobile (+91 XXXXXXXXXX)
  │
  ▼
Rate Limit Check (Max 3 OTP requests per 15 min per IP/Mobile)
  │
  ▼
Generate 6-digit cryptographically random OTP (CSPRNG)
  │
  ▼
Hash OTP with Argon2id / SHA-256 + salt
Store hash in Redis: `otp:{purpose}:{mobile}` (TTL: 300 seconds)
  │
  ▼
Dispatch via SMS Gateway adapter (e.g., Twilio / AWS SNS / Fast2SMS)
  │
  ▼
User submits 6-digit code
  │
  ▼
Verify Attempt Count (Max 3 attempts, then lock & expire)
Compare constant-time HMAC hash
  │
  ▼
On Success: Invalidate OTP in Redis immediately
Mark `mobile_verified_at = NOW()`
Issue authenticated session
```

### Rate Limiting & Abuse Mitigations
* **Per-Mobile Cooldown**: 60 seconds before a resend is permitted.
* **Max Attempts**: 3 invalid code attempts triggers automatic OTP purge and a 15-minute freeze on that mobile identifier.
* **Per-IP Rate Limit**: Max 10 OTP requests per hour per IP.
* **Captcha/Turnstile**: Cloudflare Turnstile triggered if anomalous request velocity is detected.

---

## 3. Google OAuth & Account Linking Policy

1. User authenticates via Google OAuth 2.0 (redirect flow).
2. Server exchanges auth code for Google ID token, verifies signature and issuer (`https://accounts.google.com`).
3. Extract `google_sub` (unique identifier) and verified `email`.
4. **Account Lookup**:
   * If `google_sub` exists: Log in user directly.
   * If `email` matches an existing verified user: Prompt user to link account via secondary Mobile OTP challenge. **Never silently link unverified accounts.**
   * If user does not exist: Provision new `users` record with `auth_provider = GOOGLE`, set status `PENDING_VERIFICATION`, and require mobile number verification before profile completion.

---

## 4. Session Management

* **Session Token**: 256-bit cryptographically random token generated using Node.js `crypto.randomBytes(32)`.
* **Storage**:
  * Client: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` cookie.
  * Server: Session hash stored in Redis (with fallback to PostgreSQL `user_sessions`).
* **Session Lifetime**:
  * Idle timeout: 24 hours.
  * Absolute timeout: 14 days.
* **Revocation**:
  * Single session logout clears cookie and deletes Redis session key.
  * Global logout ("Log out of all devices") invalidates all session keys matching `user_id` and revokes tokens in `user_sessions`.
