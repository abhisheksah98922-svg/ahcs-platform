'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Stethoscope,
  FlaskConical,
  Pill,
  MapPin,
  Phone,
  ShieldCheck,
  Search,
  Clock,
  Star,
  Map as MapIcon,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { ProviderRecord, ProviderCategory } from '@/lib/db/types';

export default function HealthcareDirectoryPage() {
  const [providers, setProviders] = useState<ProviderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [onlyEmergency, setOnlyEmergency] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, [selectedCategory, onlyEmergency]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (cityFilter) params.append('city', cityFilter);
      if (searchQuery) params.append('query', searchQuery);
      if (onlyEmergency) params.append('emergency24x7', 'true');

      const res = await fetch(`/api/v1/providers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProviders(data.providers);
      }
    } catch (err) {
      console.error('Failed to load providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
  };

  const categoryIcons: Record<ProviderCategory, any> = {
    HOSPITAL: Building2,
    CLINIC: Stethoscope,
    LAB: FlaskConical,
    PHARMACY: Pill,
    DOCTOR: Stethoscope,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified AHCS Healthcare Network</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
                Healthcare Facilities & Practitioners
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl mt-1">
                Explore accredited hospitals, emergency trauma units, family clinics, diagnostic centers, and 24x7 pharmacies across India.
              </p>
            </div>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all shrink-0"
            >
              <MapIcon className="w-4 h-4" />
              <span>Open Live Hospital Map</span>
            </Link>
          </div>

          {/* Search Bar & Filters */}
          <form onSubmit={handleSearchSubmit} className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by facility name, doctor speciality, or service..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-4 relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Filter by city (e.g. Bengaluru, Mumbai)..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            {['ALL', 'HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'All Facilities' : cat}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setOnlyEmergency(!onlyEmergency)}
              className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all ${
                onlyEmergency
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-800 text-red-300 hover:bg-slate-700'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>24x7 Emergency Units Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <h2 className="text-xl font-black text-slate-900">
            {providers.length} Verified Facilities Found
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Authenticated Real Coordinates & Medical Council Verified
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            Searching verified healthcare facilities...
          </div>
        ) : providers.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-slate-700 font-bold text-base">No verified facilities found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria, clearing the city filter, or disabling 24x7 emergency restrictions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {providers.map((p) => {
              const Icon = categoryIcons[p.category] || Building2;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
                        {p.emergency24x7 && (
                          <span className="mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            24/7 Trauma
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{p.address}, {p.city}</span>
                      </div>
                    </div>

                    {p.rating && (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{p.rating.toFixed(1)} / 5.0</span>
                        <span className="text-slate-400 font-normal">({p.partnerTier})</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-700 mb-1.5">Accredited Services:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.services.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                        {p.services.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium px-1">
                            +{p.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px]">{p.operatingHours}</span>
                    </div>

                    <Link
                      href={`/providers/${p.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs transition-colors"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
