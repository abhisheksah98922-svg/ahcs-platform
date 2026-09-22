# AHCS — Security & Cryptographic Architecture

## 1. Threat Model & Mitigations (OWASP Top 10)

| Attack Vector | Threat Description | AHCS Mitigation Architecture |
| :--- | :--- | :--- |
| **SQL Injection (SQLi)** | Malicious SQL inputs in search or filters | All database interactions run via Prisma ORM parameterized prepared statements; zero raw concatenated SQL queries. |
| **Broken Access Control (IDOR)** | Attacker replaces account or record UUID in API calls | Strict server-side authorization checks verifying account ownership or active consent grants on every route handler. |
| **Cryptographic Failures** | Sensitive health records or document scans exposed in transit or at rest | TLS 1.3 in transit; AES-256-GCM field-level encryption for document numbers; encrypted S3 buckets with pre-signed ephemeral URLs (60s TTL). |
| **Brute Force & OTP Abuse** | Automated scripts guessing 6-digit OTPs | Redis-backed distributed rate limiting (max 3 attempts per OTP; 60s cooldown; IP velocity limits; Turnstile challenge). |
| **Session Hijacking / Theft** | Cross-Site Scripting (XSS) extracting tokens | Opaque session tokens stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies; strict Content Security Policy (CSP). |
| **Privilege Escalation** | Patient elevating permissions to Officer or Admin | Granular RBAC middleware evaluated server-side against database role claims on every protected API endpoint. |
| **File Upload Vulnerabilities** | Executable malware uploaded disguised as identity cards | Magic-byte MIME type validation (disallowing file extensions alone); 10MB file size ceiling; files quarantined in private S3 bucket without public execution rights. |

---

## 2. Cryptographic Algorithms

* **Data Encryption at Rest**: `AES-256-GCM` with distinct 96-bit initialization vectors (IV) per record.
* **Sensitive Hashes (Duplicate Detection)**: `HMAC-SHA256` salted with environment-level pepper to index document numbers and phones without storing raw plaintext.
* **Session Tokens & QR Tokens**: CSPRNG via `crypto.randomBytes(32)` (256-bit entropy).
* **Client ID Checksum**: ISO/IEC 7064 Mod 37,36 or Damm check digit.

---

## 3. Defense-in-Depth Network Topology

* **WAF Layer**: Cloudflare WAF filtering malicious SQL/XSS payloads and DDoS traffic.
* **API Gateway**: Nginx / Fastify reverse proxy enforcing rate limits, CORS policies, and request body size caps.
* **Database Isolation**: PostgreSQL instance isolated in a private subnet; inaccessible from the public internet; accessible only via VPC internal connections.
* **Principle of Least Privilege**: Verification officers cannot browse the global patient database; they only pull assigned tickets from the review queue.
