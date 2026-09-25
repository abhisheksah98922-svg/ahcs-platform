'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft,
  FileCheck2,
  Hospital
} from 'lucide-react';

export default function ProviderLoginPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('PRV-101');
  const [doctorName, setDoctorName] = useState<string>('Dr. Rajesh Verma, MD');
  const [medicalCouncilNumber, setMedicalCouncilNumber] = useState<string>('KMC-2018-0912');
  const [mobileNumber, setMobileNumber] = useState<string>('+919880011223');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [devCode, setDevCode] = useState<string>('');

  useEffect(() => {
    fetch('/api/v1/providers?status=VERIFIED')
      .then(res => res.json())
      .then(data => {
        if (data.providers && data.providers.length > 0) {
          setProviders(data.providers);
          setSelectedProviderId(data.providers[0].id);
        }
      })
      .catch(err => console.error('Failed to load facilities:', err));
  }, []);

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
        setError(data.error || 'Failed to dispatch staff 2FA OTP');
        return;
      }

      setOtpSent(true);
      setSuccess(`Staff 2FA OTP dispatched to ${mobileNumber}`);
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
      const res = await fetch('/api/v1/auth/provider/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: selectedProviderId,
          mobileNumber: mobileNumber.trim(),
          doctorName: doctorName.trim(),
          medicalCouncilNumber: medicalCouncilNumber.trim(),
          code: otpCode.trim(),
          staffRole: 'DOCTOR',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Staff authentication rejected');
        return;
      }

      setSuccess('Staff verified with medical council credential. Redirecting...');
      setTimeout(() => {
        router.push('/provider/portal');
      }, 700);
    } catch (err: any) {
      setError('Failed to verify staff credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          <span>Return to AHCS Public Portal</span>
        </Link>

        {/* Brand & Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-blue-600 p-0.5 shadow-xl shadow-teal-900/30">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-teal-400" />
            </div>
          </div>
          <div className="mt-3 text-xs uppercase tracking-widest text-teal-400 font-mono font-bold">
            Hospital & Clinic Partner Network
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Doctor & Staff Portal Login
          </h2>
          <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
            Authorized portal for clinicians, hospital triage staff, diagnostic technicians, and healthcare administrators.
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-6 bg-slate-800/90 border border-slate-700 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6">
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
                  Affiliated Healthcare Facility
                </label>
                <div className="relative">
                  <select
                    value={selectedProviderId}
                    onChange={(e) => setSelectedProviderId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                  >
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category} - {p.city})
                      </option>
                    ))}
                  </select>
                  <Hospital className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Doctor / Attending Clinician Name
                </label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma, MD"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Medical Council Registration No. (NMC/State)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={medicalCouncilNumber}
                    onChange={(e) => setMedicalCouncilNumber(e.target.value)}
                    placeholder="e.g. KMC-2018-0912"
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                  <FileCheck2 className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Staff Registered Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+919880011223"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Validating Registry...' : 'Send Staff 2FA Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndLogin} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Enter 6-Digit Staff OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-xs text-teal-400 hover:underline"
                  >
                    Change Details
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-center text-xl font-mono tracking-widest text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
                </div>
                {devCode && (
                  <p className="mt-1.5 text-xs text-teal-300/90 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20">
                    Pre-filled Secure OTP: <strong>{devCode}</strong>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black py-3.5 px-4 rounded-2xl text-sm transition-all shadow-lg shadow-teal-400/20 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating Staff...' : 'Verify & Enter Doctor Portal'}</span>
                <Lock className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Onboarding Callout */}
          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-300">New Clinic, Hospital, or Doctor?</span>
            <Link 
              href="/provider/register" 
              className="text-teal-400 hover:text-teal-300 font-bold hover:underline flex items-center gap-1"
            >
              <span>Register Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-center text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Patient & Member Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
