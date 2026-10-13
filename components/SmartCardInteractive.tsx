'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  RotateCw, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Radio, 
  QrCode, 
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface SmartCardInteractiveProps {
  initialTheme?: 'navy' | 'emerald';
  showControls?: boolean;
}

export function SmartCardInteractive({ 
  initialTheme = 'navy', 
  showControls = true 
}: SmartCardInteractiveProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [theme, setTheme] = useState<'navy' | 'emerald'>(initialTheme);

  const frontSrc = theme === 'navy' ? '/cards/navy-front.jpg' : '/cards/emerald-front.jpg';
  const backSrc = theme === 'navy' ? '/cards/navy-back.jpg' : '/cards/emerald-back.jpg';

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Theme & Side Selector */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-md mb-4 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTheme('navy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                theme === 'navy'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300 border border-white" />
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
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 border border-white" />
              <span>Emerald Health</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5 border border-slate-600/50"
          >
            <RotateCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
            <span>{isFlipped ? 'Show Front' : 'Flip to Back'}</span>
          </button>
        </div>
      )}

      {/* 3D Flippable Card Stage */}
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
              src={frontSrc}
              alt="AHCS Smart Health Card Front"
              fill
              priority
              className="object-cover rounded-2xl"
              sizes="(max-width: 768px) 100vw, 450px"
            />
            {/* Glossy Refraction Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
          </div>

          {/* BACK FACE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950">
            <Image
              src={backSrc}
              alt="AHCS Smart Health Card Back"
              fill
              priority
              className="object-cover rounded-2xl"
              sizes="(max-width: 768px) 100vw, 450px"
            />
            {/* Glossy Refraction Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Card Info Hint & Features Bar */}
      <div className="w-full max-w-md mt-4 flex items-center justify-between text-[11px] text-slate-400 px-2 font-medium">
        <span className="flex items-center gap-1">
          <RotateCw className="w-3 h-3 text-blue-400" />
          Click card to flip ({isFlipped ? 'Back View' : 'Front View'})
        </span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          ISO/IEC 7810 CR80
        </span>
      </div>

      {/* Action Links */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full max-w-md">
          <Link
            href="/apply"
            className="flex-1 min-w-[160px] py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Get Your Smart Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="/downloads/ahcs_smart_card_cr80.pdf"
            download
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Sample PDF</span>
          </a>
        </div>
      )}
    </div>
  );
}
