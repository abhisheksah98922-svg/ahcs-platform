import React from 'react';
import Link from 'next/link';
import { Building2, FileCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Healthcare Partner Terms & Agreement | AHCS',
  description: 'Terms of participation and SLA standards for hospitals, clinics, diagnostic labs, and medical practitioners joining the AHCS network.',
};

export default function PartnerTermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-950 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Healthcare Partner Terms of Participation
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm">
              Standard operating agreement, verification warranties, and clinical ethics covenants for participating providers.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Statutory Licensure & Qualification Warranties</h2>
              <p className="text-slate-600">
                Participating providers warrant that all clinical personnel, medical establishments, and diagnostic facilities maintain active and unrevoked registrations under relevant state Clinical Establishments Acts, National Medical Commission (NMC) regulations, or Pharmacy Council guidelines. Any suspension or inquiry must be reported to AHCS within 24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Patient Consent & DPDP Compliance</h2>
              <p className="text-slate-600">
                Partner facilities agree that clinical health records vaulted on AHCS are accessible solely upon explicit digital patient consent. Partner doctors must not screenshot, download, or transfer patient health records outside the designated AHCS encounter terminal without clinical necessity.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Transparent Billing & Concession Commitments</h2>
              <p className="text-slate-600">
                Providers agree to honor verified AHCS member concessions without raising baseline rack rates or inflating diagnostic billing prior to discount application.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Independence of Medical Judgment</h2>
              <p className="text-slate-600">
                AHCS does not supervise or interfere in clinical diagnoses, surgical recommendations, or prescription choices. All medical liability remains exclusively with the licensed treating physician or hospital entity.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
