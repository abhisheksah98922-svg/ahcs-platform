'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Building2, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  ShieldCheck, 
  Phone, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function FindCarePage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/v1/providers?status=VERIFIED')
      .then(res => res.json())
      .then(data => {
        if (data.providers) {
          setProviders(data.providers);
        }
      })
      .catch(err => console.error('Error fetching providers:', err))
      .finally(() => setLoading(false));
  }, []);

  const cities = Array.from(new Set(providers.map(p => p.city))).filter(Boolean);

  const filteredProviders = providers.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pinCode?.includes(searchTerm) ||
      p.services?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'ALL' || p.city === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Search */}
        <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <Search className="w-4 h-4" />
              <span>Real-Time Provider Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Find Participating Healthcare Providers
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Search verified partner hospitals, specialized clinics, and diagnostic labs where your AHCS Client ID is recognized.
            </p>

            {/* Search and Filters Bar */}
            <div className="mt-8 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-100 text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by hospital, clinic name, specialty or PIN code..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="ALL">All Provider Types</option>
                    <option value="HOSPITAL">Hospitals</option>
                    <option value="CLINIC">Clinics</option>
                    <option value="LABORATORY">Diagnostic Labs</option>
                    <option value="PHARMACY">Pharmacies</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="ALL">All Cities</option>
                    {cities.map((city, idx) => (
                      <option key={idx} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {loading ? 'Searching network providers...' : `${filteredProviders.length} Participating Providers Found`}
            </h2>
            <Link href="/network" className="text-xs text-blue-600 hover:underline font-semibold">
              View Network Statistics →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
                  <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-16 bg-slate-50 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base mb-1">No matching providers found</h3>
              <p className="text-xs text-slate-500 mb-4">Try clearing filters or searching with a different city name.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); setSelectedCity('ALL'); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map(provider => (
                <div 
                  key={provider.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-blue-400 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                        {provider.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Partner</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {provider.name}
                    </h3>
                    <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{provider.address}, {provider.city}, {provider.state} - {provider.pinCode}</span>
                    </div>

                    {provider.services && provider.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {provider.services.slice(0, 3).map((s: string, idx: number) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {s}
                          </span>
                        ))}
                        {provider.services.length > 3 && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                            +{provider.services.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Reg: <span className="font-mono text-slate-700">{provider.registrationNumber}</span>
                    </div>
                    <Link
                      href={`/providers/${provider.id}`}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
