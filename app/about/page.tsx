import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Lock, 
  Users, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';

export const metadata = {
  title: 'About AHCS | Private Healthcare Access & Assistance Network',
  description: 'Learn about AHCS mission, core values, technological architecture, and our strict boundaries as a private healthcare access platform.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent Healthcare Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Building Trust and Seamless Access in Indian Healthcare
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              AHCS was founded to solve a pervasive problem: fragmented health records, paper-heavy hospital admissions, and critical information gaps during medical emergencies.
            </p>
          </div>
        </section>

        {/* Identity Boundary Banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 text-center">
              Our Core Identity & Regulatory Demarcation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What AHCS IS */}
              <div className="p-5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>WHAT AHCS IS:</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-950">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Private Healthcare Access Network:</strong> Connecting verified members with participating healthcare providers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Private Health Identity:</strong> Generating unique AHCS Client IDs and cryptographically secure Smart Health Cards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Emergency Break-Glass Gateway:</strong> Providing instant, life-saving critical allergy and contact access during trauma.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Encrypted Record Vault:</strong> Patient-directed digital health records with granular, revocable consent controls.</span>
                  </li>
                </ul>
              </div>

              {/* What AHCS IS NOT */}
              <div className="p-5 bg-rose-50/60 rounded-xl border border-rose-200">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-sm mb-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>WHAT AHCS IS NOT:</span>
                </div>
                <ul className="space-y-2 text-xs text-rose-950">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>NOT a Government Entity:</strong> Not affiliated with UIDAI (Aadhaar), NHA, ABHA, or Ayushman Bharat.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>NOT an Insurance Company:</strong> AHCS does not underwrite risk, sell insurance policies, or provide cash indemnity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>NOT a Hospital or Clinical Provider:</strong> AHCS does not independently practice medicine; clinical care is delivered exclusively by licensed providers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>NOT a Hospital Management System:</strong> AHCS operates as an interoperable access layer, not proprietary hospital ERP software.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars of Engineering & Ethics */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              The Principles That Guide Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              How we protect patient autonomy, institutional integrity, and digital trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Zero Data Monetization</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We will never sell patient health data, diagnostic histories, or clinical records to advertisers, pharmaceutical marketers, or data brokers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Absolute Reality First</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No simulated data, no fake hospital affiliations, no fake reviews, and no overstated medical promises. Every provider on AHCS is verified against official state licensing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Patient-Directed Consent</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your medical data is vaulted and encrypted. Doctors and hospitals can only view what you explicitly authorize through temporary cryptographic sessions.
              </p>
            </div>
          </div>

          {/* Contact Strip */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Have Questions About AHCS?</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Reach out to our compliance, partner relations, or member assistance teams.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md"
              >
                Contact Support
              </Link>
              <Link
                href="/privacy-center"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition-all"
              >
                Privacy Center
              </Link>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
