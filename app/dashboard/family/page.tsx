'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  AlertCircle, 
  Lock, 
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function DashboardFamilyPage() {
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    relationship: 'SPOUSE',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: 'UNKNOWN',
    emergencyAccessAllowed: true,
  });
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const loadFamily = async () => {
    try {
      const res = await fetch('/api/v1/family');
      const data = await res.json();
      if (data.success) {
        setFamilyMembers(data.family || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamily();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMessage('');

    try {
      const res = await fetch('/api/v1/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to add family member');
      } else {
        setMessage('Family profile enrolled successfully.');
        setShowAddModal(false);
        setFormData({
          fullName: '',
          relationship: 'SPOUSE',
          dateOfBirth: '',
          gender: 'MALE',
          bloodGroup: 'UNKNOWN',
          emergencyAccessAllowed: true,
        });
        await loadFamily();
      }
    } catch (err) {
      setMessage('Network error adding family member.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Family Health Management
            </h1>
            <p className="text-xs text-slate-500">
              Manage care coordination, emergency profiles, and card issuance for spouses, children, and parents.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Members Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading family members...</div>
        ) : familyMembers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">No family members enrolled</h3>
            <p className="text-xs text-slate-500 mb-6">
              Connect your dependents or elderly parents to manage their appointments and emergency profiles.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
            >
              Add First Dependent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyMembers.map((m, idx) => (
              <div key={m.id || idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 uppercase">
                      {m.relationship || 'FAMILY'}
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1">{m.fullName}</h4>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div>DOB: {m.dateOfBirth ? new Date(m.dateOfBirth).toLocaleDateString() : 'Declared'}</div>
                    <div>Gender: {m.gender} · Blood Group: {m.bloodGroup || 'Not declared'}</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Emergency Access: <strong className="text-slate-700">Enabled</strong>
                  </span>
                  <Link href="/smart-card" className="text-blue-700 font-bold hover:underline">
                    Order Card →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-base">Enroll Family Member</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sangeeta Verma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship *</label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                    >
                      <option value="SPOUSE">Spouse</option>
                      <option value="CHILD">Child / Dependent</option>
                      <option value="PARENT">Parent (Father / Mother)</option>
                      <option value="SIBLING">Sibling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                    >
                      <option value="UNKNOWN">Unknown / Not Tested</option>
                      <option value="A_POS">A Positive (A+)</option>
                      <option value="A_NEG">A Negative (A-)</option>
                      <option value="B_POS">B Positive (B+)</option>
                      <option value="B_NEG">B Negative (B-)</option>
                      <option value="O_POS">O Positive (O+)</option>
                      <option value="O_NEG">O Negative (O-)</option>
                      <option value="AB_POS">AB Positive (AB+)</option>
                      <option value="AB_NEG">AB Negative (AB-)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.emergencyAccessAllowed}
                      onChange={(e) => setFormData({ ...formData, emergencyAccessAllowed: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Allow emergency profile linkage for this member</span>
                  </label>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="w-1/2 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold disabled:opacity-50"
                  >
                    {adding ? 'Enrolling...' : 'Save Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
