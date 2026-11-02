'use client';

import Image from 'next/image';
import { Ruler, Droplets, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export function CraftSection() {
  const sizingData = [
    { size: '2-4 (Small)', diameter: '2.25 inches (57.2 mm)', fit: 'Petite, slender wrists' },
    { size: '2-6 (Medium)', diameter: '2.375 inches (60.3 mm)', fit: 'Most common standard fit' },
    { size: '2-8 (Large)', diameter: '2.50 inches (63.5 mm)', fit: 'Comfortable, broader wrists' },
  ];

  return (
    <section id="craft" className="py-24 sm:py-36 px-6 sm:px-12 bg-[#050B16] relative overflow-hidden border-t border-[#162B4C]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Craft Narrative & Sizing */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] mb-3">
              Artisan Atelier Notes
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-light tracking-tight leading-[1.15]">
              The Anatomy of an <br />
              <span className="italic text-[#C5A059]">Artisanal Bangle</span>
            </h2>

            <p className="text-sm font-sans text-[#D4C9BA]/80 mt-6 leading-relaxed font-light">
              Unlike machine-stamped jewelry, thread-wrapped bangles possess a tactile soul.
              Each set takes hours of meticulous hand-winding with silk thread, hand-stitching of micro ceramic flora,
              and setting of genuine glass mirror fragments (aabhla) with fine metallic zari cords.
            </p>

            {/* Sizing Chart Box */}
            <div className="w-full mt-10 bg-[#071326] border border-[#162B4C] p-6 rounded-sm">
              <div className="flex items-center gap-2 mb-4 text-[#C5A059]">
                <Ruler className="w-4 h-4" />
                <h4 className="font-serif text-xl tracking-wide">Standard Bangladeshi Bangle Sizing</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {sizingData.map((s) => (
                  <div key={s.size} className="bg-[#0B1C36] p-4 rounded-sm border border-[#162B4C]/60">
                    <span className="text-xs font-semibold text-[#E5C378] font-sans block">
                      {s.size}
                    </span>
                    <span className="text-[11px] text-[#FAF7F2]/60 block mt-1">
                      {s.diameter}
                    </span>
                    <span className="text-[10px] text-[#FAF7F2]/80 mt-2 block italic">
                      {s.fit}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#D4C9BA]/50 mt-4 italic font-sans">
                *Custom sizes (2-2 or 2-10) can be handcrafted upon request in your order notes or via chat.
              </p>
            </div>

            {/* Care Guidance */}
            <div className="mt-8 flex flex-col sm:flex-row gap-6 text-xs text-[#FAF7F2]/75">
              <div className="flex items-start gap-3">
                <Droplets className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Keep away from direct water immersion and detergents to protect thread luster.</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Spray perfumes and body mists before wearing bangles to avoid chemical discoloration.</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Close-up Texture Photography */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[15/16] w-full max-w-md mx-auto lg:max-w-none rounded-sm overflow-hidden border border-[#C5A059]/30 shadow-2xl">
              <Image
                src="/products/sitara.jpg"
                alt="Sitara Handcrafted Silk Thread and Zardozi Detailing"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center filter brightness-[0.85] contrast-[1.08] hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B16] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block">
                  Close-up Macro Study
                </span>
                <p className="font-serif italic text-lg text-[#FAF7F2] mt-1">
                  Intricate zardozi and metallic knotting over magenta silk.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default CraftSection;
