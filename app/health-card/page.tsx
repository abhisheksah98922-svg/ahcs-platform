'use client';

import React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ShieldCheck,
  QrCode,
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  Sparkles,
  Download,
  FileText,
  Printer,
  ExternalLink,
  ShieldAlert,
  Wifi,
  Smartphone,
  EyeOff,
  Clock,
  Ban,
  Activity,
  FileCheck2,
} from 'lucide-react';
import { SmartCardInteractive } from '@/components/SmartCardInteractive';

export default function HealthCardSpecPage() {
  const specs = [
    { label: 'Physical Form Factor', value: 'ISO/IEC 7810 ID-1 standard (85.60 mm × 53.98 mm × 0.76 mm)' },
    { label: 'Substrate & Finish', value: 'Multi-layer PVC / Composite Polycarbonate, Frosted Platinum brushed matte with scratch-resistant gloss laminate' },
    { label: 'Security Hologram', value: 'Micro-embossed 3D rainbow diffraction optical foil featuring AHCS medical caduceus shield' },
    { label: 'Identifier Verification', value: 'ISO/IEC 7064 Mod 97-10 Checksum validated AHCS Client ID' },
    { label: 'Contactless Interface', value: '13.56 MHz ISO/IEC 14443 Type A NFC chip inlay with encrypted URL payload' },
    { label: 'Contact Interface', value: 'Gold-plated 6-pin ISO/IEC 7816 contact microchip architecture' },
    { label: 'Magnetic Stripe', value: '3-track High-Coercivity (HiCo 2750 Oe) magnetic stripe encoding card reference number' },
    { label: 'Break-Glass Emergency Protocol', value: 'High-contrast ISO/IEC 18004 dynamic 2D Data Matrix QR code linking directly to unauthenticated life-saving vitals' },
    { label: 'Card Lifecycle States', value: 'ACTIVE, PENDING_PRINT, DISPATCHED, DELIVERED, SUSPENDED, REVOKED, REPLACED' },
    { label: 'Cryptographic Rotation', value: 'Instant one-click QR token invalidation and re-minting from citizen dashboard' },
  ];

  const frontFeatures = [
    { title: 'AHCS Healthcare Logo', desc: 'Embossed high-definition medical insignia with holographic anti-counterfeit overlay.' },
    { title: 'Cardholder Legal Name', desc: 'Laser-printed full legal name matching government-verified proof of identity.' },
    { title: 'Permanent Client ID', desc: 'ISO/IEC 7064 Mod 97-10 validated unique identifier preventing accidental duplication.' },
    { title: 'Dynamic QR Identity', desc: 'High-contrast 2D matrix for rapid optical scanner reading at partner clinic kiosks.' },
    { title: 'Real-Time Card Status', desc: 'Visual indicator of active verification ledger status.' },
  ];

  const backFeatures = [
    { title: 'Blood Group Identification', desc: 'Prominently displayed ABO & Rh blood type for instant transfusion matching.' },
    { title: 'Emergency Contact Telephone', desc: 'Direct dial numbers for primary family guardians and designated emergency responders.' },
    { title: 'Break-Glass Instructions', desc: 'Clear clinical directives guiding EMTs on how to scan and access critical allergy vitals.' },
    { title: 'NFC Contactless Indicator', desc: 'Standard ISO/IEC 14443 13.56 MHz proximity tap area for rapid kiosk intake.' },
    { title: 'Gold-Plated Contact Microchip', desc: 'ISO/IEC 7816 micro-module interface for offline hospital card readers.' },
  ];

  const digitalCardFeatures = [
    {
      title: 'Real-Time Ledger Status',
      desc: 'Instant verification of card validity, whether ACTIVE, PENDING_RENEWAL, or SUSPENDED.',
      icon: Activity,
    },
    {
      title: 'Dynamic Rotating QR',
      desc: 'Cryptographic access tokens that rotate periodically to prevent unauthorized screenshot misuse.',
      icon: QrCode,
    },
    {
      title: 'Offline Emergency Cache',
      desc: 'Encrypted local device storage allowing emergency vitals display even when internet connectivity is lost.',
      icon: Wifi,
    },
  ];

  const securityGuarantees = [
    {
      title: 'Zero On-Card Sensitive Diagnosis',
      desc: 'Full medical history, clinical diagnoses, and prescriptions are NEVER printed on the card or encoded in raw QR. Lost cards reveal zero private medical history.',
      icon: EyeOff,
    },
    {
      title: 'Immutable Break-Glass Audit Trail',
      desc: 'Every scan of the emergency QR triggers an automated audit entry capturing timestamp, IP address, and location attempt, immediately alerting the cardholder via SMS.',
      icon: Clock,
    },
    {
      title: '1-Click Remote Card Freeze / Lock',
      desc: 'If your physical card is lost or stolen, immediately click "Freeze Card" in your dashboard to instantly revoke the QR code and NFC token in real time.',
      icon: Ban,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <section className="bg-[#102A43] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#0B1D2F]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1769AA]/30 text-[#36C5D8] text-xs font-semibold border border-[#2389D7]/30">
            <CreditCard className="w-4 h-4" />
            <span>Card Engineering Specifications</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            The AHCS Smart Health Card
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Standard ISO/IEC 7810 ID-1 form factor featuring Frosted Platinum styling, dual-interface contactless NFC, gold contact chip, and tamper-evident break-glass emergency QR code.
          </p>
        </div>
      </section>

      {/* 2. INTERACTIVE 3D & DUAL-SIDE CARD STUDIO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Interactive Card Studio
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#172B4D] mt-3">
              Interactive 3D & Side-by-Side Dual View
            </h2>
            <p className="text-xs text-[#66788A] mt-1">
              Switch finishes, rotate in 3D, inspect chip architecture, or view Front and Back faces simultaneously.
            </p>
          </div>

          <SmartCardInteractive initialTheme="platinum" />
        </div>

        {/* 3. PHYSICAL CARD ANATOMY: FRONT VS BACK */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Card Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              Physical Card Layout & Anatomy
            </h3>
            <p className="text-xs sm:text-sm text-[#66788A] mt-1">
              Manufactured with durable composite polycarbonate and PVC substrates engineered for daily pocket wear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Front Face Breakdown */}
            <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#102A43] text-white flex items-center justify-center font-bold text-xs">
                  FRONT
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#102A43]">Front Face Elements</h4>
                  <span className="text-[11px] text-[#66788A]">Patient Identity & Visual Verification</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {frontFeatures.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#172B4D]">
                    <CheckCircle2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-[#102A43]">{f.title}: </strong>
                      <span className="text-[#66788A]">{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Face Breakdown */}
            <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1769AA] text-white flex items-center justify-center font-bold text-xs">
                  BACK
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#102A43]">Back Face Elements</h4>
                  <span className="text-[11px] text-[#66788A]">Emergency Triage & Contactless Interface</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {backFeatures.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#172B4D]">
                    <CheckCircle2 className="w-4 h-4 text-[#16865C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-[#102A43]">{b.title}: </strong>
                      <span className="text-[#66788A]">{b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. DIGITAL CARD CAPABILITIES */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Mobile Portal Capabilities
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              Digital Smart Card Features
            </h3>
            <p className="text-xs sm:text-sm text-[#66788A] mt-1">
              Available instantly inside your secure member portal on any smartphone or browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {digitalCardFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-7 shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F8FC] border border-[#DFE7F0] text-[#1769AA] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-[#172B4D]">{feat.title}</h4>
                  <p className="text-xs text-[#66788A] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. PRIVACY & SECURITY GUARANTEES */}
        <div className="bg-[#102A43] text-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#0B1D2F]">
          <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#36C5D8] bg-[#1769AA]/30 px-3.5 py-1 rounded-full border border-[#2389D7]/30">
              Strict Security Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Privacy and Security Guarantees
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Designed according to Zero-Trust principles to prevent medical identity theft, unwanted data harvesting, and fraud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityGuarantees.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0B1D2F]/70 rounded-2xl p-6 border border-slate-700/60 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1769AA]/40 text-[#36C5D8] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{sec.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. TECHNICAL SPECIFICATIONS TABLE */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs">
          <div className="border-b border-[#DFE7F0] pb-4 mb-6">
            <h3 className="text-xl font-bold text-[#172B4D]">Technical Specifications Matrix</h3>
            <p className="text-xs text-[#66788A] mt-1">Full architectural parameters adhering to global digital health benchmarks.</p>
          </div>
          <div className="divide-y divide-[#DFE7F0] text-xs">
            {specs.map((s, idx) => (
              <div key={idx} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="font-semibold text-[#66788A]">{s.label}</div>
                <div className="sm:col-span-2 font-mono font-medium text-[#172B4D]">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. PRINT & DOWNLOAD ASSETS */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-8 sm:p-10 shadow-xs">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Print-Ready Assets
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#172B4D]">
              Official Card Artwork & Print PDFs
            </h3>
            <p className="text-xs sm:text-sm text-[#66788A] max-w-xl mx-auto leading-relaxed">
              Standardized CR80 direct-to-card PVC thermal print files and 1:1 real-world physical scale A4 verification sheets.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/downloads/ahcs_smart_card_cr80.pdf"
                download
                className="px-6 py-3 bg-[#102A43] hover:bg-[#1769AA] text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#36C5D8]" />
                <span>CR80 PVC Direct Print (PDF)</span>
              </a>

              <a
                href="/downloads/ahcs_smart_card_a4_sheet.pdf"
                download
                className="px-6 py-3 bg-[#F5F8FC] hover:bg-[#DFE7F0] text-[#172B4D] font-bold rounded-xl text-xs border border-[#DFE7F0] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#1769AA]" />
                <span>A4 Verification Sheet (PDF)</span>
              </a>

              <Link
                href="/apply"
                className="px-6 py-3 bg-[#1769AA] hover:bg-[#2389D7] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Apply for Health ID</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
