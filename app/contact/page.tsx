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
  HelpCircle,
  PhoneCall,
  ArrowRight,
  FileText,
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
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    ticketNumber?: string;
  } | null>(null);

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
          text: `Your ticket has been recorded with Ticket #${data.ticket?.ticketNumber || 'TKT-AHCS'}. Our member assistance desk will respond via email within 24 hours.`,
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
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <section className="bg-[#102A43] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#0B1D2F]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1769AA]/30 text-[#36C5D8] text-xs font-semibold border border-[#2389D7]/30">
            <Mail className="w-4 h-4" />
            <span>Member Support & Inquiries</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Contact AHCS Support & Assistance
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We are here to assist with health card verification, card loss replacement, identity onboarding, and healthcare provider partnerships.
          </p>
        </div>
      </section>

      {/* 2. EMERGENCY DIRECTIVE STRIP */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-[#D64545] text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PhoneCall className="w-6 h-6 text-white shrink-0 animate-pulse" />
            <div className="text-xs">
              <strong className="block text-sm font-black">Medical Emergency Advisory:</strong>
              For acute medical distress, dial <strong>112 or 108</strong> immediately. AHCS is an identity platform and does not dispatch emergency ambulances.
            </div>
          </div>
          <a
            href="tel:112"
            className="px-4 py-2 bg-white text-[#D64545] hover:bg-red-50 font-black text-xs rounded-xl shadow-xs shrink-0"
          >
            CALL 112
          </a>
        </div>
      </div>

      {/* 3. CONTACT CHANNELS & TICKET FORM */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-[#102A43]">Direct Contact Channels</h2>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1769AA] flex items-center justify-center shrink-0 border border-blue-100">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#102A43] text-sm">Member Assistance Helpline</div>
                  <div className="text-[#1769AA] font-mono font-bold text-sm mt-0.5">1800-242-7000</div>
                  <div className="text-[#66788A] text-xs mt-0.5">Mon – Sat: 08:00 AM – 08:00 PM IST</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16865C] flex items-center justify-center shrink-0 border border-emerald-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#102A43] text-sm">Official Email Desk</div>
                  <div className="text-[#172B4D] font-medium text-xs mt-0.5">support@ahcs.in</div>
                  <div className="text-[#66788A] text-xs">Partnerships: partner@ahcs.in</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#102A43] text-sm">Corporate Headquarters</div>
                  <div className="text-[#66788A] text-xs mt-0.5 leading-relaxed">
                    AHCS Advanced Health Care System Pvt Ltd<br />
                    Level 5, Technology Hub, Outer Ring Road,<br />
                    Bellandur, Bengaluru, Karnataka 560103, India
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs pt-4 border-t border-[#DFE7F0]">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D99A24] flex items-center justify-center shrink-0 border border-amber-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#102A43] text-sm">Data Protection & Grievance Officer</div>
                  <div className="text-[#66788A] text-xs mt-0.5 leading-relaxed">
                    Adv. S. Murthy (DPDP Act Compliance)<br />
                    Email: grievance@ahcs.in
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F8FC] rounded-2xl border border-[#DFE7F0] p-5 text-xs text-[#172B4D] space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-[#102A43]">
                <HelpCircle className="w-4 h-4 text-[#1769AA]" />
                <span>Need immediate answers?</span>
              </div>
              <p className="text-[#66788A] leading-relaxed">
                Check our <Link href="/how-it-works" className="text-[#1769AA] underline font-semibold">How It Works guide</Link> or verify an issued card directly on our <Link href="/verify" className="text-[#1769AA] underline font-semibold">Card Verification page</Link>.
              </p>
            </div>
          </div>

          {/* Right: Support Ticket Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-[#102A43] mb-1">
                Submit an Assistance Ticket
              </h2>
              <p className="text-xs text-[#66788A] mb-6">
                All inquiries are assigned a unique tracking ticket with a committed 24-hour response SLA.
              </p>

              {statusMessage && (
                <div
                  className={`p-4 rounded-xl mb-6 text-xs flex items-start gap-2.5 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-[#16865C] border border-emerald-200'
                      : 'bg-rose-50 text-[#D64545] border border-rose-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{statusMessage.text}</div>
                    {statusMessage.ticketNumber && (
                      <div className="mt-1 font-mono text-[11px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-900 inline-block">
                        Ticket #{statusMessage.ticketNumber}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#172B4D] bg-[#F5F8FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#172B4D] bg-[#F5F8FC]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#172B4D] bg-[#F5F8FC]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#172B4D] bg-white"
                    >
                      <option value="GENERAL_INQUIRY">General Inquiry</option>
                      <option value="CARD_STATUS_DELIVERY">Health Card Delivery / Tracking</option>
                      <option value="VERIFICATION_HELP">Identity Verification Assistance</option>
                      <option value="PROVIDER_PARTNERSHIP">Hospital / Doctor Network Application</option>
                      <option value="CORPORATE_WELLNESS">Corporate Healthcare Package</option>
                      <option value="GRIEVANCE_PRIVACY">Data Privacy & Grievance Redressal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of your question or issue"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#172B4D] bg-[#F5F8FC]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry. Include your Client ID if applicable (never share passwords or OTPs)."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#172B4D] bg-[#F5F8FC]/50"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-[#102A43] hover:bg-[#1769AA] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Assistance Ticket...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Assistance Ticket</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
