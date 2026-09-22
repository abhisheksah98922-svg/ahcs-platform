import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertCircle, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Important Regulatory & Distinction Notice */}
      <div className="border-b border-slate-800 bg-slate-950/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">Important Regulatory Notice:</strong> AHCS (Advanced Health Care System) is an independent private healthcare identity and membership network platform. AHCS is NOT a government agency, not Aadhaar, not ABHA, not Ayushman Bharat, and not a hospital management software. The AHCS Client ID is a private platform identifier and must never be presented as official government identification.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Overview */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>AHCS</span>
            </div>
            <p className="leading-relaxed">
              Advanced Health Care System provides cryptographically verified healthcare identity cards, emergency medical access, and a federated patient-directed healthcare network.
            </p>
            <div className="flex items-center space-x-2 text-teal-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>AES-256 Encrypted & Privacy-First</span>
            </div>
          </div>

          {/* Col 2: Card & Identity Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-3">Healthcare Identity</h4>
            <ul className="space-y-2">
              <li><Link href="/apply" className="hover:text-white transition-colors">Apply for Health Card</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">Verification Process</Link></li>
              <li><Link href="/health-card" className="hover:text-white transition-colors">Card Specifications</Link></li>
              <li><Link href="/emergency-preview" className="hover:text-white transition-colors">Emergency QR System</Link></li>
              <li><Link href="/officer" className="hover:text-white transition-colors">Verification Officer Queue</Link></li>
            </ul>
          </div>

          {/* Col 3: Providers & Network */}
          <div>
            <h4 className="text-white font-semibold mb-3">Network & Providers</h4>
            <ul className="space-y-2">
              <li><Link href="/providers" className="hover:text-white transition-colors">Hospital & Clinic Directory</Link></li>
              <li><Link href="/for-clinics" className="hover:text-white transition-colors">For Clinics & Doctors</Link></li>
              <li><Link href="/for-companies" className="hover:text-white transition-colors">Corporate Health Plans</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Membership Tiers</Link></li>
            </ul>
          </div>

          {/* Col 4: Support & Security */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support & Emergency</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>Helpline: 1800-242-7000</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@ahcs.in</span>
              </li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security Architecture</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500">
          <p>© 2026 AHCS (Advanced Health Care System). All rights reserved. Built for secure, verified healthcare access.</p>
        </div>
      </div>
    </footer>
  );
};
