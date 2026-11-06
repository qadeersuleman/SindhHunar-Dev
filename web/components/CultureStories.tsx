'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { BookOpen, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Story {
  id: string;
  titleKey: string;
  tag: string;
  image: string;
  summary: string;
  fullStory: string;
  origin: string;
}

const STORIES: Story[] = [
  {
    id: '1',
    titleKey: 'The Art of Ajrak (اجرڪ جو هنر)',
    tag: '4,000 YEARS LEGACY',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
    summary: 'A sacred Indus Valley craft combining natural indigo, madder red, and geometric star blocks representing the cosmos.',
    fullStory: 'Ajrak printing is not just a textile craft; it is a sacred cultural emblem of Sindh that traces its roots directly to the Indus Valley Civilization. The Priest-King statue excavated at Mohenjo-Daro wears a shawl draped over his shoulder with the exact trefoil and star-burst pattern found on modern Sindhi Ajraks today.\n\nThe process of making an authentic Ajrak is meditative and arduous, requiring up to 21 distinct stages over several weeks. It utilizes natural river water, pure indigo, pomegranate skins, and madder root dyes. The deep blue symbolizes the limitless sky, while the intense red honors the fertile earth.',
    origin: 'Bhit Shah, Hala & Matiari, Sindh',
  },
  {
    id: '2',
    titleKey: 'Ralli: Stitched Dreams (سبييل خواب)',
    tag: 'INDUS FOLK ART',
    image: 'https://images.unsplash.com/photo-1528459801416-a7e99a0dce3a?q=80&w=1000&auto=format&fit=crop',
    summary: 'Handcrafted patchwork quilts woven by nomadic and village women using cotton scraps, geometric talismans, and applique motifs.',
    fullStory: 'In the arid villages of rural Sindh and the Thar desert, women have preserved the art of Ralli quilt-making for countless generations. Ralli quilts are lovingly pieced together from leftover fragments of dyed cotton fabric, transformed through intricate stitching into hypnotic geometric patterns.\n\nEvery Ralli tells an intimate story of celebration, memory, or dowry gifts. The patchwork symbols include sacred Indus motifs like snake trails, stars, date palms, and protective amulets. It stands as a testament to women’s creativity and sustainable living.',
    origin: 'Umerkot, Tharparkar & Ghotki, Sindh',
  },
  {
    id: '3',
    titleKey: 'Royal Embroidered Topi (سنڌي ٽوپي)',
    tag: 'SYMBOL OF DIGNITY',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
    summary: 'The iconic arch-cut crown embellished with glass mirrors, gold thread, and silk embroidery worn with profound pride.',
    fullStory: 'The Sindhi Topi, characterized by its distinctive cut-out arch in the front, is the ultimate hallmark of Sindhi honor, sovereignty, and warm hospitality. The arch in the front allows the forehead to touch the ground during prayer.\n\nCrafting a single royal topi takes weeks of patient craftsmanship. Tiny round mirrors (Aarsie) are hand-stitched into dense floral and star medallions using gold, silver, and vibrant silk threads. On Sindh Cultural Day (Sindhi Ekta Diwas), millions wear the Topi and Ajrak together across the globe in festive brotherhood.',
    origin: 'Bhit Shah, Shikarpur & Ghotki, Sindh',
  },
];

export const CultureStories: React.FC = () => {
  const { t, isRTL } = useApp();
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  return (
    <section id="culture" className="py-16 bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className={`mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800000]/10 text-[#800000] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saqafat-e-Sindh</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-bebas text-[#1A1A1A] tracking-tight">
            {t.culture.heading}
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl font-light">
            {t.culture.subheading}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORIES.map((story) => (
            <motion.div
              key={story.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveStory(story)}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-[#1A1A1A] text-white flex flex-col h-[400px]"
            >
              <Image
                src={story.image}
                alt={story.titleKey}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-[#C5A059] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {story.tag}
                </span>
              </div>

              {/* Content */}
              <div className={`relative mt-auto p-6 z-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                <span className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold block mb-1">
                  {story.origin}
                </span>
                <h3 className="text-2xl font-bold font-bebas tracking-wide leading-tight group-hover:text-[#C5A059] transition-colors">
                  {story.titleKey}
                </h3>
                <p className="text-xs text-gray-300 mt-2 line-clamp-3 leading-relaxed">
                  {story.summary}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Full Story</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Detail Modal */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStory(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#C5A059]/30 my-8"
            >
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-64 w-full">
                <Image
                  src={activeStory.image}
                  alt={activeStory.titleKey}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="text-[10px] bg-[#800000] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                    {activeStory.tag}
                  </span>
                  <h3 className="text-3xl font-bold font-bebas mt-2">
                    {activeStory.titleKey}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#800000] bg-[#FAF9F6] p-3 rounded-xl border border-gray-100">
                  <span>Traditional Center of Excellence:</span>
                  <strong className="text-gray-800">{activeStory.origin}</strong>
                </div>

                <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-3 whitespace-pre-line">
                  {activeStory.fullStory}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setActiveStory(null)}
                    className="px-6 py-2.5 rounded-full bg-[#800000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#660000] shadow-sm"
                  >
                    Close Story
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
