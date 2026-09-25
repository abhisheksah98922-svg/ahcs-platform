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
  RefreshCw
} from 'lucide-react';
import { HealthCard } from '@/components/HealthCard';

export default function HealthCardSpecPage() {
  const specs = [
    { label: 'Physical Standard', value: 'ISO/IEC 7810 ID-1 (85.60 × 53.98 mm)' },
    { label: 'Material & Durability', value: 'Multi-layer PVC / Composite Polycarbonate, scratch-resistant gloss laminate' },
    { label: 'Identifier Encoding', value: 'ISO/IEC 7064 Mod 97-10 Checksum validated AHCS Client ID' },
    { label: 'Barcode / QR Type', value: 'High-density Micro-QR Code with 256-bit cryptographically signed URL' },
    { label: 'Emergency Protocol', value: 'Unauthenticated break-glass vital profile resolution' },
    { label: 'Card Lifecycle Statuses', value: 'ACTIVE, SUSPENDED, LOST, STOLEN, REVOKED, REPLACED' },
    { label: 'Security Token Rotation', value: 'One-click token invalidation and instant QR re-minting from dashboard' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Card Engineering Specifications
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-3 tracking-tight">
            The AHCS Smart Health Card
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Standard ISO/IEC 7810 ID-1 form factor with instant visual identity, dynamic emergency QR code, and tamper-evident fraud deterrence.
          </p>
        </div>

        {/* Visual Card Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <HealthCard
                memberName="ANANYA VERMA"
                clientId="AHCS-IN-2026-9142-8810"
                cardNumber="CRD-8491-2041"
                validThru="12/2031"
                bloodGroup="O+"
                isVerified={true}
              />
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Biometric & Vital Profile Display
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Immediate Visual Clarity for Medical Emergencies
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every AHCS Card carries the citizen&apos;s verified name, checked blood group, permanent Client ID, and a high-contrast dynamic emergency QR code.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero medical history printed on physical plastic for personal privacy.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Loss of physical card does NOT expose sensitive diagnosis records.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lost card can be permanently frozen or revoked in 1 second via web dashboard.</span>
              </div>
            </div>
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

        {/* CTA */}
        <div className="text-center bg-blue-700 text-white rounded-3xl p-8 sm:p-10 shadow-lg shadow-blue-700/25">
          <h2 className="text-2xl font-black">Get Your Verified AHCS Health Card</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-xl mx-auto">
            Enroll your healthcare identity today. Free forever for every Indian citizen.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/apply"
              className="px-8 py-3.5 bg-white text-blue-700 hover:bg-slate-100 font-bold rounded-full text-xs shadow-md transition-all"
            >
              Apply for Health Card &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
