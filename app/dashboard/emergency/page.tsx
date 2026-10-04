'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  HeartPulse, 
  Save, 
  Plus, 
  Trash2,
  ExternalLink,
  QrCode
} from 'lucide-react';

export default function DashboardEmergencyPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [allergies, setAllergies] = useState<string>('Penicillin, Sulfa drugs');
  const [conditions, setConditions] = useState<string>('Hypertension, Diabetic Type 2');
  const [medications, setMedications] = useState<string>('Metformin 500mg, Telmisartan 40mg');
  const [preferredHospital, setPreferredHospital] = useState<string>('Manipal Hospital, Old Airport Road');
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState<string>('SPOUSE');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setUserData(data);
        if (data.profile) {
          setEmergencyContactName(data.profile.emergencyContactName || '');
          setEmergencyContactPhone(data.profile.emergencyContactPhone || '');
          setEmergencyContactRelation(data.profile.emergencyContactRelation || 'SPOUSE');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/v1/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyContactName,
          emergencyContactPhone,
          emergencyContactRelation,
          allergies,
          conditions,
          medications,
          preferredHospital,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to save emergency profile.');
      } else {
        setMessage('Emergency medical profile and contacts updated successfully.');
        await loadData();
      }
    } catch (err) {
      setMessage('Network error updating emergency settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Emergency Profile & Break-Glass Settings
            </h1>
            <p className="text-xs text-slate-500">
              Information visible to first responders and emergency doctors when your card QR is scanned during trauma.
            </p>
          </div>

          <Link
            href="/emergency-preview"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-slate-700" />
            <span>Preview Scanner View</span>
          </Link>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Emergency Contacts Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>Primary Emergency Contact</span>
            </h3>
            <p className="text-xs text-slate-500">
              This person will be displayed with a one-tap phone button on the emergency break-glass screen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Full Name *</label>
                <input
                  type="text"
                  required
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="e.g. Sangeeta Verma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship *</label>
                <select
                  value={emergencyContactRelation}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                >
                  <option value="SPOUSE">Spouse</option>
                  <option value="PARENT">Parent</option>
                  <option value="CHILD">Adult Child</option>
                  <option value="SIBLING">Sibling</option>
                  <option value="GUARDIAN">Legal Guardian / Friend</option>
                </select>
              </div>
            </div>
          </div>

          {/* Critical Clinical Vitals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <span>Critical Clinical Declarations</span>
            </h3>
            <p className="text-xs text-slate-500">
              Vital warnings for casualty physicians to prevent contraindications during acute resuscitation.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Known Drug & Environmental Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, NSAIDs, Peanuts (or 'None Known')"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Critical Conditions & Medical Implants</label>
                <input
                  type="text"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g. Cardiac Stent (2023), Pacemaker, Diabetic, Asthmatic"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Maintenance Medications</label>
                <input
                  type="text"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="e.g. Blood thinners (Aspirin 75mg), Insulin, Blood pressure pills"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Casualty Hospital</label>
                <input
                  type="text"
                  value={preferredHospital}
                  onChange={(e) => setPreferredHospital(e.target.value)}
                  placeholder="Hospital name and branch"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-700/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Emergency Gateway...' : 'Save Emergency Settings'}</span>
          </button>
        </form>
      </main>

    </div>
  );
}
