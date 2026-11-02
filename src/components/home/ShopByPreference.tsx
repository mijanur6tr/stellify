'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function ShopByPreference() {
  const occasions = [
    { label: 'Wedding & Bridal', query: 'occasion=wedding' },
    { label: 'Festive & Holud', query: 'occasion=festive' },
    { label: 'Daytime Soirée', query: 'occasion=daytime' },
    { label: 'Gifting & Keepsakes', query: 'occasion=gifting' },
  ];

  const colours = [
    { name: 'Cobalt Blue', hex: '#1B3B6F', query: 'colour=blue' },
    { name: 'Crimson Red', hex: '#7A1C28', query: 'colour=red' },
    { name: 'Cocoa Brown', hex: '#5A3926', query: 'colour=brown' },
    { name: 'Magenta Fuchsia', hex: '#8B1E6B', query: 'colour=magenta' },
    { name: 'Pastel Lilac', hex: '#9D8DB8', query: 'colour=lavender' },
    { name: 'Champagne Ivory', hex: '#D6C2A5', query: 'colour=ivory' },
    { name: 'Peacock Teal', hex: '#0D5C63', query: 'colour=teal' },
  ];

  const styles = [
    { label: 'Traditional Mirrorwork (Aabhla)', query: 'style=mirror' },
    { label: 'Ceramic Florals & Seed Pearls', query: 'style=floral' },
    { label: 'Metallic Zardozi Cord', query: 'style=zardozi' },
    { label: 'Minimalist Clean Wrap', query: 'style=minimal' },
  ];

  return (
    <section className="py-20 px-6 sm:px-12 bg-[#050C18] border-y border-[#162B4C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] block mb-2">
            Tailor Your Ensemble
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light">
            Shop by <span className="italic text-[#C5A059]">Preference</span>
          </h3>
        </motion.div>

        {/* 3 Categories Cards with Staggered Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. By Occasion */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#071326] border border-[#162B4C] hover:border-[#C5A059]/40 p-6 rounded-sm transition-colors duration-300"
          >
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#C5A059] block mb-4">
              By Occasion
            </span>
            <div className="flex flex-wrap gap-2">
              {occasions.map((occ) => (
                <Link
                  key={occ.label}
                  href={`/shop?${occ.query}`}
                  className="text-xs px-3.5 py-2 rounded-sm bg-[#0B1C36] text-[#FAF7F2]/80 hover:text-[#C5A059] border border-[#162B4C] hover:border-[#C5A059]/40 transition-all font-sans"
                >
                  {occ.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* 2. By Colour Palette */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#071326] border border-[#162B4C] hover:border-[#C5A059]/40 p-6 rounded-sm transition-colors duration-300"
          >
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#C5A059] block mb-4">
              By Silk Colour
            </span>
            <div className="flex flex-wrap gap-2.5 items-center">
              {colours.map((col) => (
                <Link
                  key={col.name}
                  href={`/shop?${col.query}`}
                  className="group flex items-center gap-2 text-xs px-3 py-1.5 rounded-sm bg-[#0B1C36] border border-[#162B4C] hover:border-[#C5A059]/40 text-[#FAF7F2]/80 hover:text-[#FAF7F2] transition-all"
                  title={col.name}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="text-[11px] font-sans">{col.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* 3. By Artisanal Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#071326] border border-[#162B4C] hover:border-[#C5A059]/40 p-6 rounded-sm transition-colors duration-300"
          >
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#C5A059] block mb-4">
              By Artisanal Style
            </span>
            <div className="flex flex-col gap-2">
              {styles.map((st) => (
                <Link
                  key={st.label}
                  href={`/shop?${st.query}`}
                  className="text-xs px-3.5 py-2 rounded-sm bg-[#0B1C36] text-[#FAF7F2]/80 hover:text-[#C5A059] border border-[#162B4C] hover:border-[#C5A059]/40 transition-all font-sans flex items-center justify-between group"
                >
                  <span>{st.label}</span>
                  <Sparkles className="w-3 h-3 text-[#C5A059] opacity-40 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ShopByPreference;
