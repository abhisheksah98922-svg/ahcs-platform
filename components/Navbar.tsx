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
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-[#0f3b56] text-white flex items-center justify-center font-bold text-sm tracking-wide">
              A
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 leading-none">
                AHCS
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                Advanced Health Care System
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </Link>
            <Link href="/health-card" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Smart Health Card</span>
            </Link>
            <Link href="/verify" className="hover:text-slate-900 transition-colors">
              Verify Card
            </Link>
            <Link href="/emergency-preview" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Emergency Access</span>
            </Link>
          </nav>

          {/* Desktop Right CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/apply"
              className="text-xs font-medium text-white bg-[#0f3b56] hover:bg-[#092132] px-4 py-2 rounded-md transition-colors flex items-center gap-1.5"
            >
              <span>Get Client ID</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="sm:hidden text-xs font-medium text-white bg-[#0f3b56] px-3 py-1.5 rounded-md"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 px-2 space-y-3 bg-white">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              How It Works
            </Link>
            <Link
              href="/health-card"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              Smart Health Card
            </Link>
            <Link
              href="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              Verify Card Authenticity
            </Link>
            <Link
              href="/emergency-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded"
            >
              Emergency Access
            </Link>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-medium border border-slate-300 rounded text-slate-700"
              >
                Sign In
              </Link>
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-medium bg-[#0f3b56] text-white rounded"
              >
                Get Client ID
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
