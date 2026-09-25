'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  ShieldAlert, 
  QrCode, 
  Phone, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Droplet,
  MapPin,
  Lock
} from 'lucide-react';

export default function EmergencyPreviewPage() {
  const [activeTab, setActiveTab] = useState<'CARD' | 'GATEWAY'>('CARD');

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            24x7 Break-Glass Technology
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            Emergency QR Gateway Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            See exactly what paramedics and emergency room doctors see when they scan an AHCS Health Card in a crisis.
          </p>
        </div>

        {/* Switcher Buttons */}
        <div className="flex justify-center">
          <div className="bg-slate-200/80 p-1 rounded-2xl flex gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('CARD')}
              className={`px-6 py-2.5 rounded-xl transition-all ${
                activeTab === 'CARD' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Physical Card QR Code
            </button>
            <button
              onClick={() => setActiveTab('GATEWAY')}
              className={`px-6 py-2.5 rounded-xl transition-all ${
                activeTab === 'GATEWAY' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Paramedic ER View (Live Gateway)
            </button>
          </div>
        </div>

        {/* Content Box */}
        {activeTab === 'CARD' ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto shadow-inner">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Dynamic Emergency QR</h3>
              <p className="text-xs text-slate-500 mt-1">
                Printed on the face of the AHCS Health Card. Contains a 256-bit signed cryptographic token resolving to the break-glass portal.
              </p>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl inline-block shadow-lg">
              <div className="w-48 h-48 bg-white rounded-xl p-3 flex flex-col items-center justify-center border-4 border-emerald-500">
                <QrCode className="w-36 h-36 text-slate-900" />
                <span className="text-[10px] font-mono font-bold text-slate-600 mt-1">SCAN FOR VITALS</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Works with any iPhone or Android camera app — <strong>no AHCS app installation required</strong>.
            </p>

            <button
              onClick={() => setActiveTab('GATEWAY')}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Simulate Emergency Scan by Paramedic &rarr;</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-rose-200 shadow-lg max-w-lg mx-auto overflow-hidden">
            {/* Top Red Emergency Banner */}
            <div className="bg-rose-600 text-white p-5 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 shrink-0 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest bg-rose-700 px-2 py-0.5 rounded font-bold">
                  BREAK-GLASS EMERGENCY ACCESS
                </span>
                <h3 className="text-lg font-black leading-tight mt-0.5">Critical Emergency Profile</h3>
                <p className="text-[11px] text-rose-100">Audit logged at {new Date().toLocaleTimeString()} • Unauthenticated EMT view</p>
              </div>
            </div>

            {/* Profile Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Primary Patient Vitals */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                  <span className="text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-rose-600" />
                    Blood Group
                  </span>
                  <div className="text-2xl font-black text-rose-900 mt-1">O Positive (O+)</div>
                  <span className="text-[10px] text-rose-700 font-medium">Verified by Lab Record</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Patient
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-1 truncate">Ananya Verma</div>
                  <span className="text-[10px] text-slate-500">Age: 29 • Female</span>
                </div>
              </div>

              {/* Critical Allergies */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Known Severe Allergies:
                </span>
                <div className="text-xs font-bold text-amber-950">
                  PENICILLIN, SULFA DRUGS, PEANUTS (ANAPHYLACTIC RISK)
                </div>
              </div>

              {/* Primary Emergency Contact */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Primary Emergency Contact (Family):
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Dr. Rajesh Verma (Father)</div>
                    <div className="text-slate-500 font-mono text-[11px]">+91 98800 11223</div>
                  </div>
                  <a
                    href="tel:+919880011223"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>

              {/* Privacy Disclosure Notice */}
              <div className="p-3 bg-slate-100 rounded-xl text-[10px] text-slate-500 leading-normal flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>
                  <strong>Strict Privacy Guard:</strong> Full clinical history, prescriptions, and lab diagnostic files remain protected and encrypted. Only critical vitals are revealed during break-glass events.
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
