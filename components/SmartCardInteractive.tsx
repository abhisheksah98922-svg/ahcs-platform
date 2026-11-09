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
  Radio,
  Eye,
  RotateCw,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  Activity,
  Lock,
} from 'lucide-react';

export function SmartCardInteractive({
  initialTheme = 'platinum',
  showControls = true,
}: {
  initialTheme?: 'platinum' | 'navy' | 'emerald';
  showControls?: boolean;
}) {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [activeTheme, setActiveTheme] = useState<'platinum' | 'navy' | 'emerald'>(initialTheme);
  const [activeFeature, setActiveFeature] = useState<'none' | 'nfc' | 'qr'>('none');

  const cardImages = {
    platinum: {
      front: '/cards/platinum-front.jpg',
      back: '/cards/platinum-back.jpg',
      name: 'Frosted Platinum',
      pillColor: 'bg-slate-100 text-[#102A43] border-slate-300',
      tag: 'Executive Issue',
    },
    navy: {
      front: '/cards/navy-front.jpg',
      back: '/cards/navy-back.jpg',
      name: 'Sapphire Navy',
      pillColor: 'bg-blue-50 text-[#1769AA] border-blue-200',
      tag: 'Standard Issue',
    },
    emerald: {
      front: '/cards/emerald-front.jpg',
      back: '/cards/emerald-back.jpg',
      name: 'Emerald Jade',
      pillColor: 'bg-emerald-50 text-[#16865C] border-emerald-200',
      tag: 'Family & Senior',
    },
  };

  const currentTheme = cardImages[activeTheme];

  const handleInspectFeature = (type: 'nfc' | 'qr') => {
    setActiveFeature((prev) => (prev === type ? 'none' : type));
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#DFE7F0] shadow-[0_10px_35px_rgba(16,42,67,0.06)] overflow-hidden text-[#172B4D] transition-all">
      {/* 1. TOP STUDIO HEADER: Finish Selector & Dual-Mode Status */}
      <div className="p-4 sm:p-5 border-b border-[#DFE7F0] bg-gradient-to-r from-slate-50 via-white to-blue-50/30 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16865C] animate-pulse" />
          <span className="text-xs font-bold text-[#102A43] tracking-tight">
            CR80 Physical Smart Health Card
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#1769AA] border border-blue-200 font-semibold">
            ISO 7810 ID-1
          </span>
        </div>

        {/* Edition / Finish Pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#DFE7F0] shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTheme('platinum')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              activeTheme === 'platinum'
                ? 'bg-[#102A43] text-white shadow-xs'
                : 'text-[#66788A] hover:text-[#102A43]'
            }`}
          >
            Platinum
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('navy')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              activeTheme === 'navy'
                ? 'bg-[#1769AA] text-white shadow-xs'
                : 'text-[#66788A] hover:text-[#102A43]'
            }`}
          >
            Navy
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('emerald')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              activeTheme === 'emerald'
                ? 'bg-[#16865C] text-white shadow-xs'
                : 'text-[#66788A] hover:text-[#102A43]'
            }`}
          >
            Emerald
          </button>
        </div>
      </div>

      {/* 2. THE CARD CANVAS: High-Resolution Realistic Presentation */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-[#F5F8FC]/50 to-white flex flex-col items-center">
        {/* Card Artwork Box with 3D elevation */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(16,42,67,0.18)] border border-[#DFE7F0] group transition-transform duration-300 hover:scale-[1.02]">
          <Image
            src={activeSide === 'front' ? currentTheme.front : currentTheme.back}
            alt={`AHCS Smart Health Card - ${activeSide === 'front' ? 'Front Identity' : 'Back Emergency QR'}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover transition-opacity duration-300"
          />

          {/* Realistic Specular Sheen Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* Holographic Security Overlay Ribbon */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-[9px] font-mono font-bold text-[#102A43] shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1769AA]" />
            <span>NFC · ACTIVE</span>
          </div>

          {/* Quick Side Toggle Floating Button */}
          <button
            type="button"
            onClick={() => setActiveSide((prev) => (prev === 'front' ? 'back' : 'front'))}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-[#102A43]/85 hover:bg-[#102A43] text-white backdrop-blur-md text-[10px] font-bold shadow-sm transition-all flex items-center gap-1.5 border border-white/20"
          >
            <RotateCw className="w-3 h-3" />
            <span>Flip to {activeSide === 'front' ? 'Back' : 'Front'}</span>
          </button>
        </div>

        {/* Side Indicator Switcher */}
        <div className="mt-5 flex items-center gap-2 p-1 bg-[#F5F8FC] rounded-2xl border border-[#DFE7F0] w-full max-w-[340px] sm:max-w-[380px]">
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSide === 'front'
                ? 'bg-white text-[#102A43] shadow-sm border border-[#DFE7F0]'
                : 'text-[#66788A] hover:text-[#102A43]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#1769AA]" />
            <span>Front (Identity)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSide('back')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSide === 'back'
                ? 'bg-white text-[#102A43] shadow-sm border border-[#DFE7F0]'
                : 'text-[#66788A] hover:text-[#102A43]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#D64545]" />
            <span>Back (Emergency QR)</span>
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE FEATURE TEST BUTTONS */}
      {showControls && (
        <div className="p-4 sm:p-5 border-t border-[#DFE7F0] bg-[#F5F8FC]/50 space-y-3">
          <div className="text-[11px] font-bold text-[#66788A] uppercase tracking-wider text-center">
            Test Genuine Card Capabilities
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleInspectFeature('nfc')}
              className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeFeature === 'nfc'
                  ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-sm ring-2 ring-[#1769AA]/20'
                  : 'bg-white hover:bg-blue-50 text-[#1769AA] border-[#DFE7F0] shadow-2xs'
              }`}
            >
              <Radio className="w-3.5 h-3.5 shrink-0" />
              <span>Contactless NFC Tap</span>
            </button>

            <button
              type="button"
              onClick={() => handleInspectFeature('qr')}
              className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeFeature === 'qr'
                  ? 'bg-[#D64545] text-white border-[#D64545] shadow-sm ring-2 ring-red-200'
                  : 'bg-white hover:bg-rose-50 text-[#D64545] border-[#DFE7F0] shadow-2xs'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              <span>Emergency QR Vitals</span>
            </button>
          </div>

          {/* Drawer: NFC Tap Result */}
          {activeFeature === 'nfc' && (
            <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 text-xs animate-in fade-in duration-200 space-y-1">
              <div className="flex items-center justify-between font-bold text-[#1769AA]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1769AA] animate-ping" />
                  <span>Kiosk Tap Authentication Resolved</span>
                </span>
                <span className="text-[10px] font-mono bg-blue-100 text-[#1769AA] px-1.5 py-0.5 rounded">
                  ISO 14443 Type-A
                </span>
              </div>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                Permanent Client ID verified instantly at hospital admission kiosk. Zero sensitive medical records or diagnosis exposed on kiosk tap.
              </p>
            </div>
          )}

          {/* Drawer: Paramedic Break-Glass QR */}
          {activeFeature === 'qr' && (
            <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 text-xs animate-in fade-in duration-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-[#D64545]">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#D64545] animate-pulse" />
                  <span>Break-Glass Emergency Vitals (Paramedic ER View)</span>
                </span>
                <span className="text-[10px] font-mono bg-rose-100 text-[#D64545] px-1.5 py-0.5 rounded">
                  Sub-1s Triage
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded-xl border border-rose-100">
                  <span className="text-[#66788A] block text-[10px]">Blood Group:</span>
                  <strong className="text-[#D64545] font-black">O Positive (O+)</strong>
                </div>
                <div className="bg-white p-2 rounded-xl border border-rose-100">
                  <span className="text-[#66788A] block text-[10px]">Critical Allergy:</span>
                  <strong className="text-[#D99A24] font-bold">Penicillin</strong>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#66788A] pt-1 border-t border-rose-200/60">
                <span>✓ Immutable audit entry recorded</span>
                <span>SMS alert sent to Family Guardian</span>
              </div>
            </div>
          )}

          {/* Quick Specifications Bullet Points */}
          <div className="pt-2 border-t border-[#DFE7F0] space-y-1.5 text-[11px] text-[#172B4D]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16865C] shrink-0" />
              <span>Multi-layer durable composite polycarbonate substrate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16865C] shrink-0" />
              <span>Zero sensitive health records printed on physical card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16865C] shrink-0" />
              <span>Free doorstep tracked courier dispatch across India</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
