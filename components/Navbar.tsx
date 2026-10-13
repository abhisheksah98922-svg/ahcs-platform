'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

  return (
    <>
      {/* 1. TOP UTILITY TAPE: Trust, Security Protocol, Helpline */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="hidden sm:inline font-mono">AHCS CORE LEDGER:</span>
              <span className="text-emerald-400 font-semibold">100% OPERATIONAL</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>AES-256 Vault Encryption</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/verify"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Search className="w-3 h-3 text-sky-400" />
              <span className="font-semibold">Verify Any Card</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/emergency-preview"
              className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>Break-Glass Emergency</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN FLOATING-STYLE PROFESSIONAL HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo with Premium Badge Look */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-[#0f3b56] to-sky-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-sky-950/20 group-hover:scale-105 transition-transform duration-200 border border-sky-400/30">
                A
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                    AHCS
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
                    Smart Card
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                  Advanced Health Care System
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-semibold text-slate-700">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/health-card"
                className="px-3 py-2 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Smart Health Card</span>
              </Link>
              <Link
                href="/how-it-works"
                className="px-3 py-2 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="px-3 py-2 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors"
              >
                Plans & Pricing
              </Link>
              <Link
                href="/network"
                className="px-3 py-2 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors"
              >
                Network
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-lg hover:text-blue-700 hover:bg-slate-50 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Right CTAs */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-800 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/apply"
                className="relative inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-700/25 hover:shadow-lg hover:shadow-blue-700/35 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span>Get Health Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/apply"
                className="text-xs font-bold text-white bg-blue-700 px-3.5 py-1.5 rounded-lg shadow-xs"
              >
                Get Card
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-6 space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/health-card"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Smart Card</span>
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                Plans & Pricing
              </Link>
              <Link
                href="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                Verify Card
              </Link>
              <Link
                href="/emergency-preview"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-rose-50 text-rose-700 transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Emergency QR</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
              >
                Member Sign In
              </Link>
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-700/20"
              >
                Apply for Smart Health Card →
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
