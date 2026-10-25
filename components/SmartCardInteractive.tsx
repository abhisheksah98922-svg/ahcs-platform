'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Lock,
  Activity,
  Zap,
  PhoneCall,
  Sparkles,
  Layers,
  Fingerprint,
  Radio,
  Eye,
  Check,
  RotateCw,
  Clock,
  AlertTriangle
} from 'lucide-react';

export function SmartCardInteractive({ 
  initialTheme = 'platinum',
  showControls = true 
}: {
  initialTheme?: 'platinum' | 'navy' | 'emerald';
  showControls?: boolean;
}) {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [activeTheme, setActiveTheme] = useState<'platinum' | 'navy' | 'emerald'>(initialTheme);
  const [simulatedAction, setSimulatedAction] = useState<'none' | 'nfc' | 'qr'>('none');

  const cardImages = {
    platinum: {
      front: '/cards/platinum-front.jpg',
      back: '/cards/platinum-back.jpg',
      name: 'Frosted Platinum',
      pillColor: 'bg-slate-200 text-slate-800 border-slate-300',
      badge: 'Executive Issue',
    },
    navy: {
      front: '/cards/navy-front.jpg',
      back: '/cards/navy-back.jpg',
      name: 'Sapphire Navy',
      pillColor: 'bg-blue-100 text-blue-800 border-blue-200',
      badge: 'Standard Edition',
    },
    emerald: {
      front: '/cards/emerald-front.jpg',
      back: '/cards/emerald-back.jpg',
      name: 'Emerald Jade',
      pillColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badge: 'Family & Senior',
    },
  };

  const currentTheme = cardImages[activeTheme];

  const handleSimulate = (type: 'nfc' | 'qr') => {
    setSimulatedAction(type);
    setTimeout(() => {
      setSimulatedAction('none');
    }, 7000);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-blue-950/10 overflow-hidden text-slate-900 transition-all">
      
      {/* 1. REAL LIFE CLINICIAN PHOTO BANNER WITH PHYSICAL EMBLEM */}
      <div className="relative w-full h-56 sm:h-64 bg-slate-900 overflow-hidden group">
        <Image
          src="/images/doctor-holding-card.jpg"
          alt="Clinician holding AHCS Smart Health Card"
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
          sizes="(max-width: 768px) 100vw, 550px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
        
        {/* Floating Top Trust Pill */}
        <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold shadow-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CR80 Physical Smart Credential</span>
        </div>

        {/* Edition Switcher Pills on Banner */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-full border border-slate-700/80 shadow-md">
          <button
            type="button"
            onClick={() => setActiveTheme('platinum')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              activeTheme === 'platinum'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Platinum
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('navy')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              activeTheme === 'navy'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Navy
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('emerald')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              activeTheme === 'emerald'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Emerald
          </button>
        </div>

        {/* Bottom Banner Title */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Dual-Protocol (ISO 14443 NFC + Dynamic Break-Glass QR)</span>
          </div>
          <h3 className="text-base sm:text-lg font-black leading-tight mt-0.5 text-white">
            Hospital Kiosk & Paramedic Ready
          </h3>
          <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
            Zero medical records printed on card. Audited cryptographic emergency retrieval.
          </p>
        </div>
      </div>

      {/* 2. CARD SIDES EXPLORER & SPECIFICATIONS */}
      <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-white to-slate-50">
        
        {/* Side Switcher Pills */}
        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSide === 'front'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Card Front (Identity & NFC)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSide('back')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSide === 'back'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Card Back (Break-Glass QR)</span>
          </button>
        </div>

        {/* Live Interactive Action Simulation Bars */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => handleSimulate('nfc')}
            className={`py-2 px-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
              simulatedAction === 'nfc'
                ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-400/30'
                : 'bg-white hover:bg-sky-50 text-sky-800 border-sky-200 shadow-2xs'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Simulate NFC Tap</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulate('qr')}
            className={`py-2 px-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
              simulatedAction === 'qr'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-400/30'
                : 'bg-white hover:bg-rose-50 text-rose-800 border-rose-200 shadow-2xs'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Simulate Paramedic QR</span>
          </button>
        </div>

        {/* Simulated Feedback Banner: NFC Kiosk Tap */}
        {simulatedAction === 'nfc' && (
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between font-bold text-sky-900 mb-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span>NFC Tap Authenticated (Hospital Kiosk)</span>
              </span>
              <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                ISO 14443 Type-A
              </span>
            </div>
            <p className="text-[11px] text-sky-800 leading-relaxed">
              Contactless token resolved: <strong>AHCS Client ID #CRD-9921</strong> authenticated. Temporary check-in session initiated at clinic reception desk. Zero sensitive medical history dumped.
            </p>
          </div>
        )}

        {/* Simulated Feedback Banner: Paramedic Break-Glass QR */}
        {simulatedAction === 'qr' && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between font-bold text-rose-900 mb-1">
              <span className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Break-Glass Trauma Vitals (Paramedic ER View)</span>
              </span>
              <span className="text-[10px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                Sub-Second Access
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1.5 text-[11px]">
              <span className="bg-white/90 p-1.5 rounded-lg border border-rose-200 shadow-2xs">
                Blood Group: <strong className="text-rose-700">O Positive (O+)</strong>
              </span>
              <span className="bg-white/90 p-1.5 rounded-lg border border-rose-200 shadow-2xs">
                Allergies: <strong className="text-amber-800 font-bold">Penicillin</strong>
              </span>
            </div>
            <p className="text-[10px] text-rose-700 mt-1 font-medium">
              ✓ Immutable audit log recorded. Emergency Next-of-Kin notified via SMS alert.
            </p>
          </div>
        )}

        {/* Card Artwork Display with Realistic Perspective */}
        {activeSide === 'front' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Front Card Artwork */}
            <div className="relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-300/80 shadow-xl bg-slate-950 transition-all transform hover:scale-[1.01]">
              <Image
                src={currentTheme.front}
                alt={`AHCS Smart Health Card Front - ${currentTheme.name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
              {/* Subtle Holographic Glass Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Front Technical Specifications */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs text-slate-700">
              <div className="font-bold text-blue-700 text-xs uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Front Credential Specifications</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentTheme.pillColor}`}>
                  {currentTheme.name}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Permanent AHCS Client ID:</strong> Minted atomically with ISO 7064 MOD 97-10 check digits after officer KYC approval.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Contactless NFC Interface:</strong> ISO/IEC 14443 Type-A tap token for hospital kiosk check-ins and admission desks.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Privacy Isolated:</strong> No sensitive medical records or diagnosis printed anywhere on the plastic substrate.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Back Card Artwork */}
            <div className="relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-300/80 shadow-xl bg-slate-950 transition-all transform hover:scale-[1.01]">
              <Image
                src={currentTheme.back}
                alt={`AHCS Smart Health Card Back - ${currentTheme.name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
              {/* Subtle Holographic Glass Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Back Technical Specifications */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs text-slate-700">
              <div className="font-bold text-rose-700 text-xs uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-700" />
                  <span>Reverse Safety & Emergency Controls</span>
                </span>
                <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                  Paramedic Ready
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Emergency Break-Glass QR:</strong> Cryptographically signed 256-bit rotating token for first-responder trauma triage.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Immutable Audit Log:</strong> Every emergency scan logs timestamp, GPS/IP, and alerts member contact nodes.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>India National Helpline 112:</strong> Direct golden-hour emergency guidance for emergency personnel.</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick CTA Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/apply"
            className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-700/25 transition-all text-center flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>Apply For Your Card</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            href="/verify"
            className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Verify Any Card</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
