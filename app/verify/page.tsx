'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  QrCode, 
  CreditCard, 
  Lock, 
  Calendar, 
  User, 
  AlertCircle 
} from 'lucide-react';

export default function PublicVerifyPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/v1/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || 'Credential verification failed.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network communication failure. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Credential Verification</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Verify AHCS Smart Health Card
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Verify the authenticity and active status of an AHCS Client ID or Smart Card token issued by the Advanced Health Care System.
            </p>
          </div>
        </section>

        {/* Verification Form & Results Card */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enter AHCS Client ID or QR Verification Token
                </label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. AHCS-DEL-2025-0001 or scan token string"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Format: AHCS-[STATE]-[YEAR]-[ID] or 32-character emergency QR string
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Checking Cryptographic Registry...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Verify Credential Authenticity</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Verification Failed</div>
                  <div className="text-rose-700 mt-0.5">{error}</div>
                </div>
              </div>
            )}

            {/* Success / Result card */}
            {result && (
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    {result.valid ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Credential Status</div>
                      <div className="text-base font-bold text-slate-900">
                        {result.status === 'ACTIVE' ? 'Active & Cryptographically Verified' : result.status}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    result.valid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {result.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Client ID (Masked):</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{result.clientIdMasked}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Cardholder (Masked):</span>
                    <span className="font-bold text-slate-800 text-sm">{result.holderNameInitial}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Credential Form:</span>
                    <span className="font-bold text-slate-800">{result.cardType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Network Eligible:</span>
                    <span className="font-bold text-emerald-700">{result.networkEligible ? 'YES — ACTIVE' : 'NO'}</span>
                  </div>
                </div>

                {/* Privacy & Zero-leakage notice */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
                  <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed text-[11px]">
                    <strong>Strict Privacy Protection:</strong> In compliance with Indian healthcare privacy standards and DPDP Act 2023, public verification discloses only cryptographic issuance status. Personal medical history, blood group, diagnosis, and emergency contacts are never revealed on public lookup.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legal boundary statement */}
          <div className="mt-8 text-center text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            AHCS is a private healthcare network. The AHCS Smart Card is an internal platform credential and does not represent official government identification (such as Aadhaar, Voter ID, or Passport).
          </div>
        </div>
      </main>

    </div>
  );
}
