'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Upload, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Filter, 
  Plus, 
  Calendar, 
  Stethoscope, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export default function DashboardRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    recordType: 'CONSULTATION',
    doctorName: '',
    providerName: '',
    recordDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const loadRecords = async () => {
    try {
      const res = await fetch('/api/v1/records');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      const res = await fetch('/api/v1/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to upload medical record');
      } else {
        setMessage('Record vaulted successfully with AES-256 encryption.');
        setShowUploadModal(false);
        setUploadData({
          title: '',
          recordType: 'CONSULTATION',
          doctorName: '',
          providerName: '',
          recordDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
        await loadRecords();
      }
    } catch (err) {
      setMessage('Network error during record upload.');
    } finally {
      setUploading(false);
    }
  };

  const filteredRecords = records.filter(r => {
    if (filterType === 'ALL') return true;
    return r.recordType === filterType;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Encrypted Medical Records Vault
            </h1>
            <p className="text-xs text-slate-500">
              Your lifelong clinical history, prescriptions, diagnostic reports, and vaccination records.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Vault New Document</span>
          </button>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'CONSULTATION', label: 'Consultations' },
            { id: 'PRESCRIPTION', label: 'Prescriptions' },
            { id: 'LAB_REPORT', label: 'Lab Reports' },
            { id: 'DISCHARGE_SUMMARY', label: 'Discharge Summaries' },
            { id: 'VACCINATION', label: 'Vaccinations' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Records List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading encrypted records...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">No medical records found</h3>
            <p className="text-xs text-slate-500 mb-6">
              You haven&apos;t added any {filterType !== 'ALL' ? filterType.toLowerCase() : ''} records yet. Vault records from doctors or upload past summaries.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
            >
              Upload First Record
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.map((r, i) => (
              <div key={r.id || i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                      {r.recordType || 'MEDICAL_RECORD'}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(r.recordDate || r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">{r.title || 'Clinical Encounter'}</h4>
                  <div className="text-xs text-slate-500 mb-3">
                    {r.doctorName ? `Doctor: ${r.doctorName}` : ''} {r.providerName ? `(${r.providerName})` : ''}
                  </div>

                  {r.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                      {r.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                    <Lock className="w-3 h-3" />
                    <span>AES-256 Vaulted</span>
                  </span>
                  <span className="text-blue-700 font-bold hover:underline cursor-pointer">
                    View Record Details
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-base">Vault New Medical Document</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    placeholder="e.g. Annual Cardiology Checkup Summary"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Record Type *</label>
                    <select
                      value={uploadData.recordType}
                      onChange={(e) => setUploadData({ ...uploadData, recordType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                    >
                      <option value="CONSULTATION">Consultation Note</option>
                      <option value="PRESCRIPTION">Prescription (Rx)</option>
                      <option value="LAB_REPORT">Diagnostic Lab Report</option>
                      <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                      <option value="VACCINATION">Vaccination Record</option>
                      <option value="OTHER">Other Clinical Record</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Record Date *</label>
                    <input
                      type="date"
                      required
                      value={uploadData.recordDate}
                      onChange={(e) => setUploadData({ ...uploadData, recordDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
                    <input
                      type="text"
                      value={uploadData.doctorName}
                      onChange={(e) => setUploadData({ ...uploadData, doctorName: e.target.value })}
                      placeholder="Dr. Rajesh Verma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
                    <input
                      type="text"
                      value={uploadData.providerName}
                      onChange={(e) => setUploadData({ ...uploadData, providerName: e.target.value })}
                      placeholder="Apollo Clinics"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Notes / Findings</label>
                  <textarea
                    rows={3}
                    value={uploadData.notes}
                    onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                    placeholder="Key diagnosis, medication dosages, or doctor advice..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-1/2 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold disabled:opacity-50"
                  >
                    {uploading ? 'Vaulting...' : 'Save & Encrypt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
