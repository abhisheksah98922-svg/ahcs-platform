import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  PhoneCall, 
  Building2, 
  Users, 
  QrCode, 
  Lock, 
  AlertTriangle, 
  ArrowRight,
  Clock,
  HeartPulse,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Emergency Healthcare Assistance | AHCS',
  description: 'Emergency assistance protocols, break-glass profile access, nearby emergency hospital discovery, and life-safety procedures.',
};

export default function EmergencyHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Urgent 112 Directive Banner */}
        <section className="bg-red-700 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <PhoneCall className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div>
                <span className="text-xs uppercase font-black tracking-widest text-red-200">NATIONAL EMERGENCY HELPLINE</span>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Need Immediate Medical Help?
                </h1>
                <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl">
                  For active heart attacks, severe trauma, choking, stroke, or severe bleeding, <strong>dial 112 or 108 immediately</strong> or proceed to the nearest hospital casualty.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <a
                href="tel:112"
                className="px-6 py-3.5 bg-white text-red-700 hover:bg-red-50 font-black text-sm rounded-xl transition-all shadow-lg text-center"
              >
                CALL 112 NOW
              </a>
              <Link
                href="/find-care?category=HOSPITAL"
                className="px-6 py-3.5 bg-red-900/60 hover:bg-red-900 text-white font-bold text-sm rounded-xl border border-white/20 transition-all text-center"
              >
                Find Nearest Hospital
              </Link>
            </div>
          </div>
        </section>

        {/* How AHCS Supports Emergencies */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2">Emergency Coordination</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">What AHCS Provides During Critical Care</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              While emergency services provide immediate ambulance transport, AHCS solves the medical data vacuum at the hospital triage desk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Break-Glass QR Profile</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  First responders and casualty doctors can scan the card QR with any smartphone to view life-critical details without unlocking the full app.
                </p>
                <div className="text-xs text-red-700 font-semibold flex items-center gap-1">
                  <span>Shows Blood Group, Known Allergies, Stents, & Critical Drugs</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Emergency Contact Linkage</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  The break-glass screen displays one-tap dial buttons for your primary emergency contacts (family members, spouse, or adult children).
                </p>
                <div className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                  <span>Instant Family SMS & Notification Alerts</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Facility Discovery & Triage</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  Find participating network hospitals near your location with 24x7 casualty, ICU facilities, and blood banks.
                </p>
                <div className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                  <span>Filter by Trauma, Cardiac, or Pediatric ICUs</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Immutable Audit Logging</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  Every break-glass access event is logged with IP address, device telemetry, and exact timestamp to ensure complete anti-abuse accountability.
                </p>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <span>Strict DPDP Act Emergency Exception Governance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Break-Glass QR Preview link */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-base sm:text-lg font-bold">Want to see what an emergency scanner sees?</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Inspect a real-time preview of the minimal, non-sensitive break-glass view rendered when a responder scans your card.
              </p>
            </div>
            <Link
              href="/emergency-preview"
              className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs sm:text-sm transition-all shrink-0"
            >
              Test Break-Glass View
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
