'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock, QrCode } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminEmergencyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Command</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Emergency Access & Break-Glass Audit
          </h1>
          <p className="text-xs text-slate-500">
            Supervise life-safety gateway scans, verify medical responder justification logs, and monitor SOS triggers.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Break-Glass Audit Stream</h3>
            <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
              LIVE MONITORING
            </span>
          </div>

          <div className="p-8 text-center text-xs text-slate-500">
            All emergency QR scans are cryptographically verified and matched against active card tokens in Neon PostgreSQL.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
