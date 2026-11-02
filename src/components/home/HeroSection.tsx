'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenChat?: () => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#071326] text-[#FAF7F2] pt-8 pb-20 sm:pb-28 px-4 sm:px-8 lg:px-12 selection:bg-[#C5A059]/30">
      {/* 1. Delicate Fluid Organic Contour Lines (Identical to Reference Image) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 960"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-80 180 C280 60, 560 380, 920 220 C1220 80, 1420 260, 1560 220"
            stroke="#F5DDA7"
            strokeWidth="0.8"
            strokeDasharray="4 6"
          />
          <path
            d="M-40 520 C320 380, 680 720, 1080 480 C1380 300, 1520 620, 1640 560"
            stroke="#F5DDA7"
            strokeWidth="0.6"
          />
          <path
            d="M120 900 C480 780, 840 920, 1280 760 C1460 700, 1560 840, 1620 800"
            stroke="#F5DDA7"
            strokeWidth="0.5"
            strokeDasharray="3 5"
          />
        </svg>
      </div>

      {/* Atmospheric Soft Light Radiance */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#C5A059]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#1B3B6F]/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ============================================================== */}
        {/* TOP SECTION: Headline + Tilted Capsule Card + Sunburst        */}
        {/* ============================================================== */}
        <div className="relative pt-4 sm:pt-8 pb-6 lg:pb-10">
          {/* Top-Right Starburst Ornament (Reference Match) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-0 right-[22%] sm:right-[26%] lg:right-[28%] z-20 pointer-events-none"
          >
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-[#C5A059] animate-[spin_30s_linear_infinite]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {/* 16-point Radiant Starburst */}
              <path d="M12 0L13.1 7.2L18.4 2.2L16.2 9.1L23.1 6.9L18.1 12.2L24 13.3L16.8 14.4L21.8 19.7L14.9 17.5L17.1 24.4L11.8 19.4L10.7 26.6L9.6 19.4L4.3 24.4L6.5 17.5L-0.4 19.7L4.6 14.4L-2.6 13.3L4.6 12.2L-0.4 6.9L6.5 9.1L4.3 2.2L9.6 7.2L12 0Z" />
            </svg>
          </motion.div>

          {/* Top-Right Tilted Capsule Card (Reference Match: Tilted -7deg behind text) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -12, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: -7, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-2 right-2 sm:right-6 lg:right-10 z-0 w-44 sm:w-60 lg:w-72 aspect-[3/4] rounded-[44px] overflow-hidden border border-[#C5A059]/40 bg-[#0B1C36] shadow-[0_30px_70px_rgba(5,11,22,0.8)] group"
          >
            <Image
              src="/products/orchidia.jpg"
              alt="Stellify Orchidia Handcrafted Bangles"
              fill
              priority
              sizes="(max-width: 640px) 176px, (max-width: 1024px) 240px, 288px"
              className="object-cover object-center filter brightness-[0.95] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Main Giant Headline: Line 1 Solid, Line 2 Wireframe Outlined */}
          <div className="relative z-10 max-w-4xl">
            {/* Line 1: Blooming / Handcrafted (Solid Rich Gold Serif) */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl sm:text-8xl lg:text-[9.5rem] xl:text-[11.5rem] text-[#E5C378] font-normal tracking-tight leading-[0.88] select-none drop-shadow-sm"
            >
              Handcrafted
            </motion.h1>

            {/* Line 2: Beauty / With Soul (Delicate Wireframe Hairline Stroke) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl sm:text-8xl lg:text-[9.5rem] xl:text-[11.5rem] font-light tracking-tight leading-[0.92] select-none -mt-2 sm:-mt-4"
            >
              <span
                style={{
                  WebkitTextStroke: '1.5px rgba(229, 195, 120, 0.85)',
                  color: 'transparent',
                }}
                className="inline-block transition-all duration-700 hover:opacity-90"
              >
                With Soul
              </span>
            </motion.div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM SECTION: Circular Spinning Badge + 2 Organic Cards     */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end mt-6 sm:mt-10">
          {/* Bottom-Left Image Card with Floating Spinning Badge (Reference Match) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Circular Spinning Text Badge with Arrow Button (Positioned on Card's Top-Left Shoulder) */}
            <div className="absolute -top-7 -left-3 sm:-top-9 sm:-left-6 z-20 flex items-center justify-center">
              <Link
                href="/shop"
                className="relative group w-20 h-20 sm:w-26 sm:h-26 flex items-center justify-center"
                aria-label="Shop Collections"
              >
                {/* Rotating Circular Text SVG */}
                <svg
                  className="w-full h-full animate-[spin_14s_linear_infinite] group-hover:animate-[spin_7s_linear_infinite]"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="heroBadgePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[8.5px] font-sans font-medium uppercase tracking-[0.2em] fill-[#C5A059]">
                    <textPath href="#heroBadgePath" startOffset="0%">
                      • SHOP BANGLES • STELLIFY ATELIER •
                    </textPath>
                  </text>
                </svg>

                {/* Center Circular CTA Button with Diagonal Arrow */}
                <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C5A059] group-hover:bg-[#E5C378] text-[#071326] flex items-center justify-center shadow-[0_4px_25px_rgba(197,160,89,0.45)] transition-all duration-300 group-hover:scale-110">
                  <ArrowUpRight className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </div>

            {/* Bottom-Left Card: Portrait Orientation with Organic Rounded Corners */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-[42px] overflow-hidden border border-[#C5A059]/30 bg-[#0B1C36] shadow-[0_25px_60px_rgba(5,11,22,0.6)] group">
              <Image
                src="/products/indra.jpg"
                alt="Indra Royal Cobalt Silk Bangle Set"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/70 via-[#071326]/20 to-transparent" />

              {/* Minimalist Lookbook Tag */}
              <div className="absolute bottom-6 left-6 z-10">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C5A059] block font-medium">
                  Indra Collection
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#FAF7F2] font-light mt-0.5">
                  Royal Cobalt Silk
                </h4>
              </div>
            </div>
          </motion.div>

          {/* Bottom-Right Column: Description Text Directly on Top of Right Image Card (Reference Match) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-end"
          >
            {/* Poetic Description: Positioned directly on top of the right image card */}
            <div className="mb-5 sm:mb-7 max-w-sm sm:max-w-md self-start text-left">
              <p className="font-sans text-xs sm:text-sm md:text-[15px] text-[#FAF7F2]/80 leading-relaxed font-light">
                Discover handcrafted thread-wrapped bangles and ornaments that turn simple spaces into timeless memories.
              </p>
            </div>

            {/* Arch-Crowned Editorial Portrait Card (rounded-t-[56px] / [72px] rounded-b-[42px]) */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/11] rounded-t-[56px] sm:rounded-t-[72px] rounded-b-[42px] overflow-hidden border border-[#C5A059]/30 bg-[#0B1C36] shadow-[0_25px_60px_rgba(5,11,22,0.6)] group">
              <Image
                src="/products/mehrish.jpg"
                alt="Mehrish Crimson Mirror & Pearl Bangle Set"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/70 via-[#071326]/20 to-transparent" />

              {/* Minimalist Lookbook Tag */}
              <div className="absolute bottom-6 left-6 z-10">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C5A059] block font-medium">
                  Mehrish Collection
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#FAF7F2] font-light mt-0.5">
                  Bridal Crimson Mirrorwork
                </h4>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
