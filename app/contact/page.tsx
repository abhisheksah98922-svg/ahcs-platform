'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'GENERAL_INQUIRY',
    subject: '',
    message: '',
    priority: 'MEDIUM',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; ticketNumber?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/v1/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to submit inquiry.' });
      } else {
        setStatusMessage({
          type: 'success',
          text: `Your ticket has been recorded with Ticket #${data.ticket?.ticketNumber}. Our support desk will respond via email within 24 hours.`,
          ticketNumber: data.ticket?.ticketNumber,
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          category: 'GENERAL_INQUIRY',
          subject: '',
          message: '',
          priority: 'MEDIUM',
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network communication failure. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <Mail className="w-4 h-4" />
              <span>Dedicated Member Assistance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Contact AHCS Support & Assistance
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              We are here to assist with member verification, health card replacement, provider partner onboarding, and technical inquiries.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Direct Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-900">Direct Contact Channels</h2>

                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Member Toll-Free Helpline</div>
                    <div className="text-blue-700 font-bold text-sm mt-0.5">1800-242-7000</div>
                    <div className="text-slate-500 text-xs mt-0.5">Mon - Sat, 08:00 AM - 08:00 PM IST</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Official Email Inquiries</div>
                    <div className="text-slate-800 font-medium text-xs mt-0.5">support@ahcs.in</div>
                    <div className="text-slate-500 text-xs">For partnerships: partners@ahcs.in</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Registered Office</div>
                    <div className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                      AHCS Advanced Health Care System Pvt Ltd<br />
                      Level 5, Technology Hub, Outer Ring Road,<br />
                      Bellandur, Bengaluru, Karnataka 560103, India
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Data Protection & Grievance Officer</div>
                    <div className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                      Grievance Redressal Officer: Adv. S. Murthy<br />
                      Email: grievance@ahcs.in (DPDP Act Compliance)
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-5 text-xs text-blue-950">
                <div className="font-bold flex items-center gap-1.5 mb-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-700" />
                  <span>Looking for quick answers?</span>
                </div>
                <p className="leading-relaxed">
                  Check our <Link href="/support" className="text-blue-700 underline font-semibold">Support & FAQ Center</Link> for instant guidance on health card verification, card loss replacement, and emergency profile setup.
                </p>
              </div>
            </div>

            {/* Right: Interactive Support Ticket Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Submit a Support Ticket
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Every inquiry generates a tracked ticket number with guaranteed response SLA.
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
                    <div>
                      <div className="font-semibold">{statusMessage.text}</div>
                      {statusMessage.ticketNumber && (
                        <div className="mt-1 font-mono text-xs bg-emerald-100/60 px-2 py-0.5 rounded text-emerald-900 inline-block">
                          Ticket #{statusMessage.ticketNumber}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your full name"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inquiry Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 bg-white"
                      >
                        <option value="GENERAL_INQUIRY">General Inquiry</option>
                        <option value="CARD_STATUS_DELIVERY">Health Card Delivery / Tracking</option>
                        <option value="VERIFICATION_HELP">Identity Verification Help</option>
                        <option value="PROVIDER_PARTNERSHIP">Hospital / Doctor Partnership</option>
                        <option value="CORPORATE_WELLNESS">Corporate Health Camp / Plan</option>
                        <option value="GRIEVANCE_PRIVACY">Privacy & Grievance Redressal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief summary of your question or issue"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your issue or inquiry in detail. Include Client ID if applicable (do not share OTPs or passwords)."
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Recording Support Ticket...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Support Ticket</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
