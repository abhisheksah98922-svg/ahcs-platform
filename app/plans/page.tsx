import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Users, 
  Compass, 
  Building2, 
  ArrowRight,
  Lock,
  Sparkles
} from 'lucide-react';

export const metadata = {
  title: 'Healthcare Access & Membership Plans | AHCS',
  description: 'Transparent healthcare access and assistance memberships for individuals, families, travellers, and corporate employers.',
};

export default function PlansPage() {
  const plans = [
    {
      name: 'Basic Digital Access',
      subtitle: 'Essential Digital Health Identity',
      price: '₹0',
      period: 'Lifetime Free',
      description: 'Permanent AHCS Client ID, digital health record vault, and basic emergency profile accessible via emergency QR.',
      features: [
        'Verified Digital AHCS Client ID',
        'Secure Emergency QR Token',
        'Encrypted Health Records Vault (Up to 100 MB)',
        'Basic Consent-Driven Doctor Access',
        'Network Directory & Walk-in Concessions'
      ],
      cta: 'Get Started Free',
      href: '/apply',
      badge: 'Public Tier',
      popular: false
    },
    {
      name: 'Individual Care Plan',
      subtitle: 'Complete Smart Health Card Access',
      price: '₹499',
      period: 'per year',
      description: 'Physical NFC-embedded Smart Card, priority consultation booking at partner clinics, and dedicated support helpline.',
      features: [
        'Everything in Basic Free',
        'Physical NFC + QR Smart Health Card Delivered',
        'Partner Clinic OPD Concessions (10-25%)',
        'Diagnostic Pathology Concessions (15-30%)',
        'Pharmacy Medicine Discounts',
        '24/7 Priority Emergency Helpline Assistance'
      ],
      cta: 'Apply for Individual Card',
      href: '/apply',
      badge: 'Most Popular',
      popular: true
    },
    {
      name: 'Family Health Shield',
      subtitle: 'Unified Access for Up to 6 Members',
      price: '₹1,299',
      period: 'per year',
      description: 'Consolidated family health management covering 2 adults and up to 4 children or elderly parents under one portal.',
      features: [
        'Up to 6 Physical Smart Cards Included',
        'Family Health Record Hierarchy & Sub-profiles',
        'Consolidated Emergency Contact Notification',
        'Annual Home Sample Collection Fee Waiver',
        'Senior Citizen Dedicated Care Coordinator'
      ],
      cta: 'Enroll Family Members',
      href: '/apply',
      badge: 'Family Value',
      popular: false
    },
    {
      name: 'Corporate Healthcare Access',
      subtitle: 'Enterprise Employee Wellness & Compliance',
      price: 'Custom',
      period: 'per employee / year',
      description: 'Comprehensive occupational health screening, on-site health camps, and centralized HR health identity management.',
      features: [
        'Tailored Worksite / Factory Health Camps',
        'Pre-Employment Medical Checkup Protocols',
        'Statutory Factory Act Form 32 Compliance',
        'Corporate HR Portal & Aggregate Risk Analytics',
        'Custom Hospital Tie-ups & Dedicated Account Manager'
      ],
      cta: 'Request Corporate Quote',
      href: '/corporate',
      badge: 'For Employers',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparent Healthcare Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Honest Healthcare Access & Assistance Memberships
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Choose the right plan to connect yourself, your family, or your workforce with verified healthcare providers and coordinated care benefits.
            </p>
          </div>
        </section>

        {/* Mandatory Regulatory & Insurance Disclaimer */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              <strong className="font-semibold">Important Regulatory Notice:</strong> AHCS is <strong>NOT an insurance company</strong> and does NOT sell health insurance policies. AHCS plans are healthcare access, assistance, and membership services that offer network concessions, digital identity cards, emergency profile access, and coordinated provider connections. AHCS does not provide risk indemnity or insurance reimbursement.
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <div 
                key={idx}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  plan.popular 
                    ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-xl' 
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      plan.popular 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                  <div className="text-xs text-slate-500 mb-4">{plan.subtitle}</div>

                  <div className="mb-4">
                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-500 ml-1.5">{plan.period}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="space-y-2.5 border-t border-slate-100 pt-4 mb-6">
                    <div className="text-xs font-semibold text-slate-800">Included Benefits:</div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={plan.href}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ Strip */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Frequently Asked Questions About Membership
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">How do I access provider concessions?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Simply present your physical AHCS Smart Card or show your digital AHCS Client ID QR on your phone at participating clinics, hospitals, or diagnostic labs at the reception.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Is this valid in government hospitals?</h4>
                <p className="text-slate-600 leading-relaxed">
                  AHCS is a private platform. In government hospitals, you can use your AHCS digital records and emergency profile for clinical history review, but government billing and statutory schemes operate under their own independent rules.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Can I add family members later?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Yes, you can enroll parents, spouses, and children directly through the Family Management tab in your member dashboard anytime.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">How is my medical data secured?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Every document is vaulted with AES-256 encryption. Doctors cannot view your past prescriptions or diagnostic reports without your explicit session consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
