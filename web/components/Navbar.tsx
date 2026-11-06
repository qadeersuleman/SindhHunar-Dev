'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Search, Globe, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    isRTL,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'sd', label: 'Sindhi', native: 'سنڌي' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-[#C5A059]/20 shadow-xs transition-all duration-300">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-[#800000] via-[#4A0000] to-[#800000] text-white py-1.5 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
        <span>{t.hero.features.delivery} • 100% Authentic Handcrafts directly from Sindh Artisans</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C5A059] shadow-sm bg-white p-0.5 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="Sindh Hunar Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-[#800000] font-bebas leading-none">
                  {t.brand}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium mt-0.5">
                  Artisans of Mehran
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#bazaar"
              className="text-[#1A1A1A] hover:text-[#800000] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#800000] hover:after:w-full after:transition-all"
            >
              {t.nav.bazaar}
            </a>
            <a
              href="#culture"
              className="text-[#1A1A1A] hover:text-[#800000] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#800000] hover:after:w-full after:transition-all"
            >
              {t.nav.culture}
            </a>
            <a
              href="#artisans"
              className="text-[#1A1A1A] hover:text-[#800000] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#800000] hover:after:w-full after:transition-all"
            >
              {t.nav.artisans}
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative mx-4">
            <Search className={`w-4 h-4 text-gray-400 absolute ${isRTL ? 'right-3' : 'left-3'} pointer-events-none`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'sd' ? 'سنڌي ثقافت ڳوليو...' : language === 'ur' ? 'سندھی ہنر تلاش کریں...' : 'Search Ajrak, Topi, Ralli...'}
              className={`w-full py-2 text-sm bg-white/90 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000] shadow-2xs transition-all ${isRTL ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} p-1 text-gray-400 hover:text-gray-600`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: Language & Cart */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C5A059]/40 bg-white hover:bg-gray-50 text-xs font-medium text-[#1A1A1A] shadow-2xs transition-colors"
                aria-label="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#800000]" />
                <span className="uppercase font-semibold tracking-wider">{language}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden`}
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                          language === l.code
                            ? 'bg-[#800000]/10 text-[#800000] font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="text-gray-400 font-sindhi">{l.native}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Jholi / Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#800000] text-white hover:bg-[#660000] shadow-sm hover:shadow-md transition-all group"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
                {t.nav.cart.split(' ')[0]}
              </span>
              {cartCount > 0 && (
                <span className="bg-[#C5A059] text-[#1A1A1A] font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-2xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#800000]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3"
            >
              <div className="relative mb-2">
                <Search className={`w-4 h-4 text-gray-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search crafts..."
                  className={`w-full py-2 text-sm bg-white border border-gray-200 rounded-lg ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'}`}
                />
              </div>
              <a
                href="#bazaar"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#1A1A1A] hover:text-[#800000] font-medium"
              >
                {t.nav.bazaar}
              </a>
              <a
                href="#culture"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#1A1A1A] hover:text-[#800000] font-medium"
              >
                {t.nav.culture}
              </a>
              <a
                href="#artisans"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#1A1A1A] hover:text-[#800000] font-medium"
              >
                {t.nav.artisans}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
