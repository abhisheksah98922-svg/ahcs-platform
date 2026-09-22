'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Users, 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  EyeOff
} from 'lucide-react';

export default function CorporatePortalPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [orgDetails, setOrgDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // New Org Form
  const [isRegisterOrgOpen, setIsRegisterOrgOpen] = useState<boolean>(false);
  const [orgName, setOrgName] = useState<string>('');
  const [regNo, setRegNo] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [registeringOrg, setRegisteringOrg] = useState<boolean>(false);
  const [orgSuccessMessage, setOrgSuccessMessage] = useState<string>('');

  // Sponsor Employee Form
  const [employeeId, setEmployeeId] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [sponsoring, setSponsoring] = useState<boolean>(false);
  const [sponsorMessage, setSponsorMessage] = useState<string>('');
  const [sponsorError, setSponsorError] = useState<string>('');

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/corporate');
      const data = await res.json();
      if (data.success) {
        setOrganizations(data.organizations || []);
        if (data.organizations?.length > 0 && !selectedOrgId) {
          setSelectedOrgId(data.organizations[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrgDetails = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/v1/corporate?orgId=${id}`);
      const data = await res.json();
      if (data.success) {
        setOrgDetails(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrgId) {
      loadOrgDetails(selectedOrgId);
    }
  }, [selectedOrgId]);

  const handleRegisterOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisteringOrg(true);
    setOrgSuccessMessage('');
    try {
      const res = await fetch('/api/v1/corporate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REGISTER_ORG',
          orgName,
          registrationNumber: regNo,
          contactEmail,
          contactPhone,
          domain,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to register organization');
      } else {
        setOrgSuccessMessage('Corporate organization registered successfully.');
        setIsRegisterOrgOpen(false);
        setOrgName('');
        setRegNo('');
        setContactEmail('');
        setContactPhone('');
        setDomain('');
        await loadOrganizations();
        if (data.organization?.id) {
          setSelectedOrgId(data.organization.id);
        }
      }
    } catch (err) {
      alert('Network error registering organization');
    } finally {
      setRegisteringOrg(false);
    }
  };

  const handleSponsorEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId || !employeeId.trim() || !clientId.trim()) return;

    setSponsoring(true);
    setSponsorMessage('');
    setSponsorError('');
    try {
      const res = await fetch('/api/v1/corporate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SPONSOR_EMPLOYEE',
          orgId: selectedOrgId,
          employeeId: employeeId.trim(),
          clientId: clientId.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSponsorError(data.error || 'Failed to enroll employee');
      } else {
        setSponsorMessage(data.message || 'Employee enrolled successfully');
        setEmployeeId('');
        setClientId('');
        await loadOrgDetails(selectedOrgId);
      }
    } catch (err) {
      setSponsorError('Network error enrolling employee');
    } finally {
      setSponsoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-800">
              Enterprise Health Benefits
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Building2 className="w-7 h-7 text-blue-400" />
              <span>AHCS Corporate Health Sponsorship</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Sponsor verified smart health cards for your enterprise workforce with strict clinical privacy separation.
            </p>
          </div>

          <button
            onClick={() => setIsRegisterOrgOpen(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-blue-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Company</span>
          </button>
        </div>

        {/* Privacy Barrier Notice */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 text-xs text-emerald-900">
          <EyeOff className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-emerald-950 font-bold block mb-0.5">Corporate Privacy Barrier Guaranteed by Architecture:</strong>
            Employers and HR admins can sponsor cards and verify issuance status, but are <strong>strictly prohibited</strong> by cryptographic role guards from accessing employee clinical records, diagnoses, prescription details, or emergency profiles.
          </div>
        </div>

        {orgSuccessMessage && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
            {orgSuccessMessage}
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Organization Selector & Sponsor Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Select Corporate Account
                </label>
                {organizations.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-2">
                    No corporate accounts registered yet. Click &quot;Register New Company&quot; above.
                  </div>
                ) : (
                  <select
                    value={selectedOrgId}
                    onChange={e => setSelectedOrgId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 bg-slate-50 text-xs focus:outline-none focus:border-blue-600"
                  >
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.orgName} (CIN: {org.registrationNumber})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Sponsor Form */}
              {selectedOrgId && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Sponsor Employee Health Card</h3>
                    <p className="text-xs text-slate-500">Provide employee ID and their verified AHCS Client ID.</p>
                  </div>

                  {sponsorMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      {sponsorMessage}
                    </div>
                  )}

                  {sponsorError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                      {sponsorError}
                    </div>
                  )}

                  <form onSubmit={handleSponsorEmployee} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Internal Employee ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. EMP-9042"
                        value={employeeId}
                        onChange={e => setEmployeeId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Employee AHCS Client ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AHCS-3B9K-7M2P-4"
                        value={clientId}
                        onChange={e => setClientId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sponsoring}
                      className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-700/20 disabled:opacity-50"
                    >
                      {sponsoring ? 'Enrolling Employee...' : 'Enroll in Corporate Sponsorship'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sponsored Roster */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Sponsored Workforce Roster</h3>
                  <p className="text-xs text-slate-500">
                    {orgDetails?.organization?.orgName || 'Active Organization'} • {orgDetails?.sponsoredMembersCount || 0} Employees Active
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {orgDetails?.organization?.activePlan || 'ENTERPRISE'}
                </span>
              </div>

              {!orgDetails?.members || orgDetails.members.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-300" />
                  <div>No employees enrolled under this sponsorship yet.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-2.5 rounded-l-lg">Employee ID</th>
                        <th className="p-2.5">Sponsorship</th>
                        <th className="p-2.5">Card Status</th>
                        <th className="p-2.5 rounded-r-lg">Date Enrolled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orgDetails.members.map((m: any) => (
                        <tr key={m.id}>
                          <td className="p-2.5 font-bold font-mono text-slate-900">{m.employeeId}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {m.status}
                            </span>
                          </td>
                          <td className="p-2.5 font-semibold text-slate-700">{m.cardStatus}</td>
                          <td className="p-2.5 text-slate-400 font-mono text-[11px]">{new Date(m.sponsoredAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Register Company */}
        {isRegisterOrgOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Register Enterprise Account</h3>
                  <p className="text-xs text-slate-500">Setup company sponsorship for AHCS Health Cards</p>
                </div>
                <button onClick={() => setIsRegisterOrgOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleRegisterOrg} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Entity Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Infosys Technologies Ltd"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">CIN / Registration No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. L85110KA2020PLC123456"
                      value={regNo}
                      onChange={e => setRegNo(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company Domain</label>
                    <input
                      type="text"
                      placeholder="e.g. company.com"
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">HR / Benefit Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="benefits@company.com"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">HR Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 80 8888 7777"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOrgOpen(false)}
                    className="px-4 py-2 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registeringOrg}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    {registeringOrg ? 'Registering...' : 'Register Corporate Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
