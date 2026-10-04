'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  Search, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  CreditCard, 
  ArrowRight,
  Building2,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ProviderDashboardPage() {
  const providerModules = [
    {
      title: 'Clinical Encounter & Rx',
      desc: 'Lookup patient by Client ID, request consent, record diagnosis, and dispense digital prescriptions.',
      href: '/provider/portal',
      icon: Stethoscope,
      badge: 'Active Terminal'
    },
    {
      title: 'Scheduled Appointments',
      desc: 'Review outpatient visits booked by verified AHCS members at your healthcare establishment.',
      href: '/provider/appointments',
      icon: Calendar,
      badge: 'Schedule'
    },
    {
      title: 'Member Verification',
      desc: 'Validate client credentials, verify physical NFC smart card status, and check active memberships.',
      href: '/provider/members',
      icon: Search,
      badge: 'Lookup'
    },
    {
      title: 'Emergency Break-Glass',
      desc: 'Initiate emergency clinical lookup with mandatory audit justification and instant logging.',
      href: '/provider/emergency',
      icon: ShieldAlert,
      badge: 'Life-Safety'
    },
    {
      title: 'Uploaded Clinical Records',
      desc: 'Access patient records granted through active consent sessions.',
      href: '/provider/records',
      icon: FileText,
      badge: 'Encrypted Vault'
    },
    {
      title: 'Concession & Benefits Grid',
      desc: 'Inspect approved partner concessions, OPD discounts, and diagnostic fee waivers.',
      href: '/provider/benefits',
      icon: CreditCard,
      badge: 'Agreement'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-blue-950 text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-teal-800/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
              <Stethoscope className="w-4 h-4" />
              <span>Participating Healthcare Provider Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Provider Clinical & Encounter Console
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Verify members, request consent-directed medical records, and log clinical diagnoses.
            </p>
          </div>

          <Link
            href="/provider/portal"
            className="px-5 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0"
          >
            Launch Patient Terminal →
          </Link>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providerModules.map((m, idx) => {
            const IconComp = m.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-teal-400 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2">{m.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{m.desc}</p>
                </div>

                <Link
                  href={m.href}
                  className="inline-flex items-center justify-between w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-50 hover:bg-teal-600 hover:text-white text-slate-800 transition-all"
                >
                  <span>Open {m.title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
