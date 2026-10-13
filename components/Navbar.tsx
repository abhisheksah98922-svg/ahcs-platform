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
  Activity,
  Layers,
  Cpu,
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 1. TOP STATUS TICKER TAPE (Obsidian Dark with Cyan indicators) */}
      <div className="bg-[#050811] text-slate-400 text-[11px] font-mono border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse inline-block" />
              <span className="hidden sm:inline text-slate-500">LEDGER:</span>
              <span className="text-cyan-400 font-semibold tracking-wide">AHCS CORE ACTIVE</span>
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-cyan-500" />
              <span>AES-256 VAULT ENCRYPTION</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/verify"
              className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <Search className="w-3 h-3 text-cyan-400" />
              <span className="font-semibold">Verify Card</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/emergency-preview"
              className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>112 Emergency Gateway</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN OBSIDIAN & ELECTRIC CYAN HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-slate-800/90 transition-all shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo with Electric Cyber Accent */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-900 text-white flex items-center justify-center font-black text-base shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200 border border-cyan-400/40">
                A
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none group-hover:text-cyan-400 transition-colors">
                    AHCS
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    Smart Card ID
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                  Advanced Health Care System
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-semibold text-slate-300">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/health-card"
                className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Smart Health Card</span>
              </Link>
              <Link
                href="/how-it-works"
                className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              >
                Architecture
              </Link>
              <Link
                href="/pricing"
                className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              >
                Plans & Cards
              </Link>
              <Link
                href="/network"
                className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              >
                Hospital Network
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              >
                Support Desk
              </Link>
            </nav>

            {/* Desktop Right CTAs */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                Member Sign In
              </Link>

              <Link
                href="/apply"
                className="relative inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:from-cyan-300 hover:to-white px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all transform hover:-translate-y-0.5"
              >
                <Cpu className="w-3.5 h-3.5 text-slate-950" />
                <span>Get Health Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/apply"
                className="text-xs font-bold text-slate-950 bg-cyan-400 px-3 py-1.5 rounded-lg shadow-xs"
              >
                Get Card
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0a0f1d]/98 backdrop-blur-2xl px-4 py-6 space-y-4 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-cyan-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/health-card"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Smart Card</span>
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-cyan-400 transition-colors"
              >
                Architecture
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-cyan-400 transition-colors"
              >
                Plans & Pricing
              </Link>
              <Link
                href="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-cyan-400 transition-colors"
              >
                Verify Card
              </Link>
              <Link
                href="/emergency-preview"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-rose-950/60 border border-rose-900 text-rose-300 transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>112 Emergency</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200"
              >
                Member Sign In
              </Link>
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-400/25"
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
