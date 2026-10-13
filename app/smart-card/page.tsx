import React from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  ShieldCheck, 
  QrCode, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Zap,
  Activity,
  HeartPulse,
  EyeOff
} from 'lucide-react';

import { SmartCardInteractive } from '@/components/SmartCardInteractive';

export const metadata = {
  title: 'AHCS Smart Health Card | QR & NFC Healthcare Credential',
  description: 'Your physical and digital healthcare access card with contactless NFC and dynamic emergency QR. Private, encrypted, and recognized across participating network providers.',
};

export default function SmartCardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                  <CreditCard className="w-4 h-4" />
                  <span>Physical & Digital Credential</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Your AHCS Identity. <br />
                  <span className="text-blue-400">In Your Pocket.</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  A high-security, ISO-standard healthcare credential that bridges your offline physical presentation with your encrypted digital health records and emergency break-glass profile.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/apply"
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <span>Get Your Smart Health Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/verify"
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all"
                  >
                    Verify an Issued Card
                  </Link>
                </div>
              </div>

              {/* Interactive 3D Smart Card Preview (Deep Navy & Emerald Themes) */}
              <div className="lg:col-span-5 flex justify-center">
                <SmartCardInteractive initialTheme="navy" showControls={true} />
              </div>

            </div>
          </div>
        </section>

        {/* Technical Architecture & Privacy Safeguards */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Security Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Engineered for Complete Privacy</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              How the AHCS Smart Health Card eliminates medical identity theft while preserving life-saving speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <EyeOff className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Zero Medical Data inside NFC/QR</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The card does NOT store your medical files directly on the chip or QR. It only stores a cryptographically signed pointer token that validates against the secure cloud registry.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Instant Lost Card Lockout</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Lost your physical card? Deactivate it in seconds from your Member Dashboard. The physical token is immediately revoked while your digital Client ID remains valid.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Tamper-Evident Anti-Counterfeit</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every card contains an ISO 7064 checksum algorithmic validation, micro-text security printing, and an encrypted UID signature preventing unauthorized card cloning.
              </p>
            </div>
          </div>

          {/* Regulatory Boundary */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong>Mandatory Regulatory Notice:</strong> The AHCS Smart Health Card is a private membership and healthcare access card. It is <strong>NOT a government identity document</strong> (such as Aadhaar, Voter ID, or PAN) and must never be used or presented as official government identification.
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
