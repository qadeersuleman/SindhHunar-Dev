'use client';

import React, { useMemo } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryChips } from '@/components/CategoryChips';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CultureStories } from '@/components/CultureStories';
import { FloatingAIChat } from '@/components/FloatingAIChat';
import { Footer } from '@/components/Footer';
import { Sparkles, Users, Award, ShieldCheck, SearchX } from 'lucide-react';

function MainBazaar() {
  const {
    t,
    isRTL,
    products,
    loadingProducts,
    searchQuery,
    selectedCategory,
    selectedProduct,
    setSelectedProduct,
  } = useApp();

  // Category & Search filter matching mobile app
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      const categoryMap: Record<string, string> = {
        ajrak: 'Ajrak',
        topi: 'Topi',
        ralli: 'Rilli',
        mirror: 'Mirror Work',
        crafts: 'Block Printing',
      };
      const filterKey = categoryMap[selectedCategory]?.toLowerCase();
      if (filterKey) {
        result = result.filter(
          (p) =>
            (p.category && p.category.toLowerCase().includes(filterKey)) ||
            (p.name && p.name.toLowerCase().includes(filterKey))
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroBanner />

      {/* Main Bazaar Section */}
      <section id="bazaar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
        
        {/* Section Title & Subheading */}
        <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800000]/10 text-[#800000] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sindh Hunar Bazaar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-bebas text-[#1A1A1A] tracking-tight">
            {t.products.heading}
          </h2>
          <p className="mt-1 text-sm text-gray-500 font-light max-w-2xl">
            {t.products.subheading}
          </p>
        </div>

        {/* Category Filters */}
        <CategoryChips />

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs animate-pulse">
                <div className="aspect-4/3 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-3 bg-gray-200 rounded-md w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-4" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gray-200 rounded-md w-1/2" />
                  <div className="w-8 h-8 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-bebas text-gray-800">
              {t.products.empty}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Try searching for something else like &quot;Ajrak&quot;, &quot;Topi&quot;, or &quot;Ralli&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Artisan Spotlight */}
      <section id="artisans" className="bg-[#FAF9F6] py-16 border-t border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#800000] via-[#500000] to-[#1A1A1A] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: 'url(/images/AjrakBG.jpg)',
                backgroundSize: 'cover',
              }}
            />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#C5A059]/30">
                <Award className="w-3.5 h-3.5" />
                <span>Meet Our Master Craftsmen</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold font-bebas leading-tight">
                Preserving 4,000 Years of Heritage, One Stitch at a Time
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-4 leading-relaxed font-light">
                Over 500+ rural artisans in Bhit Shah, Hala, Matiari, Ghotki, and Umerkot partner directly with Sindh Hunar. When you buy from this bazaar, 100% of your support empowers families and keeps the sacred art of Indus block-printing and embroidery alive.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#C5A059] border border-white/10">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-bebas">500+ Artisans</div>
                    <div className="text-[11px] text-gray-400">Rural Families Supported</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#C5A059] border border-white/10">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-bebas">100% Fair Trade</div>
                    <div className="text-[11px] text-gray-400">Zero Middleman Exploitation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Heritage Stories */}
      <CultureStories />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer />
      <FloatingAIChat />
    </main>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Navbar />
        <MainBazaar />
        <Footer />
      </div>
    </AppProvider>
  );
}
