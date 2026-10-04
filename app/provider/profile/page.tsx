'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ArrowLeft, Stethoscope, MapPin, Phone, Mail } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ProviderProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <Link href="/provider" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Provider Console</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Establishment Profile & Registrations
          </h1>
          <p className="text-xs text-slate-500">
            Review state clinical establishment registration, medical council affiliations, and operating hours.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Manipal Hospital — Bangalore Central</h2>
              <div className="text-slate-500">Registration: KA-MED-2018-0914 · Category: TERTIARY_HOSPITAL</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-slate-700">
            <div><strong>Medical Council:</strong> Karnataka Medical Council / NMC</div>
            <div><strong>Status:</strong> <span className="text-emerald-700 font-bold">VERIFIED NETWORK PROVIDER</span></div>
            <div><strong>Emergency Ward:</strong> 24x7 Casualty & Trauma Unit Active</div>
            <div><strong>Outpatient Hours:</strong> Mon - Sat: 08:00 AM - 08:00 PM</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
