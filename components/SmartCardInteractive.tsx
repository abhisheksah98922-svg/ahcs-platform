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
      pillColor: 'bg-[#F0F4F8] text-[#102A43] border-[#DFE7F0]',
      badge: 'Executive Edition',
    },
    navy: {
      front: '/cards/navy-front.jpg',
      back: '/cards/navy-back.jpg',
      name: 'Sapphire Navy',
      pillColor: 'bg-blue-50 text-[#1769AA] border-blue-200',
      badge: 'Standard Edition',
    },
    emerald: {
      front: '/cards/emerald-front.jpg',
      back: '/cards/emerald-back.jpg',
      name: 'Emerald Jade',
      pillColor: 'bg-emerald-50 text-[#0F9D8A] border-emerald-200',
      badge: 'Senior & Family',
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
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-[#DFE7F0] shadow-card overflow-hidden text-[#172B4D] transition-all">
      
      {/* 1. CLINICIAN PHOTO BANNER WITH PHYSICAL EMBLEM */}
      <div className="relative w-full h-44 sm:h-48 bg-[#102A43] overflow-hidden group">
        <Image
          src="/images/doctor-holding-card.jpg"
          alt="Clinician holding AHCS Smart Health Card"
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
          sizes="(max-width: 768px) 100vw, 550px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/50 to-transparent" />
        
        {/* Floating Top Trust Pill */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#102A43] text-[11px] font-bold shadow-sm border border-[#DFE7F0]">
          <span className="w-2 h-2 rounded-full bg-[#16835F] animate-pulse" />
          <span>CR80 Physical Smart Credential</span>
        </div>

        {/* Edition Switcher Pills on Banner */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#102A43]/90 backdrop-blur-md p-1 rounded-full border border-slate-700/80 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTheme('platinum')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              activeTheme === 'platinum'
                ? 'bg-white text-[#102A43] shadow-xs'
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
                ? 'bg-[#1769AA] text-white shadow-xs'
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
                ? 'bg-[#0F9D8A] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Emerald
          </button>
        </div>

        {/* Bottom Banner Title */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#2884CD] font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#2884CD] animate-pulse" />
            <span>Dual-Protocol (ISO 14443 NFC + Dynamic QR)</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold leading-tight mt-0.5 text-white">
            Hospital Kiosk & Paramedic Ready
          </h3>
        </div>
      </div>

      {/* 2. CARD SIDES EXPLORER & SPECIFICATIONS */}
      <div className="p-4 sm:p-5 space-y-3.5 bg-gradient-to-b from-white to-[#F5F8FC]">
        
        {/* Side Switcher Pills */}
        <div className="flex items-center justify-between gap-2 p-1 bg-[#F0F4F8] rounded-xl border border-[#DFE7F0]">
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSide === 'front'
                ? 'bg-[#102A43] text-white shadow-sm'
                : 'text-[#62748A] hover:text-[#172B4D]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Front (Identity & NFC)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSide('back')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSide === 'back'
                ? 'bg-[#102A43] text-white shadow-sm'
                : 'text-[#62748A] hover:text-[#172B4D]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Back (Emergency QR)</span>
          </button>
        </div>

        {/* Live Interactive Action Simulation Bars */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => handleSimulate('nfc')}
            className={`py-1.5 px-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
              simulatedAction === 'nfc'
                ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-sm ring-2 ring-[#2884CD]/30'
                : 'bg-white hover:bg-sky-50 text-[#1769AA] border-[#DFE7F0] shadow-2xs'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#1769AA] shrink-0" />
            <span>Simulate NFC Tap</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulate('qr')}
            className={`py-1.5 px-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
              simulatedAction === 'qr'
                ? 'bg-[#C53030] text-white border-[#C53030] shadow-sm ring-2 ring-red-300'
                : 'bg-white hover:bg-rose-50 text-[#C53030] border-[#DFE7F0] shadow-2xs'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#C53030] shrink-0" />
            <span>Simulate Emergency QR</span>
          </button>
        </div>

        {/* Simulated Feedback Banner: NFC Kiosk Tap */}
        {simulatedAction === 'nfc' && (
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between font-bold text-sky-900 mb-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1769AA] animate-ping" />
                <span>NFC Tap Authenticated (Hospital Kiosk)</span>
              </span>
              <span className="text-[9px] font-mono bg-sky-100 text-[#1769AA] px-1.5 py-0.5 rounded">
                ISO 14443
              </span>
            </div>
            <p className="text-[11px] text-sky-800 leading-relaxed">
              Contactless token resolved: <strong>AHCS Client ID #CRD-9921</strong> authenticated. Temporary check-in session initiated at clinic reception desk. Zero sensitive medical history dumped.
            </p>
          </div>
        )}

        {/* Simulated Feedback Banner: Paramedic Break-Glass QR */}
        {simulatedAction === 'qr' && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between font-bold text-rose-900 mb-0.5">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#C53030] animate-pulse" />
                <span>Break-Glass Trauma Vitals (Paramedic ER View)</span>
              </span>
              <span className="text-[9px] font-mono bg-rose-100 text-[#C53030] px-1.5 py-0.5 rounded">
                Sub-Second
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-1 text-[11px]">
              <span className="bg-white/90 p-1.5 rounded border border-rose-200">
                Blood Group: <strong className="text-[#C53030]">O Positive (O+)</strong>
              </span>
              <span className="bg-white/90 p-1.5 rounded border border-rose-200">
                Allergies: <strong className="text-[#B7791F] font-bold">Penicillin</strong>
              </span>
            </div>
            <p className="text-[10px] text-[#C53030] mt-1 font-medium">
              ✓ Immutable audit log recorded. Emergency Next-of-Kin notified via SMS alert.
            </p>
          </div>
        )}

        {/* Card Artwork Display with Realistic Perspective */}
        {activeSide === 'front' ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Front Card Artwork */}
            <div className="relative aspect-[1.586/1] w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-[#DFE7F0] shadow-md bg-slate-950 transition-all transform hover:scale-[1.01]">
              <Image
                src={currentTheme.front}
                alt={`AHCS Smart Health Card Front - ${currentTheme.name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Front Technical Specifications */}
            <div className="bg-white rounded-xl p-3 border border-[#DFE7F0] shadow-2xs space-y-2 text-xs text-[#172B4D]">
              <div className="font-bold text-[#1769AA] text-[11px] uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>Front Credential Specifications</span>
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${currentTheme.pillColor}`}>
                  {currentTheme.name}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16835F] shrink-0 mt-0.5" />
                <span><strong>Permanent Client ID:</strong> Minted atomically with ISO 7064 check digits upon approval.</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16835F] shrink-0 mt-0.5" />
                <span><strong>Contactless NFC:</strong> ISO/IEC 14443 Type-A tap for hospital admission desks.</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16835F] shrink-0 mt-0.5" />
                <span><strong>Privacy Isolated:</strong> Zero medical records printed on physical card substrate.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Back Card Artwork */}
            <div className="relative aspect-[1.586/1] w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-[#DFE7F0] shadow-md bg-slate-950 transition-all transform hover:scale-[1.01]">
              <Image
                src={currentTheme.back}
                alt={`AHCS Smart Health Card Back - ${currentTheme.name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Back Technical Specifications */}
            <div className="bg-white rounded-xl p-3 border border-[#DFE7F0] shadow-2xs space-y-2 text-xs text-[#172B4D]">
              <div className="font-bold text-[#C53030] text-[11px] uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#C53030]" />
                  <span>Reverse Safety & Emergency Controls</span>
                </span>
                <span className="text-[9px] font-mono bg-rose-50 text-[#C53030] px-1.5 py-0.5 rounded border border-rose-200">
                  Paramedic Ready
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C53030] shrink-0 mt-0.5" />
                <span><strong>Emergency Break-Glass QR:</strong> Cryptographically signed 256-bit rotating token.</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C53030] shrink-0 mt-0.5" />
                <span><strong>Immutable Audit Log:</strong> Every scan logs timestamp & alerts emergency contacts.</span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C53030] shrink-0 mt-0.5" />
                <span><strong>Helpline 112:</strong> Direct golden-hour emergency guidance for first responders.</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick CTA Actions */}
        <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
          <Link
            href="/apply"
            className="w-full sm:flex-1 py-2.5 px-3 bg-[#102A43] hover:bg-[#1769AA] text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>Create Your Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          
          <Link
            href="/verify"
            className="w-full sm:w-auto py-2.5 px-3 bg-[#F0F4F8] hover:bg-slate-200 text-[#172B4D] font-bold text-xs rounded-xl border border-[#DFE7F0] transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-[#62748A]" />
            <span>Verify Card</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
