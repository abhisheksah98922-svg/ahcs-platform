'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Building2, 
  HeartHandshake, 
  Clock, 
  Phone,
  CheckCircle2,
  ArrowRight,
  Truck,
  Home,
  FlaskConical,
  Video,
  Users,
  Search,
  AlertCircle,
  FileText,
  Activity,
  HeartPulse,
  Stethoscope,
  Pill,
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function HomePage() {
  const trustCards = [
    {
      title: 'Verified Client Identity',
      desc: 'Unique private AHCS Client ID generated following document verification and duplicate checking.',
      icon: ShieldCheck,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      title: 'QR + NFC Smart Card',
      desc: 'High-security physical and digital cards with dynamic QR tokens and tap-to-verify NFC credentials.',
      icon: CreditCard,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Digital Health Records',
      desc: 'Patient-directed clinical vault with end-to-end encryption and granular, revocable consent controls.',
      icon: FileText,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Healthcare Network',
      desc: 'Verified partner hospitals, clinics, diagnostic centers, and pharmacies across Indian districts.',
      icon: Building2,
      color: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    {
      title: 'Emergency Assistance',
      desc: 'Rapid break-glass profile access, emergency contact notification, and nearby facility discovery.',
      icon: ShieldAlert,
      color: 'text-rose-700 bg-rose-50 border-rose-200'
    },
    {
      title: 'Family Health Access',
      desc: 'Manage elderly parents and dependents under a single family health portal with role-based access.',
      icon: Users,
      color: 'text-purple-700 bg-purple-50 border-purple-200'
    }
  ];

  const servicesList = [
    {
      title: 'Mobile Medical Units',
      desc: 'Healthcare services brought closer to communities, workplaces and organizations with mobile screening vans.',
      icon: Truck,
      href: '/services/mobile-medical',
      tag: 'On-Site Delivery',
      tagColor: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Home Healthcare',
      desc: 'Coordinate eligible home-based nursing, post-discharge dressing, elder assistance and physiotherapy.',
      icon: Home,
      href: '/services/home-care',
      tag: 'Doorstep Nursing',
      tagColor: 'bg-indigo-50 text-indigo-700'
    },
    {
      title: 'Diagnostic Testing',
      desc: 'Diagnostic pathology tests and home sample collection through accredited participating diagnostic labs.',
      icon: FlaskConical,
      href: '/services/diagnostics',
      tag: 'NABL Partners',
      tagColor: 'bg-teal-50 text-teal-700'
    },
    {
      title: 'Telemedicine Consultations',
      desc: 'Remote consultations through participating licensed medical practitioners with digital e-prescriptions.',
      icon: Video,
      href: '/services/telemedicine',
      tag: 'Network Onboarding',
      tagColor: 'bg-amber-50 text-amber-800'
    },
    {
      title: 'Worksite Health Camps',
      desc: 'Preventive health screening drives tailored for factory workforces, corporate offices and housing societies.',
      icon: Users,
      href: '/services/health-camps',
      tag: 'Corporate & Society',
      tagColor: 'bg-purple-50 text-purple-700'
    },
    {
      title: 'Hospital & Clinic Network',
      desc: 'Find participating clinics and multi-specialty hospitals offering member concessions and digital onboarding.',
      icon: Stethoscope,
      href: '/providers',
      tag: 'Verified Directory',
      tagColor: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'Pharmacy Network',
      desc: 'Access participating retail pharmacies for genuine medicines, e-prescription sync and member discounts.',
      icon: Pill,
      href: '/services/pharmacy',
      tag: 'Prescription Savings',
      tagColor: 'bg-rose-50 text-rose-700'
    },
    {
      title: 'Emergency Assistance',
      desc: 'Break-glass clinical profile access, emergency contact notification, and hospital facility discovery.',
      icon: ShieldAlert,
      href: '/emergency',
      tag: '24/7 Access Gateway',
      tagColor: 'bg-red-50 text-red-700'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">

      <main className="flex-1">
        {/* 1. COMPLETELY NEW HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white border-b border-slate-200/80 py-16 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-60 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Headlines & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>Private Healthcare Access & Assistance Network</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                  Healthcare Access, <br />
                  <span className="text-blue-700">Connected.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                  One private healthcare network connecting your digital health identity, healthcare providers, care services and emergency assistance.
                </p>

                {/* 3 Clear Action Paths */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/apply"
                    className="px-7 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-700/25 transition-all flex items-center gap-2 group"
                  >
                    <span>Get Your AHCS ID</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/find-care"
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-300 hover:border-slate-400 transition-all flex items-center gap-2 shadow-xs"
                  >
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>Find Healthcare</span>
                  </Link>

                  <Link
                    href="/services"
                    className="px-5 py-3.5 rounded-xl text-blue-700 hover:text-blue-800 font-bold text-sm hover:underline transition-all"
                  >
                    Explore Services →
                  </Link>
                </div>

                {/* Direct Regulatory Badge */}
                <div className="pt-4 border-t border-slate-200/80 flex items-start gap-2.5 max-w-lg">
                  <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    AHCS is an independent private healthcare network. Not affiliated with government health portals, Aadhaar, or ABHA.
                  </p>
                </div>
              </div>

              {/* Right Column: Custom AHCS Healthcare Ecosystem Visualization */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 relative overflow-hidden">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                    <span>The Connected Ecosystem</span>
                    <span className="text-blue-600 font-mono text-[10px] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      AHCS ARCHITECTURE
                    </span>
                  </div>

                  {/* Flow Diagram */}
                  <div className="space-y-3">
                    {/* Node 1: Person */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                          👤
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Individual & Family</div>
                          <div className="text-[11px] text-slate-500">Citizen Mobile Enrollment</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">STEP 1</span>
                    </div>

                    <div className="flex justify-center -my-1 text-slate-400 text-xs">↓</div>

                    {/* Node 2: AHCS Client ID */}
                    <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-700 text-white font-bold flex items-center justify-center text-xs">
                          ID
                        </div>
                        <div>
                          <div className="text-xs font-bold text-blue-950">Permanent AHCS Client ID</div>
                          <div className="text-[11px] text-blue-700 font-mono">AHCS-XXXX-XXXX</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">VERIFIED</span>
                    </div>

                    <div className="flex justify-center -my-1 text-slate-400 text-xs">↓</div>

                    {/* Node 3: Smart Health Card */}
                    <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white font-bold flex items-center justify-center text-sm">
                          💳
                        </div>
                        <div>
                          <div className="text-xs font-bold text-indigo-950">Smart Health Card (QR + NFC)</div>
                          <div className="text-[11px] text-indigo-700">Encrypted Break-Glass Profile</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">PHYSICAL / DIGITAL</span>
                    </div>

                    <div className="flex justify-center -my-1 text-slate-400 text-xs">↓</div>

                    {/* Node 4: Healthcare Network Grid */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-white">
                      <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2">
                        Participating Care Network
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                        <div className="p-1.5 rounded-lg bg-white/10">🏥 Hospitals</div>
                        <div className="p-1.5 rounded-lg bg-white/10">🩺 Clinics</div>
                        <div className="p-1.5 rounded-lg bg-white/10">🔬 Labs</div>
                        <div className="p-1.5 rounded-lg bg-white/10">💊 Pharmacy</div>
                        <div className="p-1.5 rounded-lg bg-white/10">🚐 Mobile Med</div>
                        <div className="p-1.5 rounded-lg bg-white/10">🏡 Home Care</div>
                        <div className="p-1.5 rounded-lg bg-white/10">💻 Tele-Med</div>
                        <div className="p-1.5 rounded-lg bg-white/10">🚨 Emergency</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. TRUST SECTION — "Your Healthcare Access Layer" */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
              Platform Architecture
            </h2>
            <h3 className="text-3xl font-black text-slate-950 tracking-tight">
              Your Healthcare Access Layer
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Engineered as an independent coordination and access network to deliver verified identity, life-saving emergency data access, and patient-directed records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${card.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {card.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. NEW "WHAT IS AHCS?" SECTION */}
        <section className="bg-slate-50 border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Unified Ecosystem
              </h2>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">
                One Platform. Multiple Healthcare Connections.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                AHCS removes the friction between finding healthcare, proving clinical history, and getting emergency assistance across private clinics, diagnostic centers, and hospitals.
              </p>
            </div>

            {/* 6 Step Horizontal Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mx-auto mb-3">1</div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">User Registers</h4>
                <p className="text-[11px] text-slate-500">Fast mobile OTP authentication</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mx-auto mb-3">2</div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Client ID Issued</h4>
                <p className="text-[11px] text-slate-500">Permanent verified health identity</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mx-auto mb-3">3</div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Smart Card</h4>
                <p className="text-[11px] text-slate-500">QR + NFC chip in your pocket</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mx-auto mb-3">4</div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Care Services</h4>
                <p className="text-[11px] text-slate-500">Mobile units, home care, diagnostics</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mx-auto mb-3">5</div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Providers</h4>
                <p className="text-[11px] text-slate-500">Participating clinics & hospitals</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mx-auto mb-3">6</div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">Health Records</h4>
                <p className="text-[11px] text-slate-500">Consent-vaulted lifelong records</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HEALTHCARE SERVICES SECTION (8 Professional Cards) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Coordinated Care Delivery
              </h2>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">
                Healthcare Services
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                Explore our full suite of care access programs connecting members with verified clinicians and diagnostics.
              </p>
            </div>

            <Link
              href="/services"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 shrink-0"
            >
              <span>View All 8 Services Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesList.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${service.tagColor}`}>
                        {service.tag}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base mb-2">
                      {service.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {service.desc}
                    </p>
                  </div>

                  <Link
                    href={service.href}
                    className="inline-flex items-center justify-between w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-800 transition-all"
                  >
                    <span>Explore {service.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. SMART CARD FEATURE SPOTLIGHT */}
        <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white py-16 sm:py-20 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                  <CreditCard className="w-4 h-4" />
                  <span>Physical & Digital Credential</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Your AHCS Identity. In Your Pocket.
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  A high-security, debit-card-size physical card embedded with an NFC chip and tamper-evident rotating QR code. Present it at participating clinics, diagnostic centers, and pharmacies for instant verification and emergency access.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>NFC Tap-to-Verify Integration</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Rotating QR Dynamic Token</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero Medical Data inside NFC/QR</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>One-Tap Lost Card Blocking</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/smart-card"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>View Card Specifications</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/verify"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all"
                  >
                    Verify a Card
                  </Link>
                </div>
              </div>

              {/* Realistic Card Visual Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-6 shadow-2xl border border-blue-400/30 flex flex-col justify-between relative overflow-hidden text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black tracking-tight">AHCS</div>
                      <div className="text-[9px] uppercase tracking-wider text-blue-200">Advanced Health Care System</div>
                    </div>
                    <div className="text-[11px] font-mono border border-white/30 px-2 py-0.5 rounded bg-white/10">
                      NFC ENABLED
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase text-blue-200">Member Name</div>
                    <div className="text-base font-bold tracking-wide">VIKRAMADITYA SENGUPTA</div>
                    <div className="text-xs font-mono text-blue-300">AHCS-DEL-2025-1048</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[10px] text-blue-200">
                    <div>EXP: 12/2028</div>
                    <div className="font-bold text-emerald-300">● ACTIVE STATUS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. EMERGENCY ASSISTANCE CALLOUT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Life-Safety Protocols</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-950">
                Need Immediate Medical Help?
              </h3>
              <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                For life-threatening emergencies, dial <strong>112</strong> or proceed immediately to the nearest casualty department. AHCS provides rapid emergency profile break-glass access, family contact notification, and participating hospital discovery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/emergency"
                className="px-6 py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md text-center"
              >
                Emergency Assistance Hub
              </Link>
              <Link
                href="/find-care?category=HOSPITAL"
                className="px-6 py-3.5 bg-white hover:bg-rose-100/50 text-rose-950 font-bold text-xs sm:text-sm rounded-xl border border-rose-300 transition-all text-center"
              >
                Find Nearest Hospital
              </Link>
            </div>
          </div>
        </section>

        {/* 7. PARTNER & CORPORATE CALLOUT */}
        <section className="bg-slate-50 border-t border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">For Healthcare Providers</span>
                  <h4 className="text-xl font-bold text-slate-900 mt-4 mb-2">Join the AHCS Care Network</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    Connect your hospital, clinic, diagnostic lab, or pharmacy to thousands of verified AHCS cardholders. Streamline patient onboarding and enable consent-gated electronic records.
                  </p>
                </div>
                <Link
                  href="/partner"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all inline-flex items-center justify-between"
                >
                  <span>Apply as Healthcare Partner</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">For Employers & Factories</span>
                  <h4 className="text-xl font-bold text-slate-900 mt-4 mb-2">Corporate Health Plans</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    Organize turnkey worksite medical camps, statutory factory health audits, pre-employment checkups, and smart health cards for your employees.
                  </p>
                </div>
                <Link
                  href="/corporate"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all inline-flex items-center justify-between"
                >
                  <span>Explore Corporate Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
