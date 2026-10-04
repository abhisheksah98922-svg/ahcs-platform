'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, ArrowLeft, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/providers')
      .then(res => res.json())
      .then(data => {
        if (data.providers) setProviders(data.providers);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Command</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Healthcare Providers Registry
            </h1>
            <p className="text-xs text-slate-500">
              Audit participating hospitals, clinics, diagnostic centers, and registered practitioners.
            </p>
          </div>

          <Link
            href="/officer"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Review Pending Onboardings
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">All Registered Facilities</h3>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              {providers.length} ESTABLISHMENTS
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading providers...</div>
          ) : providers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No providers found in registry.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Provider Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Registration Number</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {providers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-50 text-blue-800 border border-blue-200">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{p.registrationNumber}</td>
                      <td className="p-3 text-slate-600">{p.city}, {p.state}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
