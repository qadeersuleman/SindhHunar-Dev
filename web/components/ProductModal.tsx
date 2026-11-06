'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, Check, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { t, isRTL, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : typeof product.images === 'string'
    ? product.images
    : '/images/AjrakBG.jpg';

  const artisanName = product.artisans?.shop_name || product.artisan_name || 'Sindhi Hunarmand';
  const originalPrice = Math.round(product.price * 1.15); // Show original price for strike-through

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 800);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! I want to order "${product.name}" (Price: Rs. ${product.price}, Qty: ${quantity}) from Sindh Hunar website.`
    );
    window.open(`https://wa.me/923000000000?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#C5A059]/30 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-md transition-all cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Preview */}
            <div className="relative aspect-square md:aspect-auto w-full h-72 md:h-full bg-gray-100 min-h-[320px]">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                <span className="text-xs font-bold text-[#1A1A1A]">
                  {Number(product.rating || 5.0).toFixed(1)} / 5.0 Rating
                </span>
              </div>
            </div>

            {/* Details Content */}
            <div className={`p-6 sm:p-8 flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
              <div>
                {/* Category & Availability */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-[#800000] uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {t.products.inStock}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-bebas leading-tight">
                  {product.name}
                </h2>

                {/* Artisan Name */}
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  {t.products.by} <strong className="text-gray-800 font-semibold">{artisanName}</strong>
                </p>

                {/* Price block */}
                <div className="flex items-baseline gap-3 my-3">
                  <span className="text-3xl font-bold text-[#800000] font-bebas">
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#C5A059]/20 text-[#8B6B23] text-xs font-bold">
                    SAVE 15%
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed my-4 border-t border-b border-gray-100 py-3">
                  {product.description ||
                    'Authentic Sindhi cultural handcraft made with time-tested heritage techniques and natural pigments directly from Ghotki and Bhit Shah.'}
                </p>

                {/* Authentic Guarantee */}
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#FAF9F6] p-2.5 rounded-xl border border-gray-100 mb-6">
                  <ShieldCheck className="w-4 h-4 text-[#800000] shrink-0" />
                  <span>100% Verified Sindhi Artisan Origin & Fair Trade.</span>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-medium text-gray-600">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-200 text-gray-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-200 text-gray-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAdd}
                    className="w-full py-3 px-4 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Jholi!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t.products.addToCart}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
