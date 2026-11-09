import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  PhoneCall,
  Building2,
  Users,
  QrCode,
  Lock,
  AlertTriangle,
  ArrowRight,
  Clock,
  HeartPulse,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  BellRing,
  History,
} from 'lucide-react';

export const metadata = {
  title: 'Emergency Break-Glass Gateway & Assistance | AHCS',
  description:
    'Life-critical emergency vitals access protocols, break-glass profile mechanism, family emergency alerts, and acute trauma directives.',
};

export default function EmergencyHubPage() {
  const breakGlassPillars = [
    {
      title: 'Authorized Clinical Emergency Access',
      desc: 'First responders, EMTs, and ER trauma clinicians can scan the card QR with any smartphone to view life-critical details without entering passwords or app logins.',
      icon: QrCode,
      color: 'text-[#D64545]',
      bg: 'bg-rose-50',
    },
    {
      title: 'Documented Reason & Time Limits',
      desc: 'Access is restricted to acute clinical necessity. Emergency sessions automatically expire after the trauma window, preventing persistent unattended sessions.',
      icon: Clock,
      color: 'text-[#1769AA]',
      bg: 'bg-blue-50',
    },
    {
      title: 'Instant Family SMS Broadcast',
      desc: 'The exact moment an emergency scan is performed, automated SMS notifications are dispatched to all registered primary emergency contacts with hospital location data.',
      icon: BellRing,
      color: 'text-[#D99A24]',
      bg: 'bg-amber-50',
    },
    {
      title: 'Immutable Audit Ledger',
      desc: 'Every break-glass request records exact timestamp, geolocation telemetry, IP address, and scanner browser signature into an unalterable compliance ledger.',
      icon: History,
      color: 'text-[#16865C]',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* 1. URGENT 112 DIRECTIVE BANNER */}
      <section className="bg-[#D64545] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-black tracking-widest text-red-200 block">
                NATIONAL MEDICAL EMERGENCY DIRECTIVE
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
                Experiencing an Acute Life-Threatening Medical Emergency?
              </h1>
              <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl leading-relaxed">
                For cardiac arrest, severe trauma, stroke, choking, or active hemorrhage, <strong>call 112 or 108 immediately</strong> or proceed directly to the nearest hospital casualty emergency room.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href="tel:112"
              className="px-6 py-3.5 bg-white text-[#D64545] hover:bg-red-50 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md text-center"
            >
              CALL 112 NOW
            </a>
            <Link
              href="/find-care?category=HOSPITAL"
              className="px-6 py-3.5 bg-[#102A43] hover:bg-[#0B1D2F] text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all text-center"
            >
              Find Nearest Hospital Casualty
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY DEMARCATION */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-4 sm:p-5 shadow-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-[#66788A] leading-relaxed">
            <strong className="text-[#172B4D] font-bold">Important Clinical Advisory:</strong> AHCS is an assistive health identity and medical data coordination platform. AHCS does not dispatch ambulances, run independent paramedic squads, or replace emergency government rescue services.
          </p>
        </div>
      </div>

      {/* 3. BREAK-GLASS MECHANISM EXPLANATION */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Golden Hour Triage Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              How the AHCS Break-Glass System Works
            </h2>
            <p className="text-xs sm:text-sm text-[#66788A] mt-2">
              In high-stress trauma admissions, unconscious patients cannot unlock phones or remember medication histories. The Break-Glass QR bridges this critical information gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {breakGlassPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-[#1769AA]/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl ${pillar.bg} ${pillar.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#172B4D]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#66788A] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. WHAT IS DISPLAYED VS WHAT IS PROTECTED */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Data Minimization
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#172B4D] mt-3">
              Selective Disclosure During Emergencies
            </h3>
            <p className="text-xs text-[#66788A] mt-1">
              Strictly adheres to DPDP Act 2023 emergency access exceptions by releasing only life-critical parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#16865C]" />
                <span>EXPOSED IN BREAK-GLASS (LIFE-SAVING VITALS):</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16865C]" />
                  <span>Cardholder Full Name & Date of Birth</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16865C]" />
                  <span>ABO & Rh Blood Group & Transfusion Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16865C]" />
                  <span>Severe Known Drug Allergies (e.g. Penicillin, NSAIDs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16865C]" />
                  <span>Critical Implants / Conditions (e.g. Pacemaker, Cardiac Stents)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16865C]" />
                  <span>Primary & Secondary Emergency Contact Phone Numbers</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                <Lock className="w-4 h-4 text-[#D64545]" />
                <span>KEPT STRICTLY PRIVATE & LOCKED:</span>
              </div>
              <ul className="space-y-2 text-xs text-rose-950">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D64545]" />
                  <span>Full Historical Clinical Consultations & Notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D64545]" />
                  <span>Uploaded Diagnostic Scans & Lab Test PDFs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D64545]" />
                  <span>Private Psychiatric or Reproductive Health Records</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D64545]" />
                  <span>Financial, Billing & Insurance Records</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D64545]" />
                  <span>Identity Proof Documents (Aadhaar/PAN Vault Files)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. INTERACTIVE BREAK-GLASS PREVIEW STRIP */}
        <div className="bg-[#102A43] text-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#0B1D2F] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg sm:text-xl font-bold">Want to inspect what an emergency responder sees?</h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Explore the live Break-Glass Emergency Gateway demonstration to verify the exact minimal vitals rendered during a triage scan.
            </p>
          </div>
          <Link
            href="/emergency-preview"
            className="px-6 py-3.5 bg-[#D64545] hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shrink-0 shadow-sm flex items-center gap-2"
          >
            <span>Inspect Emergency Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
