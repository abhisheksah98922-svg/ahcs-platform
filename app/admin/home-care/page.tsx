'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, CheckCircle2, Clock, Phone, MapPin } from 'lucide-react';

export default function AdminHomeCarePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/services/home-care')
      .then(res => res.json())
      .then(data => {
        if (data.requests) setRequests(data.requests);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Command</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Home Healthcare & Nursing Dispatch
          </h1>
          <p className="text-xs text-slate-500">
            Review patient home care bookings, supervise caregiver allocation, and track service fulfillment.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">All Home Care Requests</h3>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              {requests.length} BOOKINGS
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading home care requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No home care requests recorded.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Service Type</th>
                    <th className="p-3">Location / City</th>
                    <th className="p-3">Contact Phone</th>
                    <th className="p-3">Preferred Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">{r.patientName}</td>
                      <td className="p-3 text-slate-700">{r.serviceType}</td>
                      <td className="p-3 text-slate-600">{r.location}, {r.city} ({r.pinCode})</td>
                      <td className="p-3 text-slate-600 font-mono">{r.contactPhone}</td>
                      <td className="p-3 text-slate-600">{new Date(r.preferredDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-indigo-100 text-indigo-800">
                          {r.status}
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

    </div>
  );
}
