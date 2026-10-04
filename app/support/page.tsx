'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  Phone, 
  Mail, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function SupportHubPage() {
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState<any>(null);
  const [ticketError, setTicketError] = useState('');

  const handleLookupTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearch.trim()) return;

    setTicketLoading(true);
    setTicketError('');
    setTicketResult(null);

    try {
      const res = await fetch(`/api/v1/support/tickets?ticketNumber=${encodeURIComponent(ticketSearch.trim().toUpperCase())}`);
      const data = await res.json();
      if (!res.ok) {
        setTicketError(data.error || 'Support ticket not found.');
      } else {
        setTicketResult(data.ticket);
      }
    } catch (err) {
      setTicketError('Network error checking ticket status.');
    } finally {
      setTicketLoading(false);
    }
  };

  const faqs = [
    {
      q: 'How long does physical card delivery take?',
      a: 'Once your identity verification is approved by the verification officer, physical NFC smart cards are dispatched within 48 business hours via tracked speed post. Delivery generally takes 3 to 5 business days.'
    },
    {
      q: 'What happens if I lose my AHCS Smart Card?',
      a: 'You can immediately lock your lost card token with one tap in your Member Dashboard under the Security tab. Your digital Client ID remains valid, and you can order a replacement physical card anytime.'
    },
    {
      q: 'Does the Emergency QR reveal my full medical history?',
      a: 'No. The emergency QR triggers a minimal break-glass emergency profile containing only critical life-saving items: blood group, severe allergies, active medications, and primary emergency contacts. Full diagnosis and treatment files remain securely locked.'
    },
    {
      q: 'Can a doctor view my records without my permission?',
      a: 'Never. Healthcare providers must submit a digital consent request specifying the purpose (e.g. Outpatient Encounter) and time duration. Records are accessible only while your consent session is active.'
    },
    {
      q: 'Is AHCS affiliated with the Indian Government or Ayushman Bharat?',
      a: 'No. AHCS (Advanced Health Care System) is an independent private healthcare technology platform. It is not government software, not Aadhaar, not ABHA, and does not operate as government health insurance.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <HelpCircle className="w-4 h-4" />
              <span>Help & Knowledge Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              How Can We Help You Today?
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Track existing support tickets, browse frequently asked questions, or reach our member care desk directly.
            </p>
          </div>
        </section>

        {/* Ticket Status Tracker */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-7">
            <h2 className="text-base font-bold text-slate-900 mb-2">Track Support Ticket Status</h2>
            <form onSubmit={handleLookupTicket} className="flex gap-2">
              <input
                type="text"
                required
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder="Enter Ticket Number (e.g. AHCS-TKT-1002)"
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
              <button
                type="submit"
                disabled={ticketLoading}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 disabled:opacity-50"
              >
                {ticketLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {ticketError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{ticketError}</span>
              </div>
            )}

            {ticketResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{ticketResult.ticketNumber}</span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 text-[11px]">
                    Status: {ticketResult.status}
                  </span>
                </div>
                <div className="text-slate-700 font-semibold">{ticketResult.subject}</div>
                <div className="text-slate-500">Category: {ticketResult.category} | Priority: {ticketResult.priority}</div>
                {ticketResult.adminNotes && (
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 mt-2 text-slate-700">
                    <strong>Support Team Note:</strong> {ticketResult.adminNotes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Answered Questions</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Clear answers regarding platform features and data boundaries.</p>
          </div>

          <div className="space-y-4 mb-14">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/contact"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Need Direct Help?</h4>
                <p className="text-xs text-slate-500 mt-0.5">Submit a new support ticket</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/verify"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Verify a Card</h4>
                <p className="text-xs text-slate-500 mt-0.5">Public card authenticity check</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/privacy-center"
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Privacy & Security</h4>
                <p className="text-xs text-slate-500 mt-0.5">DPDP compliance standards</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
