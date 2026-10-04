'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck2, 
  User, 
  Clock, 
  Eye,
  Lock,
  RotateCcw
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminVerificationPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [message, setMessage] = useState('');

  const loadQueue = async () => {
    try {
      const res = await fetch('/api/v1/officer/queue');
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleDecision = async (action: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION') => {
    if (!selectedTicket) return;
    setActionBusy(true);
    setMessage('');

    try {
      const res = await fetch('/api/v1/officer/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          action,
          notes: decisionNotes || `Action ${action} executed by verification officer`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to submit decision.');
      } else {
        setMessage(`Decision ${action} recorded successfully.`);
        setSelectedTicket(null);
        setDecisionNotes('');
        await loadQueue();
      }
    } catch (err) {
      setMessage('Network error recording decision.');
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Command</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Citizen ID Verification & Document Scrutiny
            </h1>
            <p className="text-xs text-slate-500">
              Audit government documents, evaluate duplicate detection scores, and approve permanent AHCS Client IDs.
            </p>
          </div>

          <Link
            href="/officer"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Open Officer Workspace
          </Link>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Queue List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Pending Verification Queue</h3>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {tickets.length} PENDING
              </span>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading queue...</div>
            ) : tickets.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No applicants pending verification scrutiny.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3 rounded-xl transition-all block ${
                      selectedTicket?.id === t.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{t.profile?.fullName || 'Applicant'}</span>
                      <span className="text-[10px] font-mono text-slate-400">{t.account?.accountNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>District: {t.profile?.district || 'Not declared'}</span>
                      <span>·</span>
                      <span className={`font-bold ${t.duplicateScore > 40 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        Dup Score: {t.duplicateScore}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Selected Ticket Review Details */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            {!selectedTicket ? (
              <div className="p-12 text-center text-xs text-slate-400">
                Select an applicant from the queue to inspect identity documents and duplicate checks.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedTicket.profile?.fullName}</h3>
                    <div className="text-xs text-slate-500">Account: {selectedTicket.account?.accountNumber}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {selectedTicket.status}
                  </span>
                </div>

                {/* Duplicate Analysis */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Algorithmic Duplicate Check Result</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>Duplicate Score: <strong className="text-slate-900">{selectedTicket.duplicateScore}%</strong></div>
                    <div>Match Result: <strong className="text-slate-900">{selectedTicket.duplicateCheckResult}</strong></div>
                  </div>
                </div>

                {/* Submitted Documents */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-900">Submitted Verification Documents</div>
                  {(!selectedTicket.documents || selectedTicket.documents.length === 0) ? (
                    <div className="text-slate-400 italic">No document attachments uploaded.</div>
                  ) : (
                    <div className="space-y-2">
                      {selectedTicket.documents.map((doc: any, i: number) => (
                        <div key={i} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-800">{doc.documentType}</div>
                            <div className="text-[11px] font-mono text-slate-500">Masked: {doc.documentNumberMasked}</div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Decision Form */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-900">Officer Audit Notes</label>
                  <textarea
                    rows={2}
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="Enter audit rationale for approval, rejection, or correction request..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 text-slate-800"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision('APPROVE')}
                      disabled={actionBusy}
                      className="w-1/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Approve & Issue ID
                    </button>
                    <button
                      onClick={() => handleDecision('REQUEST_CORRECTION')}
                      disabled={actionBusy}
                      className="w-1/3 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Request Correction
                    </button>
                    <button
                      onClick={() => handleDecision('REJECT')}
                      disabled={actionBusy}
                      className="w-1/3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
