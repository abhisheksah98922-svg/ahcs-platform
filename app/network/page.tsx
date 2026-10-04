'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Users, 
  ArrowRight,
  Search,
  Lock
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function NetworkPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/providers?status=VERIFIED')
      .then(res => res.json())
      .then(data => {
        if (data.providers) {
          setProviders(data.providers);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const hospitalCount = providers.filter(p => p.category === 'HOSPITAL').length;
  const clinicCount = providers.filter(p => p.category === 'CLINIC').length;
  const labCount = providers.filter(p => p.category === 'LABORATORY').length;
  const pharmacyCount = providers.filter(p => p.category === 'PHARMACY').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Network Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              The AHCS Healthcare Access Network
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Every healthcare provider in our directory undergoes verification of establishment licensing, clinical council registrations, and data security adherence before being admitted.
            </p>
          </div>
        </section>

        {/* Live Network Counts */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900">{loading ? '...' : hospitalCount}</div>
              <div className="text-xs text-slate-500 font-medium">Hospitals</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900">{loading ? '...' : clinicCount}</div>
              <div className="text-xs text-slate-500 font-medium">Clinics</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900">{loading ? '...' : labCount}</div>
              <div className="text-xs text-slate-500 font-medium">Diagnostic Labs</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
                <Pill className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900">{loading ? '...' : pharmacyCount}</div>
              <div className="text-xs text-slate-500 font-medium">Pharmacies</div>
            </div>
          </div>
        </div>

        {/* Verification Standards */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              How Providers Are Verified
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-3xl leading-relaxed">
              To safeguard patient safety and preserve data trust, every prospective network provider undergoes a rigorous 4-step credentialing workflow before their facility is approved in the AHCS registry.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">1</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Entity Registration</h4>
                <p className="text-xs text-slate-600">Verification of Clinical Establishments Act license, state health registration, or municipal hospital license.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">2</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Doctor Registrations</h4>
                <p className="text-xs text-slate-600">Verification of medical practitioners&apos; National Medical Commission (NMC) or State Medical Council registrations.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">3</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">DPDP & Security Audit</h4>
                <p className="text-xs text-slate-600">Strict adherence to patient consent protocols, role-based record lookup, and cryptographic token verification.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">4</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Contractual SLA</h4>
                <p className="text-xs text-slate-600">Binding agreement on transparent billing concessions, priority consultation slots, and digital report delivery.</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Explore Participating Providers</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">
                  Locate hospitals, clinics, and diagnostic labs near your pin code using our interactive directory.
                </p>
              </div>
              <Link
                href="/find-care"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Find Care Near You</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Apply as a Healthcare Partner</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Expand your patient footprint, enable instant digital record access, and join our coordinated health access network.
                </p>
              </div>
              <Link
                href="/partner"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Submit Provider Application</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
