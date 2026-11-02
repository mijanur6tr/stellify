'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Truck,
  Ruler,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatBDT } from '@/lib/utils/currency';

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
  longDescription: string;
  stock: number;
}

const mockProducts: Record<string, ProductData> = {
  'gulzar-brushed-gold-cocoa': {
    id: 'prod-gulzar-1',
    name: 'Gulzar Brushed Gold & Cocoa Bangle Set',
    slug: 'gulzar-brushed-gold-cocoa',
    collection: 'Gulzar',
    collectionSlug: 'gulzar',
    price: 1750,
    compareAtPrice: 1950,
    image: '/products/gulzar.jpg',
    colours: ['Cocoa Brown', 'Warm Gold'],
    occasion: 'Festive & Elegant Daytime',
    materials: ['Raw Silk Thread', 'Brushed Brass Leaf Accents', 'Textured Zari Cord'],
    shortDescription: 'Warm cocoa threads wrapped in natural texture with brushed gold leaf motifs.',
    longDescription:
      'Gulzar is a quiet, earthen tribute to the autumnal landscape. Each bangle begins with natural-textured cocoa silk thread, wound with patient precision. It is accented with brushed gold leaf rosettes and laser-edged metallic trims. A tactile masterpiece designed for celebrations and quiet afternoon gatherings.',
    stock: 14,
  },
  'indra-royal-cobalt-silk': {
    id: 'prod-indra-1',
    name: 'Indra Royal Cobalt Silk Bangle Set',
    slug: 'indra-royal-cobalt-silk',
    collection: 'Indra',
    collectionSlug: 'indra',
    price: 1650,
    compareAtPrice: 1850,
    image: '/products/indra.jpg',
    colours: ['Cobalt Blue', 'White', 'Gold'],
    occasion: 'Wedding & Evening Reception',
    materials: ['Royal Blue Silk', 'Micro White Ceramic Flowers', 'Faux Seed Pearls', 'Gold Cord'],
    shortDescription: 'Cobalt silk threads with delicate white flowers, seed pearls, and gold-leaf lace.',
    longDescription:
      'Cobalt silk threads scattered with small white flowers and pearl trim. This handcrafted set reads as considered rather than decorative: the mark of deliberate, artisanal craftsmanship. Each bangle carries a story of its own, shaped by hands that know patience, poured into gold that never rushes itself.',
    stock: 12,
  },
  'mehrish-crimson-mirror-pearl': {
    id: 'prod-mehrish-1',
    name: 'Mehrish Crimson Mirror & Pearl Bangle Set',
    slug: 'mehrish-crimson-mirror-pearl',
    collection: 'Mehrish',
    collectionSlug: 'mehrish',
    price: 1850,
    compareAtPrice: 2100,
    image: '/products/mehrish.jpg',
    colours: ['Crimson Red', 'Ivory', 'Gold'],
    occasion: 'Bridal & Holud',
    materials: ['Crimson Silk Thread', 'Authentic Mirror Accents (Aabhla)', 'Ivory Pearl Clusters'],
    shortDescription: 'Crimson silk thread bangles embellished with authentic mirrorwork and ivory pearl clusters.',
    longDescription:
      'Mehrish brings bridal drama and heritage into luminous alignment. Spun with deep crimson silk threads, the bangles feature hand-fastened glass mirrors bordered by delicate ivory pearl strings that shimmer with every gesture.',
    stock: 10,
  },
  'sitara-magenta-zardozi': {
    id: 'prod-sitara-1',
    name: 'Sitara Magenta Zardozi Silk Bangle Set',
    slug: 'sitara-magenta-zardozi',
    collection: 'Sitara',
    collectionSlug: 'sitara',
    price: 1600,
    compareAtPrice: 1800,
    image: '/products/sitara.jpg',
    colours: ['Magenta Fuchsia', 'Antique Gold'],
    occasion: 'Festive & Party Wear',
    materials: ['Magenta Silk Thread', 'Metallic Zardozi Cord', 'Gold Sequins'],
    shortDescription: 'Fuchsia silk threads adorned with intricate golden zardozi embroidery motifs.',
    longDescription:
      'Named after the stars, Sitara celebrates twilight celebrations with deep jewel-toned magenta silk and shimmering metallic cord embroidery. Pairs effortlessly with raw silk and georgette sarees.',
    stock: 8,
  },
  'orchidia-lilac-floral': {
    id: 'prod-orchidia-1',
    name: 'Orchidia Lilac Floral Bangle Set',
    slug: 'orchidia-lilac-floral',
    collection: 'Orchidia',
    collectionSlug: 'orchidia',
    price: 1550,
    compareAtPrice: 1750,
    image: '/products/orchidia.jpg',
    colours: ['Lavender Lilac', 'Ivory'],
    occasion: 'Daytime Soirée & Eid',
    materials: ['Lavender Silk Thread', 'Soft Glass Crystals', 'Pearl Trim'],
    shortDescription: 'Pastel lilac silk wrap with handcrafted botanical stone accents and pearl trim.',
    longDescription:
      'Orchidia is quiet poetry in soft lavender. Inspired by dew-touched floral petals, this pastel set balances soft lilac silk with dew-drop crystals and ivory pearls.',
    stock: 15,
  },
  'cream-whirl-artisanal-silk': {
    id: 'prod-cream-whirl-1',
    name: 'Cream Whirl Artisanal Silk Bangle Set',
    slug: 'cream-whirl-artisanal-silk',
    collection: 'Cream Whirl',
    collectionSlug: 'cream-whirl',
    price: 1650,
    compareAtPrice: 1850,
    image: '/products/cream whirl.jpg',
    colours: ['Cream', 'Ivory', 'Gold'],
    occasion: 'Daytime Elegance & Family Celebrations',
    materials: ['Ivory Silk Thread', 'Golden Spiral Wire', 'Seed Pearls'],
    shortDescription: 'Cream and ivory thread-wrapped bangles with delicate golden swirls and seed pearls.',
    longDescription:
      'A serene, minimalist set spun with ivory silk and accented with handcrafted golden whorls and delicate seed pearls. Understated luxury that complements almost any festive or daytime outfit.',
    stock: 10,
  },
};

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  // Robust product lookup by exact slug, collection slug, or slug keywords
  const findProduct = (slugToFind?: string): ProductData => {
    if (!slugToFind) return mockProducts['indra-royal-cobalt-silk'];
    if (mockProducts[slugToFind]) return mockProducts[slugToFind];

    const normalized = slugToFind.toLowerCase();
    const match = Object.values(mockProducts).find(
      (p) =>
        p.slug.toLowerCase() === normalized ||
        p.id.toLowerCase() === normalized ||
        normalized.includes(p.collectionSlug.toLowerCase()) ||
        p.collectionSlug.toLowerCase().includes(normalized.split('-')[0]) ||
        p.slug.toLowerCase().includes(normalized.split('-')[0])
    );

    return match || mockProducts['indra-royal-cobalt-silk'];
  };

  const product = findProduct(slug);
  const router = useRouter();

  const [selectedSize, setSelectedSize] = React.useState('2-6 (Standard)');
  const [selectedColor, setSelectedColor] = React.useState(product.colours[0]);
  const [sizeModalOpen, setSizeModalOpen] = React.useState(false);
  const [addedNotice, setAddedNotice] = React.useState(false);

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

  const handleAddToCart = () => {
    addToCart(product, 1, { size: selectedSize, color: selectedColor });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const isFavourite = isFav(product.id);

  const sizes = ['2-4 (Small)', '2-6 (Standard)', '2-8 (Large)', 'Custom'];

  return (
    <div className="min-h-screen bg-[#071326] text-[#FAF7F2] flex flex-col">
      <Header
        cartCount={cartCount}
        favouriteCount={favouriteCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 py-12 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#FAF7F2]/60 mb-8">
          <Link href="/shop" className="hover:text-[#C5A059] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shop</span>
          </Link>
          <span>/</span>
          <span className="text-[#C5A059]">{product.collection}</span>
          <span>/</span>
          <span className="text-[#FAF7F2] truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Visual Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden border border-[#C5A059]/30 bg-[#0B1C36] shadow-2xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center filter brightness-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/60 via-transparent to-transparent pointer-events-none" />

              {/* Atelier Hallmark Tag */}
              <div className="absolute top-4 left-4">
                <Badge variant="gold">{product.collection} Atelier</Badge>
              </div>
            </div>

            {/* Micro Gallery Thumbnails */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-20 h-20 rounded-sm overflow-hidden border-2 border-[#C5A059] cursor-pointer">
                <Image src={product.image} alt={product.name} fill sizes="80px" className="object-cover" />
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing Controls */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#C5A059] mb-2">
              {product.collection} Collection
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-light leading-tight">
              {product.name}
            </h1>

            {/* Price Badge */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-2xl sm:text-3xl font-semibold text-[#E5C378]">
                {formatBDT(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-[#FAF7F2]/40 line-through">
                  {formatBDT(product.compareAtPrice)}
                </span>
              )}
              <span className="text-[11px] font-sans tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-sm bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                In Stock ({product.stock} sets)
              </span>
            </div>

            <div className="w-full h-[1px] bg-[#162B4C] my-4" />

            {/* Short Narrative */}
            <p className="text-sm font-sans text-[#D4C9BA]/80 leading-relaxed font-light mb-6">
              {product.longDescription}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#D4C9BA] font-medium">
                  Select Bangle Size
                </span>
                <button
                  onClick={() => setSizeModalOpen(true)}
                  className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 font-sans"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-3 text-xs font-sans rounded-sm border transition-all text-center ${
                      selectedSize === s
                        ? 'bg-[#C5A059] text-[#071326] font-semibold border-[#C5A059]'
                        : 'bg-[#0B1C36] text-[#FAF7F2]/80 border-[#162B4C] hover:border-[#C5A059]/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Materials Breakdown */}
            <div className="bg-[#0B1C36] border border-[#162B4C] p-4 rounded-sm mb-8">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5A059] block mb-2 font-medium">
                Artisanal Materials &amp; Provenance
              </span>
              <ul className="text-xs text-[#FAF7F2]/75 space-y-1 font-sans">
                {product.materials.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={handleAddToCart} className="w-full gap-2">
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {formatBDT(product.price)}</span>
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    addToCart(product, 1, { size: selectedSize, color: selectedColor });
                    router.push('/checkout');
                  }}
                >
                  Order via COD
                </Button>

                <button
                  type="button"
                  onClick={() => toggleFav(product)}
                  className={`py-3 px-4 rounded-sm border transition-all flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-[0.18em] cursor-pointer ${
                    isFavourite
                      ? 'bg-[#7A1C28]/30 text-white border-[#7A1C28] shadow-[0_0_12px_rgba(122,28,40,0.4)]'
                      : 'bg-[#0B1C36] text-[#FAF7F2]/80 border-[#162B4C] hover:border-[#C5A059]/40'
                  }`}
                  aria-label={isFavourite ? 'Remove from saved' : 'Save to favourites'}
                >
                  <Heart className={`w-4 h-4 transition-transform ${isFavourite ? 'fill-[#E08A93] text-[#E08A93] scale-110' : ''}`} />
                  <span>{isFavourite ? 'Saved' : 'Favourite'}</span>
                </button>
              </div>
            </div>

            {/* Delivery Guarantees */}
            <div className="mt-8 pt-6 border-t border-[#162B4C] space-y-3 text-xs text-[#D4C9BA]/70 font-sans">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Cash on Delivery Only • Zero upfront payments</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Delivery: Dhaka ৳70 (2-3 days) • Outside Dhaka ৳130 (3-5 days)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Carefully packed in a signature Stellify keepsake pouch</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Sizing Guide Modal */}
      <Modal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        title="Stellify Bangle Size Guide"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs font-sans text-[#FAF7F2]/85">
          <p className="leading-relaxed">
            To measure your bangle size accurately, measure the inner diameter of a bangle that fits you well, or measure the circumference of your hand at the widest point (with thumb folded into palm).
          </p>

          <table className="w-full text-left border-collapse border border-[#162B4C] mt-2">
            <thead>
              <tr className="bg-[#071326] text-[#C5A059]">
                <th className="p-2.5 border border-[#162B4C]">Size</th>
                <th className="p-2.5 border border-[#162B4C]">Inner Diameter</th>
                <th className="p-2.5 border border-[#162B4C]">Wrist Fit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2.5 border border-[#162B4C] font-semibold text-[#E5C378]">2-4</td>
                <td className="p-2.5 border border-[#162B4C]">2.25 in (57.2 mm)</td>
                <td className="p-2.5 border border-[#162B4C]">Petite / Small</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-[#162B4C] font-semibold text-[#E5C378]">2-6</td>
                <td className="p-2.5 border border-[#162B4C]">2.375 in (60.3 mm)</td>
                <td className="p-2.5 border border-[#162B4C]">Standard (Most Common)</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-[#162B4C] font-semibold text-[#E5C378]">2-8</td>
                <td className="p-2.5 border border-[#162B4C]">2.50 in (63.5 mm)</td>
                <td className="p-2.5 border border-[#162B4C]">Comfortable / Broad</td>
              </tr>
            </tbody>
          </table>

          <p className="text-[11px] text-[#D4C9BA]/60 italic pt-2">
            Need special sizing (e.g. 2-2 or 2-10)? Feel free to note it at checkout or ask our Style Concierge.
          </p>
        </div>
      </Modal>

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

export default function ProductDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#071326] flex items-center justify-center text-[#C5A059]">
          <span className="font-serif text-xl tracking-widest animate-pulse">STELLIFY ATELIER...</span>
        </div>
      }
    >
      <ProductDetailContent />
    </React.Suspense>
  );
}

