'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Smartphone, 
  FileText, 
  QrCode, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  HeartPulse,
  Building2,
  Stethoscope,
  Clock,
  Eye,
  UserCheck
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Digital Enrollment & Real Authentication',
      desc: 'Citizen signs up using their email or mobile number. A 6-digit cryptographic OTP is dispatched directly to their personal inbox to verify account ownership.',
      icon: Smartphone,
      badge: 'Step 1: Security Anchor'
    },
    {
      num: '02',
      title: 'Demographic Profile & Emergency Contacts',
      desc: 'Enter your legal demographics: Name, Date of Birth, Blood Group, and Primary Emergency Contact. Crucial vitals are indexed for emergency first-responders.',
      icon: FileText,
      badge: 'Step 2: Vital Data'
    },
    {
      num: '03',
      title: 'Encrypted Identity Proof Submission',
      desc: 'Upload an official identity document (Aadhaar, PAN, Voter ID, or Passport). Files are cryptographically hashed using SHA-256 and stored in AES-256 vault storage.',
      icon: Lock,
      badge: 'Step 3: Cryptographic Vault'
    },
    {
      num: '04',
      title: 'Official Verification & Permanent Client ID',
      desc: 'The AHCS verification desk audits your document. Upon approval, your permanent ISO/IEC 7064 Mod 97-10 verified Client ID and active QR Card are minted.',
      icon: UserCheck,
      badge: 'Step 4: Certified Identity'
    }
  ];

  const emergencyFeatures = [
    {
      title: 'No App or Login Needed for Paramedics',
      desc: 'In severe accidents, EMTs and ER doctors simply scan the card’s QR code with any standard smartphone camera. No hospital software login required.',
      icon: QrCode
    },
    {
      title: 'Selective Data Disclosure',
      desc: 'Break-glass gateway exposes ONLY life-critical vitals: blood group, critical allergies, emergency contact phone numbers, and emergency conditions. Full medical records remain private.',
      icon: Eye
    },
    {
      title: 'Tamper-Evident Audit Logging',
      desc: 'Every QR scan records the exact timestamp, IP address, and location attempt into an immutable audit ledger, notifying the citizen.',
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            System Architecture & Lifecycle
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-3 tracking-tight">
            How the AHCS Health Identity Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            From initial registration and verification desk audit to life-saving 24x7 break-glass QR access — here is how AHCS protects your healthcare identity.
          </p>
        </div>

        {/* 4-Step Lifecycle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-blue-700/30">{step.num}</span>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    {step.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Break-Glass Deep Dive */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              Life-Saving Innovation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-3">
              The 24x7 Break-Glass Emergency QR Protocol
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              When seconds count between life and death, hospital ER teams cannot wait for passwords, OTPs, or bureaucratic paperwork.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {emergencyFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                    <Icon className="w-6 h-6 text-emerald-400 mb-2" />
                    <h4 className="text-xs font-bold text-white mb-1">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Doctor & Patient Consent Barrier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Zero-Trust Privacy Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Doctors Cannot View Records Without Explicit Patient Consent
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              Unlike traditional hospital management systems where any staff can view private files, AHCS enforces an explicit cryptographic consent barrier.
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Doctor initiates a structured access request with clinical purpose.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Citizen receives an instant notification and approves with a specific time window (e.g. 24 hours).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Patient can revoke doctor access at any second with a single click.</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              Verification State Machine
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Initial Enrollment</span>
                <span className="font-mono font-bold text-blue-700">REGISTERED</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Document Upload</span>
                <span className="font-mono font-bold text-amber-700">PENDING_REVIEW</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Officer Verification</span>
                <span className="font-mono font-bold text-emerald-700">CLIENT_ID_ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="text-center bg-blue-700 text-white rounded-3xl p-8 sm:p-10 shadow-lg shadow-blue-700/25">
          <h2 className="text-2xl font-black">Ready to Establish Your Digital Health ID?</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-xl mx-auto">
            Free forever for every citizen. Get started in under 3 minutes with real email verification.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/apply"
              className="px-8 py-3.5 bg-white text-blue-700 hover:bg-slate-100 font-bold rounded-full text-xs shadow-md transition-all"
            >
              Create Free Health ID &rarr;
            </Link>
            <Link
              href="/emergency-preview"
              className="px-8 py-3.5 bg-blue-800 text-white hover:bg-blue-900 font-semibold rounded-full text-xs border border-blue-500 transition-all"
            >
              Test Emergency QR Simulator
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
