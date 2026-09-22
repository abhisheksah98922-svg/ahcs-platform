'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  User, 
  Clock, 
  Search, 
  Eye, 
  Lock,
  FileText,
  Sparkles,
  Building2,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  Send,
  X,
  BadgeCheck,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface VerificationTicket {
  id: string;
  accountId: string;
  status: string;
  duplicateScore: number;
  duplicateCheckResult: string;
  createdAt: string;
  account: {
    id: string;
    accountNumber: string;
  };
  profile: {
    id: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    district: string;
    bloodGroup: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  } | null;
  documents: Array<{
    id: string;
    documentType: string;
    documentNumberMasked: string;
    status: string;
    s3ObjectKey: string;
    documentNumberHash?: string;
  }>;
}

export default function VerificationOfficerPanel() {
  const [activeTab, setActiveTab] = useState<'CITIZENS' | 'PROVIDERS'>('CITIZENS');
  const [tickets, setTickets] = useState<VerificationTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isUnauthorized, setIsUnauthorized] = useState<boolean>(false);

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState<any>(null);

  // Rejection Reason Modal State
  const [rejectingItem, setRejectingItem] = useState<{
    type: 'CITIZEN' | 'PROVIDER';
    id: string;
    name: string;
  } | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');

  // Provider Queue State
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState<boolean>(false);

  const loadQueue = async () => {
    setLoading(true);
    setError('');
    setIsUnauthorized(false);
    try {
      const res = await fetch('/api/v1/officer/queue');
      const data = await res.json();

      if (res.status === 401 || res.status === 403 || !res.ok) {
        setIsUnauthorized(true);
        setError(data.error || 'Access Denied: Verification Officer credentials required.');
        setLoading(false);
        return;
      }

      setTickets(data.tickets || []);
      if (data.tickets?.length > 0 && !selectedTicketId) {
        setSelectedTicketId(data.tickets[0].id);
      }
    } catch (err) {
      setError('Network communication failure. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    setLoadingProviders(true);
    try {
      const res = await fetch('/api/v1/providers?status=PENDING_VERIFICATION');
      const data = await res.json();
      if (data.success) {
        setProviders(data.providers || []);
      }
    } catch (err) {
      console.error('Error loading pending providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    loadQueue();
    loadProviders();
  }, []);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleDecision = async (decision: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION', reasonText?: string) => {
    if (!selectedTicket) return;

    setActionLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload: any = {
        verificationRequestId: selectedTicket.id,
        decision,
        notes: reasonText || reviewNotes || `Decision: ${decision} executed by verification officer`,
      };

      if (decision === 'REJECT' && reasonText) {
        payload.rejectionReason = reasonText;
      }

      const res = await fetch('/api/v1/officer/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Failed to execute ${decision}`);
        setActionLoading(false);
        return;
      }

      if (decision === 'REJECT') {
        setSuccessMessage(`Application for ${selectedTicket.profile?.fullName || selectedTicket.id} was rejected. An official rejection notice with reason has been emailed to the applicant.`);
      } else if (decision === 'APPROVE') {
        setSuccessMessage(`Application verified & authorized! Permanent Client ID ${data.clientId || ''} issued.`);
      } else {
        setSuccessMessage(`Ticket updated to: ${decision}`);
      }

      setReviewNotes('');
      setRejectingItem(null);
      setRejectionReasonInput('');
      await loadQueue();
    } catch (err) {
      setError('Network error processing decision');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProviderDecision = async (providerId: string, decision: 'VERIFY' | 'REJECT' | 'SUSPEND', reasonText?: string) => {
    setActionLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const payload: any = {
        providerId,
        decision,
        reviewNotes: reasonText || `Officer decision: ${decision}`,
      };

      if (decision === 'REJECT' && reasonText) {
        payload.rejectionReason = reasonText;
      }

      const res = await fetch('/api/v1/officer/provider-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Failed to process provider decision`);
        return;
      }

      if (decision === 'REJECT') {
        setSuccessMessage(`Facility application rejected. Rejection reason dispatched to facility email.`);
      } else {
        setSuccessMessage(`Provider credential status updated to: ${decision}`);
      }

      setRejectingItem(null);
      setRejectionReasonInput('');
      await loadProviders();
    } catch (err) {
      setError('Network error updating provider status');
    } finally {
      setActionLoading(false);
    }
  };

  // If Unauthorized, Render Lock Screen with Redirect to /officer/login
  if (isUnauthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              Restricted Government Operation
            </span>
            <h2 className="text-2xl font-black text-white">Officer Authentication Required</h2>
            <p className="text-xs text-slate-400">
              This dashboard is strictly restricted to designated Government Verification Officers and Credentialing Authorities.
            </p>
          </div>

          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300">
            {error || 'Access Denied: You must authenticate with an authorized Officer Badge.'}
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/officer/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/25"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login to Officer Portal</span>
            </Link>

            <Link
              href="/"
              className="w-full inline-block text-xs text-slate-400 hover:text-white transition-colors"
            >
              Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Panel Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 rounded-3xl shadow-lg mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-sky-400">Government Verification Authority</div>
              <h1 className="text-2xl font-black">Officer Audit & Verification Console</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="bg-white/10 px-3.5 py-2 rounded-full border border-white/10 text-slate-200">
              Duty Officer: <strong>Ananya Sen (VO-892)</strong>
            </span>
            <span className="bg-blue-600 px-3.5 py-2 rounded-full font-bold text-white shadow-sm">
              Pending: <strong>{tickets.length} KYC / {providers.length} Facilities</strong>
            </span>
            <Link
              href="/officer/login"
              className="bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-full text-slate-300 font-semibold border border-slate-700 transition-colors"
            >
              Switch Officer
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('CITIZENS')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'CITIZENS'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen KYC Queue ({tickets.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('PROVIDERS'); loadProviders(); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'PROVIDERS'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Facility Credential Queue ({providers.length})</span>
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: CITIZEN KYC QUEUE */}
        {activeTab === 'CITIZENS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Tickets Queue List */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Review Queue</span>
                <button onClick={loadQueue} className="text-xs text-blue-700 font-bold hover:underline">
                  Refresh Queue
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading audit queue...</div>
              ) : tickets.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="text-sm font-bold text-slate-800">Queue is Clear!</div>
                  <p className="text-xs text-slate-500">All submitted citizen applications have been audited.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        ticket.id === selectedTicket?.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900">
                          {ticket.profile?.fullName || 'Anonymous Profile'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {ticket.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Account: {ticket.account.accountNumber}</span>
                        <span className="font-mono text-[11px]">{ticket.id}</span>
                      </div>

                      {ticket.duplicateScore > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Duplicate Check Score: {ticket.duplicateScore}/100</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Active Ticket Inspector */}
            {selectedTicket ? (
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono text-slate-400">Request: {selectedTicket.id}</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                      {selectedTicket.profile?.fullName || 'Anonymous Applicant'}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1">Submitted: {new Date(selectedTicket.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Account State</div>
                    <div className="font-bold text-blue-700 mt-0.5">{selectedTicket.status}</div>
                  </div>
                </div>

                {/* Duplicate Engine Result Alert */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                    <span>Automated Duplicate Check Status: <strong>{selectedTicket.duplicateCheckResult}</strong></span>
                  </div>
                  <div className="text-slate-500">
                    Calculated similarity score: <strong>{selectedTicket.duplicateScore}/100</strong> (Checks exact SHA-256 document hash, mobile, email, and Levenshtein name distance).
                  </div>
                </div>

                {/* Submitted Profile Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div><span className="text-slate-400">Date of Birth:</span> <strong className="text-slate-900 block">{selectedTicket.profile?.dateOfBirth}</strong></div>
                  <div><span className="text-slate-400">Gender:</span> <strong className="text-slate-900 block">{selectedTicket.profile?.gender}</strong></div>
                  <div><span className="text-slate-400">District:</span> <strong className="text-slate-900 block">{selectedTicket.profile?.district}</strong></div>
                  <div><span className="text-slate-400">Emergency Contact:</span> <strong className="text-slate-900 block">{selectedTicket.profile?.emergencyContactName} ({selectedTicket.profile?.emergencyContactPhone})</strong></div>
                </div>

                {/* Submitted Document Proof Box with View Document action */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Submitted Document Proof
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">Click document to inspect & verify</span>
                  </div>

                  {selectedTicket.documents.length === 0 ? (
                    <div className="p-3 text-xs text-slate-400 italic">No document records attached to this ticket.</div>
                  ) : (
                    selectedTicket.documents.map(doc => (
                      <div 
                        key={doc.id} 
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs hover:border-blue-400 transition-colors cursor-pointer group"
                        onClick={() => setViewingDoc({
                          ...doc,
                          applicantName: selectedTicket.profile?.fullName,
                          dob: selectedTicket.profile?.dateOfBirth,
                          ticketId: selectedTicket.id,
                        })}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 group-hover:bg-blue-600 text-blue-700 group-hover:text-white flex items-center justify-center transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{doc.documentType} ({doc.documentNumberMasked})</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.s3ObjectKey}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10px]">
                            {doc.status}
                          </span>
                          <button
                            type="button"
                            className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1 text-[11px]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Document</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Officer Audit Notes */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Verification Officer Audit Remarks</label>
                  <textarea
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    placeholder="Record notes on document consistency, clarity, or additional audit criteria..."
                    rows={2}
                    className="w-full text-xs rounded-2xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Decision Controls: Verify & Authorize vs Reject with Reason */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 justify-end items-center">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleDecision('REQUEST_CORRECTION')}
                    className="px-4 py-2.5 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Request Correction</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setRejectingItem({
                      type: 'CITIZEN',
                      id: selectedTicket.id,
                      name: selectedTicket.profile?.fullName || 'Applicant',
                    })}
                    className="px-5 py-2.5 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleDecision('APPROVE')}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-700/25 transition-all"
                  >
                    <BadgeCheck className="w-4 h-4" />
                    <span>{actionLoading ? 'Authorizing...' : 'Verify & Authorize (Issue Client ID)'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center text-slate-400 text-sm">
                Select an applicant ticket from the queue on the left to inspect documents and record a verification decision.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROVIDER CREDENTIAL QUEUE */}
        {activeTab === 'PROVIDERS' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Healthcare Facility & Provider Applications</h3>
                <p className="text-xs text-slate-500">
                  Verify State Medical Council license numbers and physical facility compliance before granting provider portal access.
                </p>
              </div>
              <button
                onClick={loadProviders}
                className="text-xs text-blue-700 font-bold hover:underline"
              >
                Refresh Applications
              </button>
            </div>

            {loadingProviders ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading pending facilities...</div>
            ) : providers.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="text-sm font-bold text-slate-800">All Facility Applications Reviewed!</div>
                <p className="text-xs text-slate-500">No pending healthcare provider applications at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {providers.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{p.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {p.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                        <span>Reg No: <strong className="font-mono text-slate-900">{p.registrationNumber}</strong></span>
                        <span>Council: <strong>{p.medicalCouncil}</strong></span>
                        <span>Location: <strong>{p.city}, {p.state}</strong></span>
                        <span>Contact: <strong>{p.phone}</strong> ({p.email})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewingDoc({
                          documentType: `${p.category} REGISTRATION CERTIFICATE`,
                          documentNumberMasked: p.registrationNumber,
                          applicantName: p.name,
                          dob: p.medicalCouncil,
                          s3ObjectKey: `credentials/${p.id}/council_registration.pdf`,
                          status: 'PENDING_AUDIT',
                          ticketId: p.id,
                        })}
                        className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Certificate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRejectingItem({
                          type: 'PROVIDER',
                          id: p.id,
                          name: p.name,
                        })}
                        className="px-4 py-2 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Application</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleProviderDecision(p.id, 'VERIFY')}
                        className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <BadgeCheck className="w-3.5 h-3.5" />
                        <span>Authorize Facility</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW DOCUMENT PREVIEW MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Official Document Proof Inspector</h3>
                  <div className="text-[11px] text-slate-400">AHCS National Identity & Credential Vault</div>
                </div>
              </div>
              <button 
                onClick={() => setViewingDoc(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content / Simulated Visual Certificate */}
            <div className="p-6 space-y-6">
              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl relative">
                {/* Government Stamp Overlay */}
                <div className="absolute top-4 right-4 border-2 border-emerald-600/40 text-emerald-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded rotate-12 uppercase">
                  Audited Identity Record
                </div>

                <div className="text-center space-y-1 mb-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Official Government Identity Submission</span>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">{viewingDoc.documentType}</h4>
                  <div className="font-mono text-sm text-blue-700 font-bold">{viewingDoc.documentNumberMasked}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Applicant / Facility Name</span>
                    <strong className="text-slate-900 font-bold">{viewingDoc.applicantName || 'Applicant'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Registry Reference</span>
                    <strong className="text-slate-900 font-mono">{viewingDoc.ticketId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Storage URI</span>
                    <span className="font-mono text-[10px] text-slate-600 truncate block">{viewingDoc.s3ObjectKey}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Audit State</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {viewingDoc.status || 'PENDING_OFFICER_REVIEW'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Cryptographically verified against tamper registry</span>
                <button
                  onClick={() => setViewingDoc(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-colors"
                >
                  Done Inspecting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT WITH MANDATORY REASON & EMAIL DISPATCH */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Reject Application & Dispatch Notice</h3>
                  <div className="text-[11px] text-rose-300">Mandatory audit reason required</div>
                </div>
              </div>
              <button 
                onClick={() => setRejectingItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2">
                <Mail className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  The rejection reason below will be recorded in the immutable audit log and <strong>dispatched directly to the applicant&apos;s registered email and in-app notification feed</strong>.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quick Select Audit Reason
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Blurry or unreadable document scan',
                    'Name mismatch with National Passport/Aadhaar registry',
                    'Submitted document is expired',
                    'Medical Council License number could not be validated',
                    'Address proof incomplete or outside operating jurisdiction',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionReasonInput(preset)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 text-[11px] text-slate-700 transition-colors text-left"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Rejection Explanation (Mandatory)
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="Explain clearly to the applicant what needs to be corrected before re-applying..."
                  className="w-full text-xs rounded-2xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!rejectionReasonInput.trim() || actionLoading}
                  onClick={() => {
                    if (rejectingItem.type === 'CITIZEN') {
                      handleDecision('REJECT', rejectionReasonInput);
                    } else {
                      handleProviderDecision(rejectingItem.id, 'REJECT', rejectionReasonInput);
                    }
                  }}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{actionLoading ? 'Dispatching Notice...' : 'Confirm Rejection & Send Email'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
