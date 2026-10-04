'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Truck, 
  Home, 
  FlaskConical, 
  Video, 
  Users, 
  HeartHandshake, 
  ShieldAlert, 
  CreditCard, 
  Search, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const servicesList = [
    { title: 'Mobile Medical Units', desc: 'On-site medical vans & camps', href: '/services/mobile-medical', icon: Truck },
    { title: 'Home Healthcare', desc: 'Verified home nursing & elder care', href: '/services/home-care', icon: Home },
    { title: 'Diagnostics & Labs', desc: 'Pathology & sample collection', href: '/services/diagnostics', icon: FlaskConical },
    { title: 'Telemedicine', desc: 'Remote doctor consultations', href: '/services/telemedicine', icon: Video },
    { title: 'Health Camps', desc: 'Worksite & community drives', href: '/services/health-camps', icon: Users },
    { title: 'Senior Care', desc: 'Assisted care & vitals monitoring', href: '/services/senior-care', icon: HeartHandshake },
    { title: 'Emergency Assistance', desc: 'Break-glass access & facility discovery', href: '/emergency', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow-xs" fill="none">
                <path
                  d="M24 42s-15-9.3-19-19.4C1 12.5 9.5 4 19.5 7.5 22 8.4 24 11 24 11s2-2.6 4.5-3.5c10-3.5 18.5 5 14.5 15.1C39 32.7 24 42 24 42z"
                  fill="#1E40AF"
                />
                <rect x="21" y="16" width="6" height="16" rx="2" fill="white" />
                <rect x="16" y="21" width="16" height="6" rx="2" fill="white" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-blue-700 leading-none">
                AHCS
              </div>
              <div className="text-[10px] text-slate-500 font-semibold tracking-tight mt-0.5 uppercase">
                Healthcare Access Network
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-5 text-[13px] font-semibold text-slate-700">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Care Coordination Services
                  </div>
                  {servicesList.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setServicesDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-700 flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="pt-2 mt-1 border-t border-slate-100 px-3">
                    <Link
                      href="/services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-between py-1"
                    >
                      <span>View All Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/find-care" className="hover:text-blue-600 transition-colors">
              Find Care
            </Link>
            <Link href="/network" className="hover:text-blue-600 transition-colors">
              Network
            </Link>
            <Link href="/smart-card" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Smart Card</span>
            </Link>
            <Link href="/plans" className="hover:text-blue-600 transition-colors">
              Plans
            </Link>
            <Link href="/corporate" className="hover:text-blue-600 transition-colors">
              Corporate
            </Link>
            <Link href="/partner" className="hover:text-blue-600 transition-colors">
              Partner With Us
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Right CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 border border-blue-600/40 hover:border-blue-700 px-5 py-2.5 rounded-full transition-all"
            >
              Login
            </Link>

            <Link
              href="/apply"
              className="text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 rounded-full shadow-md shadow-blue-700/20 transition-all flex items-center gap-1.5"
            >
              <span>Get AHCS ID</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              href="/apply"
              className="sm:hidden text-xs font-bold text-white bg-blue-700 px-3.5 py-1.5 rounded-full shadow-xs"
            >
              Get ID
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto">
          {/* Services Accordion */}
          <div>
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 border-b border-slate-100"
            >
              <span>Healthcare Services</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
            </button>
            {mobileServicesOpen && (
              <div className="pl-3 py-2 space-y-2 border-b border-slate-100 bg-slate-50/50 rounded-xl my-1">
                {servicesList.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs font-semibold text-slate-700 hover:text-blue-600 py-1"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/find-care"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Find Care
          </Link>

          <Link
            href="/network"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Network Providers
          </Link>

          <Link
            href="/smart-card"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Smart Health Card
          </Link>

          <Link
            href="/plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Membership Plans
          </Link>

          <Link
            href="/corporate"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Corporate Solutions
          </Link>

          <Link
            href="/partner"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Partner With Us
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            About AHCS
          </Link>

          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-amber-700 hover:text-amber-800 border-b border-slate-100"
          >
            Verify Smart Card
          </Link>

          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-blue-600 text-blue-700 text-xs font-bold"
            >
              Sign In to Portal
            </Link>
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-700/20"
            >
              Get Your AHCS ID
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
