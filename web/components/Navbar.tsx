'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Search, Globe, X, Menu, User, ShieldCheck, Palette, Package, LogOut } from 'lucide-react';
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
    setIsAuthModalOpen,
    setIsOrdersModalOpen,
  } = useApp();

  const { user, profile, role, isAdmin, isArtisan, signOut } = useAuth();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
        {isAdmin && (
          <Link
            href="/admin"
            className="ml-3 px-2.5 py-0.5 rounded-full bg-[#C5A059] text-gray-950 font-bold text-[10px] uppercase tracking-wider hover:bg-white transition-all shadow-xs"
          >
            Admin Panel Active →
          </Link>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
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
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              href="/#bazaar"
              className="text-[#1A1A1A] hover:text-[#800000] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#800000] hover:after:w-full after:transition-all"
            >
              {t.nav.bazaar}
            </Link>
            <Link
              href="/#culture"
              className="text-[#1A1A1A] hover:text-[#800000] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#800000] hover:after:w-full after:transition-all"
            >
              {t.nav.culture}
            </Link>
            <Link
              href="/#artisans"
              className="text-[#1A1A1A] hover:text-[#800000] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#800000] hover:after:w-full after:transition-all"
            >
              {t.nav.artisans}
            </Link>
            
            {/* Direct Admin Panel Navigation Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366] text-white hover:bg-[#001744] text-xs font-bold uppercase tracking-wider shadow-xs transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative mx-2">
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

          {/* Action Buttons: Language, Account, Cart */}
          <div className="flex items-center gap-2.5">
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

            {/* User Account / Role Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all shadow-2xs ${
                  user
                    ? role === 'admin'
                      ? 'border-[#002366] bg-[#002366]/10 text-[#002366]'
                      : role === 'artisan'
                      ? 'border-[#800000] bg-[#800000]/10 text-[#800000]'
                      : 'border-[#C5A059] bg-[#C5A059]/10 text-[#1A1A1A]'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">
                  {user ? (profile?.name ? profile.name.split(' ')[0] : 'Account') : 'Sign In'}
                </span>
                {user && (
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                      role === 'admin'
                        ? 'bg-[#002366] text-white'
                        : role === 'artisan'
                        ? 'bg-[#800000] text-white'
                        : 'bg-[#C5A059] text-gray-900'
                    }`}
                  >
                    {role}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#C5A059]/30 py-2 z-50 overflow-hidden`}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {profile?.name || user.email}
                          </p>
                          <span className="text-[10px] text-gray-500 capitalize">Role: {role}</span>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs text-[#002366] font-bold hover:bg-[#002366]/5 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#002366]" />
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        {isArtisan && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs text-[#800000] font-bold hover:bg-[#800000]/5 transition-colors"
                          >
                            <Palette className="w-4 h-4 text-[#800000]" />
                            <span>Artisan Studio (Add Craft)</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setIsOrdersModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#C5A059]" />
                          <span>My Orders History</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsAuthModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          <span>Switch Role / Profile</span>
                        </button>

                        <div className="my-1 border-t border-gray-100" />

                        <button
                          onClick={async () => {
                            await signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsAuthModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-xs text-[#800000] font-bold hover:bg-[#800000]/5 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Sign In / Register</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsOrdersModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left flex items-center gap-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#C5A059]" />
                          <span>Track Order (Guest)</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Jholi / Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#800000] text-white hover:bg-[#660000] shadow-sm hover:shadow-md transition-all group cursor-pointer"
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

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg bg-[#002366] text-white font-bold flex items-center gap-2 text-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <Link
                href="/#bazaar"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#1A1A1A] hover:text-[#800000] font-medium"
              >
                {t.nav.bazaar}
              </Link>
              <Link
                href="/#culture"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#1A1A1A] hover:text-[#800000] font-medium"
              >
                {t.nav.culture}
              </Link>
              <Link
                href="/#artisans"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#1A1A1A] hover:text-[#800000] font-medium"
              >
                {t.nav.artisans}
              </Link>

              <button
                onClick={() => {
                  setIsOrdersModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-left text-gray-700 hover:text-[#800000] font-medium flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-[#C5A059]" />
                <span>Track Orders</span>
              </button>

              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-left text-[#800000] font-bold flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{user ? `Account (${role})` : 'Sign In / Register'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
