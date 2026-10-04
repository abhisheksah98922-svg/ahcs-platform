import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | AHCS',
  description: 'Terms regarding membership plan cancellations, card printing fee refunds, and service request reconciliations.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-950 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Refund & Cancellation Policy
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm">
              Clear and transparent guidelines regarding membership subscription refunds, physical card issuance, and service cancellations.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Digital Client ID & Basic Free Tier</h2>
              <p className="text-slate-600">
                The Basic AHCS Client ID enrollment is completely free of charge. No payment is collected and no refund terms apply.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Physical Smart Card Printing & Shipping Fee</h2>
              <p className="text-slate-600">
                Orders for physical NFC Smart Cards may be cancelled for a 100% full refund at any time prior to the physical card being personalized and dispatched via courier. Once dispatched, manufacturing and shipping costs (₹150) are non-refundable. If a card arrives physically damaged, a free replacement will be re-printed and dispatched immediately upon photo verification.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Annual Membership Cancellation</h2>
              <p className="text-slate-600">
                Members may cancel annual care plans within 14 calendar days of activation provided no network doctor discounts or diagnostic benefits have been redeemed. In such cases, a prorated refund will be initiated within 5 to 7 banking days to the original payment source.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Support & Refund Inquiries</h2>
              <p className="text-slate-600">
                To request a cancellation or refund status update, please submit a ticket through the <Link href="/contact" className="text-blue-600 underline font-semibold">Contact Support Portal</Link> or email billing@ahcs.in referencing your Order ID and Client ID.
              </p>
            </section>
          </div>
        </div>
      </main>

    </div>
  );
}
