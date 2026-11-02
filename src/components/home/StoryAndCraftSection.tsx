'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Ruler,
  Droplets,
  ShieldAlert,
  Layers,
  CircleDot,
  Check,
} from 'lucide-react';

export function StoryAndCraftSection() {
  const anatomyPillars = [
    {
      num: '01',
      title: 'The Raw Silk Core',
      materials: 'Mulberry Raw Silk & Alloy Base',
      description:
        'Pure silk thread wound millimeter by millimeter over a lightweight, break-resistant base. Shaped by hands that know patience, poured into tactile warmth that never rushes itself.',
      tag: 'Hand-Wound Foundation',
    },
    {
      num: '02',
      title: 'Authentic Aabhla Mirrorwork & Zari',
      materials: 'Hand-Cut Glass & Metallic Zari Cords',
      description:
        'Traditional glass mirrors (aabhla) reflecting heritage with a bridal luminescence. Bordered by laser-edged metallic cord embroidery and golden floral lace.',
      tag: 'Festive Luminescence',
    },
    {
      num: '03',
      title: 'Micro Botanical Flora & Pearls',
      materials: 'Ceramic Blossoms & Ivory Seed Pearls',
      description:
        'Delicate white ceramic blossoms paired with lustrous ivory faux pearls. Every motif is hand-stitched individually to withstand celebratory movement.',
      tag: 'Delicate Embellishment',
    },
  ];

  const sizingData = [
    { size: '2-4 (Small)', diameter: '2.25 in (57.2 mm)', fit: 'Petite, slender wrists' },
    { size: '2-6 (Medium)', diameter: '2.375 in (60.3 mm)', fit: 'Most common standard fit' },
    { size: '2-8 (Large)', diameter: '2.50 in (63.5 mm)', fit: 'Comfortable, broader wrists' },
  ];

  return (
    <section
      id="story"
      className="py-24 sm:py-36 px-6 sm:px-12 bg-[#050B16] relative overflow-hidden border-t border-[#162B4C]"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#C5A059]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#C5A059]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] block mb-3">
            Our Artisanal Heritage &amp; Craft
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] font-light leading-[1.15] tracking-tight">
            Woven with care, <br />
            <span className="italic text-[#C5A059]">tradition and soul.</span>
          </h2>
          <div className="w-16 h-[1px] bg-[#C5A059]/40 mx-auto my-6" />
          <blockquote className="font-serif italic text-lg sm:text-2xl text-[#FAF7F2]/90 leading-relaxed font-light">
            &ldquo;This is not just metal. This is memory wrapped around a wrist, quiet in its glow, loud in its meaning.&rdquo;
          </blockquote>
        </motion.div>

        {/* Narrative & Anatomy Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Overlapping Editorial Photography & Story Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-start space-y-6"
          >
            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden border border-[#C5A059]/30 shadow-2xl group bg-[#071326]">
              <Image
                src="/products/gulzar.jpg"
                alt="Stellify Gulzar Handcrafted Bangle Set"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B16] via-transparent to-transparent opacity-85" />

              {/* Decorative Gold Monogram Stamp */}
              <div className="absolute top-4 left-4 bg-[#071326]/90 backdrop-blur-sm border border-[#C5A059]/50 px-3 py-1.5 rounded-sm shadow-xl">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#E5C378] font-sans font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  EST. DHAKA ATELIER
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block">
                  Mirpur-11 Atelier
                </span>
                <p className="font-serif italic text-lg text-[#FAF7F2] mt-1">
                  Each bangle carries a unique story shaped by patient hands.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-sans text-[#D4C9BA]/80 leading-relaxed font-light">
              In an age of rushed mass manufacturing, Stellify returns to the intimate rhythm of the artisan&rsquo;s touch.
              Every thread is spun patiently, honoring Bengal&rsquo;s rich textile tapestry with understated, quiet luxury.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-[#C5A059] hover:text-[#E5C378] font-medium group transition-colors pt-2"
            >
              <span>Explore The Atelier Collections</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>

          {/* Right Column: Layer-by-Layer Anatomy of the Bangle */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            <div>
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mb-2">
                Construction Breakdown
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#FAF7F2] font-light">
                The Anatomy of <span className="italic text-[#C5A059]">Artisanal Jewelry</span>
              </h3>
            </div>

            <div className="space-y-4">
              {anatomyPillars.map((pillar, idx) => (
                <div
                  key={pillar.num}
                  className="bg-[#071326] border border-[#162B4C] hover:border-[#C5A059]/40 p-6 rounded-sm transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-[#C5A059] bg-[#0B1C36] border border-[#162B4C] w-7 h-7 rounded-full flex items-center justify-center">
                        {pillar.num}
                      </span>
                      <h4 className="font-serif text-xl text-[#FAF7F2] font-normal group-hover:text-[#E5C378] transition-colors">
                        {pillar.title}
                      </h4>
                    </div>
                    <span className="text-[9px] uppercase font-sans tracking-[0.2em] px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#E5C378] border border-[#C5A059]/20 hidden sm:inline-block">
                      {pillar.tag}
                    </span>
                  </div>

                  <span className="text-[11px] font-sans text-[#C5A059] block mb-2 font-medium">
                    Materials: {pillar.materials}
                  </span>

                  <p className="text-xs font-sans text-[#FAF7F2]/70 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Integrated Atelier Specifications: Sizing Guide & Care Strip */}
        <motion.div
          id="craft"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#071326] border border-[#C5A059]/30 p-6 sm:p-10 rounded-sm shadow-xl space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#162B4C]">
            <div>
              <div className="flex items-center gap-2 text-[#C5A059] mb-1">
                <Ruler className="w-4 h-4" />
                <span className="text-[10px] uppercase font-sans tracking-[0.22em] font-semibold">
                  Sizing &amp; Longevity
                </span>
              </div>
              <h4 className="font-serif text-2xl text-[#FAF7F2] font-light">
                Standard Bangladeshi Sizing &amp; Care
              </h4>
            </div>
            <p className="text-xs font-sans text-[#D4C9BA]/60 max-w-sm">
              We handcraft bangles in three standard sizes, with bespoke dimensions crafted upon request.
            </p>
          </div>

          {/* Sizing & Care Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sizingData.map((s) => (
              <div
                key={s.size}
                className="bg-[#0B1C36] p-5 rounded-sm border border-[#162B4C] hover:border-[#C5A059]/40 transition-colors"
              >
                <span className="text-xs font-semibold text-[#E5C378] font-sans block">
                  {s.size}
                </span>
                <span className="text-xs font-mono text-[#FAF7F2]/70 block mt-1">
                  {s.diameter}
                </span>
                <span className="text-[11px] text-[#FAF7F2]/80 mt-3 block italic font-light">
                  {s.fit}
                </span>
              </div>
            ))}

            {/* Care Guidance Card */}
            <div className="bg-[#0B1C36] p-5 rounded-sm border border-[#162B4C] space-y-3">
              <span className="text-xs font-semibold text-[#C5A059] font-sans block uppercase tracking-wider">
                Artisanal Care Tips
              </span>
              <div className="space-y-2 text-[11px] text-[#FAF7F2]/75 font-light leading-snug">
                <div className="flex items-start gap-2">
                  <Droplets className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>Keep away from direct water immersion to protect silk luster.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>Apply perfumes before wearing bangles to avoid chemical discoloration.</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#D4C9BA]/60 italic font-sans text-center">
            *Need custom sizes like 2-2 or 2-10? Simply mention it in your order notes or ask our AI Style Concierge.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
export default StoryAndCraftSection;
