'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ChevronLeft,
  FileCheck,
  Hospital,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

const CATEGORIES = [
  { id: 'HOSPITAL', label: 'Hospital', desc: 'Multi-speciality, Tertiary, or General Hospital' },
  { id: 'CLINIC', label: 'Clinic', desc: 'Outpatient, Polyclinic, or Day Care Center' },
  { id: 'DOCTOR', label: 'Independent Doctor', desc: 'Private Practice, Consultant, or General Practitioner' },
  { id: 'DIAGNOSTIC_LAB', label: 'Diagnostic Lab', desc: 'Pathology, Biochemistry, or Radiology Center' },
  { id: 'PHARMACY', label: 'Pharmacy', desc: 'Licensed Retail or Hospital Pharmacy' },
];

const COMMON_SERVICES = [
  'General Consultation',
  'Emergency 24x7 Care',
  'Cardiology',
  'Pediatrics',
  'Orthopedics',
  'Gynecology & Obstetrics',
  'Pathology & Blood Tests',
  'Radiology & Ultrasound',
  'Digital Prescriptions (Rx)',
  'Inpatient Bed Management',
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('CLINIC');
  const [name, setName] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [medicalCouncil, setMedicalCouncil] = useState<string>('State Medical Council / NMC');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Bengaluru');
  const [state, setState] = useState<string>('Karnataka');
  const [pinCode, setPinCode] = useState<string>('');
  const [operatingHours, setOperatingHours] = useState<string>('09:00 AM - 08:00 PM');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'General Consultation',
    'Digital Prescriptions (Rx)'
  ]);
  const [emergency24x7, setEmergency24x7] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [submittedProvider, setSubmittedProvider] = useState<any>(null);

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter(s => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !registrationNumber.trim() || !phone.trim() || !email.trim() || !city.trim()) {
      setError('Please fill in all mandatory fields (Facility Name, Reg No, Phone, Email, City).');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        category,
        registrationNumber: registrationNumber.trim().toUpperCase(),
        medicalCouncil: medicalCouncil.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        phone: phone.trim(),
        email: email.trim(),
        services: selectedServices,
        operatingHours: emergency24x7 ? '24 Hours / 7 Days' : operatingHours.trim(),
        emergency24x7,
      };

      const res = await fetch('/api/v1/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit registration');
        return;
      }

      setSubmittedProvider(data.provider);
    } catch (err) {
      setError('Network communication failure. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-3xl w-full space-y-6 relative z-10">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/provider/login" 
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Staff & Doctor Login</span>
          </Link>
          <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30">
            Provider Onboarding Portal
          </div>
        </div>

        {submittedProvider ? (
          /* Application Submitted Success Card */
          <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                Application Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Registration Submitted for Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                Your facility has been submitted to the National Health Authority registry with Reference ID:
              </p>
              <div className="inline-block px-5 py-2.5 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono text-lg font-bold">
                {submittedProvider.id}
              </div>
            </div>

            {/* Application Summary Box */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2.5 max-w-lg mx-auto">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Facility Name:</span>
                <span className="font-bold text-white">{submittedProvider.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-teal-300">{submittedProvider.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Reg / License No:</span>
                <span className="font-mono text-white">{submittedProvider.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audit Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[10px]">
                  PENDING_VERIFICATION
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-xs text-teal-200/90 text-left flex items-start gap-3 max-w-lg mx-auto">
              <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong>Next Step: Officer Authorization</strong>
                <p className="mt-1 text-slate-300 text-[11px]">
                  A Government Verification Officer will review your medical council registration and physical compliance on the Officer Console. Once verified, this facility will appear in the login selector at <Link href="/provider/login" className="text-teal-300 underline font-semibold">Doctor & Staff Login</Link>.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/officer/login"
                className="px-6 py-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Check Officer Verification Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/provider/login"
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Go to Staff Login</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-inner">
                  <Hospital className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Register Healthcare Facility or Practice
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Onboard your Hospital, Clinic, Independent Practice, or Lab to the AHCS National Network.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Category Selector Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  1. Select Facility / Practice Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        category === cat.id
                          ? 'bg-teal-500/15 border-teal-400 text-white shadow-md shadow-teal-500/10 ring-1 ring-teal-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{cat.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{cat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Facility Information */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  2. Legal Facility & License Details *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">
                      {category === 'DOCTOR' ? 'Doctor / Practice Name *' : 'Hospital / Clinic / Lab Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={category === 'DOCTOR' ? 'Dr. Priya Sharma, MD' : 'CareLife Multispeciality Clinic'}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">
                      Registration / License Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CEA-KA-2024-9182 / NMC-84729"
                      value={registrationNumber}
                      onChange={e => setRegistrationNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">
                      Medical Council / Licensing Authority *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karnataka Medical Council / NMC / NABH"
                      value={medicalCouncil}
                      onChange={e => setMedicalCouncil(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08:00 AM - 09:00 PM"
                      value={operatingHours}
                      onChange={e => setOperatingHours(e.target.value)}
                      disabled={emergency24x7}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200">24x7 Emergency Services Available</span>
                    <p className="text-[11px] text-slate-400">Check if your facility operates trauma/emergency around the clock</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emergency24x7}
                    onChange={e => setEmergency24x7(e.target.checked)}
                    className="w-4 h-4 text-teal-500 rounded bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  3. Contact & Communication *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Official Contact Phone / Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+919876543210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="admissions@carelifeclinic.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Location */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  4. Physical Facility Location *
                </label>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Street Address & Landmark</label>
                  <input
                    type="text"
                    placeholder="Plot 42, 100 Feet Road, Indiranagar"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Bengaluru"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="Karnataka"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">PIN Code</label>
                    <input
                      type="text"
                      placeholder="560038"
                      value={pinCode}
                      onChange={e => setPinCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              </div>

              {/* Services Offered */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  5. Clinical Services & Capabilities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_SERVICES.map(srv => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition-colors ${
                        selectedServices.includes(srv)
                          ? 'bg-teal-500/15 border-teal-500/40 text-teal-200'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-medium">{srv}</span>
                      {selectedServices.includes(srv) && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <Link
                  href="/provider/login"
                  className="px-5 py-3 rounded-2xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
                >
                  <span>{loading ? 'Submitting Registration...' : 'Submit Facility for Officer Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
