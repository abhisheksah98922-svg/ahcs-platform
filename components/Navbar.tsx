'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Heart + Cross Icon in Royal Blue */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-sm" fill="none">
                <path
                  d="M24 42s-15-9.3-19-19.4C1 12.5 9.5 4 19.5 7.5 22 8.4 24 11 24 11s2-2.6 4.5-3.5c10-3.5 18.5 5 14.5 15.1C39 32.7 24 42 24 42z"
                  fill="#1E40AF"
                />
                {/* White Cross */}
                <rect x="21" y="16" width="6" height="16" rx="2" fill="white" />
                <rect x="16" y="21" width="16" height="6" rx="2" fill="white" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-blue-700 leading-none">
                AHCS
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
                Advanced Health Care System
              </div>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[14px] font-medium text-slate-700">
            <Link href="/" className="text-slate-800 hover:text-blue-600 transition-colors font-semibold">
              Home
            </Link>
            <Link href="/providers" className="hover:text-blue-600 transition-colors">
              Hospitals & Labs
            </Link>
            <Link href="/provider/login" className="hover:text-teal-700 transition-colors flex items-center gap-1 font-semibold text-teal-800">
              <span>Doctor Portal</span>
            </Link>
            <Link href="/corporate" className="hover:text-blue-600 transition-colors">
              Corporate
            </Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/officer/login" className="text-amber-800 hover:text-amber-950 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 transition-colors text-xs font-mono font-bold">
              Officer Portal
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4 text-sky-500" />
                <span>{currentLang}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 text-xs font-medium z-50">
                  {['English', 'हिन्दी', 'বাংলা', 'தமிழ்', 'తెలుగు'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button (Outline Pill) */}
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 border-2 border-blue-600 hover:border-blue-700 px-6 py-2 rounded-full transition-all text-center"
            >
              Login
            </Link>

            {/* Get Started Button (Filled Royal Blue Pill) */}
            <Link
              href="/apply"
              className="text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 px-6 py-2.5 rounded-full shadow-md shadow-blue-700/20 transition-all text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
