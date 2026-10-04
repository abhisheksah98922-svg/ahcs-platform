'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, Building2, Calendar, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminHealthCampsPage() {
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/services/mobile-medical')
      .then(res => res.json())
      .then(data => {
        if (data.requests) setCamps(data.requests);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Command</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Worksite & Community Health Camps
          </h1>
          <p className="text-xs text-slate-500">
            Monitor employer wellness drives, industrial health audits, and residential screening programs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Scheduled Preventive Camps</h3>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              {camps.length} ACTIVE DRIVES
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">Loading camps...</div>
          ) : camps.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">No health camps booked yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {camps.map(c => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.organizationName}</span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-100 text-purple-800">
                      {c.status}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Coordinator: {c.contactPerson} ({c.phone})
                  </div>
                  <div className="text-slate-600">
                    Location: {c.location}, {c.city} · Target Date: {new Date(c.preferredDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
