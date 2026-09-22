'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Building2, 
  HeartHandshake, 
  Clock, 
  Phone,
  FileCheck2,
  XCircle,
  QrCode
} from 'lucide-react';
import { HealthCard } from '@/components/HealthCard';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION — ULTRA-PREMIUM DIGITAL HEALTHCARE IDENTITY */}
      <section className="relative isolate overflow-hidden min-h-[640px] lg:min-h-[700px] flex items-center border-b border-slate-200 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white">
        {/* Subtle Tech Dot Matrix Grid — Crisp national digital health infrastructure texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none" />

        {/* Ambient Healthcare Glow Orbs */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/20 to-sky-300/20 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-gradient-to-bl from-indigo-300/15 to-blue-500/15 rounded-full blur-3xl z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge: India's Digital Health Identity Platform */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold border border-slate-200 shadow-xs">
                <span className="font-bold bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  AHCS · IN
                </span>
                <span>India&apos;s Digital Health Security Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Your Health, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500">
                  Our Priority
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
                One permanent health identity — lifelong clinical records, 24x7 emergency break-glass access, and verified hospital care.
              </p>

              {/* 4 Feature Bullet Points in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-2xl text-xs sm:text-[13px] text-slate-800 font-medium">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  </div>
                  <span>Permanent Health ID (AHCS Client ID) — issued instantly</span>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  </div>
                  <span>QR Health Card with rotating secure token</span>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  </div>
                  <span>Verified clinical records & e-prescriptions</span>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/60 border border-slate-200/60 shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  </div>
                  <span>Emergency profile — free for every Indian, forever</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-700/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Create Free Health ID →</span>
                </Link>

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-blue-700 font-bold text-sm border-2 border-blue-600 shadow-xs transition-all"
                >
                  <span>How it works</span>
                </Link>
              </div>

              {/* Trust Metrics Bar */}
              <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-3 max-w-lg">
                <div className="bg-white/70 p-3 rounded-2xl border border-slate-200/80">
                  <div className="text-lg sm:text-xl font-black text-slate-900">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Digital & Paperless</div>
                </div>
                <div className="bg-white/70 p-3 rounded-2xl border border-slate-200/80">
                  <div className="text-lg sm:text-xl font-black text-blue-700">ISO 7064</div>
                  <div className="text-[11px] text-slate-500 font-medium">Verified Checksum</div>
                </div>
                <div className="bg-white/70 p-3 rounded-2xl border border-slate-200/80">
                  <div className="text-lg sm:text-xl font-black text-emerald-600">24x7</div>
                  <div className="text-[11px] text-slate-500 font-medium">Break-Glass QR</div>
                </div>
              </div>

              {/* Micro Status Notes */}
              <div className="pt-1 text-xs text-slate-500 space-y-0.5 font-medium">
                <div>Live now: Client ID · QR card · Records · Appointments · Emergency gateway</div>
                <div className="text-slate-600 font-semibold">Free forever: your Health ID and emergency access.</div>
              </div>
            </div>

            {/* Right Card Column: Floating Cobalt Blue Health Card with Visual Badges */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating Top Badge */}
                <div className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Break-Glass Emergency Ready</span>
                </div>

                {/* Backlight Ambient Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/25 via-sky-400/20 to-indigo-500/25 rounded-3xl blur-2xl -z-10" />

                {/* HealthCard Component */}
                <HealthCard
                  memberName="Your Name Here"
                  clientId="AHCS-IN-XXXX-XXXX"
                  validThru="set at signup"
                  isVerified={true}
                />

                {/* Floating Bottom Badge */}
                <div className="absolute -bottom-4 -right-2 z-20 hidden sm:flex items-center gap-2 bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-slate-800 text-xs font-semibold text-white">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>AES-256 Vault Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: What AHCS IS vs What AHCS IS NOT */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Clear Boundaries & Ethics
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              Understanding What AHCS Is & Is Not
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              AHCS is an independent private healthcare identity, health record, emergency access, and network platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What AHCS IS */}
            <div className="rounded-3xl bg-white border border-blue-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">What AHCS Is</h3>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Independent Healthcare Identity:</strong> An AHCS-owned, verified permanent Client ID.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Physical & Digital Health Card:</strong> Standard ISO/IEC 7810 ID-1 card with dynamic QR & contactless NFC.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Break-Glass Emergency Access:</strong> Discloses only critical vital parameters (blood group, allergies, contacts) during life-saving scenarios.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Granular Patient Consent:</strong> Zero clinical records shared with clinics without explicit patient approval.</span>
                </li>
              </ul>
            </div>

            {/* What AHCS IS NOT */}
            <div className="rounded-3xl bg-white border border-rose-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">What AHCS Is NOT</h3>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Not a Government Portal:</strong> AHCS is NOT Aadhaar, NOT ABHA, NOT Ayushman Bharat, and NOT a government portal.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Not Hospital Management Software:</strong> We do not operate hospital bed rosters, operating room bookings, or internal pharmacy registers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Not an Insurance Underwriter:</strong> AHCS is an independent healthcare identity and membership network platform.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>No Free Treatment Everywhere:</strong> Healthcare benefits and discounts follow partner facility eligibility rules.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: The 8-Step Verification to Card Issuance Pipeline */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Verified Pipeline
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              From Registration to Active Health Card
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Every card is backed by genuine document verification and automated duplicate checks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">1</div>
              <h4 className="font-bold text-slate-900 text-sm">Create Account</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Verify your mobile number with secure OTP to establish your identity anchor.</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">2</div>
              <h4 className="font-bold text-slate-900 text-sm">Complete Profile</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Enter demographic data, address, emergency contact, and declared blood group.</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">3</div>
              <h4 className="font-bold text-slate-900 text-sm">Submit Documents</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Upload official photo ID. Document references are hashed; files encrypted in S3.</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">4</div>
              <h4 className="font-bold text-slate-900 text-sm">Duplicate Check</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Automated matching ensures no duplicate accounts exist for the same individual.</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">5</div>
              <h4 className="font-bold text-slate-900 text-sm">Officer Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Verification officers cross-verify document legibility and approve account.</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">6</div>
              <h4 className="font-bold text-slate-900 text-sm">Permanent Client ID</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Permanent AHCS Client ID issued with ISO/IEC 7064 check character.</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">7</div>
              <h4 className="font-bold text-slate-900 text-sm">Card Minted</h4>
              <p className="text-xs text-slate-600 leading-relaxed">ISO/IEC 7810 ID-1 card generated with dynamic 256-bit QR lookup token.</p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-300 bg-blue-50/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-700 text-white font-bold flex items-center justify-center text-sm">✓</div>
              <h4 className="font-bold text-blue-900 text-sm">Card Active</h4>
              <p className="text-xs text-blue-800 leading-relaxed">Activated via secure OTP/code; digital wallet ready; emergency break-glass live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DOCTOR CONSULTATIONS & DIGITAL CLINICAL RECORDS */}
      <section className="py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                <img
                  src="/images/doctor-consult.jpg"
                  alt="Doctor consulting patient in modern clinic"
                  className="w-full h-[380px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-600/90 font-bold">
                    Doctor Consultation Gateway
                  </span>
                  <h4 className="text-lg font-bold text-white">Verified Clinical Encounters</h4>
                  <p className="text-xs text-slate-300">
                    Encrypted clinical notes, diagnosis, and verified e-prescriptions linked to your permanent ID.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Zero File Clutter · Permanent Record Anchor</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Your Lifelong Medical History, <br />
                <span className="text-blue-700">Accessible Only With Consent</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Never carry thick paper files or lose diagnostic reports again. Doctors can record consultations, diagnosis, and prescriptions directly to your AHCS identity — but strictly when you grant temporary consent.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>Granular Patient Consent:</strong> You choose which doctor views your records, for 1 hour, 24 hours, or 7 days.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>1-Click Instant Revocation:</strong> Revoke doctor access in real time directly from your dashboard.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>Tamper-Proof Audit Trails:</strong> Every provider access is timestamped, IP-logged, and visible to you.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/providers"
                  className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm hover:text-blue-800 transition-colors"
                >
                  <span>Explore Verified Hospital Directory →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: BREAK-GLASS EMERGENCY & AMBULANCE RESPONSE */}
      <section className="py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                <Phone className="w-3.5 h-3.5" />
                <span>Life-Saving Golden Hour Protection</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Break-Glass Emergency Gateway: <br />
                <span className="text-rose-600">When Every Second Counts</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                In sudden road accidents, cardiac crises, or unconscious states, first responders and ER personnel scan your card’s QR or tap NFC to instantly retrieve life-saving vitals without passwords or biometric delays.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>Crucial Emergency Vitals:</strong> Blood group, primary emergency contacts, and life-threatening allergies.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>Privacy Isolated:</strong> General medical consultations and past diagnostic history remain 100% locked.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>Sub-Second Access:</strong> Works on standard mobile phone cameras without needing any proprietary apps.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span>Activate Your Free Emergency Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Image Showcase */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                <img
                  src="/images/emergency-care.jpg"
                  alt="Emergency response team and ambulance"
                  className="w-full h-[380px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-rose-600/90 font-bold">
                    Emergency Protocol 112
                  </span>
                  <h4 className="text-lg font-bold text-white">First Responder Ready</h4>
                  <p className="text-xs text-slate-300">
                    Standardized emergency landing page optimized for paramedics and hospital trauma centers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: PHYSICAL SMART CARD & HOSPITAL TAP */}
      <section className="py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                <img
                  src="/images/card-in-hand.jpg"
                  alt="Holding smart health card at clinic counter"
                  className="w-full h-[380px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-600/90 font-bold">
                    Physical Credential
                  </span>
                  <h4 className="text-lg font-bold text-white">Tap & Go Clinic Admission</h4>
                  <p className="text-xs text-slate-300">
                    High durability composite PVC card with gold EMV security and dynamic anti-counterfeiting token.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                <CreditCard className="w-3.5 h-3.5" />
                <span>ISO/IEC 7810 ID-1 Standard Credential</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Designed for Everyday Use, <br />
                <span className="text-blue-700">Built to Last a Lifetime</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The AHCS physical smart card fits in any standard wallet. It combines traditional physical durability with next-generation cryptographic verification to prevent identity fraud and duplicate health records.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Gold EMV Security</h4>
                  <p className="text-xs text-slate-500 mt-1">Embedded chip simulation architecture ready for cryptographic smart-card reader terminals.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Rotating Dynamic QR</h4>
                  <p className="text-xs text-slate-500 mt-1">256-bit cryptographically signed token prevents static QR cloning and replay attacks.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Contactless NFC</h4>
                  <p className="text-xs text-slate-500 mt-1">Instant tap with any NFC-enabled smartphone or tablet at reception desks.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">1-Click Replacement</h4>
                  <p className="text-xs text-slate-500 mt-1">Lost or stolen card? Immediately invalidate old tokens while keeping your permanent ID intact.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: NATIONWIDE NETWORK OF VERIFIED HOSPITALS & LABS */}
      <section className="py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 mb-12">
            <img
              src="/images/hospital-network.jpg"
              alt="Modern Indian hospital reception and facilities"
              className="w-full h-[320px] sm:h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/30" />
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center max-w-2xl text-white space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-blue-600 font-bold w-max">
                Verified Health Network
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                Connected with India&apos;s Premier Hospitals & Diagnostic Centers
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Seamless admission, verified clinician lookups, and standardized e-prescriptions across accredited private facilities and medical practitioners nationwide.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/providers"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-md transition-all"
                >
                  Search Verified Providers
                </Link>
                <Link
                  href="/provider/portal"
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold text-xs backdrop-blur-md transition-all"
                >
                  Healthcare Provider Login
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Your Free AHCS Health Card Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
