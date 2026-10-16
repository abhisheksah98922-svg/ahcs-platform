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
  Fingerprint
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

  const cardImages = {
    platinum: {
      front: '/cards/platinum-front.jpg',
      back: '/cards/platinum-back.jpg',
      name: 'Frosted Platinum',
      accentColor: 'text-slate-900 border-slate-300 bg-slate-100',
    },
    navy: {
      front: '/cards/navy-front.jpg',
      back: '/cards/navy-back.jpg',
      name: 'Sapphire Navy',
      accentColor: 'text-blue-900 border-blue-300 bg-blue-50',
    },
    emerald: {
      front: '/cards/emerald-front.jpg',
      back: '/cards/emerald-back.jpg',
      name: 'Emerald Jade',
      accentColor: 'text-emerald-900 border-emerald-300 bg-emerald-50',
    },
  };

  const currentTheme = cardImages[activeTheme];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-blue-950/10 overflow-hidden text-slate-900 transition-all">
      
      {/* 1. TOP DOCTOR CLINIC BANNER */}
      <div className="relative w-full h-52 sm:h-60 md:h-64 bg-slate-900 overflow-hidden group">
        <Image
          src="/images/doctor-holding-card.jpg"
          alt="Clinician holding AHCS Smart Health Card"
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
          sizes="(max-width: 768px) 100vw, 550px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
        
        {/* Floating Top Trust Pill */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold shadow-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Physical CR80 Smart Credential</span>
        </div>

        {/* Edition Switcher Pills on Banner */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-full border border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTheme('platinum')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              activeTheme === 'platinum'
                ? 'bg-white text-slate-900 shadow-xs'
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
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>Dual-Protocol (ISO 14443 NFC + Dynamic QR)</span>
          </div>
          <h3 className="text-base sm:text-lg font-black leading-tight mt-0.5 text-white">
            Hospital Kiosk & Paramedic Ready
          </h3>
          <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
            Zero medical history printed on card. Audited cryptographic emergency retrieval.
          </p>
        </div>
      </div>

      {/* 2. CARD SIDES EXPLORER & SPECIFICATIONS */}
      <div className="p-5 sm:p-6 space-y-5 bg-gradient-to-b from-white to-slate-50">
        
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

        {/* Card Artwork Display */}
        {activeSide === 'front' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Front Card Artwork with subtle realistic shadow */}
            <div className="relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-xl bg-slate-950 transition-all transform hover:scale-[1.01]">
              <Image
                src={currentTheme.front}
                alt={`AHCS Smart Health Card Front - ${currentTheme.name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>

            {/* Front Technical Specifications */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs text-slate-700">
              <div className="font-bold text-blue-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Front Credential Specifications</span>
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
            {/* Back Card Artwork with subtle realistic shadow */}
            <div className="relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-xl bg-slate-950 transition-all transform hover:scale-[1.01]">
              <Image
                src={currentTheme.back}
                alt={`AHCS Smart Health Card Back - ${currentTheme.name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>

            {/* Back Technical Specifications */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs text-slate-700">
              <div className="font-bold text-rose-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-700" />
                <span>Reverse Safety & Emergency Controls</span>
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
