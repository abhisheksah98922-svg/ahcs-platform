import React from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  Heart, 
  Bone, 
  Baby, 
  Brain, 
  Eye, 
  Sparkles, 
  Search, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Specialist Doctor Network | AHCS',
  description: 'Verified medical specialists across cardiology, orthopedics, pediatrics, neurology, and surgery with AHCS consultation concessions.',
};

export default function SpecialistsPage() {
  const specialties = [
    { name: 'Cardiology', icon: Heart, desc: 'Heart care, hypertension, echocardiography, and preventive cardiac wellness.', category: 'HOSPITAL' },
    { name: 'Orthopedics & Joint Care', icon: Bone, desc: 'Bone fractures, arthroscopy, joint replacement, and sports injury rehabilitation.', category: 'HOSPITAL' },
    { name: 'Pediatrics & Neonatal Care', icon: Baby, desc: 'Childhood vaccinations, growth milestone assessments, and pediatric illness.', category: 'CLINIC' },
    { name: 'Neurology & Neurosurgery', icon: Brain, desc: 'Headaches, epilepsy, stroke rehabilitation, and spine disorders.', category: 'HOSPITAL' },
    { name: 'General & Family Medicine', icon: Stethoscope, desc: 'Fever, diabetes management, respiratory ailments, and general wellness consultations.', category: 'CLINIC' },
    { name: 'Ophthalmology', icon: Eye, desc: 'Cataract surgery, glaucoma management, diabetic retinopathy, and vision correction.', category: 'CLINIC' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <Stethoscope className="w-4 h-4" />
              <span>Multi-Specialty Clinical Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Connect with Verified Medical Specialists
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Access credentialed medical practitioners across leading hospitals and specialized clinical centers in the AHCS network.
            </p>
          </div>
        </section>

        {/* Specialty Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {specialties.map((spec, i) => {
              const IconComp = spec.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-blue-300 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">{spec.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{spec.desc}</p>
                  </div>
                  <Link
                    href={`/providers?category=${spec.category}`}
                    className="inline-flex items-center justify-between w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 transition-all group"
                  >
                    <span>Find Specialists</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Directory CTA */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Search Complete Provider Registry</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Browse our verified database of hospitals, specialized nursing homes, and diagnostic partners by city and specialty.
              </p>
            </div>
            <Link
              href="/providers"
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shrink-0"
            >
              Browse All Providers
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
