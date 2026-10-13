import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://ahcs.in'),
  title: {
    default: 'AHCS — Advanced Health Care System | Private Healthcare Identity & Smart Card',
    template: '%s | AHCS',
  },
  description:
    'AHCS is an independent, private healthcare identity, card verification, and emergency access platform. Not a government agency or insurance scheme.',
  keywords: [
    'AHCS',
    'Health Card',
    'Private Healthcare Identity',
    'Emergency Health QR',
    'Client ID',
    'Health Record Management',
  ],
  authors: [{ name: 'AHCS Technical Team' }],
  creator: 'AHCS',
  publisher: 'AHCS',
  alternates: {
    canonical: 'https://ahcs.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ahcs.in',
    title: 'AHCS — Private Healthcare Identity & Smart Health Card',
    description:
      'Independent private healthcare identity, verified smart health card, and emergency break-glass records platform.',
    siteName: 'AHCS',
  },
  twitter: {
    card: 'summary',
    title: 'AHCS — Private Healthcare Identity Platform',
    description:
      'Independent private healthcare identity, verified smart health card, and emergency break-glass records platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#0a0f1d] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
