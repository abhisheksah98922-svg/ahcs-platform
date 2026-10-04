import React from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Home, 
  Video, 
  FlaskConical, 
  Pill, 
  Users, 
  HeartHandshake, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export const metadata = {
  title: 'Healthcare Services Network | AHCS',
  description: 'Explore the AHCS connected healthcare services network: partner clinics, diagnostic labs, pharmacies, mobile medical units, and home care.',
};

export default function ServicesHubPage() {
  const services = [
    {
      title: 'Partner Clinics & Hospitals',
      href: '/providers',
      icon: Stethoscope,
      badge: 'Active Network',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Consultation benefits, priority access, and seamless digital record sharing across verified partner healthcare facilities.',
      highlights: ['Outpatient consultation concessions', 'Verified clinical credentials', 'Digital consent-driven health records'],
      cta: 'Explore Providers'
    },
    {
      title: 'Mobile Medical Units',
      href: '/services/mobile-medical',
      icon: Truck,
      badge: 'Request Service',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Fully equipped mobile healthcare vans providing worksite health checkups, rural screenings, and community camps.',
      highlights: ['On-site basic vitals & ECG', 'Dedicated medical team', 'Corporate & NGO deployments'],
      cta: 'Book Mobile Unit'
    },
    {
      title: 'Home Healthcare & Nursing',
      href: '/services/home-care',
      icon: Home,
      badge: 'Request Service',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'Verified professional home nursing, post-operative care, elderly patient assistance, and home lab sample collections.',
      highlights: ['Verified nursing staff', 'Wound dressing & IV therapy', 'Elder care companionship'],
      cta: 'Request Home Care'
    },
    {
      title: 'Diagnostic Labs & Imaging',
      href: '/services/diagnostics',
      icon: FlaskConical,
      badge: 'Partner Network',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      description: 'Transparent rates on pathology tests, blood panels, and imaging scans through NABL-accredited diagnostic partners.',
      highlights: ['Pathology & biochemistry panels', 'Digital report delivery to vault', 'Discounted partner pricing'],
      cta: 'View Diagnostic Tests'
    },
    {
      title: 'Partner Pharmacy Network',
      href: '/services/pharmacy',
      icon: Pill,
      badge: 'Partner Network',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Authentic prescription medicines with member savings across verified retail pharmacies and certified online delivery partners.',
      highlights: ['100% genuine medicines', 'E-prescription sync', 'Chronic refill reminders'],
      cta: 'Explore Pharmacy Perks'
    },
    {
      title: 'Telemedicine Consultations',
      href: '/services/telemedicine',
      icon: Video,
      badge: 'Coming Soon',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
      description: 'Secure, encrypted video consultations with registered medical practitioners across multi-specialty care domains.',
      highlights: ['Scheduled video calls', 'Digital prescription issued', 'End-to-end encrypted room'],
      cta: 'Learn More'
    },
    {
      title: 'Worksite & Community Camps',
      href: '/services/health-camps',
      icon: Users,
      badge: 'Corporate / Society',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Structured preventive health screening programs tailored for corporate offices, factory premises, and residential societies.',
      highlights: ['Customizable diagnostic panels', 'Aggregate wellness analytics', 'Doctor consultation on site'],
      cta: 'Plan a Health Camp'
    },
    {
      title: 'Senior & Chronic Care',
      href: '/services/senior-care',
      icon: HeartHandshake,
      badge: 'Assisted Program',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Dedicated monitoring and compassionate coordination for elderly family members dealing with hypertension, diabetes, and mobility issues.',
      highlights: ['Assigned care coordinators', 'Routine vitals logging', 'Emergency contact linkage'],
      cta: 'View Senior Care'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>AHCS Coordinated Care Ecosystem</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              One Verified Network. Multiple Ways to Access Care.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              AHCS connects you directly to verified partner hospitals, diagnostic facilities, pharmacy networks, home caregivers, and mobile health units through your AHCS Client ID.
            </p>

            {/* Disclaimer strip */}
            <div className="mt-8 flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 max-w-3xl">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Platform Notice:</strong> AHCS is a private healthcare access and assistance network. AHCS does not operate hospitals or manufacture pharmaceuticals. All clinical diagnoses and treatments are performed independently by licensed partner healthcare practitioners.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
              Choose from our verified partner network programs designed to make quality healthcare accessible, organized, and accountable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between p-6 sm:p-7"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                      {item.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 transition-all group"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Corporate & Partner CTA banner */}
        <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Are you a Healthcare Provider or Corporate Employer?
              </h3>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Join the verified AHCS healthcare access network to deliver cashless benefits, streamline patient identity, and organize worksite wellness programs.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/partner"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/30"
              >
                Join as Provider
              </Link>
              <Link
                href="/corporate"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/15 transition-all"
              >
                Corporate Plans
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
