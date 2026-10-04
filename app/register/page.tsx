import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, CreditCard } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Register for AHCS Client ID | Start Application',
  description: 'Begin your verified healthcare enrollment for permanent AHCS Client ID and Smart Health Card.',
};

export default function RegisterLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Get Your AHCS Client ID
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Enroll in India&apos;s independent private healthcare access network. Get your verified Client ID, encrypted medical vault, and smart health card.
          </p>

          <div className="text-left space-y-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mobile OTP Phone Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Document Verification & Duplicate Check</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant Digital Card & Optional NFC Physical Card</span>
            </div>
          </div>

          <Link
            href="/apply"
            className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-700/20 block text-center"
          >
            Start Registration Application →
          </Link>

          <div className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-700 font-bold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
