'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Laptop,
  LogOut,
  Clock,
  MapPin,
  KeyRound,
  History,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';

interface ActiveSession {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

interface AuditEvent {
  id: string;
  action: string;
  targetResource: string;
  createdAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export default function SecurityCenterPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/security/sessions');
      const data = await res.json();
      if (res.ok && data.success) {
        setSessions(data.sessions || []);
        setRecentActivity(data.recentActivity || []);
      } else if (res.status === 401) {
        setNotification({
          type: 'error',
          message: 'Please log in to view active security credentials and sessions.',
        });
      }
    } catch (err: any) {
      console.error('Error fetching security sessions:', err);
      setNotification({
        type: 'error',
        message: 'Failed to contact security center service.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleLogoutAllOther = async () => {
    setActionLoading(true);
    setNotification(null);
    try {
      const res = await fetch('/api/v1/security/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOGOUT_ALL_OTHER' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: data.message,
        });
        fetchSecurityData();
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Failed to terminate other sessions.',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Network error occurred.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-4 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Patient Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Trust Security Perimeter Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Security & Session Center</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Manage authenticated devices, cryptographic tokens, and inspect real-time clinical access logs.
              </p>
            </div>

            <button
              onClick={fetchSecurityData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* Banner Alerts */}
        {notification && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 border ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Section 1: Active Sessions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-blue-600" />
                Active Devices & Sessions ({sessions.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every browser or mobile terminal currently authorized to access your AHCS records.
              </p>
            </div>

            {sessions.length > 1 && (
              <button
                onClick={handleLogoutAllOther}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition disabled:opacity-50"
              >
                {actionLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Revoke All Other Sessions
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`p-5 rounded-2xl border transition-all ${
                  sess.isCurrent
                    ? 'border-blue-300 bg-blue-50/40'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        sess.isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {sess.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser'}
                        </span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Current Session
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-500 block truncate max-w-[220px]">
                        {sess.userAgent}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    IP: {sess.ipAddress}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(sess.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Security & Authentication Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Multi-Factor Authentication</h3>
            <p className="text-xs text-slate-500">
              Cryptographic SMS & Email OTP authentication enforced on all high-risk clinical transactions.
            </p>
            <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Enabled (Mandatory)
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dynamic Smart Card QR</h3>
            <p className="text-xs text-slate-500">
              HMAC-SHA256 time-rotating QR codes prevent unauthorized physical card cloning or replay attacks.
            </p>
            <span className="inline-block text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              Active (60s Expiry)
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Fraud & Velocity Guard</h3>
            <p className="text-xs text-slate-500">
              Automatic anomaly scoring protects against excessive rapid emergency access attempts.
            </p>
            <span className="inline-block text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Real-time Monitored
            </span>
          </div>
        </div>

        {/* Section 3: Real-Time Audit Log History */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-700" />
                Immutable Access & Event Logs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every authorization event, record access, and consent grant is cryptographically logged.
              </p>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No recent audit events registered in current session.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-3 font-medium">Timestamp</th>
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Resource</th>
                    <th className="pb-3 font-medium">Network IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentActivity.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-500 whitespace-nowrap">
                        {new Date(evt.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {evt.action}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 font-medium">{evt.targetResource}</td>
                      <td className="py-3 font-mono text-slate-400">{evt.ipAddress || 'Internal'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
