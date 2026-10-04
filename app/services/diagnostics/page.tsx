import React from 'react';
import Link from 'next/link';
import { 
  FlaskConical, 
  CheckCircle2, 
  ShieldCheck, 
  Home, 
  FileText, 
  ArrowRight, 
  Clock, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Diagnostic Labs & Pathology Network | AHCS',
  description: 'Verified diagnostic tests and pathology packages with digital report delivery to your AHCS Health Vault.',
};

export default function DiagnosticsPage() {
  const popularPackages = [
    {
      name: 'Essential Wellness Profile',
      testsCount: '48 Tests',
      parameters: ['Complete Hemogram (CBC)', 'Lipid Profile', 'Liver Function (LFT)', 'Kidney Function (KFT)', 'Fasting Blood Sugar'],
      turnaround: '12-24 Hours',
      sampleType: 'Fasting Blood & Urine',
      popular: true
    },
    {
      name: 'Comprehensive Diabetic & Cardiac Panel',
      testsCount: '62 Tests',
      parameters: ['HbA1c & Average Blood Glucose', 'High-Sensitivity CRP (hs-CRP)', 'Lipid Profile Advanced', 'Serum Creatinine & eGFR', 'Urine Microalbumin'],
      turnaround: '24 Hours',
      sampleType: 'Fasting Blood & Urine',
      popular: false
    },
    {
      name: 'Active Vitality & Micronutrient Panel',
      testsCount: '24 Tests',
      parameters: ['Vitamin D Total (25-OH)', 'Vitamin B12 (Cyanocobalamin)', 'Serum Ferritin & Iron Studies', 'Thyroid Profile (T3, T4, TSH)', 'Calcium Total'],
      turnaround: '24 Hours',
      sampleType: 'Fasting Blood',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <FlaskConical className="w-4 h-4" />
              <span>NABL Partner Lab Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Diagnostic Testing & Automated Digital Lab Records
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Book routine, specialized, and preventive laboratory tests through verified partner pathology centers. Digital PDF reports are delivered straight into your AHCS Health Vault.
            </p>
          </div>
        </section>

        {/* Benefits bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-teal-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Accredited Laboratories</h4>
                <p className="text-[11px] text-slate-500">NABL & CAP certified partner centers</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <Home className="w-8 h-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Doorstep Phlebotomy</h4>
                <p className="text-[11px] text-slate-500">Trained technicians for home sample pickup</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Instant Vault Storage</h4>
                <p className="text-[11px] text-slate-500">Historical trend charts & encrypted reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Popular Preventive Health Packages</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Transparent network pricing with member concessions. Reports are verified by licensed pathologists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {popularPackages.map((pkg, i) => (
              <div 
                key={i}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  pkg.popular ? 'border-teal-400 ring-2 ring-teal-500/20 shadow-md' : 'border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {pkg.testsCount}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.turnaround}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Sample: {pkg.sampleType}</p>

                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                    <div className="text-xs font-semibold text-slate-700">Key Parameters:</div>
                    {pkg.parameters.map((param, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{param}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/services/home-care"
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-800 transition-all text-center"
                >
                  Book Home Collection
                </Link>
              </div>
            ))}
          </div>

          {/* Partner Walk-in search */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Prefer a Walk-in Diagnostic Center?</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Locate participating pathology labs and imaging radiology centers near your location with the AHCS Provider Directory.
              </p>
            </div>
            <Link
              href="/providers?category=LABORATORY"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shrink-0"
            >
              Find Partner Labs Near You
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
