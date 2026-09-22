'use client';

import React, { useState } from 'react';
import { Wifi, Phone, ExternalLink, AlertTriangle } from 'lucide-react';

export type CardTheme = 'obsidian' | 'cobalt' | 'emerald';

export interface HealthCardProps {
  memberName?: string;
  clientId?: string;
  cardNumber?: string;
  validThru?: string;
  bloodGroup?: string;
  qrCodeDataUrl?: string;
  isVerified?: boolean;
  theme?: CardTheme;
  showThemeToggle?: boolean;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  memberName = 'Your Name Here',
  clientId = 'AHCS-IN-XXXX-XXXX',
  cardNumber = 'CRD-XXXX-XXXX',
  validThru = 'set at signup',
  bloodGroup,
  qrCodeDataUrl,
  isVerified = true,
  theme: initialTheme = 'obsidian',
  showThemeToggle = true,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<CardTheme>(initialTheme);

  // Theme Gradients & Accents
  const themeStyles = {
    obsidian: {
      gradient: isFlipped
        ? 'linear-gradient(135deg, #030712 0%, #111827 50%, #1f2937 100%)'
        : 'linear-gradient(135deg, #090d16 0%, #131d31 45%, #1e293b 100%)',
      shadow: '0 20px 50px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
      subtext: 'text-slate-300',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      tag: 'Obsidian Titanium',
    },
    cobalt: {
      gradient: isFlipped
        ? 'linear-gradient(135deg, #0a2540 0%, #0d3b66 50%, #1565c0 100%)'
        : 'linear-gradient(135deg, #1565c0 0%, #1976d2 55%, #1e88e5 100%)',
      shadow: '0 20px 50px -15px rgba(13, 71, 161, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
      subtext: 'text-blue-100',
      badge: 'bg-blue-400/20 text-blue-200 border-blue-300/30',
      tag: 'Royal Cobalt',
    },
    emerald: {
      gradient: isFlipped
        ? 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)'
        : 'linear-gradient(135deg, #064e3b 0%, #047857 55%, #059669 100%)',
      shadow: '0 20px 50px -15px rgba(4, 120, 87, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
      subtext: 'text-emerald-100',
      badge: 'bg-emerald-400/20 text-emerald-200 border-emerald-300/30',
      tag: 'Emerald Elite',
    },
  };

  const activeStyle = themeStyles[currentTheme];

  return (
    <div className="relative inline-block select-none animate-card-float">
      {/* Translucent circular frosted disc glow behind card */}
      <div className="absolute top-1/2 left-1/2 w-[340px] sm:w-[410px] h-[340px] sm:h-[410px] bg-white/40 backdrop-blur-md rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 shadow-2xl border border-white/30" />

      {/* Card Container conforming to ISO/IEC 7810 ID-1 standard aspect ratio (~1.586) */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer relative w-[295px] sm:w-[365px] md:w-[400px] h-[186px] sm:h-[230px] md:h-[252px] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-500 hover:scale-[1.02] text-white flex flex-col justify-between overflow-hidden"
        style={{
          background: activeStyle.gradient,
          boxShadow: activeStyle.shadow,
        }}
      >
        {!isFlipped ? (
          /* FRONT OF THE CARD (Matches user screenshot) */
          <>
            {/* Top Bar: Brand + NFC Wave */}
            <div className="flex items-center justify-between">
              {/* Logo + Brand */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    +
                  </div>
                </div>
                <div>
                  <div className="text-base font-black tracking-wide text-white leading-tight">
                    AHCS
                  </div>
                  <div className="text-[10px] text-blue-100 tracking-tight font-medium opacity-90">
                    Advanced Health Care System
                  </div>
                </div>
              </div>

              {/* Gold/Yellow NFC Wave Symbol */}
              <div className="flex items-center space-x-0.5 text-amber-300 pr-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current rotate-90">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-2.48-.48-4.45-2.45-4.93-4.93h2.02c.41 1.38 1.53 2.5 2.91 2.91v2.02zm0-4.07c-.96-.38-1.7-1.12-2.08-2.08h2.08v2.08zm4.93 4.07c-1.38-.41-2.5-1.53-2.91-2.91h2.02c.48 2.48 2.45 4.45 4.93 4.93v-2.02z" />
                </svg>
              </div>
            </div>

            {/* Middle Section: Gold EMV Chip & Right-side QR */}
            <div className="flex items-center justify-between my-auto pt-0.5">
              {/* Left Column: Chip + Cardholder Details */}
              <div className="space-y-1.5 sm:space-y-2">
                {/* Gold EMV Chip Graphic */}
                <div className="w-9 h-6 sm:w-10 sm:h-7 rounded-sm bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 p-0.5 shadow-inner border border-amber-500/40 flex flex-col justify-between">
                  <div className="w-full h-0.5 border-b border-amber-600/30" />
                  <div className="w-full h-0.5 border-b border-amber-600/30" />
                </div>

                {/* Cardholder Name */}
                <div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-white tracking-wide drop-shadow-sm leading-tight">
                    {memberName}
                  </div>
                  <div className={`font-mono text-[10px] sm:text-xs font-bold ${activeStyle.subtext} tracking-wider mt-0.5`}>
                    CLIENT ID: {clientId}
                  </div>
                  <div className={`text-[9px] sm:text-[10px] ${activeStyle.subtext} opacity-90 font-medium`}>
                    {bloodGroup ? `Blood group ${bloodGroup} · ` : 'Blood group · '} 
                    Valid thru — {validThru}
                  </div>
                </div>
              </div>

              {/* Right Column: Square QR Code + "Scan QR — verified" */}
              <div className="flex flex-col items-center shrink-0 pl-2">
                <div className="bg-white p-1 rounded-lg sm:rounded-xl shadow-lg">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="QR Code" className="w-13 h-13 sm:w-16 sm:h-16" />
                  ) : (
                    /* High-fidelity Vector QR SVG */
                    <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-15 sm:h-15 fill-slate-900">
                      <rect x="10" y="10" width="30" height="30" rx="3" fill="black" />
                      <rect x="16" y="16" width="18" height="18" fill="white" />
                      <rect x="20" y="20" width="10" height="10" fill="black" />

                      <rect x="60" y="10" width="30" height="30" rx="3" fill="black" />
                      <rect x="66" y="16" width="18" height="18" fill="white" />
                      <rect x="70" y="20" width="10" height="10" fill="black" />

                      <rect x="10" y="60" width="30" height="30" rx="3" fill="black" />
                      <rect x="16" y="66" width="18" height="18" fill="white" />
                      <rect x="20" y="70" width="10" height="10" fill="black" />

                      <rect x="48" y="20" width="5" height="15" fill="black" />
                      <rect x="48" y="45" width="12" height="12" fill="black" />
                      <rect x="65" y="45" width="10" height="6" fill="black" />
                      <rect x="65" y="65" width="22" height="22" fill="black" />
                      <rect x="70" y="70" width="12" height="12" fill="white" />
                      <rect x="48" y="75" width="8" height="12" fill="black" />
                    </svg>
                  )}
                </div>
                <span className={`text-[8px] sm:text-[9px] ${activeStyle.subtext} font-semibold tracking-tight mt-1 opacity-90`}>
                  Scan QR — verified
                </span>
              </div>
            </div>

            {/* Bottom Bar: Red Emergency Badge */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl shadow-md border border-red-400/40">
                <div className="w-3.5 h-3.5 rounded bg-white flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-black text-[10px] leading-none">+</span>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-white tracking-wide">
                  In emergency <span className="underline decoration-white/60">Call 112 · National</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* BACK OF THE CARD */
          <div className="h-full flex flex-col justify-between text-white">
            {/* Magnetic Stripe */}
            <div className="h-6 sm:h-7 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-slate-950 border-b border-white/20 mb-1" />

            <div className="space-y-2">
              <div className="bg-white/10 p-2 sm:p-2.5 rounded-lg border border-white/20 space-y-0.5">
                <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Break-Glass Emergency Protocol</span>
                </div>
                <p className="text-[9px] text-slate-200 leading-tight">
                  First responders: scan the front QR or tap NFC for critical blood group, emergency contacts, and vital medical alerts. No clinical records stored on card.
                </p>
              </div>

              <div className="text-[9px] text-slate-300 space-y-0.5 bg-black/20 p-2 rounded-lg">
                <div className="flex justify-between">
                  <span>Emergency Helpline:</span>
                  <strong className="text-white font-mono">1800-242-7000 / 112</strong>
                </div>
                <div className="flex justify-between">
                  <span>Web Verification:</span>
                  <strong className="text-cyan-300 font-mono">https://ahcs.in/verify</strong>
                </div>
              </div>
            </div>

            <div className="text-[7.5px] text-slate-300 text-center border-t border-white/10 pt-1 leading-tight">
              Property of AHCS. Independent private healthcare identifier · Not government identification.
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls: Flip Hint & Theme Switcher */}
      <div className="flex flex-col items-center gap-2 mt-3">
        <div className="text-center text-[11px] text-slate-500 font-medium">
          Click card to flip ({isFlipped ? 'Back' : 'Front'})
        </div>

        {showThemeToggle && (
          <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-sm text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setCurrentTheme('obsidian')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currentTheme === 'obsidian'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Obsidian
            </button>
            <button
              type="button"
              onClick={() => setCurrentTheme('cobalt')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currentTheme === 'cobalt'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cobalt
            </button>
            <button
              type="button"
              onClick={() => setCurrentTheme('emerald')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currentTheme === 'emerald'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Emerald
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
