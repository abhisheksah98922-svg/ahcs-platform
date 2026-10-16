'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  Activity,
  Layers,
  FileText,
  ChevronRight,
  Search,
  UserCheck,
  Fingerprint,
  Share2
} from 'lucide-react';
import { SmartCardInteractive } from '@/components/SmartCardInteractive';

export default function HomePage() {
  const router = useRouter();
  const [activeServiceTab, setActiveServiceTab] = useState<'ALL' | 'CARE' | 'CLINICAL' | 'EMERGENCY'>('ALL');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [quickVerifyInput, setQuickVerifyInput] = useState<string>('');

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickVerifyInput.trim()) {
      router.push(`/verify?query=${encodeURIComponent(quickVerifyInput.trim())}`);
    } else {
      router.push('/verify');
    }
  };

  const careServices = [
    {
      id: 'mobile-medical',
      category: 'CARE',
      title: 'Mobile Medical Units',
      desc: 'Equipped healthcare vans with on-site digital vitals screening and physician consultation for societies and worksites.',
      icon: Truck,
      href: '/services/mobile-medical',
      tag: 'On-Demand Van',
      tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'home-care',
      category: 'CARE',
      title: 'Home Healthcare & Nursing',
      desc: 'Certified post-hospitalization nurses, elder caregivers, and physiotherapy attendants delivered at your doorstep.',
      icon: Home,
      href: '/services/home-care',
      tag: 'Doorstep Care',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'diagnostics',
      category: 'CLINICAL',
      title: 'Diagnostic Lab Tests',
      desc: 'NABL-partnered pathology tests and diagnostic checkup packages with doorstep sample collection and digital report vault.',
      icon: FlaskConical,
      href: '/services/diagnostics',
      tag: 'NABL Certified',
      tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 'telemedicine',
      category: 'CLINICAL',
      title: 'Telemedicine Consultations',
      desc: 'Connect remotely with verified medical specialists and receive authenticated digital prescriptions directly to your vault.',
      icon: Video,
      href: '/services/telemedicine',
      tag: 'Instant Video',
      tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      id: 'pharmacy',
      category: 'CLINICAL',
      title: 'Pharmacy Network',
      desc: 'Access verified retail network pharmacies for genuine medicines, e-prescription sync, and direct member concessions.',
      icon: Pill,
      href: '/services/pharmacy',
      tag: 'Genuine Sync',
      tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'health-camps',
      category: 'CARE',
      title: 'Health Camps & Screening',
      desc: 'Organized preventive screening camps and workplace health checkups for corporate campuses and residential societies.',
      icon: HeartPulse,
      href: '/services/health-camps',
      tag: 'Community Camps',
      tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 'senior-care',
      category: 'CARE',
      title: 'Senior & Geriatric Care',
      desc: 'Personalized elderly health monitoring, regular vitals tracking, and dedicated caregiver coordination.',
      icon: Stethoscope,
      href: '/services/senior-care',
      tag: 'Senior Wellness',
      tagColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    },
    {
      id: 'emergency',
      category: 'EMERGENCY',
      title: 'Emergency Assistance',
      desc: '24/7 break-glass medical profile retrieval, next-of-kin emergency notification, and hospital facility discovery.',
      icon: ShieldAlert,
      href: '/emergency',
      tag: 'Golden Hour 112',
      tagColor: 'bg-red-500/10 text-red-400 border-red-500/20'
    }
  ];

  const filteredServices = activeServiceTab === 'ALL' 
    ? careServices 
    : careServices.filter(s => s.category === activeServiceTab);

  const verificationStages = [
    {
      step: '01',
      title: 'Mobile Ownership & Account Sign-Up',
      statusTag: 'REGISTERED',
      desc: 'Real-time cryptographic OTP validation confirms mobile number ownership, eliminating simulated account creation.',
      icon: Phone,
      badge: 'Step 1'
    },
    {
      step: '02',
      title: 'Personal Profile & KYC Submission',
      statusTag: 'DOCUMENTS_SUBMITTED',
      desc: 'Encrypted submission of legal identity and KYC documentation stored in an AES-256 private document vault.',
      icon: FileCheck2,
      badge: 'Step 2'
    },
    {
      step: '03',
      title: 'Officer Audit & Duplicate Detection',
      statusTag: 'UNDER_REVIEW',
      desc: 'Authorized Verification Officers perform manual and algorithmic duplicate checks before identity approval.',
      icon: UserCheck,
      badge: 'Step 3'
    },
    {
      step: '04',
      title: 'Permanent Client ID & Card Minting',
      statusTag: 'APPROVED & ACTIVE',
      desc: 'System atomically generates an immutable AHCS Client ID with ISO 7064 check digits and binds dynamic QR/NFC tokens.',
      icon: CreditCard,
      badge: 'Step 4'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* 1. HERO SECTION: Executive Tech Aesthetic with Blue Ambient Lighting */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-slate-800/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.18),rgba(15,23,42,0))]">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline, Trust Signals, CTAs */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-lg">
                <span className="flex items-center gap-1.5 bg-blue-500/10 text-sky-400 text-[11px] font-bold px-2 py-0.5 rounded-full border border-sky-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  AHCS · PLATFORM
                </span>
                <span className="text-slate-300">Independent Healthcare Identity & Smart Health Card</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Your Sovereign Health Identity. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Verified, Connected & Protected.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl leading-relaxed">
                An authoritative private health identity ecosystem built around a permanent AHCS Client ID, physical Contactless Smart Card (QR + NFC), permissioned medical vault, and instant 24x7 emergency break-glass triage.
              </p>

              {/* 4 Feature Trust Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-2xl text-xs sm:text-[13px] text-slate-300 font-medium">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                    ✓
                  </div>
                  <span><strong>Permanent Client ID:</strong> ISO 7064 check-digit verified; independent of Aadhaar/ABHA</span>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                    ✓
                  </div>
                  <span><strong>Physical Smart Card:</strong> ISO 7810 ID-1 standard with NFC tap & rotating QR token</span>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                    ✓
                  </div>
                  <span><strong>Zero-Leak Privacy:</strong> No clinical records or history printed on the physical card</span>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                    ✓
                  </div>
                  <span><strong>Break-Glass Protocol:</strong> Sub-second vital allergy & blood triage with audit logging</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Get Your AHCS Health ID</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/providers"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
                >
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span>Healthcare Network</span>
                </Link>

                <Link
                  href="/provider/login"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition-all"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Doctor Portal</span>
                </Link>
              </div>

              {/* Quick Card Verification Input Field */}
              <div className="pt-2">
                <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={quickVerifyInput}
                      onChange={(e) => setQuickVerifyInput(e.target.value)}
                      placeholder="Enter AHCS Client ID to verify (e.g. AHCS-IN-2026-9921)"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verify Card</span>
                  </button>
                </form>
              </div>

              {/* Trust Metrics Bar */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-3 max-w-xl">
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <div className="text-base sm:text-lg font-black text-white">Zero Leak</div>
                  <div className="text-[11px] text-slate-400 font-medium">Opaque tokenized QR/NFC</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <div className="text-base sm:text-lg font-black text-sky-400">AES-256</div>
                  <div className="text-[11px] text-slate-400 font-medium">Encrypted medical vault</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                  <div className="text-base sm:text-lg font-black text-emerald-400">ISO 7810</div>
                  <div className="text-[11px] text-slate-400 font-medium">Physical CR80 credential</div>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Interactive Smart Card Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Backlight Ambient Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 via-sky-400/20 to-indigo-500/20 rounded-3xl blur-2xl -z-10" />

                {/* Interactive Smart Card Component */}
                <SmartCardInteractive initialTheme="platinum" showControls={true} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VERIFICATION STATE MACHINE: The 4 Distinct Stages */}
      <section className="py-20 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              Auditable State Machine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              How Identity Is Verified & Issued
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Unlike simulated portals, creating an account does not mean you are verified. AHCS enforces four strict, immutable state transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  onClick={() => setActiveStep(idx + 1)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    activeStep === idx + 1
                      ? 'bg-slate-800 border-sky-500/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-black text-sky-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {stage.step}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-300">
                        {stage.statusTag}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      {stage.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>Begin Verified Enrollment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. CONNECTED HEALTHCARE SERVICES NETWORK: Filterable Care Hub */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Connected Clinical Services</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Coordinated Healthcare Network
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Access verified on-demand mobile units, certified home nursing, NABL diagnostics, and retail pharmacy concessions.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveServiceTab('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'ALL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Services
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('CARE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'CARE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Home & Mobile Care
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('CLINICAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'CLINICAL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Labs & Doctors
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('EMERGENCY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'EMERGENCY'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Emergency
              </button>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group bg-slate-900/60 hover:bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-sky-500/40 flex items-center justify-center text-sky-400 shadow-xs transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${service.tagColor}`}>
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                      {service.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed mb-5">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. EMERGENCY BREAK-GLASS ACCESS: Paramedic & Trauma Care */}
      <section className="py-20 bg-slate-900/70 border-b border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-rose-400 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Life-Saving Golden Hour Protocol</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Break-Glass Emergency Gateway: <br />
                <span className="text-rose-400">When Every Second Counts.</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                In sudden trauma or unconscious states, treating clinicians and first responders scan the dynamic QR or tap the NFC chip to instantly retrieve crucial vitals without biometric or password delays.
              </p>

              <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>Minimal Triage Projection:</strong> Verified Blood Group, primary Next-of-Kin contacts, and critical drug allergies.</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>Clinical Records Isolation:</strong> Full past diagnostic records and prescriptions remain completely locked.</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span><strong>Cryptographic Audit Log:</strong> Every emergency scan creates an immutable audit trail and triggers instant SMS/Email alerts to emergency contacts.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all"
                >
                  <span>Activate Emergency Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/emergency-preview"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                >
                  <span>Simulate Paramedic Scan</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Simulator Card */}
            <div className="lg:col-span-6 relative">
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold">
                      Emergency Vitals Triage
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400 font-medium">Verified Blood Group</span>
                    <div className="text-2xl font-black text-rose-400 mt-1">O Positive (O+)</div>
                    <span className="text-[10px] text-emerald-400">Document Verified</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400 font-medium">Critical Drug Allergies</span>
                    <div className="text-sm font-bold text-amber-300 mt-1">Penicillin, Sulfa Drugs</div>
                    <span className="text-[10px] text-slate-500">High Risk Indicator</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase text-slate-400 font-medium">Next-of-Kin Emergency Contacts</span>
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span className="font-bold">Primary Guardian:</span>
                    <span className="font-mono text-sky-400">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span className="font-bold">Secondary Contact:</span>
                    <span className="font-mono text-sky-400">+91 91234 56789</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Full medical history locked. Requires clinician credential authentication.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHAT AHCS IS vs WHAT AHCS IS NOT (Regulatory Transparency) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              Zero-Fabrication Demarcation
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-3">
              Clear Boundaries. Absolute Integrity.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              We operate with uncompromising regulatory clarity. Know exactly what AHCS delivers and how your sovereign healthcare rights are governed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* What AHCS IS */}
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-emerald-500/30 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">What AHCS Is</h3>
                  <p className="text-xs text-emerald-400 font-semibold">Private Healthcare Infrastructure</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>A private healthcare identity verification and assistance network.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Permanent Client ID issued only after human officer document validation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Smart Health Card (QR & NFC) carrying rotating, revocable tokens.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Patient-directed consent vault for sharing clinical records with doctors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>24x7 break-glass emergency profile access with immutable audit logging.</span>
                </li>
              </ul>
            </div>

            {/* What AHCS IS NOT */}
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-rose-500/30 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">What AHCS Is NOT</h3>
                  <p className="text-xs text-rose-400 font-semibold">Strict Regulatory Boundaries</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>NOT a government scheme</strong>, Aadhaar, ABHA, or Ayushman Bharat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>NOT an insurance company</strong> and does not guarantee cashless hospitalisation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>NOT a hospital or clinic</strong>; does not employ treating physicians directly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Does NOT guarantee hospital admissions</strong> or clinical medical outcomes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Never makes unsupported promises of free medical care everywhere.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED HEALTHCARE PROVIDER NETWORK LOOKUP */}
      <section className="py-20 bg-slate-900/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <Image
              src="/images/hospital-network.jpg"
              alt="Connected Healthcare Facility"
              width={1400}
              height={500}
              className="w-full h-[320px] sm:h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
            
            <div className="absolute inset-0 p-8 sm:p-14 flex flex-col justify-center max-w-2xl text-white space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-blue-600/90 font-bold w-max border border-blue-400/30">
                Verified Provider Network
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                Empanelled Hospitals, Clinics & Diagnostic Centres
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect with verified clinics, diagnostic labs, and healthcare professionals onboarded under formal compliance agreements.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/providers"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  Browse Healthcare Directory
                </Link>
                <Link
                  href="/partner"
                  className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl font-bold text-xs border border-slate-700 transition-all"
                >
                  Join As Provider
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIFE-SAFETY ADVISORY / 112 EMERGENCY BANNER */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>National Trauma Advisory</span>
            </div>
            <h2 className="text-lg font-bold">In a medical emergency, call 112 immediately.</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              AHCS break-glass is an assistive medical profile retrieval tool for treating practitioners. Do not delay emergency physical transit or treatment for digital card scanning.
            </p>
          </div>
          <Link
            href="/verify"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Card Verification Gateway</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
