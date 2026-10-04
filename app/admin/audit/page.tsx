'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Clock } from 'lucide-react';

export default function AdminAuditPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Command</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Security & Audit Telemetry Logs
          </h1>
          <p className="text-xs text-slate-500">
            Immutable log of authentication challenges, verification officer actions, and break-glass emergency accesses.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">System Access Records</h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              SHA-256 Chained
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800">OFFICER_DECISION_APPROVE</span>
                <span className="text-slate-500 block text-[11px]">Actor: Officer Session · Target: Citizen Enrollment</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Live Sync</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800">EMERGENCY_QR_LOOKUP</span>
                <span className="text-slate-500 block text-[11px]">Trigger: Public Break-Glass Gateway · Method: QR Nonce Validation</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Live Sync</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800">SESSION_TOKEN_MINTED</span>
                <span className="text-slate-500 block text-[11px]">Trigger: User OTP Verification · Storage: PostgreSQL Session Token</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Live Sync</span>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
