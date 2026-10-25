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
  Share2,
  Radio,
  BadgeCheck,
  ExternalLink,
  Shield,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { SmartCardInteractive } from '@/components/SmartCardInteractive';

export default function HomePage() {
  const router = useRouter();
  const [activeServiceTab, setActiveServiceTab] = useState<'ALL' | 'CARE' | 'CLINICAL' | 'EMERGENCY'>('ALL');
  const [quickVerifyInput, setQuickVerifyInput] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      status: 'Active Pilot',
      tagColor: 'bg-blue-50 text-[#1769AA] border-blue-200',
      highlights: ['Digital Vitals Station', 'Worksite Camps', 'Society Visits']
    },
    {
      id: 'home-care',
      category: 'CARE',
      title: 'Home Healthcare & Nursing',
      desc: 'Certified post-hospitalization nurses, elder caregivers, and physiotherapy attendants delivered at your doorstep.',
      icon: Home,
      href: '/services/home-care',
      tag: 'Doorstep Care',
      status: 'Active Network',
      tagColor: 'bg-emerald-50 text-[#16835F] border-emerald-200',
      highlights: ['Post-Op Attendants', 'Physiotherapy', 'Elder Assistance']
    },
    {
      id: 'diagnostics',
      category: 'CLINICAL',
      title: 'Diagnostic Lab Tests',
      desc: 'Pathology tests and checkup packages with doorstep sample collection and digital report vault.',
      icon: FlaskConical,
      href: '/services/diagnostics',
      tag: 'Home Collection',
      status: 'Partner Network',
      tagColor: 'bg-amber-50 text-[#B7791F] border-amber-200',
      highlights: ['Doorstep Phlebotomy', 'Accredited Labs', 'Direct Vault Sync']
    },
    {
      id: 'telemedicine',
      category: 'CLINICAL',
      title: 'Telemedicine Consultations',
      desc: 'Connect remotely with verified medical practitioners and receive authenticated digital prescriptions directly in your vault.',
      icon: Video,
      href: '/services/telemedicine',
      tag: 'Remote Care',
      status: 'Operational',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
      highlights: ['Verified Clinicians', 'Encrypted Gateway', 'E-Prescription Sync']
    },
    {
      id: 'pharmacy',
      category: 'CLINICAL',
      title: 'Pharmacy Network',
      desc: 'Access verified retail network pharmacies for genuine medicines, e-prescription sync, and member concessions.',
      icon: Pill,
      href: '/services/pharmacy',
      tag: 'Medicine Network',
      status: 'Active Network',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
      highlights: ['E-Prescription Delivery', 'Network Concessions', 'Genuine Batch Proof']
    },
    {
      id: 'health-camps',
      category: 'CARE',
      title: 'Health Camps & Screening',
      desc: 'Organized preventive screening camps and workplace health checkups for corporate campuses and residential societies.',
      icon: HeartPulse,
      href: '/services/health-camps',
      tag: 'Preventive Drives',
      status: 'Scheduled Drives',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      highlights: ['Corporate Campus Drives', 'Vitals Triage', 'Mass ID Enrollment']
    },
    {
      id: 'senior-care',
      category: 'CARE',
      title: 'Senior & Geriatric Care',
      desc: 'Personalized elderly health monitoring, regular vitals tracking, and dedicated caregiver coordination.',
      icon: Stethoscope,
      href: '/services/senior-care',
      tag: 'Elderly Wellness',
      status: 'Specialized Program',
      tagColor: 'bg-teal-50 text-[#0F9D8A] border-teal-200',
      highlights: ['Routine Vitals Log', 'Emergency SOS Node', 'Caregiver Continuity']
    },
    {
      id: 'emergency',
      category: 'EMERGENCY',
      title: 'Emergency Assistance',
      desc: '24/7 break-glass medical profile retrieval, next-of-kin emergency notification, and facility discovery.',
      icon: ShieldAlert,
      href: '/emergency',
      tag: '24x7 Gateway',
      status: 'Standard Safety',
      tagColor: 'bg-red-50 text-[#C53030] border-red-200',
      highlights: ['Sub-Second QR Access', 'Blood Group & Allergies', 'Next-of-Kin SMS']
    }
  ];

  const filteredServices = activeServiceTab === 'ALL' 
    ? careServices 
    : careServices.filter(s => s.category === activeServiceTab);

  const workflowSteps = [
    {
      step: '01',
      title: 'Create Your Account',
      desc: 'Initiate signup via mobile phone ownership verification with cryptographic 6-digit OTP.',
      status: 'Operational'
    },
    {
      step: '02',
      title: 'Submit Information & Documents',
      desc: 'Provide essential demographic details, emergency contacts, and required government KYC documentation.',
      status: 'Operational'
    },
    {
      step: '03',
      title: 'Complete Verification Review',
      desc: 'Submitted records undergo automated duplicate collision checks followed by human verification officer review.',
      status: 'Active Review Queue'
    },
    {
      step: '04',
      title: 'Access AHCS Identity & Smart Card',
      desc: 'Upon formal officer approval, an immutable AHCS Client ID is atomically minted and smart health card is issued.',
      status: 'Issuance Available'
    }
  ];

  const faqs = [
    {
      q: 'What is AHCS and how does it work?',
      a: 'AHCS (Advanced Health Care System) is an independent private healthcare identity, card verification, and emergency access platform. It provides individuals with a permanent AHCS Client ID, an encrypted medical records vault, and a physical smart health card (NFC/QR) for streamlined hospital admission and break-glass emergency vitals access.'
    },
    {
      q: 'Is AHCS affiliated with government schemes like Aadhaar, ABHA, or Ayushman Bharat?',
      a: 'No. AHCS is completely independent and private. It is NOT government-operated, NOT affiliated with UIDAI (Aadhaar), NOT ABHA/NDHM, and NOT Ayushman Bharat (PM-JAY). The AHCS Client ID is a private platform identification credential.'
    },
    {
      q: 'Is AHCS an insurance company or does it provide cashless hospitalization?',
      a: 'No. AHCS is NOT an insurance company and does not underwrite policies or guarantee cashless hospital claims. Any membership plans offered are healthcare assistance and coordination plans covering discounted diagnostics, telemedicine, and home care services.'
    },
    {
      q: 'Are my medical records visible to anyone scanning my smart health card QR code?',
      a: 'No. The QR code and NFC tap on your AHCS Smart Health Card contain zero medical records or diagnosis history. In non-emergency scenarios, accessing records requires your explicit patient consent PIN. In critical emergency break-glass triage, only vital emergency information (blood group, critical allergies, emergency contact) is disclosed, and an immutable audit log is generated with instant SMS alerts to your family.'
    },
    {
      q: 'How do healthcare providers participate in the AHCS network?',
      a: 'Clinics, hospitals, diagnostic centers, and treating physicians can apply to participate in the AHCS network through our verified provider onboarding portal. Every provider undergoes credential inspection and formal agreement review before receiving authorized clinical portal access.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#172B4D] selection:bg-[#1769AA] selection:text-white">
      
      {/* TOP REGULATORY ADVISORY TAPE */}
      <section className="bg-[#EEF3F9] border-b border-[#DFE7F0] px-4 py-2 text-xs text-[#102A43] font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16835F] animate-pulse shrink-0" />
            <span><strong>Private Healthcare Identity:</strong> AHCS is an independent identity and healthcare access platform. Not affiliated with UIDAI, ABHA, or government schemes.</span>
          </div>
          <Link href="/how-it-works" className="text-[#1769AA] hover:text-[#102A43] font-bold underline underline-offset-2 shrink-0 flex items-center gap-1">
            <span>Security Architecture</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* 1. HERO SECTION: Balanced 2-Column Layout */}
      <section className="relative overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-center border-b border-[#DFE7F0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Core Positioning & Identity Gateway */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F8FC] text-[#102A43] text-xs font-semibold border border-[#DFE7F0]">
                <span className="font-bold bg-white text-[#1769AA] text-[10px] px-2 py-0.5 rounded-full border border-[#DFE7F0] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D8A] animate-pulse" />
                  AHCS · PLATFORM
                </span>
                <span>Private Healthcare Identity & Access</span>
              </div>

              {/* Exact Master Prompt Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-[#102A43] tracking-tight leading-[1.12]">
                Your Health Identity. <br />
                <span className="text-[#1769AA]">Connected Care.</span> <br />
                Greater Confidence.
              </h1>

              {/* Exact Master Prompt Supporting Text */}
              <p className="text-base sm:text-lg text-[#62748A] font-normal max-w-xl leading-relaxed">
                AHCS is building a private healthcare identity and access platform designed to help individuals manage essential health information and connect with participating healthcare providers.
              </p>

              {/* Primary & Secondary Action CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#102A43] hover:bg-[#1769AA] text-white font-bold text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <span>Create Your Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F5F8FC] text-[#172B4D] font-bold text-sm border border-[#DFE7F0] transition-all"
                >
                  <span>Explore How It Works</span>
                </Link>
              </div>

              {/* Quick Card Verification Input Field */}
              <div className="pt-2">
                <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row gap-2 max-w-lg bg-[#F5F8FC] p-2 rounded-2xl border border-[#DFE7F0]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#62748A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={quickVerifyInput}
                      onChange={(e) => setQuickVerifyInput(e.target.value)}
                      placeholder="Enter AHCS Client ID to verify (e.g. AHCS-IN-2026-9921)"
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DFE7F0] rounded-xl text-xs text-[#172B4D] placeholder-[#62748A] focus:outline-none focus:ring-2 focus:ring-[#1769AA] font-mono shadow-2xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#102A43] hover:bg-[#1769AA] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#13BBA4]" />
                    <span>Verify Now</span>
                  </button>
                </form>
              </div>

              {/* 4 Trust Metric Cards in Grid */}
              <div className="pt-2 border-t border-[#DFE7F0] grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg text-left">
                <div className="bg-[#F5F8FC] p-2.5 rounded-xl border border-[#DFE7F0]">
                  <div className="text-xs font-black text-[#102A43]">Zero Leak</div>
                  <div className="text-[10px] text-[#62748A]">No medical data in QR</div>
                </div>
                <div className="bg-[#F5F8FC] p-2.5 rounded-xl border border-[#DFE7F0]">
                  <div className="text-xs font-black text-[#1769AA]">AES-256</div>
                  <div className="text-[10px] text-[#62748A]">Encrypted Record Vault</div>
                </div>
                <div className="bg-[#F5F8FC] p-2.5 rounded-xl border border-[#DFE7F0]">
                  <div className="text-xs font-black text-[#16835F]">ISO 7810</div>
                  <div className="text-[10px] text-[#62748A]">Standard CR80 Credential</div>
                </div>
                <div className="bg-[#F5F8FC] p-2.5 rounded-xl border border-[#DFE7F0]">
                  <div className="text-xs font-black text-[#0F9D8A]">Sub-1s</div>
                  <div className="text-[10px] text-[#62748A]">Break-Glass Vitals</div>
                </div>
              </div>

            </div>

            {/* Right Column: Smart Card Interactive Component */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-md">
                <SmartCardInteractive initialTheme="platinum" showControls={true} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST AND TRANSPARENCY SECTION: Capabilities & Demarcation */}
      <section className="py-16 bg-[#F5F8FC] border-b border-[#DFE7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Trust & Transparency
            </span>
            <h2 className="text-3xl font-black text-[#102A43] tracking-tight mt-3">
              Clear Boundaries. Absolute Integrity.
            </h2>
            <p className="text-sm text-[#62748A] mt-2">
              We operate with uncompromising clarity. Know exactly what AHCS delivers and how your healthcare rights and personal privacy are protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* What AHCS IS */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#DFE7F0] shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16835F] flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#102A43]">What AHCS Is</h3>
                  <p className="text-xs text-[#16835F] font-semibold">Private Healthcare Infrastructure</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#172B4D]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16835F] shrink-0 mt-0.5" />
                  <span><strong>Private Healthcare Identity:</strong> Built around an immutable permanent AHCS Client ID.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16835F] shrink-0 mt-0.5" />
                  <span><strong>Physical Smart Health Card:</strong> Contactless NFC & dynamic rotating QR with revocable tokens.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16835F] shrink-0 mt-0.5" />
                  <span><strong>Patient Consent Vault:</strong> Granular, time-bound clinical record sharing with verified treating doctors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16835F] shrink-0 mt-0.5" />
                  <span><strong>Emergency Break-Glass Access:</strong> Paramedic triage access to critical blood group and allergies with immutable audit logs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16835F] shrink-0 mt-0.5" />
                  <span><strong>Healthcare Assistance Network:</strong> Transparent discounted diagnostic, home care, and telemedicine coordination.</span>
                </li>
              </ul>
            </div>

            {/* What AHCS IS NOT */}
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#DFE7F0] shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#C53030] flex items-center justify-center border border-rose-200">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#102A43]">What AHCS Is NOT</h3>
                  <p className="text-xs text-[#C53030] font-semibold">Strict Regulatory Boundaries</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#172B4D]">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-[#C53030] shrink-0 mt-0.5" />
                  <span><strong>NOT a government scheme:</strong> Not affiliated with Aadhaar, ABHA, NDHM, or Ayushman Bharat PM-JAY.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-[#C53030] shrink-0 mt-0.5" />
                  <span><strong>NOT an insurance underwriter:</strong> Does not underwrite policies or guarantee insurance payouts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-[#C53030] shrink-0 mt-0.5" />
                  <span><strong>NOT a hospital or clinic:</strong> Does not directly employ or substitute licensed treating doctors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-[#C53030] shrink-0 mt-0.5" />
                  <span><strong>Does NOT guarantee hospital admissions:</strong> Cannot guarantee cashless beds or clinical medical outcomes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-[#C53030] shrink-0 mt-0.5" />
                  <span><strong>No fabricated claims:</strong> Never claims unverified hospital partnerships or 100% free surgery guarantees.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Statutory Guarantee Badge */}
          <div className="mt-8 max-w-5xl mx-auto p-4 rounded-2xl bg-white border border-[#DFE7F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#172B4D]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1769AA] shrink-0" />
              <span><strong>Statutory Integrity Guarantee:</strong> AHCS strictly complies with India&apos;s Digital Personal Data Protection (DPDP) Act 2023.</span>
            </div>
            <Link href="/privacy" className="font-bold underline text-[#1769AA] hover:text-[#102A43] shrink-0">
              Review Privacy Architecture →
            </Link>
          </div>

        </div>
      </section>

      {/* 3. HOW AHCS WORKS: Clean 4-Step Visual Flow */}
      <section className="py-16 bg-white border-b border-[#DFE7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Workflow Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight mt-3">
              How AHCS Works
            </h2>
            <p className="text-sm text-[#62748A] mt-2">
              A transparent, 4-step verified workflow ensuring every account is linked to an authentic identity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {workflowSteps.map((s, idx) => (
              <div 
                key={s.step}
                className="bg-[#F5F8FC] p-6 rounded-2xl border border-[#DFE7F0] flex flex-col justify-between hover:border-[#1769AA] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-white border border-[#DFE7F0] flex items-center justify-center font-mono font-black text-xs text-[#102A43]">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#DFE7F0] text-[#1769AA]">
                      {s.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#102A43] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#62748A] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#DFE7F0] flex items-center text-xs font-bold text-[#1769AA]">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#102A43] hover:bg-[#1769AA] text-white font-bold text-sm shadow-sm transition-all"
            >
              <span>Begin Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CONNECTED HEALTHCARE CARE HUB: 8 Services */}
      <section className="py-16 bg-[#F5F8FC] border-b border-[#DFE7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1769AA] border border-blue-200 text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Ecosystem Directory</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight">
                Connected Healthcare Services
              </h2>
              <p className="text-sm text-[#62748A] mt-1 max-w-xl">
                Access on-demand care facilities, diagnostic packages, and doorstep medical assistance through your verified AHCS credential.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#DFE7F0] shrink-0">
              <button
                type="button"
                onClick={() => setActiveServiceTab('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'ALL'
                    ? 'bg-[#102A43] text-white'
                    : 'text-[#62748A] hover:text-[#172B4D]'
                }`}
              >
                All (8)
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('CARE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'CARE'
                    ? 'bg-[#102A43] text-white'
                    : 'text-[#62748A] hover:text-[#172B4D]'
                }`}
              >
                Home & Mobile
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('CLINICAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'CLINICAL'
                    ? 'bg-[#102A43] text-white'
                    : 'text-[#62748A] hover:text-[#172B4D]'
                }`}
              >
                Labs & Doctors
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('EMERGENCY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeServiceTab === 'EMERGENCY'
                    ? 'bg-[#C53030] text-white'
                    : 'text-[#62748A] hover:text-[#172B4D]'
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
                  className="group bg-white p-6 rounded-2xl border border-[#DFE7F0] hover:border-[#1769AA] hover:shadow-card transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F8FC] border border-[#DFE7F0] group-hover:border-[#1769AA] flex items-center justify-center text-[#1769AA] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${service.tagColor}`}>
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#102A43] group-hover:text-[#1769AA] transition-colors mb-2">
                      {service.title}
                    </h3>

                    <p className="text-xs text-[#62748A] leading-relaxed mb-4">
                      {service.desc}
                    </p>

                    {/* Highlights bullet chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F5F8FC] border border-[#DFE7F0] text-[#62748A]">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DFE7F0] flex items-center justify-between text-xs font-bold text-[#1769AA]">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. DOCTOR CONSULTATIONS & DIGITAL CLINICAL RECORDS (Rich Image Showcase) */}
      <section className="py-16 bg-white border-b border-[#DFE7F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-card border border-[#DFE7F0] group">
                <Image
                  src="/images/doctor-consult.jpg"
                  alt="Doctor consulting patient in modern clinic"
                  width={700}
                  height={450}
                  className="w-full h-[360px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-[#102A43]/30 to-transparent" />
                
                {/* Overlaid Floating Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#102A43] text-xs font-bold shadow-sm border border-[#DFE7F0]">
                  <Lock className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>Sub-1s Record Retrieval · AES-256 Vault</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#1769AA] font-bold">
                    Doctor Consultation Gateway
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">Verified Clinical Encounters</h4>
                  <p className="text-xs text-slate-300">
                    Encrypted clinical notes, diagnosis, and verified e-prescriptions linked to your permanent ID.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1769AA] text-xs font-semibold border border-blue-200">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Zero File Clutter · Permanent Record Anchor</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight leading-tight">
                Your Lifelong Medical History, <br />
                <span className="text-[#1769AA]">Accessible Only With Consent</span>
              </h2>

              <p className="text-[#62748A] text-sm sm:text-base leading-relaxed">
                Never carry thick paper files or lose diagnostic reports again. Doctors can record consultations, diagnosis, and prescriptions directly to your AHCS identity — but strictly when you grant temporary consent.
              </p>

              <div className="space-y-3 pt-1 text-xs sm:text-sm text-[#172B4D]">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#16835F] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">✓</div>
                  <span><strong>Granular Patient Consent:</strong> You choose which doctor views your records, for 1 hour, 24 hours, or 7 days.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#16835F] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">✓</div>
                  <span><strong>1-Click Instant Revocation:</strong> Revoke doctor access in real time directly from your dashboard.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#16835F] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">✓</div>
                  <span><strong>Tamper-Proof Audit Trails:</strong> Every provider access is timestamped, IP-logged, and visible to you.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/providers"
                  className="inline-flex items-center gap-2 text-[#1769AA] font-bold text-sm hover:text-[#102A43] transition-colors"
                >
                  <span>Explore Verified Hospital Directory →</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BREAK-GLASS EMERGENCY & AMBULANCE RESPONSE (Golden Hour Protection) */}
      <section className="py-16 bg-[#F5F8FC] border-b border-[#DFE7F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#C53030] text-xs font-semibold border border-rose-200">
                <Phone className="w-3.5 h-3.5" />
                <span>Life-Saving Golden Hour Protection</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight leading-tight">
                Break-Glass Emergency Gateway: <br />
                <span className="text-[#C53030]">When Every Second Counts</span>
              </h2>

              <p className="text-[#62748A] text-sm sm:text-base leading-relaxed">
                In sudden road accidents, cardiac crises, or unconscious states, first responders and ER personnel scan your card&apos;s QR or tap NFC to instantly retrieve life-saving vitals without passwords or biometric delays.
              </p>

              <div className="space-y-3 pt-1 text-xs sm:text-sm text-[#172B4D]">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-[#C53030] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">✓</div>
                  <span><strong>Crucial Emergency Vitals:</strong> Blood group, primary emergency contacts, and life-threatening allergies.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-[#C53030] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">✓</div>
                  <span><strong>Privacy Isolated:</strong> General medical consultations and past diagnostic history remain 100% locked.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-[#C53030] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">✓</div>
                  <span><strong>Sub-Second Access:</strong> Works on standard mobile phone cameras without needing any proprietary apps.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C53030] hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Activate Emergency Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/emergency-preview"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#172B4D] font-bold text-xs transition-all border border-[#DFE7F0]"
                >
                  <span>Test Emergency Simulator</span>
                </Link>
              </div>
            </div>

            {/* Right Image Showcase */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-card border border-[#DFE7F0] group">
                <Image
                  src="/images/emergency-care.jpg"
                  alt="Emergency response team and ambulance"
                  width={700}
                  height={450}
                  className="w-full h-[360px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-[#102A43]/30 to-transparent" />
                
                {/* Overlaid Floating Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C53030] text-white text-xs font-bold shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Paramedic Trauma Fast-Track · Protocol 112</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#C53030] font-bold">
                    Emergency Protocol 112
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">First Responder Ready</h4>
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
      <section className="py-16 bg-white border-b border-[#DFE7F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-card border border-[#DFE7F0] group">
                <Image
                  src="/images/card-in-hand.jpg"
                  alt="Holding smart health card at clinic counter"
                  width={700}
                  height={450}
                  className="w-full h-[360px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-[#102A43]/30 to-transparent" />
                
                {/* Overlaid Floating Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#102A43] text-xs font-bold shadow-sm border border-[#DFE7F0]">
                  <CreditCard className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>ISO/IEC 7810 ID-1 Standard · NFC Forum Type 4</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#16835F] font-bold">
                    Physical Credential
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">Tap & Go Clinic Admission</h4>
                  <p className="text-xs text-slate-300">
                    High-durability composite PVC card with gold EMV security and dynamic anti-counterfeiting token.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1769AA] text-xs font-semibold border border-blue-200">
                <CreditCard className="w-3.5 h-3.5" />
                <span>ISO/IEC 7810 ID-1 Standard Credential</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight leading-tight">
                Designed for Everyday Use, <br />
                <span className="text-[#1769AA]">Built to Last a Lifetime</span>
              </h2>

              <p className="text-[#62748A] text-sm sm:text-base leading-relaxed">
                The AHCS physical smart card fits in any standard wallet. It combines traditional physical durability with next-generation cryptographic verification to prevent identity fraud and duplicate health records.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#DFE7F0]">
                  <h4 className="font-bold text-[#102A43] text-xs sm:text-sm">Gold EMV Security</h4>
                  <p className="text-xs text-[#62748A] mt-0.5">Embedded chip simulation architecture ready for cryptographic smart-card terminals.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#DFE7F0]">
                  <h4 className="font-bold text-[#102A43] text-xs sm:text-sm">Rotating Dynamic QR</h4>
                  <p className="text-xs text-[#62748A] mt-0.5">256-bit cryptographically signed token prevents static QR cloning and replay attacks.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#DFE7F0]">
                  <h4 className="font-bold text-[#102A43] text-xs sm:text-sm">Contactless NFC</h4>
                  <p className="text-xs text-[#62748A] mt-0.5">Instant tap with any NFC-enabled smartphone or tablet at reception desks.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#DFE7F0]">
                  <h4 className="font-bold text-[#102A43] text-xs sm:text-sm">1-Click Replacement</h4>
                  <p className="text-xs text-[#62748A] mt-0.5">Lost or stolen card? Immediately invalidate old tokens while keeping your permanent ID intact.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/health-card"
                  className="inline-flex items-center gap-2 text-[#1769AA] font-bold text-sm hover:text-[#102A43] transition-colors"
                >
                  <span>Explore Smart Card Specifications →</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. NATIONWIDE NETWORK OF VERIFIED HOSPITALS & LABS (Hospital Network Showcase) */}
      <section className="py-16 bg-[#F5F8FC] border-b border-[#DFE7F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden shadow-card border border-[#DFE7F0]">
            <Image
              src="/images/hospital-network.jpg"
              alt="Modern Indian hospital reception and facilities"
              width={1400}
              height={450}
              className="w-full h-[320px] sm:h-[380px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#102A43]/95 via-[#102A43]/80 to-[#102A43]/40" />
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-2xl text-white space-y-3.5">
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-[#1769AA] font-bold w-max">
                Verified Health Network
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Connected with Accredited Hospitals & Diagnostic Centers
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Seamless admission, verified clinician lookups, and standardized e-prescriptions across accredited private facilities and medical practitioners nationwide.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/network"
                  className="px-5 py-2.5 bg-[#1769AA] hover:bg-[#2884CD] text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                >
                  Search Verified Providers
                </Link>
                <Link
                  href="/partner"
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs backdrop-blur-md transition-all"
                >
                  Partner Onboarding
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ Section) */}
      <section className="py-16 bg-white border-b border-[#DFE7F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Common Questions
            </span>
            <h2 className="text-3xl font-black text-[#102A43] tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#62748A] mt-2">
              Everything you need to know about the AHCS private healthcare identity and smart health card.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#DFE7F0] bg-[#F5F8FC] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#102A43] hover:text-[#1769AA] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#62748A] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#62748A] leading-relaxed border-t border-[#DFE7F0]/60 bg-white">
                      <div className="pt-3">{faq.a}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-16 bg-[#102A43] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#13BBA4] text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lifelong Sovereign Healthcare Identity</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Take Control of Your Medical Identity Today
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of individuals and families who rely on AHCS for verified medical identification, encrypted clinical records, and 24x7 emergency protection.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/apply"
              className="px-7 py-3.5 bg-[#1769AA] hover:bg-[#2884CD] text-white rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              Create Your Account
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all border border-white/20"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
