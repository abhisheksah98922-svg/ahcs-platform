import React from 'react';
import Link from 'next/link';
import { 
  Video, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Telemedicine Consultations | AHCS',
  description: 'Verified tele-consultations connected to your AHCS Client ID and encrypted health records.',
};

export default function TelemedicinePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <Video className="w-4 h-4" />
              <span>Digital Health Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Encrypted Telemedicine & Remote Consultations
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Connect directly with verified medical specialists through high-definition encrypted video, with automated prescription syncing to your AHCS Health Vault.
            </p>
          </div>
        </section>

        {/* Status Notice */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-1">
                  <span>Network Rollout In Progress</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Certified Tele-Consultation Partner Onboarding
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  We are currently onboarding MCI/NMC-registered practitioners adhering to the Telemedicine Practice Guidelines of India. In-person clinics and hospital consultations remain active today.
                </p>
              </div>
            </div>
            <Link
              href="/providers"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0"
            >
              Find In-Person Doctors
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Consent-Driven History</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The doctor only sees medical records you explicitly authorize for the duration of the consultation. Access automatically expires after the session.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Digitally Signed Prescriptions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every consultation concludes with a compliant digital prescription bearing the doctor&apos;s registration number, saved instantly into your records.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Multi-Specialty Access</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect with general physicians, pediatricians, dermatologists, psychologists, and nutritionists without physical travel barriers.
              </p>
            </div>
          </div>

          {/* Clinical emergency disclaimer */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-rose-900 leading-relaxed">
              <strong>Emergency Warning:</strong> Telemedicine is suitable for follow-ups, minor ailments, and non-emergency second opinions. Never use remote consultations for acute chest pain, uncontrolled hemorrhage, loss of consciousness, stroke symptoms, or severe trauma. Call 112 or visit the nearest emergency trauma center immediately.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
