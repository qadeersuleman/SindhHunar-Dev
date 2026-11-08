'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, Check, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
  product?: Product | null;
  onClose?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product: propProduct, 
  onClose: propOnClose 
}) => {
  const { t, isRTL, addToCart, selectedProduct, setSelectedProduct } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const product = propProduct !== undefined ? propProduct : selectedProduct;
  const handleClose = propOnClose || (() => setSelectedProduct(null));

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
      handleClose();
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
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#C5A059]/30 my-8"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Image Spotlight */}
            <div className="relative h-64 md:h-full min-h-[300px] bg-[#1A1A1A]">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
              
              <div className="absolute top-4 left-4 bg-[#800000] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {product.category}
              </div>
            </div>

            {/* Right Column: Details & Order CTA */}
            <div className={`p-6 sm:p-8 flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-semibold mb-2">
                  <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                  <span>{product.rating ?? 5.0} Master Craftsmanship</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-[#1A1A1A] tracking-tight leading-tight">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Artisan Studio: <span className="font-semibold text-gray-700">{artisanName}</span>
                </p>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-bebas text-[#800000]">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">
                    Direct Artisan Price
                  </span>
                </div>

                {/* Description */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Heritage & Materials
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    {product.description || 'Authentic traditional Sindhi handicraft made with sacred heritage techniques and natural materials by indigenous Mehran artisans.'}
                  </p>
                </div>

                {/* Authenticity Guarantee */}
                <div className="mt-4 p-3 bg-[#FAF9F6] rounded-2xl border border-[#C5A059]/30 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#C5A059] shrink-0" />
                  <div className="text-[11px] leading-snug">
                    <span className="font-bold text-[#1A1A1A] block">100% Mehran Authenticity Guarantee</span>
                    <span className="text-gray-500 font-light">Inspected for genuine handcrafting and natural mineral dyes.</span>
                  </div>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Select Quantity:</span>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 bg-gray-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAdd}
                    className="py-3 px-4 rounded-full bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-[#C5A059]" />
                        <span>Added to Jholi!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>{t.products.addToCart}</span>
                      </>
                    )}
                  </button>

                  {/* WhatsApp Direct Buy */}
                  <button
                    onClick={handleWhatsApp}
                    className="py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#1eb855] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
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
