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
  Sparkles
} from 'lucide-react';

export function SmartCardInteractive({ 
  initialTheme = 'platinum',
  showControls = true 
}: {
  initialTheme?: 'platinum' | 'navy' | 'emerald';
  showControls?: boolean;
}) {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  return (
    <div className="w-full bg-slate-900/90 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden text-white">
      
      {/* 1. REAL LIFE DOCTOR PHOTO BANNER WITH FLOATING BADGE */}
      <div className="relative w-full h-56 sm:h-64 md:h-72 bg-slate-950 overflow-hidden group">
        <Image
          src="/images/doctor-holding-card.jpg"
          alt="Doctor holding AHCS Smart Health Card"
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
          sizes="(max-width: 768px) 100vw, 550px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Floating Verified Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-sky-300 text-xs font-bold border border-sky-500/30 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ISO/IEC 7810 ID-1 Physical Credential</span>
        </div>

        {/* Bottom Banner Title */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>Dual-Interface (NFC + Dynamic QR)</span>
          </div>
          <h3 className="text-base sm:text-lg font-black leading-tight mt-1 text-white">
            Hospital Kiosk & Paramedic Ready
          </h3>
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
            Zero medical history printed on card. Audited cryptographic emergency retrieval.
          </p>
        </div>
      </div>

      {/* 2. CARD SIDES EXPLORER */}
      <div className="p-5 sm:p-6 space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
        
        {/* Side Switcher Pills */}
        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSide === 'front'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Card Back (Break-Glass QR)</span>
          </button>
        </div>

        {/* Active Side Card Graphic & Simple Explanation */}
        {activeSide === 'front' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Front Card Artwork */}
            <div className="relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 ring-1 ring-sky-500/20">
              <Image
                src="/cards/platinum-front.jpg"
                alt="AHCS Smart Health Card Front"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>

            {/* Front Specifications */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60 space-y-2.5 text-xs text-slate-300">
              <div className="font-bold text-sky-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Front Credential Specifications</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Permanent AHCS Client ID:</strong> Minted atomically with ISO 7064 MOD 97-10 check digits after officer KYC approval.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Contactless NFC Interface:</strong> ISO/IEC 14443 Type-A tap token for hospital kiosk check-ins.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Privacy Isolated:</strong> No sensitive medical records or diagnosis printed anywhere on the plastic substrate.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Back Card Artwork */}
            <div className="relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 ring-1 ring-rose-500/20">
              <Image
                src="/cards/platinum-back.jpg"
                alt="AHCS Smart Health Card Back"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>

            {/* Back Specifications */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60 space-y-2.5 text-xs text-slate-300">
              <div className="font-bold text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>Reverse Safety & Emergency Controls</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Emergency Break-Glass QR:</strong> Cryptographically signed 256-bit rotating token for first-responder trauma triage.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Immutable Audit Log:</strong> Every emergency scan logs timestamp, GPS/IP, and alerts member contact nodes.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>India National Helpline 112:</strong> Direct golden-hour emergency guidance for emergency personnel.</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick CTA Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/apply"
            className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all text-center flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5"
          >
            <span>Apply For Your Card</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            href="/verify"
            className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-600 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>Verify Any Card</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
