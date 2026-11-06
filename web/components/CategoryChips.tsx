'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Shirt, Award, Grid, Gem, BookOpen, Layers } from 'lucide-react';

export const CategoryChips: React.FC = () => {
  const { t, selectedCategory, setSelectedCategory, isRTL } = useApp();

  const categories = [
    { id: 'all', label: t.categories.all, icon: Layers, filterKey: null },
    { id: 'ajrak', label: t.categories.ajrak, icon: Shirt, filterKey: 'Ajrak' },
    { id: 'topi', label: t.categories.topi, icon: Award, filterKey: 'Topi' },
    { id: 'ralli', label: t.categories.ralli, icon: Grid, filterKey: 'Rilli' },
    { id: 'mirror', label: t.categories.mirror, icon: Gem, filterKey: 'Mirror Work' },
    { id: 'crafts', label: t.categories.crafts, icon: BookOpen, filterKey: 'Block Printing' },
  ];

  return (
    <div className="w-full py-6">
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h2 className="text-2xl font-bold font-bebas text-[#1A1A1A] tracking-tight">
            {t.categories.title}
          </h2>
          <div className="h-0.5 w-12 bg-[#800000] mt-1 rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 shadow-2xs cursor-pointer ${
                isSelected
                  ? 'bg-[#800000] text-white shadow-md shadow-[#800000]/20 scale-105 border border-[#C5A059]'
                  : 'bg-white hover:bg-gray-100 text-[#1A1A1A] border border-gray-200'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-white/20 text-[#C5A059]' : 'bg-[#800000]/10 text-[#800000]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span>{cat.label}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
