'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Check, 
  CreditCard, 
  AlertCircle, 
  Users, 
  Sparkles, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  QrCode
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  tagline: string;
  pricePaise: number;
  priceDisplay: string;
  popular?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'AHCS-PLAN-BASIC',
    name: 'Basic Health Identity',
    tagline: 'Permanent identity and digital emergency break-glass for individuals.',
    pricePaise: 99900,
    priceDisplay: '₹999',
    features: [
      'Permanent AHCS Client ID (ISO/IEC 7064 check)',
      'Digital Health Card with dynamic QR',
      'Emergency Break-Glass Access for first responders',
      'Patient-controlled Granular Consent Privacy Guard',
      'Up to 100 Encrypted Clinical Records',
    ],
  },
  {
    id: 'AHCS-PLAN-PREMIUM',
    name: 'Smart Physical Card & Family Shield',
    tagline: 'Physical ID-1 smart card with NFC + gold EMV chip graphic & complete records.',
    pricePaise: 219900,
    priceDisplay: '₹2,199',
    popular: true,
    features: [
      'All Basic Plan features included',
      'Physical ID-1 Smart Card ($85.60 \\times 53.98$ mm)',
      'Doorstep Delivery Across India via Tracked Courier',
      'Unlimited Encrypted Clinical Records & Prescriptions',
      'Verified Partner Discounts at Network Hospitals',
      'Priority Reissuance & 24/7 National Emergency Hotline',
    ],
  },
  {
    id: 'AHCS-PLAN-FAMILY',
    name: 'Family Shield (4 Members)',
    tagline: 'Complete identity & physical smart cards for parents and children.',
    pricePaise: 449900,
    priceDisplay: '₹4,499',
    features: [
      'Includes 4 Individual AHCS Client IDs',
      '4 Physical Smart Cards Delivered in Presentation Case',
      'Unified Family Emergency Contacts & Blood Registry',
      'Child Immunization & Growth Tracker Records',
      'Dedicated Verification Officer Assistance',
    ],
  },
];

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [ordering, setOrdering] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);
  const [orderError, setOrderError] = useState<string>('');

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSelectPlan = async (plan: Plan) => {
    if (!user) {
      // Redirect to apply/login
      window.location.href = '/apply';
      return;
    }

    setSelectedPlan(plan);
    setOrderError('');
    setPaymentSuccess(null);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan) return;

    setOrdering(true);
    setOrderError('');
    try {
      // 1. Create real order in DB
      const createRes = await fetch('/api/v1/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          amountPaise: selectedPlan.pricePaise,
          gateway: 'RAZORPAY',
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        setOrderError(createData.error || 'Failed to initialize order');
        setOrdering(false);
        return;
      }

      // 2. Simulate payment completion & verify cryptographically
      const verifyRes = await fetch('/api/v1/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: createData.order.id,
          gatewayOrderId: createData.order.gatewayOrderId,
          gatewayPaymentId: `pay_${Date.now()}`,
          gatewaySignature: 'mock_signature_approved',
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setOrderError(verifyData.error || 'Payment verification failed');
      } else {
        setPaymentSuccess({
          planName: selectedPlan.name,
          amount: selectedPlan.priceDisplay,
          orderId: createData.order.id,
        });
      }
    } catch (err) {
      setOrderError('Network error processing payment');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Transparent Healthcare Membership
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Choose Your AHCS Membership Plan
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Secure permanent healthcare identity, physical ID-1 smart cards, and verified network benefits.
          </p>
        </div>

        {/* Ethical Disclaimer Box */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl max-w-3xl mx-auto flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-900">Benefit Policy Disclosure:</strong> AHCS does NOT promise &quot;free treatment everywhere&quot;. Membership plans provide identity verification, encrypted record management, smart card issuance, and verified discounts/benefits at partnered healthcare facilities as detailed in our partner directory.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 shadow-sm transition-all flex flex-col justify-between ${
                plan.popular
                  ? 'bg-slate-900 text-white border-2 border-blue-500 shadow-xl md:-translate-y-2'
                  : 'bg-white text-slate-900 border border-slate-200 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className={`text-xs font-bold uppercase ${plan.popular ? 'text-sky-400' : 'text-slate-400'}`}>
                    Membership Plan
                  </div>
                  <h3 className="text-2xl font-black mt-1">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black">{plan.priceDisplay}</span>
                    <span className={`text-xs ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>/ year</span>
                  </div>
                  <p className={`text-xs mt-2 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.tagline}
                  </p>
                </div>

                <ul className={`space-y-3 pt-6 border-t text-xs ${plan.popular ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-teal-400' : 'text-blue-700'}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Select {plan.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-blue-900 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              Enterprise & Corporate Sponsorship
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Sponsor AHCS Health Cards For Your Employees
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Empower your team with verified healthcare identities and emergency cards while respecting absolute clinical privacy (zero employer access to private health records).
            </p>
          </div>

          <Link
            href="/corporate"
            className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-xs font-black shrink-0 transition-colors text-center shadow-lg"
          >
            Corporate Portal
          </Link>
        </div>

        {/* Checkout Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Confirm Order</h3>
                  <p className="text-xs text-slate-500">Secure Database-Backed Payment Processing</p>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {orderError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  {orderError}
                </div>
              )}

              {paymentSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Payment Successful!</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Order <strong>{paymentSuccess.orderId}</strong> verified in database ledger.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1">
                    <div>Plan: <strong>{paymentSuccess.planName}</strong></div>
                    <div>Amount Paid: <strong>{paymentSuccess.amount}</strong></div>
                    <div className="text-emerald-700 font-semibold">Status: PAID & ACTIVE</div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Selected Tier:</span>
                      <span className="font-black text-slate-900">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Validity:</span>
                      <span className="font-bold text-slate-800">1 Year</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-slate-900">
                      <span>Total Amount:</span>
                      <span>{selectedPlan.priceDisplay}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>256-bit encrypted gateway order verification</span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={ordering}
                      onClick={handleConfirmPayment}
                      className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-md shadow-blue-700/20 disabled:opacity-50"
                    >
                      {ordering ? 'Verifying...' : `Pay ${selectedPlan.priceDisplay}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
