import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Worksite & Community Health Camps | AHCS',
  description: 'Organize verified preventive health screening camps for corporate workplaces, factories, and residential communities.',
};

export default function HealthCampsPage() {
  const campTypes = [
    {
      title: 'Corporate Employee Health Camp',
      target: 'IT Parks, Offices & Startups',
      description: 'Comprehensive screening tailored for desk workers: ergonomic posture screening, lipid profiles, eye strain checks, and stress assessments.',
      deliverables: ['Custom corporate dashboard', 'Onsite general physician', 'Instant digital reports', 'Aggregate health risk index']
    },
    {
      title: 'Industrial & Factory Occupational Camp',
      target: 'Manufacturing, Warehouses & Plants',
      description: 'Periodic statutory medical examinations, pulmonary function tests (PFT), audiometry hearing tests, and toxicology blood tests.',
      deliverables: ['Form 32 / Factory compliance ready', 'Certified occupational health physicians', 'Batch medical certificates', 'Shift-compatible scheduling']
    },
    {
      title: 'Residential Society Wellness Drive',
      target: 'Gated Communities & Apartment Complexes',
      description: 'Family-friendly weekend health camps focusing on senior citizen cardiac health, pediatric growth milestones, and women’s bone density screenings.',
      deliverables: ['Multi-specialist doctor counters', 'Senior citizen mobility check', 'Diet & lifestyle consultation', 'Community health report']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
              <Users className="w-4 h-4" />
              <span>Preventive Healthcare Programs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Worksite & Community Preventive Health Camps
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Empower your employees and residents with turnkey medical screening drives conducted by certified doctors, licensed technicians, and digital record vaulting.
            </p>
          </div>
        </section>

        {/* Camp Types */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Customized Healthcare Drive Formats</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Select the camp program designed for your workforce or community demographics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {campTypes.map((camp, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 mb-3 inline-block">
                    {camp.target}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {camp.description}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                    <div className="text-xs font-semibold text-slate-700">Drive Deliverables:</div>
                    {camp.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/services/mobile-medical"
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Request This Camp</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Corporate inquiries banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Need a Long-Term Corporate Health Plan?</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Explore our corporate healthcare access tiers featuring pre-employment health checks, employee health cards, and emergency coverage coordination.
              </p>
            </div>
            <Link
              href="/corporate"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shrink-0"
            >
              Explore Corporate Solutions
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
