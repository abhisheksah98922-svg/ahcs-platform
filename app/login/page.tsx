'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Phone, Lock, ArrowRight, Building2, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: mobileNumber.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to dispatch verification code');
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      setError('Network communication failure. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: mobileNumber.trim(),
          code: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid or expired OTP code');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Verification network failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#DFE7F0] shadow-card p-7 sm:p-9 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1769AA] flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#102A43] tracking-tight">
              Sign In to AHCS
            </h1>
            <p className="text-xs text-[#62748A]">
              Access your digital health card, encrypted records, and family health profile.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-[#C53030] text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#C53030] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-2.5 text-xs font-bold text-[#62748A]">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-[#DFE7F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#1769AA] font-mono text-[#172B4D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || mobileNumber.length < 10}
                className="w-full py-3 bg-[#102A43] hover:bg-[#1769AA] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Dispatching OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#172B4D]">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="text-[11px] text-[#1769AA] hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFE7F0] text-center tracking-widest text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1769AA] text-[#102A43]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 bg-[#102A43] hover:bg-[#1769AA] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? 'Validating Token...' : 'Verify & Enter Dashboard'}
              </button>
            </form>
          )}

          {/* Role Links */}
          <div className="pt-4 border-t border-[#DFE7F0] space-y-2 text-center text-xs">
            <div className="text-[#62748A]">Are you a healthcare provider or clinician?</div>
            <Link
              href="/provider/login"
              className="text-[#1769AA] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Doctor & Clinic Portal Login</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <div className="pt-2 text-[#62748A] text-[11px]">
              Don&apos;t have an AHCS account yet?{' '}
              <Link href="/apply" className="text-[#1769AA] font-semibold hover:underline">
                Create Account (Get Started)
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
