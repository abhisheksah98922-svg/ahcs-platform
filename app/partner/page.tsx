import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Truck, 
  Home, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Lock, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const metadata = {
  title: 'Partner with AHCS | Healthcare Provider Onboarding',
  description: 'Join the AHCS verified healthcare access network as a hospital, clinic, diagnostic lab, pharmacy, or home care agency.',
};

export default function PartnerHubPage() {
  const providerCategories = [
    {
      title: 'Hospitals & Medical Centers',
      icon: Building2,
      desc: 'Inpatient and outpatient centers seeking streamlined patient identity, verified electronic health records, and emergency break-glass integration.',
      perks: ['Instant patient verification via NFC/QR', 'Direct consent-gated record lookup', 'Corporate referral network access']
    },
    {
      title: 'Clinics & Independent Practitioners',
      icon: Stethoscope,
      desc: 'Specialists, general physicians, and polyclinics looking to reduce administrative paperwork and accept verified AHCS members.',
      perks: ['Free doctor portal with digital Rx', 'Automated patient appointment schedule', 'Zero hardware investment needed']
    },
    {
      title: 'Diagnostic Laboratories & Imaging',
      icon: FlaskConical,
      desc: 'NABL-accredited pathology and radiology centers delivering test orders and automated PDF reports straight to members’ vaults.',
      perks: ['Direct digital lab test orders', 'Automated report sync to patient vault', 'Home collection logistics integration']
    },
    {
      title: 'Retail & Hospital Pharmacies',
      icon: Pill,
      desc: 'Licensed chemists verifying authentic digital prescriptions and applying member concessions seamlessly.',
      perks: ['Scan-to-verify digital prescriptions', 'Eliminate fake/altered paper scripts', 'Chronic medicine refill alerts']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Provider Partnership Ecosystem</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
              Expand Your Reach with the Verified Healthcare Access Network
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Connect your medical establishment to thousands of verified AHCS cardholders. Modernize patient onboarding, enable consent-based record sharing, and drive accountable clinical outcomes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/provider/register"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Register Your Establishment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/provider/login"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all"
              >
                Existing Provider Login
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Categories */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Who Can Partner with AHCS?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              We collaborate with licensed healthcare facilities and registered clinicians across all major Indian urban and semi-urban districts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {providerCategories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{cat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">{cat.desc}</p>

                    <div className="space-y-2.5 border-t border-slate-100 pt-4 mb-6">
                      <div className="text-xs font-semibold text-slate-800">Key Partner Advantages:</div>
                      {cat.perks.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/provider/register?category=${cat.title.includes('Hospital') ? 'HOSPITAL' : cat.title.includes('Clinic') ? 'CLINIC' : cat.title.includes('Diagnostic') ? 'DIAGNOSTIC_LAB' : 'PHARMACY'}`}
                    className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 transition-all group"
                  >
                    <span>Apply for {cat.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Compliance & Verification Process */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">The Verification Process</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Our back-office verification team authenticates documents before provider listing is approved.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-blue-800 mb-1">1. Online Application</div>
                <p className="text-slate-600 text-xs">Submit your facility registration, address proof, medical council registration, and offered specialties.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-blue-800 mb-1">2. Back-Office Scrutiny</div>
                <p className="text-slate-600 text-xs">Our verification officers validate council registration with official council registries and state lists.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="font-bold text-blue-800 mb-1">3. Live Listing & Portal Access</div>
                <p className="text-slate-600 text-xs">Upon approval, receive portal credentials, patient search terminal access, and inclusion in the public directory.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
