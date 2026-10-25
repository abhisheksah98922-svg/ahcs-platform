'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Search,
  Lock,
  Sparkles,
  PhoneCall,
  Activity,
  Layers,
  FileCheck2,
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Smart Health Card', href: '/health-card' },
    { label: 'Healthcare Network', href: '/network' },
    { label: 'Security', href: '/security' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 1. TOP UTILITY TAPE: Trust, Security Protocol, Verification */}
      <div className="bg-[#102A43] text-slate-300 text-[11px] font-medium border-b border-[#0B1D2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16835F] animate-pulse inline-block" />
              <span className="hidden sm:inline font-mono text-[10px] text-slate-400">LEDGER STATUS:</span>
              <span className="text-[#13BBA4] font-semibold text-[11px]">ACTIVE & AUDITED</span>
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400 text-[11px]">
              <Lock className="w-3 h-3 text-[#13BBA4]" />
              <span>AES-256 Vault-Isolated</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/verify"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              <Search className="w-3 h-3 text-[#2884CD]" />
              <span className="font-medium">Verify Card</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/emergency-preview"
              className="text-rose-300 hover:text-white transition-colors flex items-center gap-1 font-medium text-[11px]"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>Emergency Gateway</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN PROFESSIONAL HEALTHCARE HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DFE7F0] shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo with Restrained Medical Authority */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#102A43] text-white flex items-center justify-center font-black text-lg shadow-sm border border-[#1769AA]/30 group-hover:bg-[#1769AA] transition-colors">
                A
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-[#102A43] tracking-tight leading-none group-hover:text-[#1769AA] transition-colors">
                    AHCS
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[#F5F8FC] text-[#1769AA] border border-[#DFE7F0]">
                    Health Identity
                  </span>
                </div>
                <span className="text-[10px] text-[#62748A] font-medium tracking-tight mt-0.5">
                  Advanced Health Care System
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-[#172B4D]">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'text-[#1769AA] bg-[#F5F8FC] font-bold'
                        : 'text-[#172B4D] hover:text-[#1769AA] hover:bg-[#F5F8FC]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right CTAs */}
            <div className="hidden sm:flex items-center space-x-2.5">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#172B4D] hover:text-[#1769AA] px-3.5 py-2 rounded-lg hover:bg-[#F5F8FC] transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/apply"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#102A43] hover:bg-[#1769AA] px-4 py-2.5 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/apply"
                className="text-xs font-bold text-white bg-[#102A43] px-3 py-1.5 rounded-lg shadow-xs sm:hidden"
              >
                Get Started
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#172B4D] hover:bg-[#F5F8FC] border border-[#DFE7F0] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#DFE7F0] bg-white px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                      active
                        ? 'bg-[#F5F8FC] text-[#1769AA] font-bold'
                        : 'text-[#172B4D] hover:bg-[#F5F8FC] hover:text-[#1769AA]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-[#62748A]">→</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#DFE7F0] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-semibold text-[#172B4D] bg-[#F5F8FC] rounded-xl border border-[#DFE7F0]"
              >
                Sign In
              </Link>
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#102A43] hover:bg-[#1769AA] rounded-xl shadow-sm"
              >
                Create Account (Get Started)
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
