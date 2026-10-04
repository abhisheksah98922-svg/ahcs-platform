import React from 'react';
import Link from 'next/link';
import { 
  Pill, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Truck, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Partner Pharmacy Network | AHCS',
  description: 'Genuine prescription medicines, chronic refills, and partner network discounts with your AHCS Client ID.',
};

export default function PharmacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
              <Pill className="w-4 h-4" />
              <span>Verified Dispensing Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Partner Pharmacy Network & Prescription Benefits
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Present your AHCS Smart Card or Client ID at participating partner pharmacies for member discounts, batch-verified genuine medicines, and automated digital prescription fulfillment.
            </p>
          </div>
        </section>

        {/* Core pillars */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">100% Genuine Medicines</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All medications are sourced directly through licensed pharmaceutical distributors with strict cold-chain and expiration batch tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Instant Rx Verification</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Partner pharmacists can scan your AHCS QR to fetch and verify your doctor&apos;s digital prescription without paper hassles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Chronic Care Refill Alerts</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Automated reminders for blood pressure, cardiac, and thyroid maintenance medications so you never run out of critical doses.
              </p>
            </div>
          </div>

          {/* Member Concessions Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
              How Member Pharmacy Benefits Work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-blue-700 font-bold mb-1">Step 1: Consultation</div>
                <p className="text-slate-600 text-xs">Consult any doctor in the AHCS network. Your digital prescription is saved to your account.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-blue-700 font-bold mb-1">Step 2: Show Card / QR</div>
                <p className="text-slate-600 text-xs">Present your AHCS Smart Card at any partner chemist counter or upload the prescription in your portal.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-blue-700 font-bold mb-1">Step 3: Concession Applied</div>
                <p className="text-slate-600 text-xs">The partner pharmacy applies network discounts directly on the invoice before payment.</p>
              </div>
            </div>
          </div>

          {/* Regulatory & Safety notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              <strong>Drug Regulations Notice:</strong> In accordance with the Drugs and Cosmetics Act of India, Schedule H, H1, and X drugs will strictly NOT be dispensed without a valid, signed prescription from a registered medical practitioner. AHCS does not operate an online pharmacy directly and all medicine deliveries are executed by licensed retail chemists.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
