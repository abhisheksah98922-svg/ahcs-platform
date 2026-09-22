'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  HeartPulse,
  Navigation,
  ChevronRight,
  Filter,
  Compass,
  Crosshair,
  ExternalLink,
} from 'lucide-react';
import { ProviderRecord, ProviderCategory } from '@/lib/db/types';

// Haversine formula for real distance calculation in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function HealthcareMapPage() {
  const [providers, setProviders] = useState<ProviderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderRecord | null>(null);

  // User reference coordinates (Default to Bengaluru Center: 12.9716° N, 77.5946° E)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 12.9716,
    lng: 77.5946,
  });
  const [radiusKm, setRadiusKm] = useState<number>(25);

  useEffect(() => {
    async function loadAllProviders() {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/providers');
        const data = await res.json();
        if (data.success && Array.isArray(data.providers)) {
          setProviders(data.providers);
          if (data.providers.length > 0) {
            setSelectedProvider(data.providers[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load map providers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllProviders();
  }, []);

  const handleLocateMe = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Geolocation denied, keeping default location:', err);
        }
      );
    }
  };

  // Filtered providers with real distance computation
  const providersWithDistance = useMemo(() => {
    return providers
      .map((p) => {
        const dist =
          p.latitude && p.longitude
            ? calculateDistance(userLocation.lat, userLocation.lng, p.latitude, p.longitude)
            : 0;
        return { ...p, distanceKm: dist };
      })
      .filter((p) => {
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
        if (emergencyOnly && !p.emergency24x7) return false;
        if (radiusKm && p.distanceKm > radiusKm) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchService = p.services?.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchCity && !matchService) return false;
        }
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [providers, selectedCategory, emergencyOnly, radiusKm, searchQuery, userLocation]);

  const categoryIcons: Record<ProviderCategory, any> = {
    HOSPITAL: Building2,
    CLINIC: Stethoscope,
    LAB: FlaskConical,
    PHARMACY: Pill,
    DOCTOR: Stethoscope,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/healthcare"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            ← Directory
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm tracking-tight text-white">Live Healthcare Geospatial Map</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLocateMe}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-400 border border-slate-700 transition"
          >
            <Crosshair className="w-3.5 h-3.5" />
            Locate Me
          </button>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Ref: {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}
          </span>
        </div>
      </header>

      {/* Main Map + Sidebar Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Controls & Provider List */}
        <div className="w-full lg:w-96 bg-slate-950/80 border-r border-slate-800 flex flex-col shrink-0 h-auto lg:h-[calc(100vh-4rem)]">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hospitals, diagnostics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Radius and Emergency Filters */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <HeartPulse className="w-3.5 h-3.5" /> 24x7 Emergency Only
                </span>
              </label>

              <div className="flex items-center gap-1 text-slate-400">
                <span>Radius:</span>
                <select
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-1.5 py-0.5 text-xs"
                >
                  <option value={5}>5 km</option>
                  <option value={15}>15 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                  <option value={100}>100 km</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of matching providers */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading geospatial data...</div>
            ) : providersWithDistance.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No providers match the selected filters or radius.
              </div>
            ) : (
              providersWithDistance.map((p) => {
                const Icon = categoryIcons[p.category] || Building2;
                const isSelected = selectedProvider?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProvider(p)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-900/40 border border-blue-500/50 shadow-md'
                        : 'hover:bg-slate-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`p-2 rounded-xl mt-0.5 ${
                            p.emergency24x7
                              ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                              : 'bg-slate-800 text-blue-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{p.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded">
                              {p.distanceKm} km away
                            </span>
                            {p.emergency24x7 && (
                              <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">
                                24x7 Trauma
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 mt-1" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Map Canvas + Selected Detail Modal/Card */}
        <div className="flex-1 relative bg-slate-950 flex flex-col">
          {/* Map Viewport Area */}
          <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Coordinate Grid / OpenStreetMap Tile Embed for Interactive Real Coordinates */}
            {selectedProvider && selectedProvider.latitude && selectedProvider.longitude ? (
              <iframe
                title="Geospatial Map"
                className="w-full h-full border-0 filter invert contrast-125 opacity-85"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  selectedProvider.longitude - 0.03
                }%2C${selectedProvider.latitude - 0.02}%2C${
                  selectedProvider.longitude + 0.03
                }%2C${selectedProvider.latitude + 0.02}&layer=mapnik&marker=${
                  selectedProvider.latitude
                }%2C${selectedProvider.longitude}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
                Select a facility to render satellite & GIS coordinates
              </div>
            )}

            {/* Overlay Provider Info Floating Card */}
            {selectedProvider && (
              <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-[420px] bg-slate-900/95 backdrop-blur-md p-5 rounded-3xl border border-slate-700 shadow-2xl z-20 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{selectedProvider.category} • AHCS Verified</span>
                    </div>
                    <h3 className="text-base font-black text-white">{selectedProvider.name}</h3>
                    <p className="text-xs text-slate-300 mt-1">{selectedProvider.address}, {selectedProvider.city}</p>
                  </div>
                  {selectedProvider.emergency24x7 && (
                    <span className="px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[11px] font-black border border-rose-500/30 shrink-0">
                      24/7 ER
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedProvider.services?.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono">
                    Lat: {selectedProvider.latitude?.toFixed(4)}, Lng: {selectedProvider.longitude?.toFixed(4)}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${selectedProvider.phone}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition"
                      title="Call Emergency / Reception"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <Link
                      href={`/providers/${selectedProvider.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center gap-1"
                    >
                      Book Slot <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
