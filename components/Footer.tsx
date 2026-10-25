import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  Phone, 
  Mail, 
  HeartHandshake, 
  ArrowUpRight, 
  CheckCircle2,
  FileText,
  Activity,
  QrCode
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#102A43] text-slate-300 text-xs border-t border-[#0B1D2F]">
      {/* 1. STATUTORY REGULATORY NOTICE BANNER */}
      <div className="border-b border-slate-800/80 bg-[#0B1D2F] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            <strong className="text-white font-semibold">Important Statutory Notice:</strong> AHCS (Advanced Health Care System) is an independent, private healthcare identity, card verification, and emergency access management platform. AHCS is <span className="text-amber-300 font-semibold underline underline-offset-2">NOT a government agency</span>, NOT affiliated with UIDAI (Aadhaar), NOT ABHA/NDHM, NOT Ayushman Bharat (PM-JAY), and NOT an insurance underwriter. The AHCS Client ID is a private platform identification credential and must never be presented as official state identification.
          </p>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1 & 2: Platform Identity & System Guarantees */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#1769AA] text-white flex items-center justify-center font-bold text-sm shadow-sm border border-white/20">
                A
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight">AHCS</span>
                <span className="block text-[10px] text-slate-400 font-medium">Advanced Health Care System</span>
              </div>
            </div>

            <p className="leading-relaxed text-[12px] text-slate-300 max-w-sm">
              Standardized private healthcare identification, tamper-evident physical & digital smart cards, audited break-glass emergency vitals, and citizen-directed medical consent vault.
            </p>

            <div className="pt-1 space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#13BBA4] shrink-0" />
                <span>ISO/IEC 7810 ID-1 Physical Card Standard</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#13BBA4] shrink-0" />
                <span>Zero medical history printed on card (Privacy-First)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#13BBA4] shrink-0" />
                <span>India DPDP Act 2023 Compliant Consent Gateway</span>
              </div>
            </div>
          </div>

          {/* Col 3: Smart Card & Verification */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Health Card</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/apply" className="hover:text-white transition-colors flex items-center gap-1 text-[#2884CD]">
                  <span>Get Started / Apply</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/health-card" className="hover:text-white transition-colors">
                  Smart Health Card
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-white transition-colors">
                  Verify Card Online
                </Link>
              </li>
              <li>
                <Link href="/emergency-preview" className="hover:text-white transition-colors text-rose-300 hover:text-white">
                  Emergency Break-Glass QR
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Network */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform & Care</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/network" className="hover:text-white transition-colors">
                  Healthcare Network
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-medical" className="hover:text-white transition-colors">
                  Mobile Medical Units
                </Link>
              </li>
              <li>
                <Link href="/services/home-care" className="hover:text-white transition-colors">
                  Home Healthcare & Nursing
                </Link>
              </li>
              <li>
                <Link href="/services/diagnostics" className="hover:text-white transition-colors">
                  Diagnostic Lab Tests
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Emergency Assistance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Governance & Support</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & DPDP
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/medical-disclaimer" className="hover:text-white transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In to Dashboard
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. NATIONAL EMERGENCY ADVISORY & COPYRIGHT */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span><strong>Emergency Advisory:</strong> In immediate, life-threatening medical emergencies, dial <strong>112</strong> immediately. AHCS is an assistive identity tool, not an emergency ambulance dispatcher.</span>
          </div>
          <div className="shrink-0 text-slate-400">
            &copy; {new Date().getFullYear()} AHCS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
