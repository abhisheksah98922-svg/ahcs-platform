'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck, 
  HeartHandshake, 
  Activity, 
  Send 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function HomeCarePage() {
  const [formData, setFormData] = useState({
    patientName: '',
    serviceType: 'NURSING_ATTENDANT',
    location: '',
    city: '',
    state: '',
    pinCode: '',
    preferredDate: '',
    contactPhone: '',
    contactEmail: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/v1/services/home-care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to submit home care request.' });
      } else {
        setStatusMessage({ 
          type: 'success', 
          text: 'Home care request registered successfully! Reference ID: ' + (data.request?.id || 'HC-REQ') + '. A care supervisor will call you within 2 hours to confirm caregiver assignment and timing.' 
        });
        setFormData({
          patientName: '',
          serviceType: 'NURSING_ATTENDANT',
          location: '',
          city: '',
          state: '',
          pinCode: '',
          preferredDate: '',
          contactPhone: '',
          contactEmail: '',
          notes: '',
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network connection failure. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <Home className="w-4 h-4" />
              <span>Verified Home Healthcare</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Professional Home Nursing & Elder Care Assistance
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Certified nurses, geriatric caregivers, and physiotherapists delivered to your doorstep. Safe, supervised, and connected to your AHCS health records.
            </p>
          </div>
        </section>

        {/* Notice & Disclaimer */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              <strong className="font-semibold">Clinical Scope Disclaimer:</strong> Home care services provide supportive nursing, rehabilitative therapy, and activities of daily living assistance. Home care attendants cannot prescribe medication or perform surgical interventions. In case of acute respiratory distress, severe chest pain, or sudden neurological deficits, contact emergency hospital services immediately.
            </div>
          </div>
        </div>

        {/* Form and info */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Services info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Available Home Care Services</span>
                </h2>
                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-1">Skilled Clinical Nursing</h4>
                    <p className="text-slate-600 text-xs">Post-surgical wound management, urinary catheterization, IV infusion therapy, and vital signs charting by GNM/B.Sc. certified nurses.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-1">Elderly Attendant & Mobility</h4>
                    <p className="text-slate-600 text-xs">Bathing, mobility support, medication supervision, and fall prevention for senior family members.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-1">Home Physiotherapy</h4>
                    <p className="text-slate-600 text-xs">Orthopedic recovery, stroke rehabilitation, and joint mobility sessions delivered by certified physiotherapists.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-1">Home Phlebotomy & Sample Pickup</h4>
                    <p className="text-slate-600 text-xs">Trained phlebotomist visit for fasting blood, urine, or swab collection with cold-chain transport to partner NABL labs.</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/60 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-indigo-700" />
                  <span>Verified Staff Standards</span>
                </h3>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  Every caregiver undergoes mandatory government ID verification, criminal background scrutiny, clinical qualification audit, and BLS (Basic Life Support) certification check.
                </p>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Book a Home Healthcare Service
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Provide patient requirement details to request a qualified caregiver or nurse visit.
                </p>

                {statusMessage && (
                  <div className={`p-4 rounded-xl mb-6 text-xs sm:text-sm flex items-start gap-2.5 ${
                    statusMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}>
                    {statusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Service Required *
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 bg-white"
                      >
                        <option value="NURSING_ATTENDANT">Elderly / General Care Attendant (12/24 Hr)</option>
                        <option value="CLINICAL_NURSE">Skilled Nurse Visit (Injections / Wound / IV)</option>
                        <option value="PHYSIOTHERAPY">Home Physiotherapist Session</option>
                        <option value="LAB_SAMPLE_COLLECTION">Home Blood / Diagnostic Sample Collection</option>
                        <option value="POST_OPERATIVE_CARE">Post-Operative Recovery Supervision</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Home Address / Flat / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Flat 402, Green Glen Layout, Bellandur"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Bengaluru"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Karnataka"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                        placeholder="6-digit PIN"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient Condition & Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Mention patient mobility, specific medical history, preferred gender of nurse, or special care notes"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-700/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Registering Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Home Care Request</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
