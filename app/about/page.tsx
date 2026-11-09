import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  HeartHandshake,
  Lock,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  Activity,
  FileCheck2,
  Clock,
  Database,
  QrCode,
  Sparkles,
  Layers,
  HeartPulse,
} from 'lucide-react';

export const metadata = {
  title: 'About AHCS | Private Healthcare Identity & Access Infrastructure',
  description:
    'Learn about AHCS mission, core values, technological architecture, and our strict boundaries as an independent private healthcare identity and access platform.',
};

export default function AboutPage() {
  const problemsSolved = [
    {
      title: 'Healthcare Record Fragmentation',
      problem:
        'Patients visit multiple clinics, diagnostic labs, and hospitals over their lifetimes, leaving their vital medical history scattered across paper envelopes and disconnected software systems.',
      solution:
        'AHCS provides a single, permanent digital health identity and encrypted record vault where citizens organize all lab results, prescriptions, and discharge summaries under their direct consent.',
      icon: Layers,
    },
    {
      title: 'Golden Hour Information Vacuum',
      problem:
        'During trauma accidents or unconscious emergencies, first responders and casualty doctors often have zero knowledge of a patient’s blood group, critical allergies, chronic conditions, or emergency contacts.',
      solution:
        'The AHCS Smart Card break-glass QR allows verified paramedics to access life-critical vitals and emergency guardian phone numbers in seconds without demanding an app login or account password.',
      icon: Clock,
    },
    {
      title: 'Redundant & Costly Diagnostic Retesting',
      problem:
        'Because past test results cannot be easily produced upon referral, patients are frequently forced to repeat costly blood panels, X-rays, and scans, inflating healthcare expenses.',
      solution:
        'With patient authorization, consulting physicians can review chronological diagnostic trends, past lab reports, and medication history instantly through time-limited cryptographic sessions.',
      icon: Database,
    },
    {
      title: 'Physical Paper Loss & Wear-and-Tear',
      problem:
        'Traditional physical health folders degrade, are easily misplaced during house moves or travel, and are rarely available when acute health issues arise away from home.',
      solution:
        'AHCS pairs durable ID-1 frosted polycarbonate physical Smart Cards with high-availability, AES-256 cloud-encrypted digital records accessible on any smartphone or web browser.',
      icon: FileCheck2,
    },
  ];

  const citizenBenefits = [
    'One permanent, standardized AHCS Client ID for life',
    'Durable physical ID-1 Smart Card with NFC and dynamic QR',
    'Life-saving emergency break-glass profile for paramedics',
    'Secure digital health vault with strict patient-directed consent',
    'Unified family health management for children and seniors',
    'Instant one-click card freeze if lost or misplaced',
  ];

  const providerBenefits = [
    'Instant demographic verification reduces hospital registration wait times',
    'Immediate access to emergency vitals during trauma triage',
    'Zero complex software installation required to scan emergency cards',
    'Tamper-evident audit logging of all patient data disclosures',
    'Interoperable digital records eliminate handwriting ambiguity',
    'Streamlined referral and diagnostic review workflows',
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <section className="bg-[#102A43] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#0B1D2F]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1769AA]/30 text-[#36C5D8] text-xs font-semibold border border-[#2389D7]/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Independent Healthcare Technology</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Building Trust, Security & Access in Everyday Healthcare
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            AHCS (Advanced Health Care System) was built to solve healthcare fragmentation, eliminate critical data vacuums during emergency trauma, and give individuals complete, secure ownership of their medical identity.
          </p>
        </div>
      </section>

      {/* 2. REGULATORY & BOUNDARY DEMARCATION BANNER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Statutory Transparency & Identity
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#172B4D] mt-2">
              Our Core Identity & Platform Demarcation
            </h2>
            <p className="text-xs text-[#66788A] mt-1">
              AHCS is committed to absolute truth and transparency. We strictly demarcate what we do and what we do not do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What AHCS IS */}
            <div className="p-6 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 font-bold text-emerald-900 text-sm mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#16865C] shrink-0" />
                  <span>WHAT AHCS IS:</span>
                </div>
                <ul className="space-y-3 text-xs text-emerald-950">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#16865C]">•</span>
                    <span><strong>Private Healthcare Identity:</strong> Standardized, unique AHCS Client IDs issued with ISO/IEC 7064 Mod 97-10 checksum validation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#16865C]">•</span>
                    <span><strong>Smart Health Card System:</strong> Physical ID-1 frosted contactless NFC and dynamic QR cards for personal health management.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#16865C]">•</span>
                    <span><strong>Break-Glass Emergency Gateway:</strong> Instant, unauthenticated life-saving access to blood group, critical allergies, and emergency contacts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#16865C]">•</span>
                    <span><strong>Patient-Directed Encrypted Vault:</strong> AES-256 encrypted storage of clinical records governed by India DPDP Act 2023 consent controls.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* What AHCS IS NOT */}
            <div className="p-6 bg-rose-50/70 rounded-2xl border border-rose-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 font-bold text-rose-900 text-sm mb-4">
                  <XCircle className="w-5 h-5 text-[#D64545] shrink-0" />
                  <span>WHAT AHCS IS NOT:</span>
                </div>
                <ul className="space-y-3 text-xs text-rose-950">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D64545]">•</span>
                    <span><strong>NOT a Government Entity:</strong> Not affiliated with UIDAI (Aadhaar), National Health Authority (NHA), ABHA, or Ayushman Bharat.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D64545]">•</span>
                    <span><strong>NOT an Insurance Company:</strong> AHCS does not underwrite financial risk, sell insurance policies, or provide cash indemnity reimbursement.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D64545]">•</span>
                    <span><strong>NOT a Hospital or Clinical Provider:</strong> AHCS does not practice medicine. Clinical diagnoses and treatments are provided solely by licensed physicians.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D64545]">•</span>
                    <span><strong>NOT a Hospital Management System:</strong> AHCS does not replace hospital ERP or clinical billing systems; it functions as an interoperable access layer.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROBLEMS WE SOLVE */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Why AHCS Exists
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              The Real Challenges in Modern Healthcare
            </h2>
            <p className="text-xs sm:text-sm text-[#66788A] mt-2">
              Every design and engineering choice at AHCS stems from solving tangible friction in patient care, emergency readiness, and data governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problemsSolved.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-[#1769AA]/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] text-[#1769AA] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#172B4D]">
                      {item.title}
                    </h3>

                    <div className="space-y-2 text-xs text-[#66788A]">
                      <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-[#172B4D]">
                        <strong className="text-[#D64545] block font-semibold mb-1">The Friction:</strong>
                        {item.problem}
                      </div>

                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[#172B4D]">
                        <strong className="text-[#16865C] block font-semibold mb-1">The AHCS Solution:</strong>
                        {item.solution}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. DUAL VALUE: CITIZENS & PROVIDERS */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Ecosystem Benefits
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              Value for Individuals, Families & Healthcare Providers
            </h3>
            <p className="text-xs sm:text-sm text-[#66788A] mt-2">
              Designed to create shared efficiency between citizens managing their health and medical professionals delivering care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Citizens & Families */}
            <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#102A43] text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#102A43]">For Citizens & Families</h4>
                  <span className="text-[11px] text-[#66788A]">Personal health autonomy and peace of mind</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {citizenBenefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#172B4D]">
                    <CheckCircle2 className="w-4 h-4 text-[#16865C] shrink-0 mt-0.5" />
                    <span className="leading-snug">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* For Doctors & Clinics */}
            <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1769AA] text-white flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#102A43]">For Doctors & Healthcare Providers</h4>
                  <span className="text-[11px] text-[#66788A]">Accurate triage and verified clinical context</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {providerBenefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#172B4D]">
                    <CheckCircle2 className="w-4 h-4 text-[#16865C] shrink-0 mt-0.5" />
                    <span className="leading-snug">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. ETHICAL & TECHNICAL PILLARS */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-[#172B4D]">
              Guiding Technical & Ethical Principles
            </h3>
            <p className="text-xs text-[#66788A] mt-1">
              Rigorous data governance, cryptographic integrity, and zero exploitation of personal medical records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#DFE7F0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1769AA] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#172B4D] text-sm sm:text-base">Zero Data Commercialization</h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                AHCS will never monetize, lease, or broker patient diagnostic data to pharmaceutical advertisers, marketers, or underwriters. You are our member, not our product.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#DFE7F0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16865C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#172B4D] text-sm sm:text-base">Absolute Reality First</h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                No simulated doctor counts, no unverified clinic badges, and no exaggerated claims. Every participating provider undergoes compliance checks before network inclusion.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#DFE7F0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0F9D8A] flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#172B4D] text-sm sm:text-base">Patient-Directed Consent</h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                Your medical files remain encrypted in AES-256 cloud vaults. Healthcare staff can only view what you explicitly grant via temporary cryptographic access keys.
              </p>
            </div>
          </div>
        </div>

        {/* 6. CALL TO ACTION STRIP */}
        <div className="bg-[#102A43] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm border border-[#0B1D2F]">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Take Control of Your Health Identity Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the clarity and security of an independent, verified health credential built for you and your family.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/apply"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-white text-[#102A43] hover:bg-slate-100 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Create Your Health ID</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-[#1769AA] text-white hover:bg-[#2389D7] transition-all flex items-center justify-center gap-2"
            >
              <span>Explore How It Works</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
