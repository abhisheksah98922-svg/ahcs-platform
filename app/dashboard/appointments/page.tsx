'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Building2, 
  Stethoscope, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Plus, 
  X 
} from 'lucide-react';

export default function DashboardAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/appointments')
      .then(res => res.json())
      .then(data => {
        if (data.appointments) {
          setAppointments(data.appointments);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Clinical Appointments & Consultations
            </h1>
            <p className="text-xs text-slate-500">
              Manage scheduled outpatient visits, diagnostic test bookings, and provider confirmations.
            </p>
          </div>

          <Link
            href="/find-care"
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">No appointments scheduled</h3>
            <p className="text-xs text-slate-500 mb-6">
              Search participating hospitals and clinics to book your consultation with member concessions.
            </p>
            <Link
              href="/find-care"
              className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold inline-block"
            >
              Find a Doctor or Clinic
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt, i) => (
              <div key={apt.id || i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                        {apt.serviceType || 'OUTPATIENT'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status || 'SCHEDULED'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{apt.doctorName || 'Consulting Physician'}</h4>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.providerName || 'Partner Medical Facility'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{new Date(apt.appointmentDate || apt.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Slot: {apt.timeSlot || 'Morning Session'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
