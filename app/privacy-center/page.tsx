import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, UserCheck, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy & Data Protection Center | AHCS',
  description: 'Understand how AHCS safeguards your sensitive health records in strict compliance with the Digital Personal Data Protection Act (DPDP Act 2023).',
};

export default function PrivacyCenterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <Lock className="w-4 h-4" />
              <span>DPDP Act 2023 Compliant Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Privacy, Consent & Data Governance Center
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              At AHCS, your health records are your personal property. We implement patient-directed consent, zero unauthorized third-party sharing, and bank-grade cryptographic vaulting.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Core Trust Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Granular Consent</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Doctors must request specific permissions (e.g. OPD consultation or lab test). You can revoke access immediately with one tap.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">AES-256 Vaulting</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Diagnostic reports, discharge summaries, and prescriptions are encrypted at rest using AES-256 and encrypted in transit via TLS 1.3.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Zero Data Brokering</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We do not sell, rent, or trade your personal health data to pharmaceutical companies, insurance underwriters, or advertisers.
              </p>
            </div>
          </div>

          {/* Data Principal Rights (DPDP Act) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-800 mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              Your Rights as a Data Principal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1">Right to Access Information</h4>
                <p className="text-slate-600 text-xs">
                  You have the right to receive a summary of all personal data held by AHCS, along with a full audit log of which doctors or providers have accessed your records.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1">Right to Correction & Erasure</h4>
                <p className="text-slate-600 text-xs">
                  You may update inaccurate contact information or request deletion of discretionary uploaded documents from your digital vault at any time.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1">Right to Revoke Consent</h4>
                <p className="text-slate-600 text-xs">
                  Any consent previously granted to a clinic, hospital, or caregiver can be revoked instantly from your dashboard, terminating their viewing access.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1">Right to Grievance Redressal</h4>
                <p className="text-slate-600 text-xs">
                  You have the right to register a formal grievance with our designated Data Protection Officer regarding the processing of your personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Grievance Officer details */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold">Designated Grievance Redressal Officer</h3>
              <div className="text-xs text-slate-300 mt-2 space-y-1">
                <div><strong>Name:</strong> Adv. S. Murthy (Legal & Data Protection Counsel)</div>
                <div><strong>Email:</strong> grievance@ahcs.in | privacy@ahcs.in</div>
                <div><strong>Address:</strong> Level 5, Technology Hub, Outer Ring Road, Bellandur, Bengaluru 560103</div>
                <div><strong>Statutory SLA:</strong> Acknowledgment within 24 hours; formal resolution within 7 working days.</div>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all shrink-0"
            >
              Contact Grievance Desk
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}
