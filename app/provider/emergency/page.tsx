'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, AlertTriangle, Lock, CheckCircle2 } from 'lucide-react';

export default function ProviderEmergencyAccessPage() {
  const [clientId, setClientId] = useState('');
  const [reason, setReason] = useState('UNCONSCIOUS_TRAUMA');
  const [justification, setJustification] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Casualty Medical Officer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleBreakGlass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim() || !justification.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/v1/provider/patient-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientId.trim().toUpperCase(),
          providerId: 'PRV-EMERGENCY-TRIAGE',
          doctorName,
          isBreakGlassEmergency: true,
          auditReason: `${reason}: ${justification}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Emergency lookup rejected.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network communication failure with emergency gateway.');
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
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Clinical Break-Glass Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Emergency Triage Break-Glass Access
          </h1>
          <p className="text-xs text-slate-500">
            For critical trauma, unconscious patients, and acute resuscitation where standard consent OTP cannot be obtained.
          </p>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Mandatory Legal & Audit Disclosure:</strong> Break-glass access bypasses patient OTP verification under the emergency life-safety exemption of DPDP Act 2023. Every query is logged with your doctor identity, IP address, timestamp, and clinical justification. Unjustified break-glass queries constitute medical identity misconduct.
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <form onSubmit={handleBreakGlass} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient AHCS Client ID *</label>
                <input
                  type="text"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="e.g. AHCS-DEL-2025-0001"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono uppercase text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Clinical Presentation *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                >
                  <option value="UNCONSCIOUS_TRAUMA">Unconscious Trauma / GCS &lt; 8</option>
                  <option value="ACUTE_CARDIAC_ARREST">Cardiac Arrest / Acute Resuscitation</option>
                  <option value="SEVERE_ANAPHYLAXIS">Severe Anaphylaxis / Airway Compromise</option>
                  <option value="ACUTE_STROKE_PROTOCOL">Acute Stroke Protocol Window</option>
                  <option value="MASS_CASUALTY_TRIAGE">Mass Casualty Disaster Triage</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Justification Notes *</label>
                <input
                  type="text"
                  required
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="e.g. Brought by ambulance, unconscious, checking blood group and drug allergies"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-700/20 disabled:opacity-50"
            >
              {loading ? 'Validating Emergency Credentials...' : 'Execute Break-Glass Emergency Lookup'}
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div>
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">BREAK-GLASS UNLOCKED</span>
                  <div className="font-bold text-slate-900 text-base">{result.patient?.fullName || 'Emergency Patient'}</div>
                  <div className="text-xs font-mono text-slate-600">{result.patient?.clientId}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
                  LOGGED & MONITORED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Blood Group:</span>
                  <span className="font-bold text-slate-900 text-sm">O POSITIVE</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Primary Contact:</span>
                  <span className="font-bold text-slate-900 text-sm">+91 98765 43210 (Spouse)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
