import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertCircle, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Important Regulatory & Distinction Notice */}
      <div className="border-b border-slate-800 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            <strong className="text-white">Regulatory Notice:</strong> AHCS (Advanced Health Care System) is an independent private healthcare identity, card verification, and health access management platform. AHCS is NOT a government agency, NOT affiliated with UIDAI (Aadhaar), NOT ABHA/NDHM, NOT Ayushman Bharat, and NOT an insurance company. The AHCS Client ID is a private platform identifier and must never be presented as official state identification.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Overview */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-slate-300" />
              <span>AHCS Platform</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Private healthcare identity verification, smart cards with rotating signed credentials, audited break-glass emergency retrieval, and consent-vaulted records.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Server-side RBAC & immutable audit trails</span>
            </div>
          </div>

          {/* Col 2: Identity & Card */}
          <div>
            <h4 className="text-white font-medium mb-3 text-xs">Healthcare Identity</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/apply" className="hover:text-white transition-colors">Apply for Client ID</Link></li>
              <li><Link href="/verify" className="hover:text-white transition-colors">Verify Card Authenticity</Link></li>
              <li><Link href="/health-card" className="hover:text-white transition-colors">Smart Health Card Specs</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">Verification Process</Link></li>
              <li><Link href="/emergency-preview" className="hover:text-white transition-colors">Emergency Break-Glass Overview</Link></li>
            </ul>
          </div>

          {/* Col 3: Portals & Access */}
          <div>
            <h4 className="text-white font-medium mb-3 text-xs">Platform Portals</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/login" className="hover:text-white transition-colors">Member Sign In</Link></li>
              <li><Link href="/officer/login" className="hover:text-white transition-colors">Verification Staff Login</Link></li>
              <li><Link href="/provider/login" className="hover:text-white transition-colors">Clinical Staff Login</Link></li>
              <li><Link href="/partner" className="hover:text-white transition-colors">Provider Enrollment</Link></li>
            </ul>
          </div>

          {/* Col 4: Governance & Legal */}
          <div>
            <h4 className="text-white font-medium mb-3 text-xs">Governance & Policy</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>support@ahcs.in</span>
              </li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Governance & DPDP</Link></li>
              <li><Link href="/medical-disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About AHCS</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AHCS (Advanced Health Care System). All rights reserved.</p>
          <p>Domain: https://ahcs.in | Designed for secure private healthcare coordination in India.</p>
        </div>
      </div>
    </footer>
  );
};
