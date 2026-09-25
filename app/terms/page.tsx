'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Terms & Conditions
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            AHCS Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: September 2026 • Governing the use of AHCS Digital Health Infrastructure
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8 text-sm text-slate-700 leading-relaxed">
          
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Important Statutory Clarification:</strong> AHCS is an independent, non-governmental private healthcare technology platform. The AHCS Client ID and Health Card are private network identifiers and do not replace official government identities like Aadhaar or government ABHA accounts.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, registering, or using the AHCS platform, website (`ahcs.in`), smart health cards, or emergency QR gateways, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must cease using the platform immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              2. Health Card & Digital Identity
            </h2>
            <p>
              The AHCS Client ID is issued following digital mobile/email verification and identity document audit. You agree to provide accurate, genuine demographic information and legible copies of official identification documents. Submitting falsified documents is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              3. Medical Disclaimer & Healthcare Network
            </h2>
            <p>
              AHCS is a health data and identity management service. AHCS does not provide medical diagnosis, treatment, or clinical care directly. Clinical decisions, prescriptions, and medical treatments are the sole responsibility of the licensed medical practitioners and partner hospitals treating you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              4. Emergency Break-Glass Use
            </h2>
            <p>
              The emergency QR code on your card is intended for urgent medical identification during acute health crises or accidents. You acknowledge that anyone scanning your physical card will be presented with your designated emergency vital parameters (blood group, allergies, emergency phone).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              5. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
