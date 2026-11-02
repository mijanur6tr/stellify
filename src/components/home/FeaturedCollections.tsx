'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CollectionCardData {
  name: string;
  slug: string;
  tagline: string;
  image: string;
  accent: string;
  featured?: boolean;
}

const featuredCollections: CollectionCardData[] = [
  {
    name: 'Indra',
    slug: 'indra',
    tagline: 'Royal cobalt silk with white floral blossoms & seed pearls',
    image: '/products/indra.jpg',
    accent: '#1B3B6F',
    featured: true,
  },
  {
    name: 'Gulzar',
    slug: 'gulzar',
    tagline: 'Warm cocoa threads with brushed gold leaf motifs',
    image: '/products/gulzar.jpg',
    accent: '#5A3926',
    featured: true,
  },
  {
    name: 'Mehrish',
    slug: 'mehrish',
    tagline: 'Bridal crimson red with authentic mirrorwork (aabhla)',
    image: '/products/mehrish.jpg',
    accent: '#7A1C28',
    featured: false,
  },
  {
    name: 'Sitara',
    slug: 'sitara',
    tagline: 'Fuchsia magenta silk highlighted with intricate zardozi',
    image: '/products/sitara.jpg',
    accent: '#8B1E6B',
    featured: false,
  },
  {
    name: 'Cream Whirl',
    slug: 'cream-whirl',
    tagline: 'Ivory threads with golden spiral whorls & micro-pearls',
    image: '/products/cream whirl.jpg',
    accent: '#A69274',
    featured: false,
  },
  {
    name: 'Orchidia',
    slug: 'orchidia',
    tagline: 'Pastel lilac silk with handcrafted dew-drop crystals',
    image: '/products/orchidia.jpg',
    accent: '#6E6196',
    featured: false,
  },
];

export function FeaturedCollections() {
  return (
    <section id="collections" className="py-24 sm:py-36 px-6 sm:px-12 bg-[#071326] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] block mb-3">
              Curated Atelier Series
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-light tracking-tight">
              Signature <span className="italic text-[#C5A059]">Collections</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.22em] text-[#C5A059] hover:text-[#E5C378] transition-colors group"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Asymmetrical Editorial Grid with Bottom-to-Top Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCollections.map((col, idx) => {
            return (
              <motion.div
                key={col.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={`/shop?collection=${col.slug}`}
                  className="group relative overflow-hidden rounded-sm border border-[#162B4C] hover:border-[#C5A059]/50 transition-all duration-700 bg-[#0B1C36] flex flex-col justify-end p-6 sm:p-8 min-h-[420px] block"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center filter brightness-[0.55] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Subtle Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071326] via-[#071326]/40 to-transparent" />
                  </div>

                  {/* Top Corner Badge */}
                  <div className="relative z-10 self-start mb-auto">
                    <span className="text-[10px] font-sans tracking-[0.25em] uppercase px-3 py-1 bg-[#071326]/80 backdrop-blur-md border border-[#C5A059]/30 text-[#E5C378] rounded-sm">
                      {col.name}
                    </span>
                  </div>

                  {/* Bottom Card Copy */}
                  <div className="relative z-10 pt-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-3xl text-[#FAF7F2] font-normal group-hover:text-[#C5A059] transition-colors duration-300">
                        {col.name}
                      </h3>
                      <div className="w-8 h-8 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#071326] transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-xs font-sans text-[#FAF7F2]/75 mt-2 line-clamp-2 leading-relaxed">
                      {col.tagline}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default FeaturedCollections;
