'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Mail,
  Hospital,
  Stethoscope,
  FlaskConical,
  Pill,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Register Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    category: 'CLINIC',
    registrationNumber: '',
    medicalCouncil: 'State Medical Council',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '',
    phone: '',
    email: '',
    services: 'General Practice, Preventive Care',
    operatingHours: '09:00 AM - 08:00 PM',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [registerResult, setRegisterResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('query', searchQuery.trim());

      const res = await fetch(`/api/v1/providers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProviders(data.providers || []);
      }
    } catch (err) {
      console.error('Error loading providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setRegisterResult(null);

    try {
      const payload = {
        ...registerForm,
        services: registerForm.services.split(',').map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch('/api/v1/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setRegisterResult({ success: false, message: data.error || 'Failed to submit registration' });
      } else {
        setRegisterResult({ success: true, message: data.message });
        setRegisterForm({
          name: '',
          category: 'CLINIC',
          registrationNumber: '',
          medicalCouncil: 'State Medical Council',
          address: '',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '',
          phone: '',
          email: '',
          services: 'General Practice, Preventive Care',
          operatingHours: '09:00 AM - 08:00 PM',
        });
      }
    } catch (err) {
      setRegisterResult({ success: false, message: 'Network error submitting application' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Verified Healthcare Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Partner Hospitals, Clinics & Labs
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Every participating healthcare facility has their medical registration and council accreditation verified before joining the AHCS smart-card network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/provider/portal"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Stethoscope className="w-4 h-4 text-sky-400" />
              <span>Doctor Portal</span>
            </Link>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-700/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Join Network as Provider</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by hospital name, locality, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-2">Filter Category:</span>
            {[
              { id: 'ALL', label: 'All Providers', icon: Building2 },
              { id: 'HOSPITAL', label: 'Hospitals', icon: Hospital },
              { id: 'CLINIC', label: 'Clinics', icon: Stethoscope },
              { id: 'LAB', label: 'Pathology & Labs', icon: FlaskConical },
              { id: 'PHARMACY', label: 'Pharmacies', icon: Pill },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                    selectedCategory === tab.id
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>Querying verified healthcare directory...</span>
          </div>
        ) : providers.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Healthcare Facilities Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No verified providers matched your search parameters. Try clearing filters or expanding your search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-blue-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        {p.category}
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-0.5 leading-snug">
                        {p.name}
                      </h3>
                    </div>
                    <span className="shrink-0 p-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200" title="Credential Verified">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{p.address}, {p.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{p.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{p.operatingHours}</span>
                    </div>
                  </div>

                  {/* Services pills */}
                  {p.services && p.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {p.services.slice(0, 4).map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Reg: {p.registrationNumber}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Provider Registration */}
        {isRegisterOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Register Healthcare Facility</h3>
                  <p className="text-xs text-slate-500">Apply to join the AHCS Verified Healthcare Network.</p>
                </div>
                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {registerResult && (
                <div className={`p-4 rounded-2xl text-xs font-semibold ${
                  registerResult.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}>
                  {registerResult.message}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facility / Doctor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Multispecialty Clinic"
                    value={registerForm.name}
                    onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Facility Category *</label>
                    <select
                      value={registerForm.category}
                      onChange={e => setRegisterForm({ ...registerForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="HOSPITAL">Hospital</option>
                      <option value="CLINIC">Clinic</option>
                      <option value="LAB">Diagnostic Lab</option>
                      <option value="PHARMACY">Pharmacy</option>
                      <option value="DOCTOR">Independent Doctor</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Medical Registration No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KA-MED-2024-8891"
                      value={registerForm.registrationNumber}
                      onChange={e => setRegisterForm({ ...registerForm, registrationNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Registration Council *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karnataka Medical Council"
                      value={registerForm.medicalCouncil}
                      onChange={e => setRegisterForm({ ...registerForm, medicalCouncil: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru"
                      value={registerForm.city}
                      onChange={e => setRegisterForm({ ...registerForm, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 80 1234 5678"
                      value={registerForm.phone}
                      onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="contact@facility.in"
                      value={registerForm.email}
                      onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Services Offered (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Emergency, Cardiology, Pediatrics"
                    value={registerForm.services}
                    onChange={e => setRegisterForm({ ...registerForm, services: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-colors shadow-md shadow-blue-700/20 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Verification Request'}
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
