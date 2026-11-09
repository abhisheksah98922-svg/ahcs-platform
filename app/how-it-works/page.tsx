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
  Clock,
  Eye,
  UserCheck,
  Search,
  KeyRound,
  Layers,
  Cpu,
  Radio,
  FileCheck2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'How It Works — The 9-Step Verification & Activation Process | AHCS',
  description:
    'Discover the comprehensive 9-step journey of AHCS: from cryptographic OTP authentication and compliance review to ISO/IEC 7064 Client ID issuance and contactless Smart Health Card activation.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'User Registration',
      subtitle: 'Primary Account Onboarding',
      desc: 'Citizen creates an account using their legal full name, verified mobile number, and active personal email. A unique registration session token is issued.',
      icon: Smartphone,
      phase: 'Phase 1: Onboarding',
      securityTag: 'TLS 1.3 Session',
    },
    {
      num: '02',
      title: 'Mobile OTP Verification',
      subtitle: 'Cryptographic Possession Proof',
      desc: 'A time-limited 6-digit cryptographic one-time password (OTP) is dispatched via SMS or email to authenticate mobile device possession without passwords.',
      icon: KeyRound,
      phase: 'Phase 1: Onboarding',
      securityTag: 'SHA-256 HMAC',
    },
    {
      num: '03',
      title: 'Personal Profile & Vitals',
      subtitle: 'Baseline Health Demographics',
      desc: 'Citizen inputs baseline demographic and critical clinical data: Date of Birth, Gender, Blood Group, Primary Emergency Guardian, and Life-Threatening Drug Allergies.',
      icon: FileText,
      phase: 'Phase 1: Onboarding',
      securityTag: 'AES-256 Encrypted',
    },
    {
      num: '04',
      title: 'Identity Document Submission',
      subtitle: 'Official Verification Proof',
      desc: 'Upload of a valid government identity document (Aadhaar, Voter ID, Passport, or PAN). Files are validated, hashed, and isolated in restricted vault storage.',
      icon: Lock,
      phase: 'Phase 2: Verification',
      securityTag: 'Encrypted Vault Isolation',
    },
    {
      num: '05',
      title: 'Duplicate Identity Check',
      subtitle: 'Algorithmic Deduplication Guard',
      desc: 'Automated deduplication algorithms cross-verify demographic combinations and document hash checksums to ensure zero duplicate card issuances across the ledger.',
      icon: Search,
      phase: 'Phase 2: Verification',
      securityTag: 'Deduplication Engine',
    },
    {
      num: '06',
      title: 'Admin / Officer Verification Review',
      subtitle: 'Human Compliance Audit',
      desc: 'An authorized AHCS verification compliance officer reviews the submitted documentation in a secure internal back-office queue, verifying document validity against tampering.',
      icon: UserCheck,
      phase: 'Phase 2: Verification',
      securityTag: 'Role-Protected Audit Queue',
    },
    {
      num: '07',
      title: 'Permanent AHCS Client ID Generation',
      subtitle: 'ISO/IEC 7064 Algorithmic Checksum',
      desc: 'Upon official approval, the system mints a unique, permanent AHCS Client ID formatted with an ISO/IEC 7064 Mod 97-10 check digit to prevent accidental transcription errors.',
      icon: FileCheck2,
      phase: 'Phase 3: Activation',
      securityTag: 'ISO/IEC 7064 Mod 97-10',
    },
    {
      num: '08',
      title: 'Digital Health Card Activation',
      subtitle: 'Instant Member Portal Availability',
      desc: 'The member’s Digital Smart Health Card is activated immediately in their secure portal, featuring an encrypted dynamic QR code for emergency break-glass vitals access.',
      icon: QrCode,
      phase: 'Phase 3: Activation',
      securityTag: 'Dynamic Rotating Token',
    },
    {
      num: '09',
      title: 'QR / NFC Access Setup & Physical Dispatch',
      subtitle: 'Durable ID-1 Contactless Card',
      desc: 'Physical Frosted ID-1 Smart Card is laser-engraved with micro-hologram and contactless NFC inlay, verified on test kiosks, and dispatched via tracked courier to your door.',
      icon: Cpu,
      phase: 'Phase 3: Activation',
      securityTag: '13.56 MHz NFC + Laser Hologram',
    },
  ];

  const emergencyFeatures = [
    {
      title: 'Zero Login Needed for EMTs & ER Doctors',
      desc: 'During traumatic accidents or unconscious casualty admissions, paramedics scan the card QR with any smartphone camera to view vital blood group and allergies in under 3 seconds.',
      icon: QrCode,
    },
    {
      title: 'Strictly Selective Emergency Disclosure',
      desc: 'The break-glass gateway exposes ONLY life-critical data: blood group, critical allergies, pre-existing conditions (e.g. cardiac stents), and emergency guardian phone numbers. Full medical folders remain private.',
      icon: Eye,
    },
    {
      title: 'Tamper-Evident Audit Logging & Alerting',
      desc: 'Every emergency QR scan triggers an unalterable log recording exact timestamp, IP address, and browser headers, while immediately sending an emergency SMS notification to the cardholder’s guardians.',
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <section className="bg-[#102A43] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#0B1D2F]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1769AA]/30 text-[#36C5D8] text-xs font-semibold border border-[#2389D7]/30">
            <Layers className="w-4 h-4" />
            <span>Architecture & Lifecycle</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            How the AHCS Health Identity Works
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            A transparent, 9-step verification and activation journey designed to ensure absolute identity authenticity, medical data privacy, and instantaneous emergency break-glass triage.
          </p>
        </div>
      </section>

      {/* 2. THE 9-STEP WORKFLOW */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Complete Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              The 9-Step Verification & Deployment Protocol
            </h2>
            <p className="text-xs sm:text-sm text-[#66788A] mt-2">
              From cryptographic user authentication to laser-engraved NFC physical card dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-[#1769AA]/40 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-black text-[#102A43]/20 font-mono">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] text-[#1769AA] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-[#1769AA] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {step.phase}
                      </span>
                      <span className="text-[10px] font-mono text-[#66788A]">
                        {step.securityTag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#172B4D] mb-1">
                      {step.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#1769AA] mb-3">
                      {step.subtitle}
                    </div>

                    <p className="text-xs text-[#66788A] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#DFE7F0]/60 flex items-center justify-between text-[11px] text-[#66788A]">
                    <span className="font-mono">Step {step.num} of 09</span>
                    <CheckCircle2 className="w-4 h-4 text-[#16865C]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. BREAK-GLASS EMERGENCY ACCESS DEEP DIVE */}
        <div className="bg-[#102A43] text-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#0B1D2F]">
          <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#36C5D8] bg-[#1769AA]/30 px-3.5 py-1 rounded-full border border-[#2389D7]/30">
              Golden Hour Triage Innovation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              The 24/7 Break-Glass Emergency QR Protocol
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When seconds dictate patient survival in trauma admissions, medical teams cannot wait for forgotten passwords, phone unlock pins, or bureaucratic registration paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {emergencyFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0B1D2F]/70 rounded-2xl p-6 border border-slate-700/60 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1769AA]/40 text-[#36C5D8] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/emergency-preview"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
            >
              <span>Inspect Emergency Gateway Demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4. DOCTOR CONSENT BARRIER & VERIFICATION STATE MACHINE */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Zero-Trust Privacy Architecture
              </span>
              <h3 className="text-2xl font-black text-[#172B4D]">
                Doctors Cannot Access Full Records Without Patient Consent
              </h3>
              <p className="text-xs sm:text-sm text-[#66788A] leading-relaxed">
                Unlike legacy systems where hospital clerks or doctors can browse patient files without restrictions, AHCS operates an explicit, cryptographic consent barrier compliant with the India DPDP Act 2023.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#172B4D]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16865C] shrink-0 mt-0.5" />
                  <span><strong>Structured Clinical Request:</strong> The provider submits an access request specifying clinical reason and requested duration.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16865C] shrink-0 mt-0.5" />
                  <span><strong>Member Direct Authorization:</strong> Citizen receives an in-app prompt and grants temporary cryptographic access (e.g. 24 or 48 hours).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16865C] shrink-0 mt-0.5" />
                  <span><strong>Instant Revocation:</strong> Citizen can terminate physician access with one click at any time, instantly revoking read permissions.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F5F8FC] rounded-2xl border border-[#DFE7F0] p-6 space-y-4">
              <div className="text-xs font-mono font-bold text-[#102A43] uppercase tracking-wider flex items-center justify-between">
                <span>Identity State Machine</span>
                <span className="w-2 h-2 rounded-full bg-[#16865C]" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#DFE7F0] flex items-center justify-between">
                  <span className="text-[#66788A]">1. Initial Registration</span>
                  <span className="font-mono font-bold text-[#1769AA]">REGISTERED</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#DFE7F0] flex items-center justify-between">
                  <span className="text-[#66788A]">2. Document Upload</span>
                  <span className="font-mono font-bold text-[#D99A24]">PENDING_REVIEW</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#DFE7F0] flex items-center justify-between">
                  <span className="text-[#66788A]">3. Compliance Approved</span>
                  <span className="font-mono font-bold text-[#16865C]">CLIENT_ID_ACTIVE</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#DFE7F0] flex items-center justify-between">
                  <span className="text-[#66788A]">4. Physical Card Production</span>
                  <span className="font-mono font-bold text-[#2389D7]">DISPATCHED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. CALL TO ACTION */}
        <div className="bg-[#102A43] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm border border-[#0B1D2F]">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Establish Your Verified Health Identity?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Start your onboarding in under 3 minutes with SMS/Email OTP verification.
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
              href="/health-card"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-[#1769AA] text-white hover:bg-[#2389D7] transition-all flex items-center justify-center gap-2"
            >
              <span>Inspect Smart Health Card Specs</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
