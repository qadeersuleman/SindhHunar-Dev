'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Heart, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, isRTL } = useApp();

  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t-2 border-[#C5A059]/40 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'url(/images/AjrakBG.jpg)',
          backgroundSize: 'cover',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Mission */}
          <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C5A059] bg-white p-0.5">
                <Image
                  src="/images/logo.png"
                  alt="Sindh Hunar"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold font-bebas text-white">
                {t.brand}
              </span>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {t.footer.about}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#800000] flex items-center justify-center transition-colors text-white" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#800000] flex items-center justify-center transition-colors text-white" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#800000] flex items-center justify-center transition-colors text-white" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className="text-sm font-bold font-bebas tracking-wider text-[#C5A059] uppercase">
              {t.footer.categories}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#bazaar" className="hover:text-white transition-colors">{t.categories.ajrak}</a></li>
              <li><a href="#bazaar" className="hover:text-white transition-colors">{t.categories.topi}</a></li>
              <li><a href="#bazaar" className="hover:text-white transition-colors">{t.categories.ralli}</a></li>
              <li><a href="#bazaar" className="hover:text-white transition-colors">{t.categories.mirror}</a></li>
              <li><a href="#bazaar" className="hover:text-white transition-colors">{t.categories.crafts}</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className="text-sm font-bold font-bebas tracking-wider text-[#C5A059] uppercase">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#bazaar" className="hover:text-white transition-colors">{t.nav.bazaar}</a></li>
              <li><a href="#culture" className="hover:text-white transition-colors">{t.nav.culture}</a></li>
              <li><a href="#artisans" className="hover:text-white transition-colors">Artisan Network</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy & Fair Trade Policy</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className="text-sm font-bold font-bebas tracking-wider text-[#C5A059] uppercase">
              {t.footer.contact}
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Ghotki, Bhit Shah & Hala Artisan Hubs, Sindh, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>+92 300 1234567 (WhatsApp Available)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>support@sindhhunar.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Sindh Hunar. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-gray-400">
            <span>{t.footer.madeWith}</span>
            <Heart className="w-3.5 h-3.5 fill-[#800000] text-[#800000]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
