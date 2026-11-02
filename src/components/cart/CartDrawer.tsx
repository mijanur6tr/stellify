'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { formatBDT } from '@/lib/utils/currency';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  collectionName?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Your Shopping Bag" position="right">
      {items.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-[#071326] border border-[#162B4C] flex items-center justify-center text-[#C5A059] mb-4">
            <ShoppingBag className="w-8 h-8 stroke-[1.25]" />
          </div>
          <h4 className="font-serif text-2xl text-[#FAF7F2]">Your bag is empty</h4>
          <p className="text-xs text-[#D4C9BA]/60 mt-2 max-w-xs font-sans">
            Explore our handcrafted silk-wrapped bangle sets and add soul to your jewelry collection.
          </p>
          <Link href="/shop" onClick={onClose} className="mt-6">
            <Button size="sm">Explore Catalog</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between pb-6">
          {/* Items List */}
          <div className="flex flex-col gap-4 divide-y divide-[#162B4C]/60 my-2">
            {items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                {/* Product Thumbnail */}
                <div className="relative w-20 h-20 rounded-sm overflow-hidden border border-[#162B4C] shrink-0 bg-[#071326]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-serif text-lg text-[#FAF7F2] truncate font-normal">
                    {item.name}
                  </h5>
                  {item.collectionName && (
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-sans block">
                      {item.collectionName} Collection
                    </span>
                  )}
                  <span className="text-xs text-[#E5C378] font-semibold mt-1 block">
                    {formatBDT(item.price)}
                  </span>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="inline-flex items-center border border-[#162B4C] rounded-sm bg-[#071326]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:text-[#C5A059] text-[#FAF7F2]/60 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs px-2.5 font-medium font-sans">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:text-[#C5A059] text-[#FAF7F2]/60 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-xs text-[#FAF7F2]/40 hover:text-[#E08A93] transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Summary & Checkout Action */}
          <div className="pt-6 border-t border-[#162B4C] mt-6 bg-[#0B1C36]">
            <div className="flex items-center justify-between text-xs text-[#D4C9BA] font-sans mb-2">
              <span>Subtotal</span>
              <span className="text-sm font-semibold text-[#FAF7F2]">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#D4C9BA] font-sans mb-4">
              <span>Estimated Delivery (COD)</span>
              <span className="text-[#C5A059]">From ৳70 (Inside Dhaka)</span>
            </div>

            <div className="bg-[#071326] p-3 rounded-sm border border-[#162B4C] text-[11px] text-[#FAF7F2]/75 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Cash on Delivery Only. Pay upon courier inspection.</span>
            </div>

            <Link href="/checkout" onClick={onClose} className="block w-full">
              <Button size="lg" className="w-full gap-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
export default CartDrawer;
