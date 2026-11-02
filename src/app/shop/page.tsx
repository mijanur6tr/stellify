'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Heart, ShoppingBag, MessageSquare, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer, CartItem } from '@/components/cart/CartDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBDT } from '@/lib/utils/currency';
import { useStore } from '@/context/StoreContext';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  collection: string;
  collectionSlug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  colours: string[];
  occasion: string;
  materials: string[];
  shortDescription: string;
}

const mockCatalog: ProductData[] = [
  {
    id: 'prod-gulzar-1',
    name: 'Gulzar Brushed Gold & Cocoa Bangle Set',
    slug: 'gulzar-brushed-gold-cocoa',
    collection: 'Gulzar',
    collectionSlug: 'gulzar',
    price: 1750,
    compareAtPrice: 1950,
    image: '/products/gulzar.jpg',
    colours: ['Cocoa Brown', 'Antique Gold'],
    occasion: 'Festive',
    materials: ['Raw Silk Thread', 'Brushed Brass Leaf Accents'],
    shortDescription: 'Warm cocoa threads with brushed gold leaf motifs and raw textured edges.',
  },
  {
    id: 'prod-indra-1',
    name: 'Indra Royal Cobalt Silk Bangle Set',
    slug: 'indra-royal-cobalt-silk',
    collection: 'Indra',
    collectionSlug: 'indra',
    price: 1650,
    compareAtPrice: 1850,
    image: '/products/indra.jpg',
    colours: ['Cobalt Blue', 'White', 'Gold'],
    occasion: 'Wedding',
    materials: ['Royal Blue Silk', 'Micro White Ceramic Flowers', 'Faux Pearls'],
    shortDescription: 'Cobalt silk threads with delicate white flowers, seed pearls, and gold-leaf lace.',
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
    colours: ['Crimson Red', 'Ivory', 'Gold'],
    occasion: 'Bridal',
    materials: ['Crimson Silk Thread', 'Mirror Accents', 'Ivory Pearl Clusters'],
    shortDescription: 'Crimson silk thread bangles embellished with authentic mirrorwork and ivory pearl clusters.',
  },
  {
    id: 'prod-sitara-1',
    name: 'Sitara Magenta Zardozi Silk Bangle Set',
    slug: 'sitara-magenta-zardozi',
    collection: 'Sitara',
    collectionSlug: 'sitara',
    price: 1600,
    compareAtPrice: 1800,
    image: '/products/sitara.jpg',
    colours: ['Magenta', 'Gold'],
    occasion: 'Festive',
    materials: ['Magenta Silk Thread', 'Metallic Zardozi Cord'],
    shortDescription: 'Fuchsia silk threads adorned with intricate golden zardozi embroidery motifs.',
  },
  {
    id: 'prod-orchidia-1',
    name: 'Orchidia Lilac Floral Bangle Set',
    slug: 'orchidia-lilac-floral',
    collection: 'Orchidia',
    collectionSlug: 'orchidia',
    price: 1550,
    compareAtPrice: 1750,
    image: '/products/orchidia.jpg',
    colours: ['Lavender', 'Ivory'],
    occasion: 'Daytime',
    materials: ['Lavender Silk Thread', 'Soft Glass Crystals', 'Pearl Trim'],
    shortDescription: 'Pastel lilac silk wrap with handcrafted botanical stone accents and pearl trim.',
  },
  {
    id: 'prod-cream-whirl-1',
    name: 'Cream Whirl Artisanal Silk Bangle Set',
    slug: 'cream-whirl-artisanal-silk',
    collection: 'Cream Whirl',
    collectionSlug: 'cream-whirl',
    price: 1650,
    compareAtPrice: 1850,
    image: '/products/cream whirl.jpg',
    colours: ['Cream', 'Ivory', 'Gold'],
    occasion: 'Daytime',
    materials: ['Ivory Silk Thread', 'Golden Spiral Wire', 'Seed Pearls'],
    shortDescription: 'Cream and ivory thread-wrapped bangles with delicate golden swirls and seed pearls.',
  },
  {
    id: 'prod-lustrous-1',
    name: 'Lustrous Champagne Geometric Bangle Set',
    slug: 'lustrous-champagne-geometric',
    collection: 'Lustrous',
    collectionSlug: 'lustrous',
    price: 1700,
    compareAtPrice: 1900,
    image: '/products/lustrous.jpg',
    colours: ['Champagne', 'Cream', 'Gold'],
    occasion: 'Wedding',
    materials: ['Champagne Thread', 'Polished Acrylic Stones', 'Metallic Studs'],
    shortDescription: 'Natural champagne thread wrap with polished diamond-cut stones and floral studs.',
  },
  {
    id: 'prod-luminous-1',
    name: 'Luminous Ivory & Pink Floral Bangle Set',
    slug: 'luminous-ivory-pink',
    collection: 'Luminous',
    collectionSlug: 'luminous',
    price: 1500,
    compareAtPrice: 1650,
    image: '/products/luminous.jpg',
    colours: ['Off-White', 'Soft Pink'],
    occasion: 'Gifting',
    materials: ['Off-White Silk Thread', 'Pastel Pink Oval Beads'],
    shortDescription: 'Off-white thread-wrapped bangles with delicate pink oval beads and floral bead clusters.',
  },
  {
    id: 'prod-classy-1',
    name: 'Classy Violet Starburst Bangle Set',
    slug: 'classy-violet-starburst',
    collection: 'Classy',
    collectionSlug: 'classy',
    price: 1650,
    compareAtPrice: 1850,
    image: '/products/classy.jpg',
    colours: ['Violet', 'Lavender', 'Silver'],
    occasion: 'Festive',
    materials: ['Deep Violet Silk', 'Silver Studs', 'Lavender Thread'],
    shortDescription: 'Deep violet silk thread with silver-toned floral and starburst embellishments.',
  },
  {
    id: 'prod-rangsutra-1',
    name: 'Rangsutra Crimson & Noir Criss-Cross Bangle Set',
    slug: 'rangsutra-crimson-noir',
    collection: 'Rangsutra',
    collectionSlug: 'rangsutra',
    price: 1450,
    compareAtPrice: 1600,
    image: '/products/rangsutra.jpg',
    colours: ['Crimson Red', 'Black'],
    occasion: 'Daytime',
    materials: ['Crimson Thread', 'Black Cord', 'Noir Studs'],
    shortDescription: 'A trio of bold statement bangles featuring crimson red thread and black criss-cross cord.',
  },
  {
    id: 'prod-tressora-1',
    name: 'Tressora Peacock Teal & Gold Bangle Set',
    slug: 'tressora-teal-gold',
    collection: 'Tressora',
    collectionSlug: 'tressora',
    price: 1550,
    compareAtPrice: 1750,
    image: '/products/tressora.jpg',
    colours: ['Peacock Teal', 'Golden Yellow'],
    occasion: 'Festive',
    materials: ['Peacock Teal Silk', 'Golden Yellow Silk', 'Rhinestone Studs'],
    shortDescription: 'Vibrant teal and golden yellow silk threads with rhythmic chevron stitching and rhinestone studs.',
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCollection = searchParams.get('collection') || 'all';
  const initialOccasion = searchParams.get('occasion') || 'all';

  const [productsList, setProductsList] = React.useState<ProductData[]>(mockCatalog);
  const [selectedCollection, setSelectedCollection] = React.useState(initialCollection);
  const [selectedOccasion, setSelectedOccasion] = React.useState(initialOccasion);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const {
    cart,
    cartCount,
    favouriteCount,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    isFav,
    toggleFav,
  } = useStore();

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok && data.products && data.products.length > 0) {
          setProductsList(data.products);
        }
      } catch (err) {
        console.warn('Using initial product catalog fallback:', err);
      }
    }
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return productsList
      .filter((p) => {
        if (selectedCollection !== 'all' && p.collectionSlug !== selectedCollection) return false;
        if (selectedOccasion !== 'all' && p.occasion.toLowerCase() !== selectedOccasion.toLowerCase()) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.collection.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q) ||
            p.colours.some((c) => c.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [selectedCollection, selectedOccasion, searchQuery, sortBy]);

  const collectionsList = [
    { label: 'All Collections', value: 'all' },
    { label: 'Gulzar', value: 'gulzar' },
    { label: 'Indra', value: 'indra' },
    { label: 'Mehrish', value: 'mehrish' },
    { label: 'Sitara', value: 'sitara' },
    { label: 'Orchidia', value: 'orchidia' },
    { label: 'Cream Whirl', value: 'cream-whirl' },
    { label: 'Lustrous', value: 'lustrous' },
    { label: 'Luminous', value: 'luminous' },
    { label: 'Classy', value: 'classy' },
    { label: 'Rangsutra', value: 'rangsutra' },
    { label: 'Tressora', value: 'tressora' },
  ];

  return (
    <div className="min-h-screen bg-[#071326] text-[#FAF7F2] flex flex-col">
      <Header
        cartCount={cartCount}
        favouriteCount={favouriteCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 py-12 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        {/* Page Banner / Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] block mb-2">
            The Atelier Catalog
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-light tracking-tight">
            Handcrafted <span className="italic text-[#C5A059]">Bangle Sets</span>
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#D4C9BA]/70 mt-3 font-light">
            Each set is thread-wrapped by skilled artisans. Cash on delivery available across all 64 districts.
          </p>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#162B4C]">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF7F2]/40" />
            <input
              type="text"
              placeholder="Search by collection, color, or motif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-[#0B1C36] border border-[#162B4C] text-xs text-[#FAF7F2] placeholder-[#FAF7F2]/40 focus:outline-none focus:border-[#C5A059]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF7F2]/40 hover:text-[#FAF7F2]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans text-[#FAF7F2]/60 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0B1C36] border border-[#162B4C] text-xs text-[#FAF7F2] px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-[#C5A059]"
            >
              <option value="featured">Featured Atelier Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Collection Pill Strips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-8 border-b border-[#162B4C]/40">
          {collectionsList.map((col) => {
            const active = selectedCollection === col.value;
            return (
              <button
                key={col.value}
                onClick={() => setSelectedCollection(col.value)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all ${
                  active
                    ? 'bg-[#C5A059] text-[#071326] font-semibold shadow-[0_0_15px_rgba(197,160,89,0.25)]'
                    : 'bg-[#0B1C36] text-[#FAF7F2]/70 hover:text-[#FAF7F2] border border-[#162B4C]'
                }`}
              >
                {col.label}
              </button>
            );
          })}
        </div>

        {/* Active Results Summary */}
        <div className="flex items-center justify-between text-xs text-[#FAF7F2]/60 mb-6 font-sans">
          <span>Showing {filteredProducts.length} handcrafted sets</span>
          {(selectedCollection !== 'all' || selectedOccasion !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCollection('all');
                setSelectedOccasion('all');
                setSearchQuery('');
              }}
              className="text-[#C5A059] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isFavorite = isFav(product.id);
            return (
              <div
                key={product.id}
                className="group bg-[#0B1C36] border border-[#162B4C] hover:border-[#C5A059]/40 rounded-sm overflow-hidden flex flex-col transition-all duration-500"
              >
                {/* Image Container with Floating Actions */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#071326]">
                  <Link href={`/products/${product.slug}`} className="relative block w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center filter brightness-[0.9] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C36] via-transparent to-transparent opacity-80" />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <Badge variant="gold">{product.collection}</Badge>
                    <Badge variant="subtle">{product.occasion}</Badge>
                  </div>

                  {/* Favourite Heart Button */}
                  <button
                    type="button"
                    onClick={() => toggleFav(product)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-[#7A1C28] border-[#A82838] text-white shadow-[0_0_12px_rgba(122,28,40,0.5)]'
                        : 'bg-[#071326]/70 border-[#C5A059]/30 text-[#FAF7F2] hover:text-[#C5A059]'
                    }`}
                    aria-label={isFavorite ? 'Remove from favourites' : 'Save to favourites'}
                  >
                    <Heart
                      className={`w-4 h-4 stroke-[1.5] transition-transform ${
                        isFavorite ? 'fill-current text-white scale-110' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Card Info Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#C5A059] block mb-1">
                      {product.collection} Collection
                    </span>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-serif text-2xl text-[#FAF7F2] group-hover:text-[#C5A059] transition-colors leading-snug line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs font-sans text-[#FAF7F2]/65 mt-2 line-clamp-2 leading-relaxed font-light">
                      {product.shortDescription}
                    </p>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-2 mt-4">
                      {product.colours.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-sans px-2 py-0.5 rounded-sm bg-[#071326] border border-[#162B4C] text-[#FAF7F2]/75"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="pt-6 mt-6 border-t border-[#162B4C] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-[#E5C378]">
                          {formatBDT(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-[#FAF7F2]/40 line-through">
                            {formatBDT(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#C5A059]/80 font-sans block">
                        Cash on Delivery
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="p-2.5 rounded-sm border border-[#162B4C] hover:border-[#C5A059]/40 text-[#FAF7F2]/80 hover:text-[#C5A059] transition-colors"
                        title="Order via Style Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>

                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        className="gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#071326] flex items-center justify-center text-[#C5A059]">
          <span className="font-serif text-xl tracking-widest animate-pulse">STELLIFY ATELIER...</span>
        </div>
      }
    >
      <ShopContent />
    </React.Suspense>
  );
}

