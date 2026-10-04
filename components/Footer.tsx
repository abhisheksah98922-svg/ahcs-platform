import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertCircle, Phone, Mail, HeartHandshake } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Important Regulatory & Distinction Notice */}
      <div className="border-b border-slate-800 bg-slate-950/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            <strong className="text-white">Important Regulatory Demarcation:</strong> AHCS (Advanced Health Care System) is an independent private healthcare identity, card verification, and healthcare access network platform. AHCS is NOT a government agency, not affiliated with UIDAI (Aadhaar), not ABHA, not Ayushman Bharat, and not an insurance company. The AHCS Client ID is a private platform identifier and must never be presented as official government identification.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Platform Overview */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>AHCS</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Advanced Health Care System provides cryptographically verified health identity cards, emergency break-glass medical access, and a federated patient-directed healthcare access network across India.
            </p>
            <div className="flex items-center space-x-2 text-blue-400 font-medium text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              <span>AES-256 Encrypted & DPDP Compliant</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-semibold mb-3">Healthcare Services</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/services" className="hover:text-white transition-colors">Services Overview</Link></li>
              <li><Link href="/services/mobile-medical" className="hover:text-white transition-colors">Mobile Medical Units</Link></li>
              <li><Link href="/services/home-care" className="hover:text-white transition-colors">Home Healthcare & Nursing</Link></li>
              <li><Link href="/services/diagnostics" className="hover:text-white transition-colors">Diagnostic Labs & Tests</Link></li>
              <li><Link href="/services/pharmacy" className="hover:text-white transition-colors">Partner Pharmacy</Link></li>
              <li><Link href="/services/health-camps" className="hover:text-white transition-colors">Worksite Health Camps</Link></li>
              <li><Link href="/services/senior-care" className="hover:text-white transition-colors">Senior Citizen Care</Link></li>
              <li><Link href="/services/telemedicine" className="hover:text-white transition-colors">Telemedicine (Coming Soon)</Link></li>
            </ul>
          </div>

          {/* Col 3: Network & Providers */}
          <div>
            <h4 className="text-white font-semibold mb-3">Care Network</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/find-care" className="hover:text-white transition-colors font-semibold text-blue-400">Find Care Near You</Link></li>
              <li><Link href="/providers" className="hover:text-white transition-colors">Hospitals & Clinics</Link></li>
              <li><Link href="/network" className="hover:text-white transition-colors">Network Standards</Link></li>
              <li><Link href="/partner" className="hover:text-white transition-colors">Partner with AHCS</Link></li>
              <li><Link href="/provider/register" className="hover:text-white transition-colors">Provider Onboarding</Link></li>
              <li><Link href="/provider/login" className="hover:text-white transition-colors">Doctor Portal Login</Link></li>
              <li><Link href="/corporate" className="hover:text-white transition-colors">Corporate Health Plans</Link></li>
              <li><Link href="/plans" className="hover:text-white transition-colors">Membership Plans</Link></li>
            </ul>
          </div>

          {/* Col 4: Healthcare Identity & Verification */}
          <div>
            <h4 className="text-white font-semibold mb-3">Health Identity</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/apply" className="hover:text-white transition-colors font-semibold text-emerald-400">Apply for Client ID</Link></li>
              <li><Link href="/verify" className="hover:text-white transition-colors font-semibold text-amber-400">Verify Card Authenticity</Link></li>
              <li><Link href="/health-card" className="hover:text-white transition-colors">Smart Card Specs</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">Verification Process</Link></li>
              <li><Link href="/emergency-preview" className="hover:text-white transition-colors">Emergency Break-Glass</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Member Dashboard</Link></li>
              <li><Link href="/officer/login" className="hover:text-slate-500 transition-colors text-[10px]">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Col 5: Governance & Support */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support & Trust</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>1800-242-7000</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>support@ahcs.in</span>
              </li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support Desk</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support & FAQs</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About AHCS</Link></li>
              <li><Link href="/medical-disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</Link></li>
              <li><Link href="/privacy-center" className="hover:text-white transition-colors">Privacy Governance</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          <p>© 2026 AHCS (Advanced Health Care System Pvt Ltd). All rights reserved. Private healthcare access & assistance network.</p>
        </div>
      </div>
    </footer>
  );
};
