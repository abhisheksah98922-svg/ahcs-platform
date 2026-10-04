'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Laptop, 
  Smartphone, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function DashboardSecurityPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadSessions = async () => {
    try {
      const res = await fetch('/api/v1/security/sessions');
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevokeOtherSessions = async () => {
    if (!confirm('Are you sure you want to terminate all other active device sessions?')) return;
    try {
      const res = await fetch('/api/v1/security/sessions', { method: 'DELETE' });
      const data = await res.json();
      setMessage(data.message || 'All other active sessions have been terminated.');
      await loadSessions();
    } catch (err) {
      setMessage('Network error during session revocation.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div>
          <Link href="/dashboard" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Security & Active Device Sessions
          </h1>
          <p className="text-xs text-slate-500">
            Inspect logged-in devices, terminate suspicious logins, and monitor account authentication events.
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Active Logged-In Sessions</h3>
              <p className="text-xs text-slate-500">Devices currently authorized to access your AHCS Health Vault.</p>
            </div>
            <button
              onClick={handleRevokeOtherSessions}
              className="px-4 py-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Log Out All Other Devices
            </button>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs text-slate-400">Loading session telemetry...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">Only your current active session is recorded.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sessions.map((s, idx) => (
                <div key={s.id || idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      {s.userAgent?.includes('Mobile') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{s.userAgent || 'Web Browser'}</div>
                      <div className="text-[11px] text-slate-500">
                        IP: {s.ipAddress || 'Protected Gateway'} · Last Active: {new Date(s.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Checklist */}
        <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <h4 className="font-bold text-slate-900 text-sm">Security Best Practices</h4>
          <ul className="space-y-1 list-disc list-inside text-slate-600">
            <li>Never share OTP codes or authorization SMS with anyone, including staff claiming to be from AHCS.</li>
            <li>If you misplace your physical Smart Card, block it immediately in the Card Controls section.</li>
            <li>All emergency accesses to your break-glass profile trigger an instant notification to your registered mobile.</li>
          </ul>
        </div>
      </main>

    </div>
  );
}
