import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Key, Server, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Data Security Architecture | AHCS',
  description: 'Technical and architectural details of AHCS end-to-end encryption, cryptographic token rotation, and DPDP compliance.',
};

export default function DataSecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <Lock className="w-4 h-4" />
              <span>Cryptographic Trust Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Data Security & Technical Architecture
            </h1>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Detailed technical blueprint of how patient health records, biometric tokens, and emergency credentials are encrypted and isolated within the AHCS platform.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>1. AES-256 Envelope Encryption at Rest</span>
              </h2>
              <p className="text-slate-600">
                All uploaded medical prescriptions, diagnostic PDF reports, and identity verification proofs are encrypted using AES-256 in Galois/Counter Mode (GCM). Encryption keys are managed within dedicated Hardware Security Modules (HSMs) with automated cryptographic key rotation every 90 days.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                <span>2. Transport Layer Security (TLS 1.3)</span>
              </h2>
              <p className="text-slate-600">
                All communications between client devices, partner clinic terminals, and AHCS API gateways enforce strict TLS 1.3 encryption with Perfect Forward Secrecy (PFS). Legacy SSL and weak cipher suites are permanently disabled at the edge firewall level.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                <span>3. Rotating Ephemeral Tokens for QR & NFC</span>
              </h2>
              <p className="text-slate-600">
                AHCS Smart Cards do not carry static URLs or raw patient identifiers in physical NFC tags. Each scan generates a time-bound, cryptographically signed nonce token that expires automatically, eliminating replay attacks or physical skimming hazards.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-600" />
                <span>4. Digital Personal Data Protection (DPDP) Act Compliance</span>
              </h2>
              <p className="text-slate-600">
                The platform is architected strictly around patient-directed consent as mandated by India&apos;s DPDP Act 2023. No healthcare facility or doctor can query medical records without explicit, revocable digital authorization from the citizen or legal guardian.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
