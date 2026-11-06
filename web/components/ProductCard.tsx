'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { Star, Plus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const { t, isRTL, addToCart } = useApp();

  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : typeof product.images === 'string'
    ? product.images
    : '/images/AjrakBG.jpg';

  const artisanName = product.artisans?.shop_name || product.artisan_name || 'Sindhi Hunarmand';
  const rating = product.rating || 5.0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onOpenModal(product)}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-108"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Rating Badge */}
        <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
          <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
          <span className="text-[11px] font-bold text-[#1A1A1A]">{Number(rating).toFixed(1)}</span>
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(product);
          }}
          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/90 text-[#800000] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all hover:bg-white"
          title="Quick View"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>

      {/* Product Content */}
      <div className={`p-4 sm:p-5 flex-1 flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#757575]">
            {product.category || 'Handicraft'}
          </span>

          {/* Product Title */}
          <h3 
            onClick={() => onOpenModal(product)}
            className="text-base sm:text-lg font-bold text-[#1A1A1A] hover:text-[#800000] cursor-pointer transition-colors mt-1 line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Artisan Credit */}
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span>{t.products.by}</span>
            <span className="font-semibold text-gray-700">{artisanName}</span>
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-400 font-medium">{t.products.price}</span>
            <div className="text-xl sm:text-2xl font-bold text-[#800000] font-bebas leading-none">
              Rs. {Number(product.price).toLocaleString()}
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 group/btn cursor-pointer"
          >
            <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
            <span className="hidden sm:inline">{t.products.addToCart.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
