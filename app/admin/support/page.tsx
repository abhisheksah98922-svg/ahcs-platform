'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LifeBuoy, ArrowLeft, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/support/tickets')
      .then(res => res.json())
      .then(data => {
        if (data.tickets) setTickets(data.tickets);
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
            Support Desk & Grievance Tickets
          </h1>
          <p className="text-xs text-slate-500">
            Track inquiries, solve card delivery queries, and adhere to DPDP Act grievance resolution SLAs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">All Registered Tickets</h3>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {tickets.length} TICKETS
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No support tickets recorded in database.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Ticket #</th>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-blue-700">{t.ticketNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{t.fullName} ({t.email})</td>
                      <td className="p-3 text-slate-600">{t.category}</td>
                      <td className="p-3 text-slate-700 max-w-xs truncate">{t.subject}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          t.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
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
