'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Pill, 
  Plus, 
  Trash2, 
  Lock, 
  Building2, 
  ArrowRight,
  Clock,
  HeartPulse,
  Send
} from 'lucide-react';

export default function ProviderPortalPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('PRV-101');
  const [doctorName, setDoctorName] = useState<string>('Dr. Rajesh Verma, MD');
  const [clientIdInput, setClientIdInput] = useState<string>('');
  
  // Search & Encounter State
  const [searching, setSearching] = useState<boolean>(false);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [searchError, setSearchError] = useState<string>('');

  // Consent Request State
  const [requestingConsent, setRequestingConsent] = useState<boolean>(false);
  const [consentSentMessage, setConsentSentMessage] = useState<string>('');
  const [consentPurpose, setConsentPurpose] = useState<string>('GENERAL_CONSULTATION');
  const [consentScope, setConsentScope] = useState<string>('ALL_RECORDS');

  // New Clinical Encounter Form
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [medications, setMedications] = useState<any[]>([
    { medicineName: '', dosage: '', frequency: '1-0-1 (After food)', duration: '5 days', instructions: '' }
  ]);
  const [savingEncounter, setSavingEncounter] = useState<boolean>(false);
  const [encounterSuccessMessage, setEncounterSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/v1/providers?status=VERIFIED')
      .then(res => res.json())
      .then(data => {
        if (data.providers && data.providers.length > 0) {
          setProviders(data.providers);
          setSelectedProviderId(data.providers[0].id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clientIdInput.trim()) return;

    setSearching(true);
    setSearchError('');
    setLookupResult(null);
    setConsentSentMessage('');
    setEncounterSuccessMessage('');

    try {
      const res = await fetch('/api/v1/provider/patient-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientIdInput.trim().toUpperCase(),
          providerId: selectedProviderId,
          doctorName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error || 'Failed to locate patient');
      } else {
        setLookupResult(data);
      }
    } catch (err) {
      setSearchError('Network error connecting to patient registry');
    } finally {
      setSearching(false);
    }
  };

  const handleSendConsentRequest = async () => {
    if (!lookupResult?.patient?.accountId) return;

    setRequestingConsent(true);
    setConsentSentMessage('');
    try {
      const activeFacility = providers.find(p => p.id === selectedProviderId);
      const res = await fetch('/api/v1/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REQUEST',
          accountId: lookupResult.patient.accountId,
          providerId: selectedProviderId,
          providerName: activeFacility?.name || 'Verified Healthcare Clinic',
          doctorName,
          purpose: consentPurpose,
          scope: consentScope,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to dispatch consent request');
      } else {
        setConsentSentMessage(data.message || 'Consent request sent to patient.');
        // Refresh lookup
        handleLookup();
      }
    } catch (err) {
      alert('Error requesting consent');
    } finally {
      setRequestingConsent(false);
    }
  };

  const handleAddMedicationRow = () => {
    setMedications([
      ...medications,
      { medicineName: '', dosage: '', frequency: '1-0-1 (After food)', duration: '5 days', instructions: '' }
    ]);
  };

  const handleRemoveMedicationRow = (idx: number) => {
    setMedications(medications.filter((_, i) => i !== idx));
  };

  const handleUpdateMedication = (idx: number, field: string, value: string) => {
    const updated = [...medications];
    updated[idx][field] = value;
    setMedications(updated);
  };

  const handleSaveEncounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupResult?.patient?.accountId || !diagnosis.trim()) return;

    setSavingEncounter(true);
    setEncounterSuccessMessage('');
    try {
      const activeFacility = providers.find(p => p.id === selectedProviderId);
      const validMeds = medications.filter(m => m.medicineName.trim());

      const res = await fetch('/api/v1/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: lookupResult.patient.accountId,
          authorProviderId: selectedProviderId,
          authorProviderName: activeFacility?.name || 'Verified Healthcare Clinic',
          authorDoctorName: doctorName,
          recordType: validMeds.length > 0 ? 'PRESCRIPTION' : 'CONSULTATION',
          title: `Consultation: ${diagnosis.trim()}`,
          clinicalDiagnosis: diagnosis.trim(),
          clinicalNotes: clinicalNotes.trim(),
          medications: validMeds,
          recordDate: new Date().toISOString().split('T')[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to save clinical encounter');
      } else {
        setEncounterSuccessMessage('Encounter and prescription saved to patient history successfully.');
        setDiagnosis('');
        setClinicalNotes('');
        setMedications([{ medicineName: '', dosage: '', frequency: '1-0-1 (After food)', duration: '5 days', instructions: '' }]);
        // Refresh lookup records
        handleLookup();
      }
    } catch (err) {
      alert('Error saving clinical encounter');
    } finally {
      setSavingEncounter(false);
    }
  };

  const activeFacility = providers.find(p => p.id === selectedProviderId);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-800">
                Healthcare Provider Workspace
              </span>
              <span className="text-xs font-bold text-slate-400">
                • Verified Terminal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Stethoscope className="w-7 h-7 text-teal-400" />
              <span>AHCS Clinical Consultation Suite</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Lookup patients by permanent AHCS Client ID, verify active cryptographic consent, and issue tamper-evident clinical prescriptions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/provider/login"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Staff Login / Switch Doctor</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors text-center"
            >
              Citizen Dashboard
            </Link>
          </div>
        </div>

        {/* Doctor & Facility Selector Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Facility
            </label>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedProviderId}
                onChange={e => setSelectedProviderId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-600"
              >
                {providers.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category}) — Reg: {p.registrationNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Attending Doctor Name & Qualifications
            </label>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                placeholder="Dr. Name, Degree"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Patient Lookup Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-700" />
            <span>Patient Registry Lookup</span>
          </h3>

          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter AHCS Client ID (e.g. AHCS-3B9K-7M2P-4)"
              value={clientIdInput}
              onChange={e => setClientIdInput(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0"
            >
              {searching ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Lookup Patient</span>
                </>
              )}
            </button>
          </form>

          {searchError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Lookup Results Section */}
        {lookupResult && (
          <div className="space-y-6">
            {/* Case A: Consent NOT Granted */}
            {!lookupResult.hasConsent && (
              <div className="bg-amber-50/80 border-2 border-amber-300 p-6 sm:p-8 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">
                        Patient Identified: {lookupResult.patient.fullName}
                      </h4>
                      <p className="text-xs text-amber-900">
                        Client ID: <strong className="font-mono">{lookupResult.patient.clientId}</strong> • Gender: {lookupResult.patient.gender}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-200/80 text-amber-950 font-black text-xs rounded-full uppercase tracking-wider self-start sm:self-auto">
                    Consent Restricted
                  </span>
                </div>

                <div className="text-xs text-amber-900 leading-relaxed bg-white/70 p-4 rounded-2xl border border-amber-200">
                  <strong>Patient Sovereignty Notice:</strong> Under the AHCS privacy charter, clinical records, diagnostic notes, and past prescriptions cannot be accessed without explicit patient consent. You may request temporary access for consultation or diagnosis.
                </div>

                {consentSentMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    {consentSentMessage}
                  </div>
                )}

                {lookupResult.pendingRequest ? (
                  <div className="p-4 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 text-xs flex items-center justify-between">
                    <span>A consent request is already pending review on the patient&apos;s dashboard.</span>
                    <button
                      onClick={() => handleLookup()}
                      className="px-3 py-1.5 bg-amber-900 text-white rounded-lg font-bold text-[11px]"
                    >
                      Check Status
                    </button>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-2xl border border-amber-200 space-y-4">
                    <div className="font-bold text-slate-800 text-xs">Request Patient Data Access:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-500 block mb-1">Consultation Purpose</label>
                        <select
                          value={consentPurpose}
                          onChange={e => setConsentPurpose(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800"
                        >
                          <option value="GENERAL_CONSULTATION">General Consultation</option>
                          <option value="DIAGNOSIS">Specialist Diagnosis</option>
                          <option value="SECOND_OPINION">Second Opinion</option>
                          <option value="EMERGENCY_REVIEW">Emergency Clinical Review</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-500 block mb-1">Required Scope</label>
                        <select
                          value={consentScope}
                          onChange={e => setConsentScope(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800"
                        >
                          <option value="ALL_RECORDS">Full Medical History & Encounters</option>
                          <option value="PRESCRIPTIONS_ONLY">Prescriptions Only</option>
                          <option value="LABS_ONLY">Diagnostic Lab Reports Only</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleSendConsentRequest}
                      disabled={requestingConsent}
                      className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{requestingConsent ? 'Sending Consent Request...' : 'Send Consent Request to Patient Dashboard'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Case B: Consent IS Granted */}
            {lookupResult.hasConsent && (
              <div className="space-y-6">
                {/* Active Consent Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-emerald-900 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Active Patient Consent Verified. Access granted until <strong>{new Date(lookupResult.activeConsent?.expiresAt).toLocaleString()}</strong>.</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    SCOPE: {lookupResult.activeConsent?.scope?.replace('_', ' ')}
                  </span>
                </div>

                {/* Patient Vitals Header */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Patient Name</div>
                    <div className="text-sm font-black text-slate-900">{lookupResult.patient.fullName}</div>
                    <div className="text-slate-500 font-mono">{lookupResult.patient.clientId}</div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Blood Group</div>
                    <div className="text-sm font-black text-rose-600">
                      {lookupResult.patient.bloodGroup?.replace('_', '+').replace('POS', '+').replace('NEG', '-')}
                    </div>
                    <div className="text-[10px] text-slate-400">{lookupResult.patient.bloodGroupSource}</div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Known Allergies</div>
                    <div className="font-semibold text-slate-800">
                      {lookupResult.emergency?.allergies?.length > 0 
                        ? lookupResult.emergency.allergies.join(', ') 
                        : 'None Recorded'}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Critical Conditions</div>
                    <div className="font-semibold text-slate-800">
                      {lookupResult.emergency?.criticalConditions?.length > 0 
                        ? lookupResult.emergency.criticalConditions.join(', ') 
                        : 'None Recorded'}
                    </div>
                  </div>
                </div>

                {/* Patient History Timeline */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span>Consented Medical History ({lookupResult.records?.length || 0})</span>
                  </h4>

                  {lookupResult.records?.length === 0 ? (
                    <div className="text-xs text-slate-400 py-4 text-center">
                      No prior records found for this patient.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lookupResult.records.map((rec: any) => (
                        <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{rec.title}</span>
                            <span className="text-slate-400 font-mono text-[11px]">{rec.recordDate}</span>
                          </div>
                          <div className="text-slate-600">
                            <strong>Diagnosis:</strong> {rec.clinicalDiagnosis} • <strong>Notes:</strong> {rec.clinicalNotes || '—'}
                          </div>
                          {rec.medications && rec.medications.length > 0 && (
                            <div className="text-[11px] text-teal-800 font-medium pt-1">
                              Rx: {rec.medications.map((m: any) => `${m.medicineName} (${m.dosage}, ${m.frequency})`).join('; ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form: Record New Encounter & Issue Prescription */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Pill className="w-5 h-5 text-teal-600" />
                      <span>Issue Digital Clinical Encounter & Prescription</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Authored by <strong>{doctorName}</strong> at <strong>{activeFacility?.name}</strong>.
                    </p>
                  </div>

                  {encounterSuccessMessage && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      {encounterSuccessMessage}
                    </div>
                  )}

                  <form onSubmit={handleSaveEncounter} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Clinical Diagnosis *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acute Pharyngitis with Mild Dehydration"
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Clinical Notes & Observations</label>
                      <textarea
                        rows={3}
                        placeholder="Patient presented with 3 days of fever, throat irritation..."
                        value={clinicalNotes}
                        onChange={e => setClinicalNotes(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Prescription Item Rows */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                          Prescription Schedule (Rx)
                        </span>
                        <button
                          type="button"
                          onClick={handleAddMedicationRow}
                          className="px-3 py-1 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Medicine</span>
                        </button>
                      </div>

                      {medications.map((med, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              placeholder="Medicine Name (e.g. Amoxicillin)"
                              value={med.medicineName}
                              onChange={e => handleUpdateMedication(idx, 'medicineName', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 font-bold text-slate-900 bg-white"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              placeholder="Dosage (500mg)"
                              value={med.dosage}
                              onChange={e => handleUpdateMedication(idx, 'dosage', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 text-slate-800 bg-white"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <input
                              type="text"
                              placeholder="Frequency (1-0-1)"
                              value={med.frequency}
                              onChange={e => handleUpdateMedication(idx, 'frequency', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 text-slate-800 bg-white"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              placeholder="Duration (5 days)"
                              value={med.duration}
                              onChange={e => handleUpdateMedication(idx, 'duration', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 text-slate-800 bg-white"
                            />
                          </div>

                          <div className="sm:col-span-1 text-right">
                            {medications.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicationRow(idx)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingEncounter}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md shadow-teal-600/20 disabled:opacity-50"
                      >
                        <HeartPulse className="w-4 h-4" />
                        <span>{savingEncounter ? 'Saving to Encrypted Ledger...' : 'Sign & Persist Clinical Encounter'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
