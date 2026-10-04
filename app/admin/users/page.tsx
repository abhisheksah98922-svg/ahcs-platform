'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
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
            Registered Users & Accounts
          </h1>
          <p className="text-xs text-slate-500">
            Authoritative user registry synchronized with Neon PostgreSQL.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-bold">TOTAL REGISTERED USERS</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{loading ? '...' : stats?.totalUsers || 0}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-bold">ACTIVE ACCOUNTS</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">{loading ? '...' : stats?.totalAccounts || 0}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-bold">VERIFIED CLIENT IDS</div>
            <div className="text-3xl font-black text-blue-700 mt-1">{loading ? '...' : stats?.verifiedClientIds || 0}</div>
          </div>
        </div>
      </main>

    </div>
  );
}
