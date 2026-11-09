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
  Lock,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Clock,
} from 'lucide-react';

export default function NetworkPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/providers?status=VERIFIED')
      .then((res) => res.json())
      .then((data) => {
        if (data.providers) {
          setProviders(data.providers);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const hospitalCount = providers.filter((p) => p.category === 'HOSPITAL').length;
  const clinicCount = providers.filter((p) => p.category === 'CLINIC').length;
  const labCount = providers.filter((p) => p.category === 'LABORATORY').length;
  const pharmacyCount = providers.filter((p) => p.category === 'PHARMACY').length;

  const categories = [
    {
      title: 'Multi-Specialty & General Hospitals',
      desc: 'Participating tertiary and secondary hospital centers accepting verified AHCS Smart Cards for emergency break-glass triage and OPD intake.',
      icon: Building2,
      count: hospitalCount,
      status: hospitalCount > 0 ? `${hospitalCount} Registered Facilities` : 'Network Enrollment Coming Soon',
      isLive: hospitalCount > 0,
    },
    {
      title: 'Outpatient Polyclinics & Family Doctors',
      desc: 'Primary care clinics where members utilize temporary consent keys for seamless consultation history handoffs.',
      icon: Stethoscope,
      count: clinicCount,
      status: clinicCount > 0 ? `${clinicCount} Registered Clinics` : 'Network Enrollment Coming Soon',
      isLive: clinicCount > 0,
    },
    {
      title: 'Accredited Pathology & Diagnostic Labs',
      desc: 'Diagnostic centers supporting direct digital PDF report vaulting under the patient’s permanent Client ID.',
      icon: FlaskConical,
      count: labCount,
      status: labCount > 0 ? `${labCount} Registered Labs` : 'Network Enrollment Coming Soon',
      isLive: labCount > 0,
    },
    {
      title: 'Authorized Pharmacies & Chemist Stores',
      desc: 'Network partner pharmacies providing verified medicine dispense and digital prescription adherence support.',
      icon: Pill,
      count: pharmacyCount,
      status: pharmacyCount > 0 ? `${pharmacyCount} Registered Pharmacies` : 'Network Enrollment Coming Soon',
      isLive: pharmacyCount > 0,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <section className="bg-[#102A43] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#0B1D2F]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1769AA]/30 text-[#36C5D8] text-xs font-semibold border border-[#2389D7]/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Healthcare Provider Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            The AHCS Healthcare Access Network
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connecting verified citizens and participating clinics, diagnostic labs, and hospitals through standardized, patient-directed health identity infrastructure.
          </p>
        </div>
      </section>

      {/* 2. STATUTORY DEMARCATION & ZERO-FABRICATION NOTICE */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1769AA] flex items-center justify-center shrink-0 border border-blue-200">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-xs text-[#66788A] leading-relaxed">
            <strong className="text-[#172B4D] font-bold block text-sm mb-0.5">
              Strict Verification & Network Honesty Guarantee
            </strong>
            AHCS never fabricates partnership counts or displays unverified medical logos. Every healthcare provider listed in our directory undergoes verification of state medical licensing, clinical establishment certification, and data privacy protocols. In regions where network facilities are undergoing onboarding, we transparently mark them as <em>Network Enrollment Coming Soon</em>.
          </div>
        </div>
      </div>

      {/* 3. FOUR HEALTHCARE VERTICALS */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Network Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              Four Core Healthcare Verticals
            </h2>
            <p className="text-xs sm:text-sm text-[#66788A] mt-2">
              Designed to create seamless clinical data handoffs without locking providers into proprietary hospital software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-[#1769AA]/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] text-[#1769AA] flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                          cat.isLive
                            ? 'bg-emerald-50 text-[#16865C] border-emerald-200'
                            : 'bg-amber-50 text-[#D99A24] border-amber-200'
                        }`}
                      >
                        {cat.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#172B4D]">
                      {cat.title}
                    </h3>

                    <p className="text-xs text-[#66788A] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#DFE7F0]/60 flex items-center justify-between text-xs font-semibold text-[#1769AA]">
                    <Link href="/find-care" className="hover:underline flex items-center gap-1">
                      <span>View Category Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. FOUR-STAGE CREDENTIALING WORKFLOW */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Compliance Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              How Healthcare Providers Are Verified
            </h3>
            <p className="text-xs sm:text-sm text-[#66788A] mt-1">
              To safeguard patient safety and preserve clinical trust, every prospective network facility undergoes a 4-step credentialing audit before directory listing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-[#F5F8FC] rounded-2xl border border-[#DFE7F0] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#102A43] text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-[#172B4D] text-sm">Entity Licensing</h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                Verification of state Clinical Establishments Act license, municipal registration, or state health department authority.
              </p>
            </div>

            <div className="p-5 bg-[#F5F8FC] rounded-2xl border border-[#DFE7F0] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#1769AA] text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-[#172B4D] text-sm">Practitioner Registration</h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                Verification of medical doctors against the National Medical Commission (NMC) or State Medical Council registry.
              </p>
            </div>

            <div className="p-5 bg-[#F5F8FC] rounded-2xl border border-[#DFE7F0] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#2389D7] text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-[#172B4D] text-sm">DPDP & Security Audit</h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                Adherence to patient consent protocols, role-based audit logging, and strict prohibition of secondary data commercialization.
              </p>
            </div>

            <div className="p-5 bg-[#F5F8FC] rounded-2xl border border-[#DFE7F0] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#16865C] text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h4 className="font-bold text-[#172B4D] text-sm">Binding Service Level SLA</h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                Agreement on transparent billing concessions, priority consultation slots, and digital report upload commitments.
              </p>
            </div>
          </div>
        </div>

        {/* 5. CALL TO ACTION FOR CITIZENS & CLINICAL PARTNERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#102A43] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-[#0B1D2F]">
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-2">Explore Healthcare Facilities</h4>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Find participating hospitals, diagnostic labs, and clinics near your postal PIN code.
              </p>
            </div>
            <Link
              href="/find-care"
              className="px-5 py-3 bg-white text-[#102A43] hover:bg-slate-100 font-bold rounded-xl text-xs transition-all inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Explore Provider Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-[#172B4D] mb-2">
                Apply as a Healthcare Partner
              </h4>
              <p className="text-xs text-[#66788A] mb-6 leading-relaxed">
                Enable instant card verification, receive digital referrals, and join India&apos;s independent healthcare identity network.
              </p>
            </div>
            <Link
              href="/partner"
              className="px-5 py-3 bg-[#102A43] hover:bg-[#1769AA] text-white font-bold rounded-xl text-xs transition-all inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Submit Provider Onboarding Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
