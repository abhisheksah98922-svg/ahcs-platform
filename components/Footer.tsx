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
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 selection:bg-blue-600 selection:text-white">
      {/* 1. REGULATORY NOTICE BANNER */}
      <div className="border-b border-slate-800/80 bg-slate-900/90 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3.5">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            <strong className="text-white font-semibold">Important Statutory Notice:</strong> AHCS (Advanced Health Care System) is an independent, private healthcare identity, card verification, and emergency access management platform. AHCS is <span className="text-amber-300 font-semibold underline underline-offset-2">NOT a government agency</span>, NOT affiliated with UIDAI (Aadhaar), NOT ABHA/NDHM, NOT Ayushman Bharat (PM-JAY), and NOT an insurance company. The AHCS Client ID is a private platform identification credential and must never be presented as official state identification.
          </p>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Platform Identity & System Guarantees */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                A
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight">AHCS</span>
                <span className="block text-[10px] text-slate-400 font-medium">Advanced Health Care System</span>
              </div>
            </div>

            <p className="leading-relaxed text-[12px] text-slate-300 max-w-sm">
              Standardized private healthcare identification, tamper-evident physical & digital smart cards, audited break-glass emergency vitals, and citizen-directed consent records vault.
            </p>

            <div className="pt-2 space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ISO/IEC 7810 ID-1 Physical Card Standard</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero medical history printed on physical card (Privacy-First)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>India DPDP Act 2023 Compliant Consent Gateway</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-400">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                SHA-256 Verified
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                AES-256 Vault
              </span>
            </div>
          </div>

          {/* Col 3: Smart Card & Verification */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Health Card</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/apply" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Apply for Client ID</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/health-card" className="hover:text-white transition-colors">
                  Smart Card Specifications
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-white transition-colors flex items-center gap-1 text-sky-400 hover:text-sky-300">
                  <span>Verify Card Online</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                </Link>
              </li>
              <li>
                <Link href="/emergency-preview" className="hover:text-white transition-colors text-rose-400 hover:text-rose-300">
                  Emergency Break-Glass QR
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Verification Lifecycle
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Card Plans & Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Clinical Network */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Network & Portals</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Citizen / Member Sign In
                </Link>
              </li>
              <li>
                <Link href="/provider/login" className="hover:text-white transition-colors">
                  Hospital & Doctor Portal
                </Link>
              </li>
              <li>
                <Link href="/officer/login" className="hover:text-white transition-colors">
                  Verification Desk Staff
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-white transition-colors">
                  Partner Hospital Onboarding
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-white transition-colors">
                  Participating Network
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Member Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Emergency Assistance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Help & Governance</h4>
            <ul className="space-y-2 text-[12px]">
              <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="block font-semibold text-rose-400">Emergency Golden Hour:</span>
                <span className="text-[10px] text-slate-400">For life-threatening trauma, call India National Helpline </span>
                <span className="font-bold text-white font-mono">112</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300 pt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="mailto:support@ahcs.in" className="hover:text-white">support@ahcs.in</a>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/medical-disclaimer" className="hover:text-white transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. BOTTOM BASELINE BAR */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AHCS (Advanced Health Care System). All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Server Time: IST (UTC+05:30)</span>
            <span>•</span>
            <span>Domain: <strong className="text-slate-300 font-mono">https://ahcs.in</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
