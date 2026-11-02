'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function StorySection() {
  return (
    <section id="story" className="py-24 sm:py-36 px-6 sm:px-12 bg-[#050B16] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Overlapping Editorial Imagery */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none rounded-sm overflow-hidden border border-[#C5A059]/20 shadow-2xl">
              <Image
                src="/products/gulzar.jpg"
                alt="Stellify Gulzar Handcrafted Bangle Set"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B16]/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping Floating Secondary Image */}
            <div className="hidden sm:block absolute -bottom-6 -right-4 w-48 h-52 rounded-sm overflow-hidden border border-[#C5A059]/30 shadow-2xl">
              <Image
                src="/products/mehrish.jpg"
                alt="Stellify Mehrish Crimson Mirror Details"
                fill
                sizes="25vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#071326]/20" />
            </div>

            {/* Decorative Gold Monogram Stamp */}
            <div className="absolute -top-4 -left-4 bg-[#071326] border border-[#C5A059]/40 p-3 rounded-sm shadow-xl hidden sm:block">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-sans font-medium">
                EST. DHAKA
              </span>
            </div>
          </motion.div>

          {/* Right Column: Narrative Copy */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start lg:pl-6"
          >
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] mb-4">
              Our Artisanal Heritage
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-light leading-[1.18] tracking-tight">
              Woven with care, <br />
              <span className="italic text-[#C5A059]">tradition and soul.</span>
            </h2>

            <div className="w-16 h-[1px] bg-[#C5A059]/40 my-8" />

            <blockquote className="font-serif italic text-xl sm:text-2xl text-[#FAF7F2]/90 leading-relaxed font-light mb-6">
              &ldquo;This is not just metal. This is memory wrapped around a wrist, quiet in its glow, loud in its meaning.&rdquo;
            </blockquote>

            <p className="text-sm font-sans text-[#D4C9BA]/80 leading-relaxed mb-6 font-light">
              In an age of rushed manufacturing, Stellify returns to the intimate rhythm of the artisan&rsquo;s touch.
              Each bangle begins with pure raw silk and fine threads, wound patiently millimeter by millimeter over sturdy bases.
              Accented with luminous pearls, micro floral motifs, and hand-cut mirrors, our creations celebrate the timeless grace of Bengal.
            </p>

            <p className="text-sm font-sans text-[#D4C9BA]/80 leading-relaxed mb-10 font-light">
              Whether you are curating an heirloom set for a wedding reception or seeking an understated everyday signature, Stellify speaks uniquely to who you are.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#C5A059] hover:text-[#E5C378] font-medium group transition-colors"
            >
              <span>Explore All Handcrafted Sets</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default StorySection;
