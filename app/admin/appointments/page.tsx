'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, Building2, Stethoscope } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminAppointmentsPage() {
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

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Command</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Network Appointments Registry
          </h1>
          <p className="text-xs text-slate-500">
            Real-time audit of outpatient appointments, doctor consultations, and diagnostic encounters.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">All Network Bookings</h3>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {appointments.length} APPOINTMENTS
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No appointments recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Doctor / Specialty</th>
                    <th className="p-3">Healthcare Facility</th>
                    <th className="p-3">Service Type</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">{a.doctorName || 'Assigned Physician'}</td>
                      <td className="p-3 text-slate-600">{a.providerName || 'Partner Facility'}</td>
                      <td className="p-3 text-slate-600">{a.serviceType}</td>
                      <td className="p-3 text-slate-600">{new Date(a.appointmentDate || a.createdAt).toLocaleDateString()} ({a.timeSlot || 'Morning'})</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          a.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {a.status}
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
