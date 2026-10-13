'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  RotateCw, 
  CreditCard, 
  ShieldCheck, 
  Download, 
  QrCode, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface SmartCardInteractiveProps {
  initialTheme?: 'platinum' | 'navy' | 'emerald';
  initialDisplayMode?: 'side-by-side' | 'flip';
  showControls?: boolean;
}

export function SmartCardInteractive({ 
  initialTheme = 'platinum',
  initialDisplayMode = 'side-by-side',
  showControls = true 
}: SmartCardInteractiveProps) {
  const [theme, setTheme] = useState<'platinum' | 'navy' | 'emerald'>(initialTheme);
  const [displayMode, setDisplayMode] = useState<'side-by-side' | 'flip'>(initialDisplayMode);
  const [isFlipped, setIsFlipped] = useState(false);

  const cardAssets = {
    platinum: {
      front: '/cards/platinum-front.jpg',
      back: '/cards/platinum-back.jpg',
      label: 'Frosted Platinum'
    },
    navy: {
      front: '/cards/navy-front.jpg',
      back: '/cards/navy-back.jpg',
      label: 'Deep Navy Blue'
    },
    emerald: {
      front: '/cards/emerald-front.jpg',
      back: '/cards/emerald-back.jpg',
      label: 'Emerald Health'
    }
  };

  const currentFront = cardAssets[theme].front;
  const currentBack = cardAssets[theme].back;

  return (
    <div className="w-full flex flex-col items-center select-none">
      
      {/* Top Theme & Display Mode Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-xl mb-5 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 shadow-xl">
          {/* Theme Selector */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTheme('platinum')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                theme === 'platinum'
                  ? 'bg-slate-200 text-slate-900 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-600" />
              <span>Platinum Silver</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('navy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                theme === 'navy'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-white" />
              <span>Deep Navy</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('emerald')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                theme === 'emerald'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
              <span>Emerald</span>
            </button>
          </div>

          {/* View Mode Toggle (Side-by-Side vs 3D Flip) */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setDisplayMode('side-by-side')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                displayMode === 'side-by-side'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('flip')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                displayMode === 'flip'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <RotateCw className="w-3 h-3" />
              <span>3D Flip</span>
            </button>
          </div>
        </div>
      )}

      {/* DISPLAY MODE 1: SIDE-BY-SIDE (FRONT & BACK SIMULTANEOUSLY) */}
      {displayMode === 'side-by-side' ? (
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          
          {/* Card 1: Front Face */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="relative aspect-[1.586/1] w-full rounded-2xl overflow-hidden border border-slate-300/80 shadow-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-blue-900/20 bg-slate-950">
              <Image
                src={currentFront}
                alt="AHCS Smart Health Card Front"
                fill
                priority
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
            </div>
            <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1 text-slate-700">
                <CreditCard className="w-3 h-3 text-blue-600" />
                Front: EMV Chip & NFC
              </span>
              <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                CR80 ID-1
              </span>
            </div>
          </div>

          {/* Card 2: Back Face */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="relative aspect-[1.586/1] w-full rounded-2xl overflow-hidden border border-slate-300/80 shadow-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-blue-900/20 bg-slate-950">
              <Image
                src={currentBack}
                alt="AHCS Smart Health Card Back"
                fill
                priority
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
            </div>
            <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1 text-slate-700">
                <QrCode className="w-3 h-3 text-red-600" />
                Back: Emergency Break-Glass QR
              </span>
              <span className="text-blue-700 font-mono text-[10px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                HiCo Stripe
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* DISPLAY MODE 2: INTERACTIVE 3D FLIP */
        <div 
          className="w-full max-w-md cursor-pointer perspective-1000 group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className={`relative aspect-[1.586/1] w-full rounded-2xl transition-transform duration-700 transform-style-3d shadow-2xl ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950">
              <Image
                src={currentFront}
                alt="AHCS Smart Health Card Front"
                fill
                priority
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
            </div>

            {/* BACK FACE */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950">
              <Image
                src={currentBack}
                alt="AHCS Smart Health Card Back"
                fill
                priority
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
            </div>
          </div>

          <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2 font-medium">
            <span className="flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-blue-400" />
              Click to flip ({isFlipped ? 'Back' : 'Front'})
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              ISO/IEC 7810 Standard
            </span>
          </div>
        </div>
      )}

      {/* Action Links */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full max-w-xl">
          <Link
            href="/apply"
            className="flex-1 min-w-[170px] py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Get Your Smart Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="/downloads/ahcs_smart_card_cr80.pdf"
            download
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download CR80 PDF</span>
          </a>
          <Link
            href="/verify"
            className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Verify Card</span>
          </Link>
        </div>
      )}

    </div>
  );
}
