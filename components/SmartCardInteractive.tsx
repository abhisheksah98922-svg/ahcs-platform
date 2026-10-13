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
  Download, 
  Search, 
  Zap, 
  Lock,
  RotateCw,
  PhoneCall
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
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      
      {/* 1. REAL LIFE DOCTOR PHOTO BANNER WITH FLOATING BADGE */}
      <div className="relative w-full h-56 sm:h-64 md:h-72 bg-slate-900 overflow-hidden group">
        <Image
          src="/images/doctor-holding-card.jpg"
          alt="Doctor holding AHCS Smart Health Card"
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 550px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Floating Verified Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-World Physical Smart Card</span>
        </div>

        {/* Bottom Banner Title */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
            Standard ISO/IEC 7810 ID-1
          </div>
          <h3 className="text-base sm:text-lg font-black leading-tight mt-0.5">
            Doctor Verified & Kiosk Ready
          </h3>
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
            Tap at clinic counters or scan dynamic QR for instant 112 emergency vitals.
          </p>
        </div>
      </div>

      {/* 2. CARD SIDES EXPLORER (BOHOT EASY TO UNDERSTAND: FRONT YA BACK) */}
      <div className="p-5 sm:p-6 space-y-5">
        
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
            <span>Card Front (Samne Ka Side)</span>
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
            <span>Card Back (Peeche Ka Side)</span>
          </button>
        </div>

        {/* Active Side Card Graphic & Simple Explanation */}
        {activeSide === 'front' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Front Card Artwork */}
            <div className="relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-lg bg-slate-950">
              <Image
                src="/cards/platinum-front.jpg"
                alt="AHCS Smart Health Card Front"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>

            {/* Simple Easy Highlights for Front Side */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-700">
                Front Side Par Kya Hai:
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Aapka Verified Name & Client ID:</strong> Official human audit ke baad issue kiya gaya permanent ID.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Gold Contact Chip:</strong> Hospital ke check-in kiosks aur digital reader devices ke liye.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Contactless NFC Symbol:</strong> Kisi bhi smartphone ya tablet par bas tap karke admit ho sakte hain.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Back Card Artwork */}
            <div className="relative aspect-[1.586/1] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-lg bg-slate-950">
              <Image
                src="/cards/platinum-back.jpg"
                alt="AHCS Smart Health Card Back"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            </div>

            {/* Simple Easy Highlights for Back Side */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-700">
                Back Side Par Kya Hai:
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Emergency Break-Glass QR Code:</strong> Kisi accident ya emergency me paramedic phone camera se scan karke blood group aur emergency number turant dekh sakta hai.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>Black Magnetic Stripe & Signature:</strong> Standard security validation strip and card CVV code.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>112 National Emergency Helpline:</strong> Golden hour me first responders ke liye emergency guidelines.</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick CTA Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/apply"
            className="w-full sm:flex-1 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-700/25 transition-all text-center flex items-center justify-center gap-1.5"
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
