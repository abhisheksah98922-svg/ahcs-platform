'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  ShieldCheck, 
  QrCode, 
  Lock, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Eye,
  EyeOff,
  Truck
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function DashboardCardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setUserData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCardBlock = async () => {
    if (!confirm('Are you sure you want to BLOCK this card? It will immediately stop functioning at provider terminals.')) {
      return;
    }
    setBusy(true);
    setActionMessage('');
    try {
      const res = await fetch('/api/v1/cards/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'LOST' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMessage(data.error || 'Failed to update card status');
      } else {
        setActionMessage('Card blocked successfully. A new replacement token has been generated.');
        await loadData();
      }
    } catch (err) {
      setActionMessage('Network error while processing request.');
    } finally {
      setBusy(false);
    }
  };

  const handleReplacement = async () => {
    if (!confirm('Request physical card replacement? A re-print will be dispatched to your registered address.')) {
      return;
    }
    setBusy(true);
    setActionMessage('');
    try {
      const res = await fetch('/api/v1/cards/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'DAMAGED_REPLACE' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMessage(data.error || 'Failed to request replacement');
      } else {
        setActionMessage(`Replacement requested successfully! New Card Number: ${data.card?.cardNumber || 'Generated'}.`);
        await loadData();
      }
    } catch (err) {
      setActionMessage('Network error while requesting replacement.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs text-slate-500">Loading card credentials...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full shadow-sm">
          <Lock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="font-bold text-slate-900 mb-1">Authentication Required</h2>
          <p className="text-xs text-slate-500 mb-6">Please sign in to view your Smart Health Card controls.</p>
          <Link href="/login" className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const memberName = userData.profile?.fullName || 'Verified Member';
  const clientId = userData.clientId?.clientId || 'AHCS-IN-PENDING';
  const card = userData.card;
  const isCardActive = card?.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <span className="text-xs text-slate-500 font-mono">Member ID: {clientId}</span>
        </div>

        {actionMessage && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-700 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Card Visual */}
          <div className="md:col-span-6 space-y-4">
            <div className="w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-6 shadow-xl border border-blue-400/30 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-black tracking-tight">AHCS</div>
                  <div className="text-[9px] uppercase tracking-wider text-blue-200">Smart Health Card</div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono border border-white/30 px-2 py-0.5 rounded bg-white/10">
                  <span>NFC ENABLED</span>
                </div>
              </div>

              <div className="my-2">
                <div className="text-[9px] uppercase tracking-wider text-blue-200">Cardholder</div>
                <div className="text-lg font-black text-white">{memberName}</div>
                <div className="text-xs font-mono text-blue-300 mt-0.5">{clientId}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[10px] text-blue-200">
                <div>CARD NO: {card?.cardNumber || 'PENDING'}</div>
                <div className="font-bold flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isCardActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  <span className={isCardActive ? 'text-emerald-300' : 'text-rose-300'}>
                    {card?.status || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Modal / View */}
            {showQr && (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm animate-in fade-in duration-150">
                <div className="font-bold text-slate-900 text-sm">Dynamic Emergency QR Token</div>
                <div className="p-4 bg-slate-50 border border-slate-200 inline-block rounded-2xl">
                  <QrCode className="w-36 h-36 text-slate-900 mx-auto" />
                </div>
                <div className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Token refreshes automatically. Safe for emergency medical triage. Does not contain raw medical files.
                </div>
                <Link
                  href="/emergency-preview"
                  className="text-xs text-blue-700 hover:underline font-bold block"
                >
                  Test Scan View →
                </Link>
              </div>
            )}
          </div>

          {/* Right: Card Actions & Controls */}
          <div className="md:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Card Controls & Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={() => setShowQr(!showQr)}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-blue-600 hover:bg-blue-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>{showQr ? 'Hide Emergency QR' : 'Show Emergency QR'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Instant Access</span>
                </button>

                <button
                  onClick={handleBlockCard}
                  disabled={busy || !isCardActive}
                  className="w-full py-3 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-600" />
                    <span>Block Lost or Stolen Card</span>
                  </div>
                  <span className="text-[10px] text-rose-500">Immediate Lock</span>
                </button>

                <button
                  onClick={handleReplacement}
                  disabled={busy}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-blue-600 hover:bg-blue-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-indigo-600" />
                    <span>Request Card Replacement</span>
                  </div>
                  <span className="text-[10px] text-slate-400">New Token</span>
                </button>

                <Link
                  href="/smart-card"
                  className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all flex items-center justify-between shadow-xs block"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-white" />
                    <span>Order Physical NFC Smart Card</span>
                  </div>
                  <span className="text-[10px] text-blue-200">Speedpost Delivery</span>
                </Link>
              </div>
            </div>

            {/* Privacy notice */}
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>NFC & QR Hardware Protection</span>
              </div>
              <p>
                Your physical Smart Card uses ISO/IEC 14443 Type A contactless technology. The NFC chip stores no personal medical history.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  function handleBlockCard() {
    handleCardBlock();
  }
}
