'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProviderMembersPage() {
  const [clientId, setClientId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/v1/provider/patient-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientId.trim().toUpperCase(),
          providerId: 'PRV-MANIPAL-101',
          doctorName: 'Attending Physician',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No registered member found');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network communication failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <Link href="/provider" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Provider Console</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Patient Identity & Credential Lookup
          </h1>
          <p className="text-xs text-slate-500">
            Verify member card validity and initiate consent-gated clinical encounters.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="text"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter Client ID (e.g. AHCS-DEL-2025-0001)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono uppercase text-slate-800"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Lookup Member'}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{result.patient?.fullName || 'Registered Patient'}</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  VERIFIED MEMBER
                </span>
              </div>
              <div className="text-slate-600 font-mono">Client ID: {result.patient?.clientId}</div>
              <div className="pt-2 border-t border-slate-200">
                <Link
                  href="/provider/portal"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold inline-block"
                >
                  Open Clinical Encounter Terminal →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
