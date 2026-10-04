import React from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  Home, 
  Phone, 
  Activity, 
  Clock, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Senior Citizen & Chronic Care Program | AHCS',
  description: 'Dedicated geriatric healthcare coordination, home nursing, emergency responder linkage, and chronic condition monitoring.',
};

export default function SeniorCarePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-500/30">
              <HeartHandshake className="w-4 h-4" />
              <span>Geriatric & Assisted Care Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Compassionate Healthcare for Seniors & Chronic Patients
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Giving aging parents the safety, medical dignity, and dedicated attention they deserve with verified home caregivers, routine vitals tracking, and 24/7 emergency contact linkage.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Assisted Home Living</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Trained compassionate attendants supporting bathing, assisted mobility, medication timing, and daily nutritional care.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Routine Vitals & Lab Checks</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Monthly home visits by trained phlebotomists for blood pressure, sugar profiles, and cardiac status tracking with doctor review.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Emergency Card Linkage</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The senior carries an AHCS Smart Card with critical allergies, existing cardiac stents/implants, and adult child contact numbers.
              </p>
            </div>
          </div>

          {/* Action callout */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Request Senior Care Assistance</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Tell us about your parent&apos;s healthcare needs, medical conditions, and preferred home care schedule.
              </p>
            </div>
            <Link
              href="/services/home-care"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shrink-0"
            >
              Book Senior Care Attendant
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
