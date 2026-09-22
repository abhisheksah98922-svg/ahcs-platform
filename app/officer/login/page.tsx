'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  BadgeHelp,
  FileCheck2,
  ChevronLeft
} from 'lucide-react';

export default function OfficerLoginPage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState<string>('+919999900001');
  const [badgeId, setBadgeId] = useState<string>('VO-892');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [devCode, setDevCode] = useState<string>('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: mobileNumber.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch 2FA OTP code');
        return;
      }

      setOtpSent(true);
      setSuccess(`Secure 2FA OTP dispatched to ${mobileNumber}`);
      if (data.devCode) {
        setDevCode(data.devCode);
        setOtpCode(data.devCode);
      }
    } catch (err: any) {
      setError('Network communication failure. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit OTP code');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/officer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: mobileNumber.trim(),
          badgeId: badgeId.trim(),
          code: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Officer authentication rejected');
        return;
      }

      setSuccess('Officer credentials verified. Redirecting to Audit Console...');
      setTimeout(() => {
        router.push('/officer');
      }, 700);
    } catch (err: any) {
      setError('Failed to verify officer credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          <span>Return to AHCS Public Portal</span>
        </Link>

        {/* Emblem & Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 p-0.5 shadow-xl shadow-blue-900/40">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 text-xs uppercase tracking-widest text-amber-400 font-mono font-bold">
            Restricted System • Official Use Only
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Verification Officer Portal
          </h2>
          <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
            Authorized portal for National Health Registry document auditors, KYC verification officers, and credentialing adjudicators.
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className="mt-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Unauthorized access attempts are monitored and logged with IP, device fingerprints, and cryptographic audit records under Section 43 of the IT Act.
          </span>
        </div>

        {/* Login Card */}
        <div className="mt-6 bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Officer Badge / Station ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    placeholder="e.g. VO-892"
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                  <FileCheck2 className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Registered Officer Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+919999900001"
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Pre-authorized officer terminal: <code className="text-amber-400">+919999900001</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Validating Registry...' : 'Request Official 2FA Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndLogin} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Enter 6-Digit Security OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-center text-xl font-mono tracking-widest text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
                </div>
                {devCode && (
                  <p className="mt-1.5 text-xs text-amber-300/90 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    Pre-filled Secure OTP: <strong>{devCode}</strong>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-3.5 px-4 rounded-2xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating Officer...' : 'Verify & Enter Audit Operations'}</span>
                <Lock className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-xs text-slate-500">Are you a Citizen or Patient? </span>
            <Link href="/dashboard" className="text-xs font-semibold text-blue-400 hover:underline">
              Citizen Portal Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
