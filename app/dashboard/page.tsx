'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  HeartHandshake, 
  FileText, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  QrCode,
  Lock,
  UserCheck,
  RotateCcw,
  LogOut,
  Stethoscope,
  Pill,
  XCircle,
  Calendar,
  Building2,
  KeyRound,
  EyeOff
} from 'lucide-react';
import { HealthCard } from '@/components/HealthCard';

type ActiveTab = 'CARD' | 'RECORDS' | 'CONSENT';

export default function DashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('CARD');
  const [replacingCard, setReplacingCard] = useState<boolean>(false);
  const [replaceMessage, setReplaceMessage] = useState<string>('');

  // Medical Records State
  const [records, setRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState<boolean>(false);

  // Consent State
  const [consents, setConsents] = useState<any[]>([]);
  const [loadingConsents, setLoadingConsents] = useState<boolean>(false);
  const [consentMessage, setConsentMessage] = useState<string>('');

  // Authentication states
  const [loginMobile, setLoginMobile] = useState<string>('');
  const [loginOtp, setLoginOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [loginDevCode, setLoginDevCode] = useState<string>('');
  const [loginGatewayActive, setLoginGatewayActive] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [authBusy, setAuthBusy] = useState<boolean>(false);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setUserData(data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch('/api/v1/records');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const loadConsents = async () => {
    setLoadingConsents(true);
    try {
      const res = await fetch('/api/v1/consent');
      const data = await res.json();
      if (data.success) {
        setConsents(data.consents || []);
      }
    } catch (err) {
      console.error('Failed to load consents:', err);
    } finally {
      setLoadingConsents(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (userData) {
      loadRecords();
      loadConsents();
    }
  }, [userData]);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const handleCardReplacement = async (reason: string) => {
    if (!confirm(`Are you sure you want to report this card as ${reason}? Your old card and dynamic QR token will be immediately revoked.`)) {
      return;
    }

    setReplacingCard(true);
    setReplaceMessage('');
    try {
      const res = await fetch('/api/v1/cards/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to request replacement');
        setReplacingCard(false);
        return;
      }

      setReplaceMessage(`New replacement card ${data.card.cardNumber} issued! Your permanent Client ID (${data.clientId}) remains unchanged.`);
      await loadProfile();
    } catch (err) {
      alert('Network error replacing card');
    } finally {
      setReplacingCard(false);
    }
  };

  const handleConsentResponse = async (consentId: string, decision: 'GRANT' | 'REJECT', durationHours: number = 24) => {
    try {
      const res = await fetch('/api/v1/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESPOND',
          consentId,
          decision,
          durationHours,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update consent');
        return;
      }
      setConsentMessage(data.message);
      await loadConsents();
    } catch (err) {
      alert('Network error responding to consent');
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    if (!confirm('Are you sure you want to REVOKE access for this healthcare provider? They will immediately lose access to your medical history.')) {
      return;
    }

    try {
      const res = await fetch('/api/v1/consent/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to revoke consent');
        return;
      }
      setConsentMessage('Access revoked successfully in real time.');
      await loadConsents();
    } catch (err) {
      alert('Network error revoking consent');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs text-slate-500 font-medium">Loading authenticated session...</div>
        </div>
      </div>
    );
  }

  // If not logged in
  if (!userData) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-900">
        {/* Background Family Photo matching reference */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20 transition-all duration-700"
          style={{
            backgroundImage: "url('/images/hero-family.jpg?v=3')",
          }}
        />
        {/* Soft gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/60 -z-10 backdrop-blur-[2px]" />

        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 py-10">
          {/* Left Column: Information & Card Showcase */}
          <div className="lg:col-span-6 space-y-6 text-white text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              <span className="font-bold bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                AHCS
              </span>
              <span>Member Identity Dashboard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Your Health Identity, <br />
              <span className="text-sky-400">In Your Control</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Login to view your dynamic QR health card, access clinical records, track doctor visits, and manage data sharing consents.
            </p>

            <div className="pt-2 hidden sm:block">
              <HealthCard
                memberName="Verified Cardholder"
                clientId="AHCS-IN-2026-9812"
                cardNumber="CRD-7700-1122"
                validThru="12/2030"
                bloodGroup="O+"
                isVerified={true}
              />
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/40 shadow-2xl max-w-md w-full text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">Member Sign In</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered mobile number to receive a secure OTP.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-left">
                  {authError}
                </div>
              )}

              <div className="space-y-4 pt-2 text-left">
                {!otpSent ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Registered 10-Digit Mobile Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={loginMobile}
                        onChange={(e) => setLoginMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-3 rounded-r-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={authBusy || loginMobile.replace(/[^0-9]/g, '').length !== 10}
                      onClick={async () => {
                        setAuthBusy(true);
                        setAuthError('');
                        const cleanDigits = loginMobile.replace(/[^0-9]/g, '').slice(-10);
                        try {
                          const res = await fetch('/api/v1/auth/otp/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ mobileNumber: `+91${cleanDigits}` }),
                          });
                          const data = await res.json();
                          if (!res.ok) {
                            setAuthError(data.error || 'Failed to dispatch OTP');
                            return;
                          }
                          setOtpSent(true);
                          setLoginGatewayActive(Boolean(data.gatewayActive));
                          setLoginDevCode(data.devCode || '');
                        } catch (e: any) {
                          setAuthError('Network error requesting OTP');
                        } finally {
                          setAuthBusy(false);
                        }
                      }}
                      className="w-full mt-3 py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-700/25 transition-all"
                    >
                      <span>{authBusy ? 'Sending OTP...' : 'Send Verification OTP →'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loginGatewayActive ? (
                      <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Live SMS dispatched to <strong>+91 {loginMobile}</strong>. Check your phone.</span>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700">Security Verification Code:</span>
                          <span className="font-mono font-bold text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {loginDevCode || 'Generated'}
                          </span>
                        </div>
                        {loginDevCode && (
                          <button
                            type="button"
                            onClick={() => setLoginOtp(loginDevCode)}
                            className="text-[11px] text-blue-600 font-bold hover:underline block text-left"
                          >
                            Click to fill code ({loginDevCode})
                          </button>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Enter 6-Digit OTP
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setLoginOtp('');
                            setLoginDevCode('');
                          }}
                          className="text-[10px] text-blue-600 font-bold hover:underline"
                        >
                          Change number
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={authBusy || loginOtp.length < 6}
                      onClick={async () => {
                        setAuthBusy(true);
                        setAuthError('');
                        const cleanDigits = loginMobile.replace(/[^0-9]/g, '').slice(-10);
                        try {
                          const res = await fetch('/api/v1/auth/otp/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ mobileNumber: `+91${cleanDigits}`, code: loginOtp }),
                          });
                          const data = await res.json();
                          if (!res.ok) {
                            setAuthError(data.error || 'Invalid OTP code');
                            return;
                          }
                          await loadProfile();
                        } catch (e: any) {
                          setAuthError('Verification network error');
                        } finally {
                          setAuthBusy(false);
                        }
                      }}
                      className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-700/25 transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{authBusy ? 'Verifying...' : 'Verify OTP & Enter Dashboard'}</span>
                    </button>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href="/apply"
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all"
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Apply for New AHCS Health Card</span>
                  </Link>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Verified ISO/IEC 7810 ID-1 Architecture · 100% Private Health Identifier
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const memberName = userData.profile?.fullName || 'Registered Member';
  const clientId = userData.clientId?.clientId || 'AHCS-IN-PENDING';
  const cardNumber = userData.card?.cardNumber || 'CRD-NOT-MINTED';
  const cardStatus = userData.card?.status || 'NOT_ISSUED';
  const rawBlood = userData.profile?.bloodGroup || 'UNKNOWN';
  const bloodDisplay = rawBlood.replace('_', '+').replace('POS', '+').replace('NEG', '-');
  const bloodSource = userData.profile?.bloodGroupSource || 'USER_DECLARED';

  const activeConsents = consents.filter(c => c.status === 'GRANTED' && !c.revokedAt && new Date(c.expiresAt) > new Date());
  const pendingConsents = consents.filter(c => c.status === 'REQUESTED');

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header Banner in Royal Blue */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-800/40">
          {/* Subtle background image */}
          <div 
            className="absolute inset-0 bg-cover bg-right opacity-15 mix-blend-overlay -z-0 pointer-events-none"
            style={{ backgroundImage: "url('/images/hero-family.jpg?v=3')" }}
          />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest">
                Authenticated Member Dashboard
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                userData.verification?.status === 'VERIFIED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{userData.verification?.status === 'VERIFIED' ? 'VERIFIED PROFILE' : 'VERIFICATION PENDING'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {memberName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-blue-100">
              <span>Client ID: <strong className="text-white font-mono">{clientId}</strong></span>
              <span>•</span>
              <span>Mobile: <strong className="text-white">{userData.user?.mobileNumber}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong className="text-white">{bloodDisplay}</strong> ({bloodSource.replace('_', ' ')})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto">
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-blue-900/80 hover:bg-rose-900/80 text-white border border-blue-700/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('CARD')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'CARD'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Smart Card & Emergency</span>
          </button>

          <button
            onClick={() => setActiveTab('RECORDS')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'RECORDS'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Medical Records & Prescriptions</span>
            {records.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'RECORDS' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
              }`}>
                {records.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('CONSENT')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'CONSENT'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Consent & Privacy Guard</span>
            {(pendingConsents.length > 0 || activeConsents.length > 0) && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                pendingConsents.length > 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {pendingConsents.length > 0 ? `${pendingConsents.length} Pending` : `${activeConsents.length} Active`}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: SMART CARD & EMERGENCY */}
        {activeTab === 'CARD' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Interactive ID-1 Health Card */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Official Physical Smart Card</h3>
                  <p className="text-xs text-slate-500">ISO/IEC 7810 ID-1 standard physical credential.</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-200">
                  {cardStatus}
                </span>
              </div>

              <HealthCard
                memberName={memberName}
                clientId={clientId}
                cardNumber={cardNumber}
                validThru="12/2030"
                bloodGroup={bloodDisplay !== 'UNKNOWN' ? bloodDisplay : undefined}
                isVerified={userData.verification?.status === 'VERIFIED'}
              />

              <div className="w-full pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-blue-700 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Zero clinical records stored on card</span>
                </span>
                <span className="font-mono text-slate-400">ID-1: 85.60 x 53.98mm</span>
              </div>

              {/* Lost Card Workflow Trigger */}
              <div className="w-full pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  Card misplaced or stolen?
                </div>
                <button
                  onClick={() => handleCardReplacement('LOST')}
                  disabled={replacingCard}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{replacingCard ? 'Processing Replacement...' : 'Report Lost / Reissue Card'}</span>
                </button>
              </div>
              {replaceMessage && (
                <div className="w-full p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  {replaceMessage}
                </div>
              )}
            </div>

            {/* Right: Emergency Contact & Critical Data */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Configured Emergency Dataset</h3>
                  <p className="text-xs text-slate-500">Disclosed only during authorized break-glass scans.</p>
                </div>
                {userData.qrToken?.tokenRaw && (
                  <Link
                    href={`/e/${userData.qrToken.tokenRaw}`}
                    target="_blank"
                    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Test Break-Glass QR</span>
                  </Link>
                )}
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Primary Emergency Contact</div>
                  <div className="font-bold text-slate-900 text-sm">{userData.profile?.emergencyContactName || 'None configured'}</div>
                  <div className="text-blue-700 font-semibold">{userData.profile?.emergencyContactPhone || '—'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Critical Conditions / Alerts</div>
                  <div className="font-semibold text-slate-800">
                    {userData.emergencyProfile?.criticalConditions?.length > 0 
                      ? userData.emergencyProfile.criticalConditions.join(', ')
                      : 'None declared (Low Risk)'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Known Allergies</div>
                  <div className="font-semibold text-slate-800">
                    {userData.emergencyProfile?.allergies?.length > 0 
                      ? userData.emergencyProfile.allergies.join(', ')
                      : 'None recorded'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Organ Donor Directive</div>
                  <div className="font-semibold text-slate-800">
                    {userData.emergencyProfile?.organDonor ? 'YES (Registered Organ Donor)' : 'No directive recorded'}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/providers"
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-700/20"
                >
                  <span>Explore Verified Network Hospitals & Clinics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEDICAL RECORDS & PRESCRIPTIONS */}
        {activeTab === 'RECORDS' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Verified Medical History & Encounters</h3>
                  <p className="text-xs text-slate-500">Only verified healthcare providers with your active consent can author clinical records.</p>
                </div>
                <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  {records.length} Records Persisted
                </div>
              </div>

              {loadingRecords ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading verified clinical records...</div>
              ) : records.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No Medical Records Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you consult a verified AHCS network hospital or clinic, your attending physician can attach digital encounter notes and prescriptions here after your consent.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map((rec) => (
                    <div key={rec.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-blue-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`p-2 rounded-xl text-white ${
                            rec.recordType === 'PRESCRIPTION' ? 'bg-teal-600' :
                            rec.recordType === 'LAB_REPORT' ? 'bg-indigo-600' : 'bg-blue-700'
                          }`}>
                            {rec.recordType === 'PRESCRIPTION' ? <Pill className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                          </span>
                          <div>
                            <div className="text-sm font-black text-slate-900">{rec.title}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <span>Dr. {rec.authorDoctorName}</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-700">{rec.authorProviderName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{rec.recordDate}</span>
                          </span>
                        </div>
                      </div>

                      {/* Clinical Diagnosis & Notes */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100 text-xs space-y-1.5">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[10px]">Diagnosis: </span>
                          <span className="font-bold text-slate-800">{rec.clinicalDiagnosis}</span>
                        </div>
                        {rec.clinicalNotes && (
                          <div className="text-slate-600 leading-relaxed pt-1 border-t border-slate-50">
                            {rec.clinicalNotes}
                          </div>
                        )}
                        {rec.labObservations && (
                          <div className="pt-2 text-indigo-900 bg-indigo-50/50 p-2 rounded-lg font-mono text-[11px]">
                            <strong>Lab Observation:</strong> {rec.labObservations}
                          </div>
                        )}
                      </div>

                      {/* Prescribed Medications Table */}
                      {rec.medications && rec.medications.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            Prescribed Medications ({rec.medications.length})
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-200/60 text-slate-600 uppercase text-[10px] font-bold">
                                <tr>
                                  <th className="p-2.5 rounded-l-lg">Medicine</th>
                                  <th className="p-2.5">Dosage</th>
                                  <th className="p-2.5">Frequency</th>
                                  <th className="p-2.5">Duration</th>
                                  <th className="p-2.5 rounded-r-lg">Instructions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {rec.medications.map((med: any, idx: number) => (
                                  <tr key={idx} className="bg-white">
                                    <td className="p-2.5 font-bold text-slate-900">{med.medicineName}</td>
                                    <td className="p-2.5 text-slate-700">{med.dosage}</td>
                                    <td className="p-2.5 text-blue-700 font-semibold">{med.frequency}</td>
                                    <td className="p-2.5 text-slate-700">{med.duration}</td>
                                    <td className="p-2.5 text-slate-500 italic">{med.instructions || 'As directed'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CONSENT & PRIVACY GUARD */}
        {activeTab === 'CONSENT' && (
          <div className="space-y-8">
            {consentMessage && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center justify-between">
                <span>{consentMessage}</span>
                <button onClick={() => setConsentMessage('')} className="text-blue-700 hover:text-blue-900 font-bold">Dismiss</button>
              </div>
            )}

            {/* Pending Requests */}
            {pendingConsents.length > 0 && (
              <div className="bg-amber-50/70 border-2 border-amber-300 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Pending Doctor Consent Requests ({pendingConsents.length})</span>
                </div>
                <p className="text-xs text-amber-800">
                  A healthcare provider has requested temporary access to your clinical records. Review and approve or decline.
                </p>

                <div className="space-y-3">
                  {pendingConsents.map((c) => (
                    <div key={c.id} className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{c.providerName}</div>
                        <div className="text-xs text-slate-500">Doctor: <strong>Dr. {c.doctorName}</strong> • Purpose: <span className="font-semibold text-blue-700">{c.purpose.replace('_', ' ')}</span></div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">Scope: {c.scope.replace('_', ' ')}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleConsentResponse(c.id, 'GRANT', 24)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Approve (24 Hrs)
                        </button>
                        <button
                          onClick={() => handleConsentResponse(c.id, 'REJECT')}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Provider Access Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Active Healthcare Provider Permissions</h3>
                  <p className="text-xs text-slate-500">You hold full data sovereignty. Revoke any provider&apos;s access instantly with a single click.</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {activeConsents.length} Active Grants
                </span>
              </div>

              {loadingConsents ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading access authorizations...</div>
              ) : activeConsents.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">No Active Data Sharing</div>
                  <div className="text-xs text-slate-400">Zero outside providers currently have access to your clinical history.</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeConsents.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{c.providerName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                            ACTIVE ACCESS
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Attending: <strong>Dr. {c.doctorName}</strong> • Purpose: <span className="text-blue-700 font-medium">{c.purpose.replace('_', ' ')}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Expires: {new Date(c.expiresAt).toLocaleString()} • Scope: {c.scope.replace('_', ' ')}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRevokeConsent(c.id)}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-rose-600/20 shrink-0"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Revoke Access Now</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Historical Consent Log */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Access Consent Audit History</h4>
              {consents.length === 0 ? (
                <div className="text-xs text-slate-400 py-4">No consent history recorded.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-2.5 rounded-l-lg">Provider</th>
                        <th className="p-2.5">Doctor</th>
                        <th className="p-2.5">Purpose</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 rounded-r-lg">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {consents.map((c) => (
                        <tr key={c.id}>
                          <td className="p-2.5 font-bold text-slate-800">{c.providerName}</td>
                          <td className="p-2.5 text-slate-600">Dr. {c.doctorName}</td>
                          <td className="p-2.5 text-slate-600">{c.purpose.replace('_', ' ')}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.status === 'GRANTED' ? 'bg-emerald-100 text-emerald-800' :
                              c.status === 'REVOKED' ? 'bg-rose-100 text-rose-800' :
                              c.status === 'REQUESTED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-400 font-mono text-[11px]">{new Date(c.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
