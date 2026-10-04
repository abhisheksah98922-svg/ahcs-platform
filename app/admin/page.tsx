'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Building2, 
  Truck, 
  Home, 
  LifeBuoy, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock, 
  FileText,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function AdminOperationsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentMobile, setRecentMobile] = useState<any[]>([]);
  const [recentHomeCare, setRecentHomeCare] = useState<any[]>([]);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MOBILE' | 'HOME_CARE' | 'TICKETS'>('OVERVIEW');
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch('/api/v1/admin/stats')
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setUnauthorized(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setStats(data.stats);
          setRecentMobile(data.recentMobile || []);
          setRecentHomeCare(data.recentHomeCare || []);
          setRecentTickets(data.recentTickets || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Back-Office Authorization Required</h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              You must be authenticated as an AHCS Administrative Officer to inspect live operations telemetry.
            </p>
            <div className="space-y-3">
              <Link
                href="/officer/login"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all block text-center shadow-md"
              >
                Go to Officer Login
              </Link>
              <Link
                href="/dashboard"
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all block text-center"
              >
                Return to Member Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-500/30">
                <ShieldCheck className="w-4 h-4" />
                <span>Authoritative Operations Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                AHCS Administrative Command & Telemetry
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time synchronized data from Neon PostgreSQL. Zero simulated metrics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/officer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Citizen Verification Queue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Real Metrics Row */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Users</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {loading ? '...' : stats?.totalUsers || 0}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 block">Verified IDs</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700">
                {loading ? '...' : stats?.verifiedClientIds || 0}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 block">Active Cards</span>
              <span className="text-xl sm:text-2xl font-black text-blue-700">
                {loading ? '...' : stats?.activeCards || 0}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 block">Verified Providers</span>
              <span className="text-xl sm:text-2xl font-black text-purple-700">
                {loading ? '...' : stats?.verifiedProviders || 0}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 block">Mobile Camps</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-700">
                {loading ? '...' : stats?.mobileMedicalRequests || 0}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 block">Open Tickets</span>
              <span className="text-xl sm:text-2xl font-black text-amber-700">
                {loading ? '...' : stats?.openSupportTickets || 0}
              </span>
            </div>
          </div>
        </section>

        {/* Tab Controls */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'OVERVIEW'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Quick Actions
            </button>
            <button
              onClick={() => setActiveTab('MOBILE')}
              className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'MOBILE'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Mobile Medical Camps ({recentMobile.length})
            </button>
            <button
              onClick={() => setActiveTab('HOME_CARE')}
              className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'HOME_CARE'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Home Care Requests ({recentHomeCare.length})
            </button>
            <button
              onClick={() => setActiveTab('TICKETS')}
              className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'TICKETS'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Support Tickets ({recentTickets.length})
            </button>
          </div>
        </section>

        {/* Tab Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Officer Verification Panel</span>
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Review submitted citizen government IDs, assess duplicate matching scores, and approve verified AHCS Client IDs.
                </p>
                <Link
                  href="/officer"
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-all block text-center"
                >
                  Open Verification Queue
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span>Provider Clinical Portal</span>
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Lookup registered patients, initiate consent requests, record clinical encounter notes, and dispense digital prescriptions.
                </p>
                <Link
                  href="/provider/portal"
                  className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold transition-all block text-center"
                >
                  Open Provider Encounter Portal
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-emerald-600" />
                  <span>Support & Grievances Desk</span>
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Manage member support inquiries, track card delivery tracking tickets, and comply with DPDP statutory timelines.
                </p>
                <button
                  onClick={() => setActiveTab('TICKETS')}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-all block text-center"
                >
                  View Support Tickets
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE MEDICAL */}
          {activeTab === 'MOBILE' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Mobile Medical Camp Requests</h3>
                <span className="text-xs text-slate-500 font-mono">Total: {recentMobile.length}</span>
              </div>
              {recentMobile.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No mobile medical camp requests registered yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Organization</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Requested Date</th>
                        <th className="p-3">Attendees</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentMobile.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-semibold text-slate-900">{req.organizationName}</td>
                          <td className="p-3 text-slate-600">{req.contactPerson} ({req.contactPhone})</td>
                          <td className="p-3 text-slate-600">{req.city}, {req.state}</td>
                          <td className="p-3 text-slate-600">{new Date(req.requestedDate).toLocaleDateString()}</td>
                          <td className="p-3 font-mono">{req.expectedAttendees}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HOME CARE */}
          {activeTab === 'HOME_CARE' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Home Healthcare & Nursing Requests</h3>
                <span className="text-xs text-slate-500 font-mono">Total: {recentHomeCare.length}</span>
              </div>
              {recentHomeCare.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No home care requests registered yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Service Required</th>
                        <th className="p-3">Address / City</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Preferred Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentHomeCare.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-semibold text-slate-900">{req.patientName}</td>
                          <td className="p-3 text-slate-700">{req.serviceType}</td>
                          <td className="p-3 text-slate-600">{req.location}, {req.city}</td>
                          <td className="p-3 text-slate-600">{req.contactPhone}</td>
                          <td className="p-3 text-slate-600">{new Date(req.preferredDate).toLocaleDateString()}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-indigo-100 text-indigo-800">
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUPPORT TICKETS */}
          {activeTab === 'TICKETS' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Member Support & Grievance Tickets</h3>
                <span className="text-xs text-slate-500 font-mono">Total: {recentTickets.length}</span>
              </div>
              {recentTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No support tickets recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Ticket #</th>
                        <th className="p-3">User</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentTickets.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-mono font-bold text-blue-700">{t.ticketNumber}</td>
                          <td className="p-3 text-slate-900">{t.fullName}</td>
                          <td className="p-3 text-slate-600">{t.category}</td>
                          <td className="p-3 text-slate-700 max-w-xs truncate">{t.subject}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                              t.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
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
          )}
        </section>
      </main>

    </div>
  );
}
