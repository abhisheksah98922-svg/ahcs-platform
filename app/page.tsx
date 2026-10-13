import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Building2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Truck,
  Home,
  FlaskConical,
  Video,
  Pill,
  HeartPulse,
  Stethoscope,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SmartCardInteractive } from '@/components/SmartCardInteractive';

export default function HomePage() {
  const corePillars = [
    {
      title: 'Verified Client Identity',
      desc: 'A permanent, uniquely random AHCS Client ID issued only after human officer verification and duplicate prevention.',
      status: 'Active Development',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ShieldCheck,
    },
    {
      title: 'Smart Health Card (QR & NFC)',
      desc: 'Physical and digital cards carrying rotating, signed cryptographic tokens. Zero medical data is stored on the card surface or chip.',
      status: 'Active Development',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CreditCard,
    },
    {
      title: 'Emergency Break-Glass Access',
      desc: 'Time-boxed, purpose-justified emergency profile retrieval for licensed medical staff with immutable audit logging and instant patient alerts.',
      status: 'Active Development',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ShieldAlert,
    },
    {
      title: 'Consent-Directed Health Records',
      desc: 'Centralized patient record management where access requires explicit, granular, and revocable patient authorization.',
      status: 'Active Development',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: FileText,
    },
    {
      title: 'Explicit Family Delegation',
      desc: 'Manage dependents and elderly parents without assuming automatic adult access. Requires explicit authorization grants.',
      status: 'Active Development',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Users,
    },
    {
      title: 'Verified Provider Directory',
      desc: 'Role-based access controls for verified clinical staff, nurses, and receptionists at participating healthcare facilities.',
      status: 'Active Development',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Building2,
    },
  ];

  const careServices = [
    {
      title: 'Mobile Medical Units',
      desc: 'On-site preventive healthcare screening vans equipped with diagnostic testing for societies & worksites.',
      icon: Truck,
      href: '/services/mobile-medical',
      tag: 'On-Demand Van',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Home Healthcare & Nursing',
      desc: 'Certified post-hospitalization nursing, elder caregivers, and physiotherapy attendants at home.',
      icon: Home,
      href: '/services/home-care',
      tag: 'Home Visits',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Diagnostic Lab Tests',
      desc: 'Partnered diagnostic labs and health check packages with doorstep sample collection.',
      icon: FlaskConical,
      href: '/services/diagnostics',
      tag: 'Home Collection',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Telemedicine Consultations',
      desc: 'Remote consultations with licensed medical specialists with verified digital prescriptions.',
      icon: Video,
      href: '/services/telemedicine',
      tag: 'Remote Consult',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Pharmacy Network',
      desc: 'Access verified retail network pharmacies for genuine medicines, e-prescriptions, and savings.',
      icon: Pill,
      href: '/services/pharmacy',
      tag: 'Prescriptions',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: 'Health Camps & Screening Drives',
      desc: 'Preventive health screening drives organized for residential welfare associations and corporate offices.',
      icon: HeartPulse,
      href: '/services/health-camps',
      tag: 'Screening Drives',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: 'Senior & Geriatric Care',
      desc: 'Specialized elderly health management, routine vitals tracking, and regular medical check-ins.',
      icon: Stethoscope,
      href: '/services/senior-care',
      tag: 'Elder Care',
      tagColor: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      title: 'Emergency Assistance',
      desc: '24/7 break-glass medical profile retrieval, next-of-kin emergency notification, and hospital discovery.',
      icon: ShieldAlert,
      href: '/emergency',
      tag: '24/7 Gateway',
      tagColor: 'bg-red-50 text-red-700 border-red-200'
    }
  ];

  const comingSoonServices = [
    {
      title: 'Telemedicine Consultations',
      desc: 'Remote consultations with licensed medical practitioners via verified digital prescripting.',
      tag: 'Coming soon',
    },
    {
      title: 'Workplace Health Audits',
      desc: 'Statutory factory health screening camps and corporate employee health wellness management.',
      tag: 'Coming soon',
    },
    {
      title: 'Mobile Medical Units',
      desc: 'On-site preventive healthcare screening vehicles for remote and industrial communities.',
      tag: 'Coming soon',
    },
    {
      title: 'Home Care Coordination',
      desc: 'Home-based post-discharge nursing and physiotherapy coordination.',
      tag: 'Coming soon',
    },
  ];

  const enrollmentSteps = [
    {
      num: '01',
      title: 'Mobile OTP Verification',
      desc: 'Initial account creation via phone authentication with server-side rate-limiting and session generation.',
    },
    {
      num: '02',
      title: 'Profile & Document Upload',
      desc: 'Demographic details and official identity documents submitted to encrypted, private storage.',
    },
    {
      num: '03',
      title: 'Automated Duplicate Check',
      desc: 'Document cryptographic hashing and demographic matching to flag prospective duplicate applications.',
    },
    {
      num: '04',
      title: 'Officer Review & Approval',
      desc: 'Trained verification officers validate document legitimacy, request corrections, or approve issuance.',
    },
    {
      num: '05',
      title: 'Permanent Client ID Generated',
      desc: 'A secure, non-sequential identifier (AHCS-XXXX-XXXX) is generated and locked into the ledger.',
    },
    {
      num: '06',
      title: 'Smart Health Card Issued',
      desc: 'Digital and physical card issuance featuring dynamic, revocable QR and NFC verification credentials.',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. REGULATORY NOTICE BANNER */}
      <section className="bg-slate-100 border-b border-slate-200 px-4 py-3 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
            <span>
              <strong>Platform Notice:</strong> AHCS (Advanced Health Care System) is an independent private healthcare identity and management platform. Not affiliated with government health portals, Aadhaar/UIDAI, ABHA, or insurance schemes.
            </span>
          </div>
          <Link
            href="/terms"
            className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 underline text-xs shrink-0"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* 2. HERO SECTION */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 via-slate-50/70 to-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold tracking-tight">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Private Healthcare Access & Assistance Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                Verified Healthcare Identity & <span className="text-blue-700">Smart Health Card</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                One tamper-evident private healthcare identity connecting individuals with verified hospitals, diagnostic labs, care services, and 24/7 emergency assistance across India.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/apply"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
                >
                  <span>Get Your AHCS ID</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/find-care"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 transition-all shadow-xs"
                >
                  Find Healthcare
                </Link>
                <Link
                  href="/verify"
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
                >
                  Verify a Card
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Zero medical data in QR/NFC</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>256-Bit Encrypted Vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Audited Break-Glass Access</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Flippable Smart Card Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <SmartCardInteractive initialTheme="navy" showControls={true} />
            </div>

          </div>
        </div>
      </section>

      {/* 2.5. HEALTHCARE SERVICES NETWORK */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Healthcare Network Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Connected Care Services
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Access on-demand healthcare facilities, clinical screening, and home assistance through your verified AHCS identity.
              </p>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 shrink-0"
            >
              <span>View All 8 Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {careServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link
                  key={idx}
                  href={service.href}
                  className="group bg-slate-50/70 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${service.tagColor}`}>
                        {service.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1.5">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {service.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT TRUTH & BOUNDARIES SECTION */}
      <section className="py-14 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 p-8 bg-slate-50">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Product Demarcation & Clarity
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              To maintain absolute transparency with our users and partners, here is what AHCS does and does not do.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  What AHCS Is
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                  <li>A private healthcare identity verification and management platform.</li>
                  <li>A verified Client ID issuing system governed by human officer review.</li>
                  <li>A Smart Health Card (QR/NFC) carrying revocable, rotating validation tokens.</li>
                  <li>An emergency break-glass clinical profile lookup with immutable logging.</li>
                  <li>A patient-directed consent vault for sharing clinical summaries.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  What AHCS Is Not
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                  <li><strong>Not a government portal:</strong> We are not affiliated with UIDAI, ABHA, or NDHM.</li>
                  <li><strong>Not health insurance:</strong> We do not underwrite, sell, or manage insurance policies.</li>
                  <li><strong>Not guaranteed cashless treatment:</strong> Treatment costs and hospital billing are decided solely by treating facilities.</li>
                  <li><strong>Not a hospital management system (HMS):</strong> We do not manage internal hospital billing or ward beds.</li>
                  <li><strong>Not an identity replacement:</strong> AHCS Client ID is a private network identifier, not official state ID.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VERIFICATION & ISSUANCE LIFECYCLE */}
      <section className="py-16 border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Deterministic Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              End-to-End Verification Lifecycle
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every AHCS Client ID is issued through a strict, multi-stage state machine designed to prevent duplication and identity spoofing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollmentSteps.map((step) => (
              <div
                key={step.num}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-slate-400 mb-2">
                    {step.num}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ARCHITECTURAL PILLARS */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Core Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Platform Features & Modules
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Engineered with server-side authorization, append-only audit logging, and purpose-limited data exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corePillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border ${pillar.statusColor}`}
                    >
                      {pillar.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. UNBUILT / COMING SOON MODULES */}
      <section className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Roadmap Transparency
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Future Capabilities (Unbuilt)
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              These future initiatives are currently unbuilt and slated for subsequent roadmap milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonServices.map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {service.desc}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {service.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EMERGENCY PROTOCOL FOOTNOTE */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Life-Safety Advisory</span>
            </div>
            <h2 className="text-lg font-bold">In a medical emergency, call 112 immediately.</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              AHCS break-glass is an assistive medical profile retrieval tool for treating practitioners. Do not delay emergency physical transit or treatment for digital card scanning.
            </p>
          </div>
          <Link
            href="/verify"
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors shrink-0"
          >
            Access Card Verification Tool
          </Link>
        </div>
      </section>
    </div>
  );
}
