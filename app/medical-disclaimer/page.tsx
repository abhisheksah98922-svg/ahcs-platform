import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck, Stethoscope, PhoneCall, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Clinical & Medical Disclaimer | AHCS',
  description: 'Important legal and clinical disclaimers regarding the AHCS healthcare access network.',
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
              <span>Legal & Clinical Scope</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Medical & Clinical Disclaimer
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Please read this clinical notice carefully before utilizing AHCS digital services, identity credentials, or partner network healthcare programs.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Emergency Alert Box */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 mb-10 flex items-start gap-4">
            <PhoneCall className="w-8 h-8 text-rose-600 shrink-0 mt-1" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-rose-950 mb-1">
                IN A MEDICAL EMERGENCY, CALL 112 IMMEDIATELY
              </h2>
              <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                AHCS is an access network and digital record repository, NOT an emergency response dispatcher or primary ambulance provider. If you or someone around you is experiencing chest pain, acute shortness of breath, severe hemorrhage, head trauma, or sudden paralysis, please dial national emergency services (112 / 108) or proceed immediately to the nearest casualty / trauma hospital.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8 text-slate-800 text-xs sm:text-sm leading-relaxed">
            <section>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">1. No Medical Advice or Primary Care Delivery</h3>
              <p className="text-slate-600">
                The information, software tools, digital dashboards, summaries, and materials provided by Advanced Health Care System (&ldquo;AHCS&rdquo;) are for informational, organizational, and healthcare facilitation purposes only. Nothing contained on the AHCS website, mobile applications, or health cards constitutes medical advice, clinical diagnosis, prognosis, or therapeutic recommendation.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">2. Independent Doctor-Patient Relationship</h3>
              <p className="text-slate-600">
                Any consultation, physical examination, prescription, or clinical decision made by a healthcare provider found through the AHCS directory is solely between the licensed practitioner and the patient. AHCS does not employ participating hospital clinicians, nor does it control or supervise the medical judgment of independent registered doctors.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">3. No Guaranteed Bed Admission or Treatment Outcome</h3>
              <p className="text-slate-600">
                Holding an AHCS Smart Card, Client ID, or active membership does NOT guarantee hospital bed availability, priority intensive care admission, or specific clinical outcomes. Hospital admissions, triaging, and emergency ward acceptance are governed strictly by the treating hospital&apos;s clinical protocol and bed capacity at the time of presentation.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">4. Non-Insurance Demarcation</h3>
              <p className="text-slate-600">
                AHCS is NOT an insurance company, insurance broker, or corporate agent under the Insurance Regulatory and Development Authority of India (IRDAI). AHCS plans are membership and service coordination products. Concessions offered by network providers are negotiated discounts and do not constitute insurance reimbursement or risk indemnity.
              </p>
            </section>

            <section>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">5. Accuracy of Patient-Supplied Health Data</h3>
              <p className="text-slate-600">
                Users are solely responsible for verifying the accuracy of personal medical information entered in their Emergency Profile (including known drug allergies, blood group, current maintenance medications, and emergency contacts). AHCS is not liable for clinical complications arising from incorrect or outdated medical records supplied by the user.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            Last Reviewed & Updated: January 2026 | Legal & Clinical Compliance Board
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
