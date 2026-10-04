'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, Stethoscope, Clock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ProviderAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/appointments')
      .then(res => res.json())
      .then(data => {
        if (data.appointments) setAppointments(data.appointments);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <div>
          <Link href="/provider" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Provider Console</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Consultation Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Outpatient appointments booked by verified AHCS cardholders.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Scheduled Clinic Visits</h3>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
              {appointments.length} BOOKED
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No scheduled member appointments today.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{a.doctorName || 'Consulting Doctor'}</div>
                    <div className="text-slate-500 text-[11px]">Type: {a.serviceType} · Facility: {a.providerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{new Date(a.appointmentDate || a.createdAt).toLocaleDateString()}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {a.status}
                    </span>
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
