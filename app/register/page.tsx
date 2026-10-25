import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Register for AHCS Client ID | Start Application',
  description: 'Begin your verified healthcare enrollment for permanent AHCS Client ID and Smart Health Card.',
};

export default function RegisterLandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#DFE7F0] shadow-card p-8 sm:p-10 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1769AA] flex items-center justify-center mx-auto mb-2 border border-blue-100">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-[#102A43] tracking-tight">
            Get Your AHCS Client ID
          </h1>

          <p className="text-xs sm:text-sm text-[#62748A] leading-relaxed">
            Enroll in India&apos;s independent private healthcare access network. Get your verified Client ID, encrypted medical vault, and smart health card.
          </p>

          <div className="text-left space-y-2.5 p-4 bg-[#F5F8FC] rounded-2xl border border-[#DFE7F0] text-xs text-[#172B4D]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16835F] shrink-0" />
              <span>Mobile OTP Phone Ownership Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16835F] shrink-0" />
              <span>KYC Document Verification & Duplicate Collision Check</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16835F] shrink-0" />
              <span>Instant Digital Identity & Optional Physical NFC Card</span>
            </div>
          </div>

          <Link
            href="/apply"
            className="w-full py-3.5 bg-[#102A43] hover:bg-[#1769AA] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm block text-center"
          >
            Start Registration Application →
          </Link>

          <div className="text-xs text-[#62748A]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1769AA] font-bold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
