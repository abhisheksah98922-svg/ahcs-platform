import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Users,
  Building2,
  ArrowRight,
  Lock,
  Sparkles,
  HeartPulse,
  Activity,
  PhoneCall,
  FileCheck2,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const metadata = {
  title: 'Membership Packages & Transparent Pricing | AHCS',
  description:
    'Explore AHCS healthcare access and identity membership packages. Transparent annual pricing, no insurance exclusions, and direct emergency break-glass protection.',
};

export default function MembershipPage() {
  const packages = [
    {
      id: 'individual',
      name: 'Individual Membership',
      tagline: 'Personal Digital Identity & Smart Card',
      price: '₹499',
      period: 'per year',
      badge: 'Most Popular',
      popular: true,
      description:
        'Standard healthcare access and tamper-evident identity for working professionals, students, and independent adults.',
      features: [
        '1 Verified Permanent AHCS Client ID (ISO/IEC 7064 check)',
        '1 Physical ID-1 Frosted Smart Health Card (NFC + QR)',
        'Free Doorstep Tracked Delivery Across India',
        'Break-Glass Emergency Vitals Profile (Accessible 24/7)',
        'Encrypted Health Records Vault (Up to 250 documents)',
        'Instant 1-Click Card Freeze & Token Rotation from Dashboard',
        'Standard Email & In-App Support Desk (24-48 hr response)',
      ],
      cta: 'Choose Individual',
      href: '/apply?plan=individual',
    },
    {
      id: 'family',
      name: 'Family Membership',
      tagline: 'Unified Protection for Up to 5 Members',
      price: '₹1,499',
      period: 'per year',
      badge: 'Best Family Value',
      popular: false,
      description:
        'Consolidated health identity management covering parents, spouse, children, and elderly dependents under a single family portal.',
      features: [
        'Up to 5 Verified AHCS Client IDs under 1 Family Manager',
        '5 Physical Smart Cards Delivered in Custom Family Presentation Case',
        'Unified Emergency Contact Broadcast (Simultaneous SMS alerts to all guardians)',
        'Child Immunization Schedule & Senior Vitals Tracking',
        'Patient-Directed Consent Proxy for Minors & Elderly Parents',
        'Shared Encrypted Records Vault (Up to 1,000 documents)',
        'Dedicated Family Relationship Support Desk',
      ],
      cta: 'Choose Family',
      href: '/apply?plan=family',
    },
    {
      id: 'emergency',
      name: 'Emergency Assistance',
      tagline: 'High-Priority Critical Care Protocol',
      price: '₹899',
      period: 'per year',
      badge: 'Critical Care Priority',
      popular: false,
      description:
        'Tailored for frequent travelers, senior citizens, and patients with high-risk cardiovascular, diabetes, or severe allergy histories.',
      features: [
        'Priority Break-Glass Emergency Gateway with Instant Automated SMS Dispatch',
        'Dual Physical Card + High-Contrast Medical Alert Tag',
        'Allergy, Implant & Blood Group Critical Verification Badge',
        '24/7 Dedicated Emergency Coordination Helpline Assistance',
        'Automated Hospital Admission Demographic & Vitals Export',
        'Rapid Card Replacement Guarantee in under 72 hours',
        'Continuous Emergency Contact Validity Verification',
      ],
      cta: 'Choose Emergency',
      href: '/apply?plan=emergency',
    },
    {
      id: 'preventive',
      name: 'Preventive Healthcare',
      tagline: 'Proactive Health & Diagnostic Tracking',
      price: '₹1,999',
      period: 'per year',
      badge: 'Complete Wellness',
      popular: false,
      description:
        'For individuals and families dedicated to routine health screenings, chronic vitals trending, and early clinical detection.',
      features: [
        'All Individual Membership features included',
        'Annual Preventive Health Profile Audit & Vitals Summary',
        'Automated Diagnostic Trend Visualizer (BP, Blood Glucose, Lipid Panels)',
        'Network Partner Diagnostic Concessions (15%–30% at verified labs)',
        'Digital Vaccination & Health Screening Calendar Reminders',
        'Emergency Break-Glass Gateway with Complete Medication History',
        'Priority Technical & Member Support Concierge',
      ],
      cta: 'Choose Preventive',
      href: '/apply?plan=preventive',
    },
    {
      id: 'corporate',
      name: 'Corporate Healthcare',
      tagline: 'Enterprise Workforce Health Identity',
      price: '₹399',
      period: 'per employee / year (Min. 25)',
      badge: 'Enterprise Compliance',
      popular: false,
      description:
        'Turnkey health identity, occupational compliance, and emergency security infrastructure for startups, MSMEs, and enterprises.',
      features: [
        'Bulk Digital & Physical Smart Card Issuance with Optional Co-Branding',
        'Centralized HR Administrative Console with CSV Roster Onboarding',
        'Field Staff & Office Employee Break-Glass Emergency Protection',
        'India DPDP Act 2023 Enterprise Data Processing Agreement',
        'Annual Corporate Health Check-Up Logistics Support',
        'Dedicated Corporate Account Manager & Priority Enterprise SLA',
        'Secure API Integration for Internal HRMS Directory Sync',
      ],
      cta: 'Contact Corporate Desk',
      href: '/contact?inquiry=corporate',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* 1. HERO SECTION */}
      <section className="bg-[#102A43] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#0B1D2F]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1769AA]/30 text-[#36C5D8] text-xs font-semibold border border-[#2389D7]/30">
            <CreditCard className="w-4 h-4" />
            <span>Transparent Health Identity Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            AHCS Healthcare Access & Membership Packages
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Standardized annual memberships designed for verified healthcare identity, digital health records, and emergency break-glass protection. Straightforward benefits with zero hidden exclusions.
          </p>
        </div>
      </section>

      {/* 2. STATUTORY DEMARCATION BANNER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-xs text-[#66788A] leading-relaxed">
            <strong className="text-[#172B4D] font-bold block text-sm mb-0.5">
              Transparent Access Membership — Not Health Insurance
            </strong>
            AHCS is an independent technology infrastructure provider. Our memberships cover identity verification, physical and digital Smart Card issuance, encrypted vault storage, and emergency break-glass communication. AHCS does not underwrite financial claims, reimburse medical bills, or replace private or government health insurance.
          </div>
        </div>
      </div>

      {/* 3. PACKAGES GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1769AA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Annual Membership Tiers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172B4D] mt-3">
              Choose the Plan That Fits Your Healthcare Life
            </h2>
            <p className="text-xs sm:text-sm text-[#66788A] mt-2">
              All plans include official verification, ISO/IEC 7064 Client ID issuance, and our tamper-evident break-glass emergency system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between p-6 sm:p-8 ${
                    pkg.popular
                      ? 'border-[#1769AA] ring-2 ring-[#1769AA]/20 shadow-md relative'
                      : 'border-[#DFE7F0] shadow-xs hover:border-[#1769AA]/50'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1769AA] text-white text-[11px] font-bold uppercase px-3 py-0.5 rounded-full shadow-xs">
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA]">
                        {pkg.tagline}
                      </span>
                      {!pkg.popular && (
                        <span className="text-[10px] font-semibold text-[#66788A] bg-[#F5F8FC] px-2 py-0.5 rounded border border-[#DFE7F0]">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#172B4D] mb-3">{pkg.name}</h3>

                    <div className="flex items-baseline gap-1.5 mb-4 pb-4 border-b border-[#DFE7F0]">
                      <span className="text-3xl sm:text-4xl font-black text-[#102A43]">{pkg.price}</span>
                      <span className="text-xs text-[#66788A] font-medium">{pkg.period}</span>
                    </div>

                    <p className="text-xs text-[#66788A] leading-relaxed mb-6">
                      {pkg.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      <span className="text-[11px] font-bold text-[#172B4D] uppercase tracking-wider block">
                        Included Features:
                      </span>
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#172B4D]">
                          <CheckCircle2 className="w-4 h-4 text-[#16865C] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={pkg.href}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      pkg.popular
                        ? 'bg-[#102A43] hover:bg-[#1769AA] text-white shadow-sm'
                        : 'bg-[#F5F8FC] hover:bg-[#102A43] text-[#172B4D] hover:text-white border border-[#DFE7F0]'
                    }`}
                  >
                    <span>{pkg.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. COMPREHENSIVE COMPARISON TABLE */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#172B4D]">Feature-by-Feature Matrix</h3>
            <p className="text-xs text-[#66788A] mt-1">
              Compare package entitlements transparently. No asterisks, no surprise fees.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DFE7F0] bg-[#F5F8FC]/70">
                  <th className="py-3.5 px-4 font-bold text-[#102A43]">Feature / Capability</th>
                  <th className="py-3.5 px-3 font-semibold text-[#172B4D] text-center">Individual</th>
                  <th className="py-3.5 px-3 font-semibold text-[#172B4D] text-center">Family</th>
                  <th className="py-3.5 px-3 font-semibold text-[#172B4D] text-center">Emergency</th>
                  <th className="py-3.5 px-3 font-semibold text-[#172B4D] text-center">Preventive</th>
                  <th className="py-3.5 px-3 font-semibold text-[#172B4D] text-center">Corporate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE7F0] text-[#172B4D]">
                <tr>
                  <td className="py-3.5 px-4 font-medium">Permanent ISO/IEC 7064 Client ID</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">1 Member</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">Up to 5</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">1 Member</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">1 Member</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">Bulk Roster</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Physical Frosted Smart Card (NFC + QR)</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">1 Card</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">5 Cards</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">Card + Alert Tag</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">1 Card</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">All Employees</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Break-Glass Emergency Vitals Gateway</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓ (Multi-Alert)</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓ (Priority SMS)</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Encrypted Medical Records Vault</td>
                  <td className="py-3.5 px-3 text-center">250 records</td>
                  <td className="py-3.5 px-3 text-center">1,000 records</td>
                  <td className="py-3.5 px-3 text-center">250 records</td>
                  <td className="py-3.5 px-3 text-center font-bold text-[#16865C]">Unlimited</td>
                  <td className="py-3.5 px-3 text-center">Enterprise Pool</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Diagnostic Trend Analytics & Charts</td>
                  <td className="py-3.5 px-3 text-center text-[#66788A]">—</td>
                  <td className="py-3.5 px-3 text-center text-[#66788A]">—</td>
                  <td className="py-3.5 px-3 text-center text-[#66788A]">—</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓ Full Suite</td>
                  <td className="py-3.5 px-3 text-center text-[#66788A]">Optional</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">1-Click Card Freeze & Invalidation</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">✓ (Central HR)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Dedicated Support SLA</td>
                  <td className="py-3.5 px-3 text-center text-[#66788A]">Standard (48h)</td>
                  <td className="py-3.5 px-3 text-center text-[#172B4D] font-medium">Priority (24h)</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">24/7 Hotline</td>
                  <td className="py-3.5 px-3 text-center text-[#172B4D] font-medium">Concierge (12h)</td>
                  <td className="py-3.5 px-3 text-center text-[#16865C] font-bold">Enterprise AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. MEMBERSHIP FREQUENTLY ASKED QUESTIONS */}
        <div className="bg-white rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-[#172B4D]">
              Frequently Asked Questions About Membership
            </h3>
            <p className="text-xs text-[#66788A] mt-1">
              Clear answers regarding payment, renewal, physical delivery, and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] space-y-2">
              <h4 className="text-xs font-bold text-[#102A43] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#1769AA] shrink-0" />
                <span>Does AHCS replace my health insurance policy?</span>
              </h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                No. AHCS is a private healthcare identification, card verification, and emergency access platform. We do not underwrite insurance risk or reimburse hospital bills. We recommend maintaining an active health insurance policy alongside AHCS.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] space-y-2">
              <h4 className="text-xs font-bold text-[#102A43] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#1769AA] shrink-0" />
                <span>How long does physical card delivery take?</span>
              </h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                Once your submitted identity documents are verified by our desk (typically within 24 to 48 hours), your card is laser-engraved and dispatched via tracked courier. Transit typically takes 3 to 7 business days depending on your postal PIN code.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] space-y-2">
              <h4 className="text-xs font-bold text-[#102A43] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#1769AA] shrink-0" />
                <span>What happens if I lose my physical Smart Card?</span>
              </h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                You can immediately log into your member dashboard and click &quot;Freeze Card&quot; to instantly invalidate the public QR and NFC token. A replacement card can be ordered directly from your portal at a nominal re-issuance fee.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F8FC] border border-[#DFE7F0] space-y-2">
              <h4 className="text-xs font-bold text-[#102A43] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#1769AA] shrink-0" />
                <span>Is my medical information shared or sold?</span>
              </h4>
              <p className="text-xs text-[#66788A] leading-relaxed">
                Never. AHCS strictly operates under the India Digital Personal Data Protection (DPDP) Act 2023. We do not sell data to insurance underwriters, pharmaceutical companies, or third-party advertisers. Only you control who accesses your medical records.
              </p>
            </div>
          </div>
        </div>

        {/* 6. CALL TO ACTION */}
        <div className="bg-[#102A43] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm border border-[#0B1D2F]">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Secure Your Healthcare Identity?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join thousands of citizens who have protected their emergency vitals and unified their healthcare records with AHCS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/apply"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-white text-[#102A43] hover:bg-slate-100 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Create Your Health ID</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-[#1769AA] text-white hover:bg-[#2389D7] transition-all flex items-center justify-center gap-2"
            >
              <span>Inquire for Family / Corporate</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
