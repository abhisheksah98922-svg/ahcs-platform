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
  ShieldAlert
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

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            Card Engineering Specifications
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            The AHCS Smart Health Card
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Standard ISO/IEC 7810 ID-1 form factor featuring Frosted Platinum Silver styling, dual-interface contactless NFC, gold contact chip, and tamper-evident break-glass emergency QR code.
          </p>
        </div>

        {/* Visual Dual-Side Card Interactive Component */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Interactive 3D & Side-by-Side Dual View
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Switch themes, rotate in 3D, or view both Front and Back faces simultaneously.
            </p>
          </div>

          <SmartCardInteractive initialDisplayMode="side-by-side" initialTheme="platinum" />
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Dual-Interface Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped with both high-frequency 13.56 MHz contactless NFC and ISO 7816 contact smart chip for hospital kiosk check-ins.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Break-Glass Emergency QR</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paramedics scan the back-side QR to access life-critical blood group and emergency contacts in under 3 seconds without app login.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero On-Card Diagnosis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Medical history is never printed on the physical card. In case of physical card loss, sensitive diagnoses remain strictly private.
            </p>
          </div>
        </div>

        {/* Technical Specification Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-slate-900">Technical Specifications Matrix</h3>
            <p className="text-xs text-slate-500 mt-1">Full architectural parameters adhering to global digital health benchmarks.</p>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {specs.map((s, idx) => (
              <div key={idx} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="font-semibold text-slate-500">{s.label}</div>
                <div className="sm:col-span-2 font-mono font-medium text-slate-800">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Download & Print Sheet Options */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-800">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800">
              Print-Ready Assets
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Download Official Card Artwork & Print PDFs
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Standardized CR80 direct-to-card PVC thermal print files and 1:1 real-world physical scale A4 verification sheets.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/downloads/ahcs_smart_card_cr80.pdf"
                download
                className="px-6 py-3 bg-white text-blue-950 hover:bg-slate-100 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-blue-700" />
                <span>CR80 PVC Direct Print (PDF)</span>
              </a>

              <a
                href="/downloads/ahcs_smart_card_a4_sheet.pdf"
                download
                className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-white" />
                <span>A4 Verification Sheet (PDF)</span>
              </a>

              <Link
                href="/apply"
                className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <span>Apply for Client ID</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
