'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Legal & Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            AHCS Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: September 2026 • Compliant with Digital Personal Data Protection (DPDP) Act 2023 & Information Technology Act 2000
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8 text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              1. Our Core Privacy Commitment
            </h2>
            <p>
              AHCS (Advanced Health Care System, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides sovereign digital health identities and patient-directed clinical access. We believe that your health records belong solely to you. We do not sell, rent, commercialize, or monetize your health data under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-700" />
              2. Data We Collect & Process
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li><strong>Authentication Data:</strong> Mobile phone number and email address verified via cryptographic one-time passwords.</li>
              <li><strong>Demographics & Vitals:</strong> Full legal name, date of birth, gender, user-declared blood group, and emergency contact details.</li>
              <li><strong>Verification Proofs:</strong> Cryptographic SHA-256 hashes of government identity documents (Aadhaar, PAN, Voter ID, Passport) stored in private encrypted vaults.</li>
              <li><strong>Audit Telemetry:</strong> Immutable audit records of logins, document updates, QR scans, and consent grants including timestamps and masked IP addresses.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              3. Patient-Directed Consent Barrier
            </h2>
            <p>
              No healthcare provider, clinic, hospital, doctor, or corporate sponsor can access your clinical prescriptions, lab diagnostics, or doctor notes without your explicit, time-bounded consent. You maintain the right to revoke consent at any moment with instant effect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              4. Break-Glass Emergency QR Data Minimization
            </h2>
            <p>
              In life-threatening situations where a first responder scans your physical or digital health card, our emergency gateway applies strict data minimization: only life-critical parameters (blood group, critical allergies, emergency contact phone) are disclosed. Your full diagnosis records remain private and encrypted.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              5. Data Storage, Encryption & Security
            </h2>
            <p>
              All data in transit is encrypted using TLS 1.3. Identity documents and clinical records at rest are secured with AES-256 encryption. We utilize managed, isolated relational cloud infrastructure with continuous security telemetry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              6. Your Rights Under DPDP Act 2023
            </h2>
            <p>
              As a Data Principal under Indian law, you have the right to access your health data, request correction of inaccurate records, nominate emergency representatives, and request account deletion or data portability through our Data Protection Officer at <strong>privacy@ahcs.in</strong>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
