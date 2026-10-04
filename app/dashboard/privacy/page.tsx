'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export default function DashboardPrivacyPage() {
  const [consents, setConsents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadConsents = async () => {
    try {
      const res = await fetch('/api/v1/consent');
      const data = await res.json();
      if (data.success) {
        setConsents(data.consents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsents();
  }, []);

  const handleRevoke = async (consentId: string) => {
    if (!confirm('Are you sure you want to REVOKE provider access immediately?')) return;
    try {
      const res = await fetch('/api/v1/consent/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Consent revoked successfully in real time.');
        await loadConsents();
      } else {
        setMessage(data.error || 'Failed to revoke consent.');
      }
    } catch (err) {
      setMessage('Network error revoking consent.');
    }
  };

  const activeConsents = consents.filter(c => c.status === 'GRANTED' && !c.revokedAt && new Date(c.expiresAt) > new Date());
  const pastConsents = consents.filter(c => c.status !== 'GRANTED' || c.revokedAt || new Date(c.expiresAt) <= new Date());

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div>
          <Link href="/dashboard" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Consent Governance & Data Rights
          </h1>
          <p className="text-xs text-slate-500">
            Control which clinics, hospitals, and doctors have active permission to review your vaulted medical records.
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Active Consents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Active Provider Permissions</h3>
              <p className="text-xs text-slate-500">Providers currently authorized to read your clinical records.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
              {activeConsents.length} ACTIVE
            </span>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs text-slate-400">Loading consent registry...</div>
          ) : activeConsents.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No healthcare providers currently have active access to your records.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeConsents.map((c, idx) => (
                <div key={c.id || idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{c.providerName || 'Participating Doctor / Clinic'}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Scope: <strong className="text-slate-700">{c.scope || 'CONSULTATION_RECORDS'}</strong> · Expires: {new Date(c.expiresAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(c.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition-all self-start sm:self-center"
                  >
                    Revoke Access Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DPDP Data Rights Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <span>Digital Personal Data Protection (DPDP) Rights</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Under India&apos;s DPDP Act 2023, you have the full right to export a complete copy of your vaulted clinical records or request permanent erasure of elective documents.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-xs">
            <Link
              href="/privacy-center"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all"
            >
              Read Data Governance Standards
            </Link>
            <Link
              href="/contact?category=GRIEVANCE_PRIVACY"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold transition-all"
            >
              Contact Grievance Officer
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}
