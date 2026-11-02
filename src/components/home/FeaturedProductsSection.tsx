'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShoppingBag, Check, Heart } from 'lucide-react';
import { formatBDT } from '@/lib/utils/currency';
import { useStore } from '@/context/StoreContext';

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  collection: string;
  collectionSlug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: 'Bridal' | 'Festive' | 'Daily Luxe';
  materials: string[];
  shortDescription: string;
}

const ATELIER_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-indra-1',
    name: 'Indra Royal Cobalt Silk Bangle Set',
    slug: 'indra-royal-cobalt-silk',
    collection: 'Indra',
    collectionSlug: 'indra',
    price: 1650,
    compareAtPrice: 1850,
    image: '/products/indra.jpg',
    category: 'Festive',
    materials: ['Royal Blue Silk', 'Micro Ceramic Flowers', 'Faux Pearls'],
    shortDescription: 'Royal cobalt silk threads wound with delicate white floral blossoms and seed pearls.',
  },
  {
    id: 'prod-mehrish-1',
    name: 'Mehrish Crimson Mirror & Pearl Bangle Set',
    slug: 'mehrish-crimson-mirror-pearl',
    collection: 'Mehrish',
    collectionSlug: 'mehrish',
    price: 1850,
    compareAtPrice: 2100,
    image: '/products/mehrish.jpg',
    category: 'Bridal',
    materials: ['Crimson Silk Thread', 'Mirror Accents', 'Ivory Pearl Clusters'],
    shortDescription: 'Bridal crimson red threads with authentic mirrorwork (aabhla) and pearl clusters.',
  },
  {
    id: 'prod-gulzar-1',
    name: 'Gulzar Brushed Gold & Cocoa Bangle Set',
    slug: 'gulzar-brushed-gold-cocoa',
    collection: 'Gulzar',
    collectionSlug: 'gulzar',
    price: 1750,
    compareAtPrice: 1950,
    image: '/products/gulzar.jpg',
    category: 'Daily Luxe',
    materials: ['Raw Silk Thread', 'Brushed Brass Leaf Accents'],
    shortDescription: 'Warm cocoa threads with brushed gold leaf motifs and raw textured edges.',
  },
  {
    id: 'prod-sitara-1',
    name: 'Sitara Fuchsia Zardozi Bangle Set',
    slug: 'sitara-magenta-zardozi',
    collection: 'Sitara',
    collectionSlug: 'sitara',
    price: 1950,
    compareAtPrice: 2200,
    image: '/products/sitara.jpg',
    category: 'Bridal',
    materials: ['Fuchsia Silk Thread', 'Zardozi Gold Wire', 'Ruby Crystals'],
    shortDescription: 'Fuchsia magenta silk highlighted with intricate gold zardozi wire and crystal accents.',
  },
  {
    id: 'prod-orchidia-1',
    name: 'Orchidia Lilac Dew Crystal Bangle Set',
    slug: 'orchidia-lilac-floral',
    collection: 'Orchidia',
    collectionSlug: 'orchidia',
    price: 1700,
    compareAtPrice: 1900,
    image: '/products/orchidia.jpg',
    category: 'Festive',
    materials: ['Pastel Lilac Silk', 'Dew-Drop Crystals', 'Gold Filigree'],
    shortDescription: 'Pastel lilac silk adorned with handcrafted dew-drop crystals and golden filigree.',
  },
  {
    id: 'prod-cream-whirl-1',
    name: 'Cream Whirl Spiral Gold Bangle Set',
    slug: 'cream-whirl-artisanal-silk',
    collection: 'Cream Whirl',
    collectionSlug: 'cream-whirl',
    price: 1600,
    compareAtPrice: 1800,
    image: '/products/cream whirl.jpg',
    category: 'Daily Luxe',
    materials: ['Ivory Silk Thread', 'Spiral Gold Whorls', 'Micro-Pearls'],
    shortDescription: 'Luminous ivory silk threads detailed with golden spiral whorls and micro-pearl trims.',
  },
];

interface FeaturedProductsSectionProps {
  onAddToCart?: (product: ProductItem) => void;
}

