'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_SLIDES = [
  {
    title: 'Authentic Sindhi Ajrak',
    subtitle: 'Pure Hand-Blocked Heritage of Indus Valley',
    tag: 'ICONIC CRAFT',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/ajrak.jpg',
    price: 'Rs. 3,500',
    color: 'from-[#800000] to-[#3A0000]',
  },
  {
    title: 'Royal Embroidered Topi',
    subtitle: 'Intricate Mirror & Silk Thread Craft',
    tag: 'ROYAL HERITAGE',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_topi.jpg',
    price: 'Rs. 2,200',
    color: 'from-[#C5A059] to-[#7A5A1A]',
  },
  {
    title: 'Handcrafted Ralli Quilt',
    subtitle: 'Traditional Geometric Patchwork Art',
    tag: 'FOLK MASTERPIECE',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/sindhi_quilt.jpg',
    price: 'Rs. 8,500',
    color: 'from-[#002366] to-[#001026]',
  },
  {
    title: 'Sindhi Cultural Kurta',
    subtitle: 'Artisanal Hand-Embroidered Gajj Mirror Work',
    tag: 'ELEGANT ATTIRE',
    image: 'https://hypsawmgxqxsgaqfgzfk.supabase.co/storage/v1/object/public/products/catalog/female_dress.jpg',
    price: 'Rs. 7,800',
    color: 'from-[#800000] to-[#500000]',
  }
];

export const HeroBanner: React.FC = () => {
  const { t, isRTL, addToCart, products } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-cycle hero featured slide every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-[#1A1A1A] text-white py-12 lg:py-20 border-b border-[#C5A059]/30">
      {/* Background Ajrak Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/AjrakBG.jpg)',
          backgroundSize: '225px 225px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/95 via-[#1A1A1A]/80 to-[#1A1A1A]/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className={`lg:col-span-7 ${isRTL ? 'text-right' : 'text-left'}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Cultural Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#800000]/60 border border-[#C5A059]/40 backdrop-blur-md mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059]">
                  {t.hero.badge}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-bebas leading-[1.05] text-white">
                {t.hero.title}
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <a
                  href="#bazaar"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#800000] to-[#550000] text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-[#800000]/40 hover:scale-105 transition-all flex items-center gap-2 group border border-[#C5A059]/50"
                >
                  <span>{t.hero.shopNow}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </a>

                <a
                  href="#culture"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm tracking-wide border border-white/20 backdrop-blur-sm transition-all"
                >
                  {t.hero.learnStory}
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Featured Spotlight Carousel Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Outer Golden Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#C5A059] to-[#800000] opacity-40 blur-xl animate-pulse" />

              <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/50 bg-[#252525] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-4/3 w-full"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-[#800000] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {slide.tag}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute top-4 right-4 bg-white/90 text-[#800000] text-xs font-bold px-3 py-1 rounded-full shadow-sm font-bebas text-sm">
                      {slide.price}
                    </div>

                    {/* Bottom Caption & Add to Cart */}
                    <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold font-bebas tracking-wide text-white leading-tight">
                          {slide.title}
                        </h3>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                          {slide.subtitle}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const matched = products.find(p => p.name.toLowerCase().includes(slide.title.toLowerCase()));
                          if (matched) addToCart(matched);
                        }}
                        className="shrink-0 px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#d6af63] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                      >
                        {t.products.addToCart}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Dots */}
                <div className="flex items-center justify-center gap-2 p-3 bg-black/60 backdrop-blur-xs">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentSlide ? 'w-6 bg-[#C5A059]' : 'w-2 bg-white/30'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Footer Grid */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#800000]/40 border border-[#C5A059]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.hero.features.artisans}</h4>
              <p className="text-xs text-gray-400 mt-0.5">Certified traditional handmade methods</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#800000]/40 border border-[#C5A059]/40 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.hero.features.direct}</h4>
              <p className="text-xs text-gray-400 mt-0.5">Empowering rural artisans & fair wages</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#800000]/40 border border-[#C5A059]/40 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.hero.features.delivery}</h4>
              <p className="text-xs text-gray-400 mt-0.5">Dispatched securely to your doorstep</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
