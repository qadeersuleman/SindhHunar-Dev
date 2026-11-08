'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryChips } from '@/components/CategoryChips';
import { ProductCard } from '@/components/ProductCard';
import { CultureStories } from '@/components/CultureStories';
import { FloatingAIChat } from '@/components/FloatingAIChat';
import { Footer } from '@/components/Footer';
import { Sparkles, PlusCircle, SearchX, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const {
    t,
    isRTL,
    products,
    loadingProducts,
    searchQuery,
    selectedCategory,
    setSelectedProduct,
    setIsAuthModalOpen,
  } = useApp();

  const { isAdmin, isArtisan } = useAuth();

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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner />

        {/* Main Bazaar Section */}
        <section id="bazaar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
          
          {/* Section Title & Subheading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
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

            {/* Quick Add Product Button for Admin / Artisan */}
            {(isAdmin || isArtisan) && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Craft to Database</span>
              </Link>
            )}
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
            <div className="py-20 text-center flex flex-col items-center justify-center bg-white/60 rounded-3xl border border-dashed border-[#C5A059]/40 p-8 my-6">
              <div className="w-16 h-16 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-bebas text-gray-800">
                {products.length === 0 ? 'No Crafts in Database Yet' : t.products.empty}
              </h3>
              <p className="text-xs text-gray-500 mt-2 max-w-md leading-relaxed">
                {products.length === 0
                  ? 'The Supabase products table is currently empty or loading. You can use the Admin Panel to instantly add your first authentic Sindhi handicraft!'
                  : 'Try searching for something else or clear the active filter.'}
              </p>

              {products.length === 0 && (
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/admin"
                    className="px-6 py-2.5 rounded-full bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Open Admin Panel & Add Craft</span>
                  </Link>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-white border border-[#C5A059] text-gray-800 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all"
                  >
                    Manage Roles
                  </button>
                </div>
              )}
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

        {/* Culture Stories */}
        <CultureStories />
      </main>

      <Footer />
      <FloatingAIChat />
    </div>
  );
}