export function FeaturedProductsSection({
  onAddToCart,
}: FeaturedProductsSectionProps) {
  const { isFav, toggleFav: storeToggleFav, addToCart: storeAddToCart } = useStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const categories = ['All', 'Bridal', 'Festive', 'Daily Luxe'];

  const filteredProducts =
    selectedCategory === 'All'
      ? ATELIER_PRODUCTS
      : ATELIER_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleAdd = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      storeAddToCart(product);
    }
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleToggleFav = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    storeToggleFav(product);
  };

  return (
    <section id="products" className="relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#061020] border-t border-[#122544]">
      {/* Subtle Background Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#C5A059]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14"
        >
          <div className="max-w-lg">
            <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-[#C5A059] block font-medium mb-1.5">
              • The Atelier Gallery •
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#FAF7F2] font-normal tracking-tight leading-[1.08]">
              Handcrafted Bangles & Sets
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-sans tracking-[0.14em] uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#C5A059] text-[#071326] font-medium shadow-[0_2px_12px_rgba(197,160,89,0.3)]'
                    : 'bg-[#0B1C36] text-[#FAF7F2]/75 hover:text-[#FAF7F2] hover:bg-[#122748] border border-[#C5A059]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Taller Portrait Product Grid (aspect-[4/5]) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="group relative aspect-[4/5] sm:aspect-[4/5] rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#071326] border border-[#C5A059]/25 hover:border-[#C5A059]/70 shadow-[0_15px_40px_rgba(3,8,16,0.6)] transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Full-Bleed Product Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className="absolute inset-0 block"
                  aria-label={product.name}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center filter brightness-[0.93] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  {/* Subtle Gradient to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/95 via-[#071326]/30 to-transparent" />
                </Link>

                {/* Top-Left: Collection Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#071326]/85 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-sans font-medium uppercase tracking-[0.2em]">
                    {product.collection}
                  </span>
                </div>

                {/* Top-Right: Quick View Arrow Link */}
                <Link
                  href={`/products/${product.slug}`}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#071326]/75 backdrop-blur-md border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                  aria-label={`View details of ${product.name}`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                {/* Floating Frosted Glass Bottom Shelf */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 z-10 p-3.5 sm:p-4 rounded-[20px] bg-[#071326]/90 backdrop-blur-md border border-[#C5A059]/35 flex flex-col gap-2.5 sm:gap-3 group-hover:border-[#C5A059]/70 transition-colors shadow-lg">
                  {/* Top Row: Full Product Name (Non-link) */}
                  <div className="w-full">
                    <h3 className="font-serif text-sm sm:text-base text-[#FAF7F2] font-normal tracking-tight leading-snug select-none">
                      {product.name}
                    </h3>
                  </div>

                  {/* Lower Row: Price (left) + Fav and Add to Cart (right) */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#162B4C]/80">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans text-sm sm:text-base font-medium text-[#FAF7F2]">
                        {formatBDT(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="font-sans text-[11px] text-[#FAF7F2]/40 line-through">
                          {formatBDT(product.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    {/* Dual Action Row: Fav Logo + Add to Cart */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Favourite Logo Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFav(product, e)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 border ${
                          isFav(product.id)
                            ? 'bg-[#7A1C28] border-[#A82838] text-white shadow-[0_0_12px_rgba(122,28,40,0.45)]'
                            : 'bg-[#0B1C36]/90 border-[#C5A059]/40 text-[#FAF7F2] hover:text-[#E5C378] hover:border-[#E5C378]'
                        }`}
                        aria-label={isFav(product.id) ? 'Remove from favourites' : 'Add to favourites'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                            isFav(product.id) ? 'fill-current scale-110 text-white' : ''
                          }`}
                        />
                      </button>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleAdd(product, e)}
                        className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full flex items-center gap-1.5 text-[11px] sm:text-xs font-sans font-medium tracking-wider uppercase transition-all duration-300 ${
                          addedId === product.id
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-[#C5A059] hover:bg-[#E5C378] text-[#071326] hover:scale-105 active:scale-95 shadow-[0_2px_10px_rgba(197,160,89,0.3)]'
                        }`}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        {addedId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Minimal Bottom Link to Full Boutique */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#C5A059]/40 hover:border-[#E5C378] bg-[#0A1830]/70 hover:bg-[#0E2040] text-[#FAF7F2]/90 hover:text-[#E5C378] text-xs sm:text-sm font-sans tracking-[0.16em] uppercase transition-all duration-300 group shadow-md"
          >
            <span>Explore All Boutique Sets</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;
