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
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'home-care',
      category: 'CARE',
      title: 'Home Healthcare & Nursing',
      desc: 'Certified post-hospitalization nurses, elder caregivers, and physiotherapy attendants delivered at your doorstep.',
      icon: Home,
      href: '/services/home-care',
      tag: 'Doorstep Care',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'diagnostics',
      category: 'CLINICAL',
      title: 'Diagnostic Lab Tests',
      desc: 'NABL-partnered pathology tests and diagnostic checkup packages with doorstep sample collection and digital report vault.',
      icon: FlaskConical,
      href: '/services/diagnostics',
      tag: 'Home Sample Collection',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'telemedicine',
      category: 'CLINICAL',
      title: 'Telemedicine Consultations',
      desc: 'Connect remotely with verified medical specialists and receive authenticated digital prescriptions directly to your vault.',
      icon: Video,
      href: '/services/telemedicine',
      tag: 'Remote Care',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'pharmacy',
      category: 'CLINICAL',
      title: 'Pharmacy Network',
      desc: 'Access verified retail network pharmacies for genuine medicines, e-prescription sync, and direct member concessions.',
      icon: Pill,
      href: '/services/pharmacy',
      tag: 'Medicine Savings',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'health-camps',
      category: 'CARE',
      title: 'Health Camps & Screening',
      desc: 'Organized preventive screening camps and workplace health checkups for corporate campuses and residential societies.',
      icon: HeartPulse,
      href: '/services/health-camps',
      tag: 'Preventive Drives',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'senior-care',
      category: 'CARE',
      title: 'Senior & Geriatric Care',
      desc: 'Personalized elderly health monitoring, regular vitals tracking, and dedicated caregiver coordination.',
      icon: Stethoscope,
      href: '/services/senior-care',
      tag: 'Elderly Wellness',
      tagColor: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      id: 'emergency',
      category: 'EMERGENCY',
      title: 'Emergency Assistance',
      desc: '24/7 break-glass medical profile retrieval, next-of-kin emergency notification, and hospital facility discovery.',
      icon: ShieldAlert,
      href: '/emergency',
      tag: '24x7 Gateway',
      tagColor: 'bg-red-50 text-red-700 border-red-200'
    }
  ];

  const filteredServices = activeServiceTab === 'ALL' 
    ? careServices 
    : careServices.filter(s => s.category === activeServiceTab);

  const pipelineSteps = [
    {
      num: '01',
      title: 'Mobile Ownership Authentication',
      desc: 'Secure signup via cryptographic 6-digit OTP verifying actual SIM possession with server-side rate limits.',
      badge: 'Step 1'
    },
    {
      num: '02',
      title: 'Demographic Profile & Document Vault',
      desc: 'Submit legal identity details, emergency contacts, and KYC documents stored in an AES-256 private vault.',
      badge: 'Step 2'
    },
    {
      num: '03',
      title: 'Algorithmic Duplicate Check',
      desc: 'Automated hash matching ensures no duplicate accounts or fragmented records exist under multiple names.',
      badge: 'Step 3'
    },
    {
      num: '04',
      title: 'Verification Officer Review',
      desc: 'Authorised human Verification Officers inspect submitted records before approval or correction requests.',
      badge: 'Step 4'
    },
    {
      num: '05',
      title: 'Permanent Client ID Generation',
      desc: 'Unique ISO 7064 MOD 97-10 check-digit verified AHCS Client ID atomically minted upon officer approval.',
      badge: 'Step 5'
    },
    {
      num: '06',
      title: 'Smart Card & Dynamic QR Issuance',
      desc: 'Physical CR80 card dispatch and instant dynamic QR token activation with 24x7 break-glass safety.',
      badge: 'Step 6'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* TOP REGULATORY ADVISORY TAPE */}
      <section className="bg-blue-50/70 border-b border-blue-100 px-4 py-2.5 text-xs text-blue-950 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span><strong>Independent Healthcare Identity:</strong> AHCS is a private digital health ID and assistance network. Not affiliated with UIDAI, ABHA, or government schemes.</span>
          </div>
          <Link href="/how-it-works" className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-2 shrink-0">
            Read Security Architecture →
          </Link>
        </div>
      </section>

      {/* 1. HERO SECTION: Light Theme with Navy Blue, Royal Blue & Subtle Mesh */}
      <section className="relative isolate overflow-hidden min-h-[640px] lg:min-h-[720px] flex items-center border-b border-slate-200 bg-gradient-to-b from-white via-sky-50/30 to-slate-50">
        
        {/* Subtle Tech Dot Matrix Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-25 z-0 pointer-events-none" />
        
        {/* Subtle Blue & Sky Ambient Lighting Orbs */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-800 text-xs font-semibold border border-slate-200/80 shadow-xs">
                <span className="font-bold bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  AHCS · NETWORK
                </span>
                <span className="text-slate-700">Private Healthcare Identity & Assistance Ecosystem</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08]">
                Your Health Identity, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600">
                  Connected & Protected.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 font-normal max-w-xl leading-relaxed">
                One verified healthcare identity connecting your personal digital health records, care services, participating clinical network, and 24x7 emergency assistance.
              </p>

              {/* 4 Feature Bullet Points in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-2xl text-xs sm:text-[13px] text-slate-800 font-medium">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-2xs backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  </div>
                  <span><strong>Permanent Client ID:</strong> Issued after human KYC verification</span>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-2xs backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  </div>
                  <span><strong>Smart Health Card:</strong> Contactless NFC & dynamic rotating QR</span>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-2xs backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  </div>
                  <span><strong>Patient Consent Vault:</strong> Granular control over clinical record sharing</span>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-2xs backdrop-blur-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                  </div>
                  <span><strong>Break-Glass Profile:</strong> 24x7 trauma vitals access for paramedics</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold text-sm shadow-lg shadow-blue-700/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Get Your AHCS ID</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/find-care"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-300 shadow-xs transition-all"
                >
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Find Healthcare</span>
                </Link>

                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all border border-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verify a Card</span>
                </Link>
              </div>

              {/* Quick Card Verification Input Field */}
              <div className="pt-2">
                <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={quickVerifyInput}
                      onChange={(e) => setQuickVerifyInput(e.target.value)}
                      placeholder="Enter AHCS Client ID to verify (e.g. AHCS-IN-2026-9921)"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono shadow-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verify Now</span>
                  </button>
                </form>
              </div>

              {/* Trust Metrics Bar */}
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-3 gap-3 max-w-xl">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-base sm:text-lg font-black text-slate-900">Zero Leak</div>
                  <div className="text-[11px] text-slate-500 font-medium">No medical data in QR/NFC</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-base sm:text-lg font-black text-blue-700">AES-256</div>
                  <div className="text-[11px] text-slate-500 font-medium">Encrypted Record Vault</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-base sm:text-lg font-black text-emerald-600">ISO 7810</div>
                  <div className="text-[11px] text-slate-500 font-medium">Standard CR80 Credential</div>
                </div>
              </div>

            </div>

            {/* Right Card Column: Revamped Smart Card Interactive Component */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Backlight Ambient Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-400/20 via-sky-300/20 to-indigo-300/20 rounded-3xl blur-2xl -z-10" />

                {/* Interactive Flippable Smart Card Component */}
                <SmartCardInteractive initialTheme="platinum" showControls={true} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CONNECTED HEALTHCARE SERVICES NETWORK: Interactive Filterable Hub */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Ecosystem Directory</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Connected Healthcare Services
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Access on-demand care facilities, diagnostic packages, and doorstep medical assistance through your verified AHCS credential.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveServiceTab('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'ALL'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Services
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('CARE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'CARE'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Home & Mobile Care
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('CLINICAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'CLINICAL'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Labs & Doctors
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('EMERGENCY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'EMERGENCY'
                    ? 'bg-white text-red-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
                  className="group bg-slate-50/70 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 flex items-center justify-center text-blue-700 shadow-xs transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${service.tagColor}`}>
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                      {service.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed mb-5">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. WHAT AHCS IS vs WHAT AHCS IS NOT: Clean Side-by-Side Comparison */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Transparent Demarcation
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              Clear Boundaries. Absolute Integrity.
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              We operate with uncompromising clarity. Know exactly what AHCS delivers and how your sovereign healthcare rights are governed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* What AHCS IS */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">What AHCS Is</h3>
                  <p className="text-xs text-emerald-700 font-semibold">Private Healthcare Infrastructure</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>A private healthcare identity verification and assistance network.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Unique Client ID issued only after human officer document validation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Smart Health Card (QR & NFC) carrying rotating, revocable tokens.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Patient-directed consent vault for sharing clinical records with doctors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>24x7 break-glass emergency profile access with immutable audit logging.</span>
                </li>
              </ul>
            </div>

            {/* What AHCS IS NOT */}
            <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">What AHCS Is NOT</h3>
                  <p className="text-xs text-rose-700 font-semibold">Strict Regulatory Boundaries</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>NOT a government scheme</strong>, Aadhaar, ABHA, or Ayushman Bharat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>NOT an insurance company</strong> and does not guarantee insurance payouts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>NOT a hospital or clinic</strong>; does not employ treating physicians directly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Does NOT guarantee hospital admissions</strong> or clinical medical outcomes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Never makes unsupported claims like &quot;100% cashless everywhere&quot;.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 6-STEP VERIFICATION TO ISSUANCE PIPELINE */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Trust & Issuance Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-3">
              How You Get Your Verified AHCS ID
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every permanent AHCS Client ID is bound to an authentic identity through server-side verification and fraud checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelineSteps.map((step, idx) => (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx + 1)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  activeStep === idx + 1
                    ? 'bg-blue-50/60 border-blue-400 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-black text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
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

      {/* 5. DOCTOR CONSULTATIONS & DIGITAL CLINICAL RECORDS (Rich Image Showcase) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                <Image
                  src="/images/doctor-consult.jpg"
                  alt="Doctor consulting patient in modern clinic"
                  width={700}
                  height={450}
                  className="w-full h-[380px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-600 font-bold">
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
                <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
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

      {/* 6. BREAK-GLASS EMERGENCY & AMBULANCE RESPONSE (Golden Hour Protection) */}
      <section className="py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>Life-Saving Golden Hour Protection</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Break-Glass Emergency Gateway: <br />
                <span className="text-rose-600">When Every Second Counts</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                In sudden road accidents, cardiac crises, or unconscious states, first responders and ER personnel scan your card&apos;s QR or tap NFC to instantly retrieve life-saving vitals without passwords or biometric delays.
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

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span>Activate Emergency Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/emergency-preview"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all border border-slate-300"
                >
                  <span>Test Emergency Simulator</span>
                </Link>
              </div>
            </div>

            {/* Right Image Showcase */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                <Image
                  src="/images/emergency-care.jpg"
                  alt="Emergency response team and ambulance"
                  width={700}
                  height={450}
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

      {/* 7. PHYSICAL SMART CARD & HOSPITAL TAP (Card-in-Hand Showcase) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                <Image
                  src="/images/card-in-hand.jpg"
                  alt="Holding smart health card at clinic counter"
                  width={700}
                  height={450}
                  className="w-full h-[380px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-600/90 font-bold">
                    Physical Credential
                  </span>
                  <h4 className="text-lg font-bold text-white">Tap & Go Clinic Admission</h4>
                  <p className="text-xs text-slate-300">
                    High-durability composite PVC card with gold EMV security and dynamic anti-counterfeiting token.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-blue-700" />
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
                  <p className="text-xs text-slate-500 mt-1">Embedded chip simulation architecture ready for cryptographic smart-card terminals.</p>
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

              <div className="pt-2">
                <Link
                  href="/smart-card"
                  className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm hover:text-blue-800 transition-colors"
                >
                  <span>Explore Smart Card Specifications →</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. NATIONWIDE NETWORK OF VERIFIED HOSPITALS & LABS (Hospital Network Showcase) */}
      <section className="py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 mb-10">
            <Image
              src="/images/hospital-network.jpg"
              alt="Modern Indian hospital reception and facilities"
              width={1400}
              height={450}
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
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                >
                  Search Verified Providers
                </Link>
                <Link
                  href="/partner"
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs backdrop-blur-md transition-all"
                >
                  Partner Onboarding
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. LIFE-SAFETY ADVISORY / 112 EMERGENCY BANNER */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>National Trauma Advisory</span>
            </div>
            <h2 className="text-lg font-bold">In a medical emergency, call 112 immediately.</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
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
