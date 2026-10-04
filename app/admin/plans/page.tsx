import React from 'react';
import Link from 'next/link';
import { CreditCard, ArrowLeft } from 'lucide-react';

export default function AdminPlansPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Command</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Membership Plans & Benefit Rules Configuration
          </h1>
          <p className="text-xs text-slate-500">
            Configure partner concession percentages, annual membership pricing, and family sub-profile allocations.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Active Membership Tiers</h3>
            <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
              4 CONFIGURED TIERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">Basic Free Tier</div>
              <div className="text-slate-500 mt-0.5">Price: ₹0 · Permanent Digital Client ID</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">Individual Care Plan</div>
              <div className="text-slate-500 mt-0.5">Price: ₹499/yr · Physical NFC Card Included</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">Family Health Access</div>
              <div className="text-slate-500 mt-0.5">Price: ₹1,299/yr · Up to 6 Member Cards</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">Corporate Enterprise</div>
              <div className="text-slate-500 mt-0.5">Custom B2B · Worksite Health Camps & Form 32</div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
