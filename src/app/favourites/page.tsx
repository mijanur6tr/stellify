'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { formatBDT } from '@/lib/utils/currency';
import { useStore } from '@/context/StoreContext';

export default function FavouritesPage() {
  const {
    favourites,
    removeFromFav,
    favouriteCount,
    cartCount,
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  return (
    <div className="min-h-screen bg-[#071326] text-[#FAF7F2] flex flex-col">
      <Header
        cartCount={cartCount}
        favouriteCount={favouriteCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      <main className="flex-1 py-14 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] block mb-2">
            Your Wishlist
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-light tracking-tight">
            Saved <span className="italic text-[#C5A059]">Favourites</span>
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#D4C9BA]/70 mt-3 font-light">
            Your handpicked pieces are saved locally on this device.
          </p>
        </div>

        {favourites.length === 0 ? (
          <div className="bg-[#0B1C36] border border-[#162B4C] p-12 rounded-sm text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#071326] border border-[#162B4C] flex items-center justify-center text-[#FAF7F2]/40 mx-auto mb-4">
              <Heart className="w-6 h-6 stroke-[1.25]" />
            </div>
            <h4 className="font-serif text-2xl text-[#FAF7F2]">No favourites saved yet</h4>
            <p className="text-xs font-sans text-[#D4C9BA]/60 mt-2 mb-6">
              Tap the heart icon on any bangle set to save it for later.
            </p>
            <Link href="/shop">
              <Button size="sm">Explore Collections</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favourites.map((item) => (
              <div
                key={item.id}
                className="bg-[#0B1C36] border border-[#162B4C] rounded-sm overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-[4/5] w-full bg-[#071326]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeFromFav(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#071326]/85 backdrop-blur-md border border-[#162B4C] text-[#FAF7F2]/60 hover:text-[#E08A93] hover:border-[#E08A93]/40 transition-colors cursor-pointer"
                    title="Remove from saved favourites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                      {item.collection} Collection
                    </span>
                    <Link href={`/products/${item.slug}`}>
                      <h4 className="font-serif text-xl text-[#FAF7F2] hover:text-[#C5A059] transition-colors">
                        {item.name}
                      </h4>
                    </Link>
                    <span className="text-sm font-semibold text-[#E5C378] mt-2 block">
                      {formatBDT(item.price)}
                    </span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#162B4C] flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="flex-1 gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </Button>
                    <Link href={`/products/${item.slug}`}>
                      <Button size="sm" variant="outline" className="px-3" title="View details">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
