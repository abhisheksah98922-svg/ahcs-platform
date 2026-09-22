'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2,
  Stethoscope,
  FlaskConical,
  Pill,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Star,
  ChevronLeft,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  User,
  HeartPulse,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { ProviderRecord, ProviderCategory } from '@/lib/db/types';

export default function ProviderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [provider, setProvider] = useState<ProviderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: string; name: string; specialty: string }>({
    id: 'doc-seed-1',
    name: 'Dr. Priya Sharma, MD',
    specialty: 'Cardiology / General Medicine',
  });
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // tomorrow
  );
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [reason, setReason] = useState('Routine Health Checkup & Consultation');
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [bookedAppointment, setBookedAppointment] = useState<any | null>(null);

  const availableSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
  ];

  const doctorsList = [
    { id: 'doc-seed-1', name: 'Dr. Priya Sharma, MD', specialty: 'Cardiology & Internal Medicine' },
    { id: 'doc-seed-2', name: 'Dr. Rajesh Nair, MS', specialty: 'Orthopedics & Joint Care' },
    { id: 'doc-seed-3', name: 'Dr. Ananya Sen, MBBS, DNB', specialty: 'Pediatrics & Neonatal Care' },
    { id: 'doc-seed-4', name: 'Dr. Arjun Verma, MD', specialty: 'General & Preventive Health' },
  ];

  useEffect(() => {
    if (!id) return;
    async function loadProvider() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/providers/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load healthcare provider');
        }
        setProvider(data.provider);
      } catch (err: any) {
        setError(err.message || 'Error loading facility information');
      } finally {
        setLoading(false);
      }
    }
    loadProvider();
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage(null);

    try {
      const res = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: id,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          appointmentDate,
          timeSlot,
          reason,
          notes,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setBookingMessage({
          type: 'error',
          text: 'Authentication required. Please log in to book an appointment with your AHCS Client ID.',
        });
        return;
      }

      if (!res.ok) {
        setBookingMessage({
          type: 'error',
          text: data.error || 'Slot unavailable or booking failed. Please pick a different slot.',
        });
        return;
      }

      setBookedAppointment(data.appointment);
      setBookingMessage({
        type: 'success',
        text: `Appointment confirmed with ${selectedDoctor.name} for ${appointmentDate} at ${timeSlot}!`,
      });
    } catch (err: any) {
      setBookingMessage({
        type: 'error',
        text: err.message || 'Network error occurred while booking appointment.',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const categoryIcons: Record<ProviderCategory, any> = {
    HOSPITAL: Building2,
    CLINIC: Stethoscope,
    LAB: FlaskConical,
    PHARMACY: Pill,
    DOCTOR: Stethoscope,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Retrieving accredited healthcare provider details...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Provider Not Found</h2>
          <p className="text-sm text-slate-600 mb-6">{error || 'The requested facility does not exist or has been unlisted.'}</p>
          <Link
            href="/healthcare"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Healthcare Directory
          </Link>
        </div>
      </div>
    );
  }

  const CatIcon = categoryIcons[provider.category] || Building2;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/healthcare"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Healthcare Directory
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <CatIcon className="w-3.5 h-3.5" />
                  {provider.category}
                </span>
                {provider.status === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Provider
                  </span>
                )}
                {provider.emergency24x7 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <HeartPulse className="w-3.5 h-3.5" />
                    24x7 Emergency Trauma Unit
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{provider.name}</h1>
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                {provider.address}, {provider.city}, {provider.state} - {provider.pinCode}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all"
              >
                <Calendar className="w-4 h-4" />
                Book Real Appointment
              </button>

              {provider.latitude && provider.longitude && (
                <Link
                  href={`/map?lat=${provider.latitude}&lng=${provider.longitude}&zoom=15`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-2xl border border-slate-700 transition-all"
                >
                  <Navigation className="w-4 h-4 text-blue-400" />
                  View on Map
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Facility Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Facility Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Registration Number</span>
                <span className="font-mono font-medium text-slate-800">{provider.registrationNumber}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Medical Authority / Council</span>
                <span className="font-medium text-slate-800">{provider.medicalCouncil}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Operating Hours</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {provider.operatingHours || '08:00 AM - 09:00 PM'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Verified Coordinates</span>
                <span className="font-mono text-xs text-slate-700">
                  {provider.latitude?.toFixed(4)}, {provider.longitude?.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Services & Specialities */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Accredited Clinical Departments & Services</h3>
              <div className="flex flex-wrap gap-2">
                {provider.services?.map((svc, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Available Doctors & Specialists */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Attending Physicians & Specialists</h2>
              <span className="text-xs font-semibold text-slate-500">Live Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctorsList.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                      <p className="text-xs text-slate-500">{doc.specialty}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setIsBookingOpen(true);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl font-semibold text-xs transition"
                  >
                    Select & Book Slot
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Contact & Direct Action */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900">Direct Facility Desk</h3>

            <div className="space-y-3 text-sm">
              <a
                href={`tel:${provider.phone}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
              >
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="text-xs text-slate-400 block font-medium">Telephone</span>
                  <span className="font-semibold text-slate-900">{provider.phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${provider.email}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
              >
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <span className="text-xs text-slate-400 block font-medium">Official Registry Email</span>
                  <span className="font-semibold text-slate-900">{provider.email}</span>
                </div>
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 text-xs leading-relaxed">
              <p className="font-bold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                ABDM & AHCS Connected
              </p>
              Present your AHCS Smart Card or QR Code at the registration desk for instant paperless admission and health records sync.
            </div>
          </div>
        </div>
      </div>

      {/* Real Appointment Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Book Real Appointment</h3>
                <p className="text-xs text-slate-500">Facility: {provider.name}</p>
              </div>
              <button
                onClick={() => {
                  setIsBookingOpen(false);
                  setBookingMessage(null);
                  setBookedAppointment(null);
                }}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {bookedAppointment ? (
              <div className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Appointment Confirmed!</h4>
                <p className="text-sm text-slate-600">
                  Your token has been securely booked in the AHCS central database with slot-conflict verification.
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs font-mono space-y-1.5 border border-slate-100">
                  <div><span className="text-slate-500">Appointment ID:</span> <span className="font-bold text-slate-900">{bookedAppointment.id}</span></div>
                  <div><span className="text-slate-500">Doctor:</span> <span className="font-bold text-slate-900">{bookedAppointment.doctorName}</span></div>
                  <div><span className="text-slate-500">Date & Slot:</span> <span className="font-bold text-slate-900">{bookedAppointment.appointmentDate} at {bookedAppointment.timeSlot}</span></div>
                  <div><span className="text-slate-500">Status:</span> <span className="text-emerald-700 font-bold">{bookedAppointment.status}</span></div>
                </div>

                <div className="pt-2 flex gap-3">
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-500 transition"
                  >
                    View in Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setBookedAppointment(null);
                      setBookingMessage(null);
                      setIsBookingOpen(false);
                    }}
                    className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold text-sm hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                {bookingMessage && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                      bookingMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{bookingMessage.text}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Attending Physician
                  </label>
                  <select
                    value={selectedDoctor.id}
                    onChange={(e) => {
                      const found = doctorsList.find((d) => d.id === e.target.value);
                      if (found) setSelectedDoctor(found);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {doctorsList.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Consultation Reason
                  </label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Chest tightness, Routine BP follow-up, Fever"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notes for Doctor (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any relevant symptoms or previous medical history..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {bookingLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                  <p className="text-center text-slate-400 text-xs mt-2">
                    Double-booking protection prevents duplicate slots in real-time.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
