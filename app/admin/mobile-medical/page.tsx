'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, ArrowLeft, CheckCircle2, Clock, MapPin, Users, Calendar } from 'lucide-react';

export default function AdminMobileMedicalPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/services/mobile-medical')
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
            Mobile Medical Camp Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit, schedule, and assign clinical teams to worksite and community mobile health drives.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">All Registered Camp Bookings</h3>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              {requests.length} REQUESTS
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading mobile medical requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No mobile medical requests in database.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Contact Person</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Camp Date</th>
                    <th className="p-3">Expected People</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">{r.organizationName}</td>
                      <td className="p-3 text-slate-600">{r.contactPerson} ({r.phone})</td>
                      <td className="p-3 text-slate-600">{r.city}, {r.state} - {r.pinCode}</td>
                      <td className="p-3 text-slate-600">{new Date(r.preferredDate).toLocaleDateString()}</td>
                      <td className="p-3 font-mono">{r.expectedPeople}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
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
