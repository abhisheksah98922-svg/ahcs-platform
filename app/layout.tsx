import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://ahcs.in'),
  title: {
    default: 'AHCS — Advanced Health Care System | Verified Healthcare Identity & Smart Card',
    template: '%s | AHCS',
  },
  description: 'National Healthcare Identity, Verified Smart Cards, Dynamic Emergency QR, and Integrated Clinical Network in India.',
  keywords: [
    'AHCS',
    'Health Card',
    'Healthcare Identity',
    'Emergency Medical QR',
    'Ayushman Bharat Digital Health',
    'Medical Vault',
    'Doctor Portal',
    'Hospital Network India'
  ],
  authors: [{ name: 'AHCS National Health Network' }],
  creator: 'AHCS Health Authority',
  publisher: 'AHCS Inc.',
  alternates: {
    canonical: 'https://ahcs.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ahcs.in',
    title: 'AHCS — Advanced Health Care System | Verified Healthcare Identity',
    description: 'National Healthcare Identity, Verified Smart Cards, Dynamic Emergency QR, and Integrated Clinical Network in India.',
    siteName: 'AHCS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AHCS — Advanced Health Care System',
    description: 'National Healthcare Identity & Verified Smart Health Cards.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
