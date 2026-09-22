'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  AlertTriangle, 
  Phone, 
  ShieldAlert, 
  Heart, 
  Droplet, 
  UserCheck, 
  Lock, 
  Clock,
  ShieldCheck,
  Building2,
  XCircle
} from 'lucide-react';

interface EmergencyData {
  patientName: string;
  clientId: string;
  cardNumber: string;
  bloodGroup: string;
  bloodGroupSource: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relation: string;
  }>;
  criticalAlerts: {
    allergies: string[];
    criticalConditions: string[];
    currentMedications: string[];
    organDonor: boolean;
    preferredHospital: string | null;
  };
  cardStatus: string;
  timestamp: string;
}

export default function EmergencyScanPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function resolveToken() {
      if (!token) return;
      try {
        const res = await fetch(`/api/v1/emergency/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to resolve emergency token');
          setLoading(false);
          return;
        }

        setEmergencyData(data.emergencyData);
      } catch (err) {
        setError('Network error connecting to AHCS emergency gateway');
      } finally {
        setLoading(false);
      }
    }

    resolveToken();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs text-red-200 font-mono">Resolving Break-Glass Emergency Token...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-red-600/50 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 bg-red-950 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-white">Emergency Lookup Denied</h1>
          <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5">
            {error}
          </p>
          <div className="text-[11px] text-slate-500">
            National Emergency Services: <strong>Call 112</strong>
          </div>
        </div>
      </div>
    );
  }

  if (!emergencyData) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Urgent Emergency Header Banner */}
        <div className="bg-red-600 rounded-3xl p-6 shadow-xl border border-red-500 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 bg-black/30 rounded-full text-[10px] font-bold tracking-widest uppercase mb-1">
              Break-Glass Emergency Protocol
            </div>
            <h1 className="text-xl font-black tracking-tight text-white leading-tight">
              Emergency Medical Dataset
            </h1>
            <p className="text-xs text-red-100 mt-0.5">
              Live token resolution from AHCS database. Minimum necessary dataset disclosed. Full clinical records are strictly withheld.
            </p>
          </div>
        </div>

        {/* National 112 Emergency Notice & Clarification */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5 text-amber-300">
              <span>National Emergency Response: Dial 112</span>
            </span>
            <a
              href="tel:112"
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs tracking-wide transition-colors"
            >
              Call 112
            </a>
          </div>
          <p className="text-[11px] text-amber-300/80 leading-relaxed">
            Important Notice: <strong>112</strong> is India&apos;s National Emergency Support Helpline operated by government authorities. AHCS provides cryptographic identity and emergency medical data resolution only; AHCS does not operate an emergency response or ambulance dispatch service.
          </p>
        </div>

        {/* Patient Identity & Verified Blood Group */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Patient Full Name</div>
              <div className="text-2xl font-black text-white mt-0.5">{emergencyData.patientName}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono text-cyan-300 font-bold bg-white/10 px-2 py-0.5 rounded">{emergencyData.clientId}</span>
                <span className="text-[10px] bg-teal-900/80 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/40 font-semibold">
                  AHCS VERIFIED
                </span>
              </div>
            </div>

            {/* Blood Group Badge */}
            <div className="text-center bg-red-950/80 border border-red-600/50 px-4 py-3 rounded-2xl shrink-0">
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                <Droplet className="w-3.5 h-3.5 fill-red-400" />
                <span>Blood Group</span>
              </div>
              <div className="text-2xl font-black text-white mt-0.5">{emergencyData.bloodGroup}</div>
              <div className="text-[9px] text-teal-400 font-bold tracking-wider uppercase mt-0.5">
                {emergencyData.bloodGroupSource}
              </div>
            </div>
          </div>
        </div>

        {/* One-Tap Emergency Contacts */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>Emergency Contacts</span>
            </h2>
            <span className="text-[10px] text-slate-400">Tap to Call Directly</span>
          </div>

          <div className="space-y-2.5">
            {emergencyData.emergencyContacts.map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.phone}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-white">{contact.name}</div>
                  <div className="text-xs text-slate-400">{contact.relation} (Primary Emergency Contact)</div>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-sm">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{contact.phone}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Critical Alerts & Allergies */}
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Critical Medical Alerts</span>
            </h2>
            <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
              LIFE-SAVING DATA
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-400 font-medium mb-1.5">Known Allergies:</div>
              <div className="flex flex-wrap gap-2">
                {emergencyData.criticalAlerts.allergies.map((allergy, idx) => (
                  <span key={idx} className="bg-red-950/80 text-red-200 border border-red-500/40 px-3 py-1 rounded-xl font-semibold">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            {emergencyData.criticalAlerts.criticalConditions.length > 0 && (
              <div>
                <div className="text-slate-400 font-medium mb-1.5">Chronic High-Risk Conditions:</div>
                <div className="flex flex-wrap gap-2">
                  {emergencyData.criticalAlerts.criticalConditions.map((cond, idx) => (
                    <span key={idx} className="bg-amber-950/80 text-amber-200 border border-amber-500/40 px-3 py-1 rounded-xl font-semibold">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Organ Donor:</span>
              </span>
              <span className="font-bold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                {emergencyData.criticalAlerts.organDonor ? 'YES (REGISTERED)' : 'NO DIRECTIVE RECORDED'}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy & Audit Footer */}
        <div className="bg-slate-950/80 rounded-3xl p-5 border border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Immutable Audit Log Protected</span>
          </div>
          <p className="leading-relaxed">
            This emergency access event has been permanently recorded in the AHCS audit ledger with timestamp {emergencyData.timestamp}. Clinical consultation notes and diagnostic PDFs are protected by patient consent.
          </p>
        </div>
      </div>
    </div>
  );
}
