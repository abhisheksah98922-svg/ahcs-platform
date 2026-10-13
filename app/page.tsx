'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  QrCode,
  AlertCircle,
  Truck,
  Home,
  FlaskConical,
  Video,
  Pill,
  HeartPulse,
  Stethoscope,
  ShieldAlert,
  Sparkles,
  Zap,
  Eye,
  UserCheck,
  ChevronRight,
  Activity,
  Layers,
  FileText,
  Cpu,
  BarChart3,
  Server,
  Database,
  Radio,
  Fingerprint
} from 'lucide-react';
import { SmartCardInteractive } from '@/components/SmartCardInteractive';

export default function HomePage() {
  const [activeServiceTab, setActiveServiceTab] = useState<'ALL' | 'CARE' | 'CLINICAL' | 'EMERGENCY'>('ALL');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);

  const careServices = [
    {
      id: 'mobile-medical',
      category: 'CARE',
      title: 'Mobile Medical Units',
      desc: 'Smart hospital vans with GPS dispatch, digital vitals testing, and on-board physician consultation.',
      icon: Truck,
      href: '/services/mobile-medical',
      tag: 'ON-DEMAND VAN',
      tagColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80'
    },
    {
      id: 'home-care',
      category: 'CARE',
      title: 'Home Care & Nursing',
      desc: 'Certified post-surgery clinical nurses, elder caregivers, and physiotherapists delivered at your home.',
      icon: Home,
      href: '/services/home-care',
      tag: 'DOORSTEP CARE',
      tagColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
    },
    {
      id: 'diagnostics',
      category: 'CLINICAL',
      title: 'NABL Diagnostic Labs',
      desc: 'Automated sample pickup with encrypted QR report sync straight into your personal records vault.',
      icon: FlaskConical,
      href: '/services/diagnostics',
      tag: 'LAB ACCREDITED',
      tagColor: 'bg-amber-950/80 text-amber-300 border-amber-800/80'
    },
    {
      id: 'telemedicine',
      category: 'CLINICAL',
      title: 'Telemedicine Consultations',
      desc: 'Real-time encrypted audio/video consultations with board-certified doctors & digital prescriptions.',
      icon: Video,
      href: '/services/telemedicine',
      tag: 'HD TELEMED',
      tagColor: 'bg-purple-950/80 text-purple-300 border-purple-800/80'
    },
    {
      id: 'pharmacy',
      category: 'CLINICAL',
      title: 'Retail Pharmacy Network',
      desc: 'Direct partner pharmacy integration for authentic medicine dispensing & immediate member concessions.',
      icon: Pill,
      href: '/services/pharmacy',
      tag: 'VERIFIED PHARMA',
      tagColor: 'bg-sky-950/80 text-sky-300 border-sky-800/80'
    },
    {
      id: 'health-camps',
      category: 'CARE',
      title: 'Preventive Health Camps',
      desc: 'Full-spectrum preventive screenings and ECG/blood checks organized for corporate sites and societies.',
      icon: HeartPulse,
      href: '/services/health-camps',
      tag: 'PREVENTIVE',
      tagColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80'
    },
    {
      id: 'senior-care',
      category: 'CARE',
      title: 'Geriatric & Senior Wellness',
      desc: 'Continuous vital monitoring, chronic illness tracking, and dedicated geriatric health coordinators.',
      icon: Stethoscope,
      href: '/services/senior-care',
      tag: 'ELDER CARE',
      tagColor: 'bg-teal-950/80 text-teal-300 border-teal-800/80'
    },
    {
      id: 'emergency',
      category: 'EMERGENCY',
      title: '24x7 Break-Glass Gateway',
      desc: 'Instant vital retrieval (blood group, critical allergies, contacts) without passwords for hospital trauma ERs.',
      icon: ShieldAlert,
      href: '/emergency',
      tag: '112 READY',
      tagColor: 'bg-rose-950/80 text-rose-300 border-rose-800/80'
    }
  ];

  const filteredServices = activeServiceTab === 'ALL' 
    ? careServices 
    : careServices.filter(s => s.category === activeServiceTab);

  const telemetryMetrics = [
    { label: 'ACTIVE SYSTEM NODES', value: '100% ONLINE', sub: 'Zero downtime ledger', color: 'text-emerald-400' },
    { label: 'IDENTITY STANDARD', value: 'ISO 7810 ID-1', sub: 'Standard CR80 85.6mm', color: 'text-cyan-400' },
    { label: 'RECORD VAULT ENCRYPTION', value: 'AES-256-GCM', sub: 'SHA-256 integrity check', color: 'text-sky-400' },
    { label: 'BREAK-GLASS LATENCY', value: '< 1.2 SEC', sub: 'Instant camera QR access', color: 'text-amber-400' },
  ];

  const pipeline = [
    { num: '01', title: 'Cryptographic Auth', desc: 'Single-use cryptographic OTP verification prevents bots and ensures account ownership.', badge: 'NODE 01' },
    { num: '02', title: 'Demographics & Vitals', desc: 'Secure input of legal name, blood group, emergency numbers, and life-critical tags.', badge: 'NODE 02' },
    { num: '03', title: 'Encrypted ID Upload', desc: 'Aadhaar, PAN, or Passport hashed via SHA-256 and locked into AES-256 private vault.', badge: 'NODE 03' },
    { num: '04', title: 'Desk Officer Audit', desc: 'Human verification desk audits documents against fraud registries before authorization.', badge: 'NODE 04' },
    { num: '05', title: 'Permanent Client ID', desc: 'Unique ISO/IEC 7064 Mod 97-10 checksum verified Client ID permanently minted.', badge: 'NODE 05' },
    { num: '06', title: 'Smart Card Minting', desc: 'Physical frosted platinum PVC card with contactless NFC and dynamic QR issued.', badge: 'NODE 06' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 1. TOP STATUTORY INTEGRITY STRIP */}
      <section className="bg-[#03060d] border-b border-slate-800/80 px-4 py-2 text-[11px] text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse shrink-0" />
            <span>
              <strong className="text-slate-200">STATUTORY NOTICE:</strong> AHCS is an independent private healthcare infrastructure network. Not affiliated with UIDAI (Aadhaar), ABHA, or government schemes.
            </span>
          </div>
          <Link
            href="/terms"
            className="text-cyan-400 hover:text-cyan-300 underline font-semibold shrink-0"
          >
            Governance Standards →
          </Link>
        </div>
      </section>

      {/* 2. HIGH-DENSITY CYBER HERO SECTION */}
      <section className="relative isolate overflow-hidden py-14 sm:py-20 border-b border-slate-800/80 bg-[#080d1a] bg-cyber-grid">
        {/* Ambient Cyan / Royal Glow Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Tech Console Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* High-Tech Terminal Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)] text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
                <span className="text-cyan-400 font-bold">AHCS v2.4 PROTOCOL</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">SECURE HEALTH IDENTITY & SMART CARD</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Next-Gen Healthcare Identity, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                  Cryptographically Protected.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl leading-relaxed">
                One verified, tamper-evident private health ID connecting your encrypted medical vault, participating hospital networks, and instant 112 emergency break-glass vitals.
              </p>

              {/* 4 Tech Dashboard Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {telemetryMetrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
                    <div className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">{m.label}</div>
                    <div className={`text-base font-black font-mono mt-1 ${m.color}`}>{m.value}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Cpu className="w-4 h-4 text-slate-950" />
                  <span>APPLY FOR CLIENT ID</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Verify Card Online</span>
                </Link>

                <Link
                  href="/emergency-preview"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 font-bold text-xs sm:text-sm border border-rose-800/80 transition-all"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Emergency Simulator</span>
                </Link>
              </div>

            </div>

            {/* Right Card Showcase Column (Simplified Real-World Card Mockup) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Backlight Cyber Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl -z-10" />

                {/* Smart Card Component */}
                <SmartCardInteractive initialTheme="platinum" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE HEALTHCARE ECOSYSTEM DIRECTORY */}
      <section className="py-16 bg-[#0a0f1e] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-mono font-bold border border-cyan-800/80 mb-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>ECOSYSTEM SERVICES DIRECTORY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Integrated Healthcare Infrastructure
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                On-demand diagnostic tests, certified nurses, and mobile medical vans coordinated directly through your verified AHCS ID.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shrink-0 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveServiceTab('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeServiceTab === 'ALL'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ALL
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('CARE')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeServiceTab === 'CARE'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CARE UNITS
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('CLINICAL')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeServiceTab === 'CLINICAL'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CLINICS & LABS
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('EMERGENCY')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeServiceTab === 'EMERGENCY'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EMERGENCY
              </button>
            </div>
          </div>

          {/* High-Density Service Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group bg-slate-900/60 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${service.tagColor}`}>
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors mb-1.5">
                      {service.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Access Node</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. CLEAR DEMARCATION PROTOCOL (SIDE-BY-SIDE MATRIX) */}
      <section className="py-16 bg-[#070b14] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-3 py-1 rounded-full">
              STATUTORY DEMARCATION PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2.5">
              Transparent Demarcation. Uncompromising Clarity.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Know exactly how your healthcare identity functions and where state authority boundaries reside.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* WHAT AHCS IS */}
            <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">What AHCS Is</h3>
                  <p className="text-xs text-emerald-400 font-mono font-semibold">Private Healthcare Infrastructure</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Private healthcare identity verification and assistance platform.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unique Client ID issued only after human officer document validation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Smart Health Card carrying rotating, revocable cryptographic tokens.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Citizen-directed consent vault for sharing clinical summaries.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>24x7 break-glass emergency vitals access with immutable audit logging.</span>
                </li>
              </ul>
            </div>

            {/* WHAT AHCS IS NOT */}
            <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-rose-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">What AHCS Is NOT</h3>
                  <p className="text-xs text-rose-400 font-mono font-semibold">Strict Regulatory Boundaries</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>NOT a government agency</strong>, Aadhaar (UIDAI), ABHA, or Ayushman Bharat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>NOT an insurance provider</strong>; does not underwrite financial claims.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>NOT a clinic or hospital</strong>; does not directly employ attending clinicians.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Does NOT guarantee hospital beds</strong> or medical outcomes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Never makes misleading claims like &quot;100% free treatment everywhere&quot;.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 6-STAGE VERIFICATION PIPELINE */}
      <section className="py-16 bg-[#0a0f1e] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-3 py-1 rounded-full">
              ISSUANCE STATE MACHINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2.5">
              How Your Verified AHCS ID is Issued
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Every permanent AHCS Client ID is bound to a verified citizen identity through officer review and anti-fraud deduplication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipeline.map((step, idx) => (
              <div
                key={step.num}
                onClick={() => setActivePipelineStep(idx + 1)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  activePipelineStep === idx + 1
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>START CITIZEN ENROLLMENT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CLINICAL DOCTOR & CONSENT SHOWCASE */}
      <section className="py-16 bg-[#070b14] border-b border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
                <img
                  src="/images/doctor-consult.jpg"
                  alt="Doctor clinical consultation"
                  className="w-full h-[360px] object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold">
                    CLINICAL ACCESS GATEWAY
                  </span>
                  <h4 className="text-base font-bold text-white">Doctor Encounters & E-Prescriptions</h4>
                  <p className="text-xs text-slate-300">
                    Encrypted clinical notes linked to your permanent ID with explicit time-bound patient consent.
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-mono font-semibold border border-cyan-800">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>ZERO FILE CLUTTER · ENCRYPTED VAULT</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Your Lifelong Medical History, <br />
                <span className="text-cyan-400">Accessible Only With Patient Consent</span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Never lose lab reports or carry paper files again. Participating clinicians record consultations directly to your AHCS credential — only when you approve access via real-time consent.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Granular Time Limits:</strong> Grant doctor access for 1 hour, 24 hours, or 7 days only.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Instant 1-Click Revocation:</strong> Revoke any doctor or hospital at any time from your dashboard.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Immutable Audit Trails:</strong> Timestamp, IP address, and accessing doctor credentials recorded permanently.</span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/find-care"
                  className="inline-flex items-center gap-1.5 text-cyan-400 font-bold text-xs hover:text-cyan-300 transition-colors"
                >
                  <span>Explore Verified Hospital Directory →</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. EMERGENCY AMBULANCE RESPONSE (GOLDEN HOUR) */}
      <section className="py-16 bg-[#0a0f1e] border-b border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 text-xs font-mono font-semibold border border-rose-800">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>LIFE-SAVING GOLDEN HOUR PROTOCOL</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Break-Glass Emergency Gateway: <br />
                <span className="text-rose-400">When Seconds Count</span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                In sudden trauma or unconscious states, paramedics and trauma ERs scan your card&apos;s dynamic QR to retrieve life-saving vitals in sub-seconds without passwords.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Vital Demographics Only:</strong> Blood group, primary emergency contacts, and life-threatening allergies.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Privacy Preserved:</strong> General consultation notes and past prescriptions remain 100% locked.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Zero App Dependency:</strong> Scannable directly on any standard iOS or Android camera.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span>Activate Emergency Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/emergency-preview"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                >
                  <span>Test Emergency Simulator</span>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
                <img
                  src="/images/emergency-care.jpg"
                  alt="Emergency ambulance response"
                  className="w-full h-[360px] object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold">
                    EMERGENCY DISPATCH 112
                  </span>
                  <h4 className="text-base font-bold text-white">First Responder Ready</h4>
                  <p className="text-xs text-slate-300">
                    Standardized emergency landing page optimized for paramedics and hospital trauma centers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. NATIONWIDE HEALTHCARE NETWORK */}
      <section className="py-16 bg-[#070b14] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <img
              src="/images/hospital-network.jpg"
              alt="Connected hospital network"
              className="w-full h-[320px] sm:h-[380px] object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center max-w-2xl text-white space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold w-max">
                VERIFIED CLINICAL NETWORK
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Connecting Hospitals, Diagnostic Centers, and Pharmacies
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Interoperable check-ins, audited record access, and streamlined admission verification across participating accredited healthcare institutions.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/find-care"
                  className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-bold text-xs shadow-md shadow-cyan-400/20 transition-all"
                >
                  Search Verified Providers
                </Link>
                <Link
                  href="/partner"
                  className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl font-bold text-xs border border-slate-700 transition-all"
                >
                  Partner Facility Onboarding
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. LIFE-SAFETY ADVISORY 112 */}
      <section className="bg-[#03060d] text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>STATUTORY LIFE-SAFETY ADVISORY</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">In a medical emergency, call 112 immediately.</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              AHCS break-glass QR is an assistive profile retrieval tool for treating practitioners. Do not delay emergency transport for digital scanning.
            </p>
          </div>
          <Link
            href="/verify"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 font-mono text-xs font-bold border border-slate-700 transition-colors shrink-0"
          >
            Access Verification Desk
          </Link>
        </div>
      </section>

    </div>
  );
}
