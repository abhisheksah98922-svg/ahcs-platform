import React from 'react';
import Link from 'next/link';
import { CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ProviderBenefitsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <Link href="/provider" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Provider Console</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Member Concessions & Benefit Rules
          </h1>
          <p className="text-xs text-slate-500">
            Standard negotiated discounts and concessions applicable to verified AHCS Smart Card holders.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Outpatient Consultation (OPD)</div>
            <p className="text-slate-600">15% discount on general and specialist consultations when card is presented.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Pathology & Radiology Investigations</div>
            <p className="text-slate-600">20% concession on routine blood tests, lipid profiles, and X-ray imaging.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 text-sm">Inpatient Non-Clinical Billing</div>
            <p className="text-slate-600">10% concession on admission room rent and standard nursing charges.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
