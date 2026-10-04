'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  HeartPulse,
  Send
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function MobileMedicalPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    expectedAttendees: '50',
    location: '',
    city: '',
    state: '',
    pinCode: '',
    requestedDate: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/v1/services/mobile-medical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to submit request.' });
      } else {
        setStatusMessage({ 
          type: 'success', 
          text: 'Mobile medical camp request submitted successfully! Reference ID: ' + (data.request?.id || 'MMU-REQ') + '. Our regional healthcare logistics team will contact you within 24 business hours.' 
        });
        setFormData({
          organizationName: '',
          contactPerson: '',
          contactPhone: '',
          contactEmail: '',
          expectedAttendees: '50',
          location: '',
          city: '',
          state: '',
          pinCode: '',
          requestedDate: '',
          notes: '',
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network communication error. Please try again.' });
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
              <Truck className="w-4 h-4" />
              <span>Mobile Healthcare Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Mobile Medical Units (MMU) & On-Site Health Camps
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Bringing clinical screening, doctor consultations, diagnostic point-of-care testing, and health literacy directly to factories, corporate facilities, and communities.
            </p>
          </div>
        </section>

        {/* Notice & Disclaimer */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              <strong className="font-semibold">Honest Deployment Disclosure:</strong> Mobile Medical Units are deployed subject to regional fleet availability, local medical zoning regulations, and prior scheduling. MMU services are intended for scheduled preventive screening and primary consultations. They are <strong>NOT emergency ambulance units</strong> and do not provide advanced trauma life support or acute ICU transfer.
            </div>
          </div>
        </div>

        {/* Content & Form Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Capabilities */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>On-Board Capabilities</span>
                </h2>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>General Physician Consultation:</strong> Outpatient evaluation and physical assessment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Point-of-Care Diagnostics:</strong> Blood glucose, HbA1c, lipid panel, urine routine, and rapid tests.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Cardiovascular Screening:</strong> 12-lead digital ECG screening and blood pressure monitoring.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Vision & Basic Optical Check:</strong> Visual acuity tests and preliminary refractive assessments.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Digital Record Sync:</strong> Screened records are instantly vaulted to attendees&apos; AHCS Client IDs.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Who Can Request?</span>
                </h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Corporate employers organizing mandatory occupational health audits, manufacturing facilities, housing cooperative societies, rural welfare foundations, and charitable trust initiatives.
                </p>
              </div>
            </div>

            {/* Right Column: Request Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Request a Mobile Medical Unit Camp
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Fill in your camp logistics details. Our coordinator will evaluate regional route feasibility and provide a structured plan.
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
                        Organization / Society Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        placeholder="e.g. Acme Tech Park Pvt Ltd"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Coordinator / Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="Full Name"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Phone Number *
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
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="coordinator@domain.com"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Target Date for Camp *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.requestedDate}
                        onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estimated Attendees *
                      </label>
                      <select
                        value={formData.expectedAttendees}
                        onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 bg-white"
                      >
                        <option value="25-50">25 to 50 attendees</option>
                        <option value="50-100">50 to 100 attendees</option>
                        <option value="100-250">100 to 250 attendees</option>
                        <option value="250+">250+ attendees (Multi-day / Multi-van)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Camp Site Address / Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Premises address, building name, road"
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
                      Additional Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Specify requirements (e.g. eye checkup, women's health screening, parking availability for van)"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Mobile Medical Camp Request</span>
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
