'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Lock, Stethoscope } from 'lucide-react';

export default function ProviderRecordsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <Link href="/provider" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Provider Console</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Consent-Directed Patient Records
          </h1>
          <p className="text-xs text-slate-500">
            Medical files, past prescriptions, and lab tests unlocked during active consultation sessions.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <Lock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Patient Consent Required</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            In compliance with Indian healthcare regulations, doctors can only review records after the patient verifies an in-session OTP or scans the consultation QR code.
          </p>
          <Link
            href="/provider/portal"
            className="px-5 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl inline-block mt-2"
          >
            Initiate Patient Lookup & Consent Request →
          </Link>
        </div>
      </main>

    </div>
  );
}
