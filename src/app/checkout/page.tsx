'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatBDT } from '@/lib/utils/currency';
import { useStore } from '@/context/StoreContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, cartCount, favouriteCount } = useStore();

  const [formData, setFormData] = React.useState({
    fullName: '',
    phone: '',
    email: '',
    district: 'Dhaka',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = React.useState<number>(0);
  const [confirmedPhone, setConfirmedPhone] = React.useState<string>('');
  const [confirmedAddress, setConfirmedAddress] = React.useState<string>('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = formData.district.toLowerCase().includes('dhaka') ? 70 : 130;
  const totalAmount = subtotal + deliveryCharge;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your recipient full name';

    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!formData.phone.trim()) {
      errs.phone = 'Please provide a contact phone number';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678)';
    }

    if (!formData.address.trim()) errs.address = 'Please provide your full delivery street address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrors({ form: 'Your cart is empty. Please add products before placing an order.' });
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerPhone: formData.phone.replace(/[\s-]/g, ''),
          customerEmail: formData.email || undefined,
          fullAddress: formData.address,
          district: formData.district,
          notes: formData.notes,
          items: cart.map((i) => ({
            productId: i.productId || i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            selectedColor: i.selectedColor,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.order) {
        // Save confirmed details before clearing cart
        setConfirmedTotal(totalAmount);
        setConfirmedPhone(formData.phone.replace(/[\s-]/g, ''));
        setConfirmedAddress(`${formData.address}, ${formData.district}`);
        setOrderSuccess(data.order.orderNumber);

        // CLEAR THE CART AND LOCALSTORAGE ON SUCCESSFUL ORDER
        clearCart();
      } else {
        setErrors((prev) => ({ ...prev, form: data.error || 'Failed to place order. Please try again.' }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, form: 'Network error. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#071326] text-[#FAF7F2] flex flex-col">
        <Header cartCount={0} favouriteCount={favouriteCount} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#0B1C36] border border-[#C5A059]/40 rounded-sm p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-[#C5A059]/15 border border-[#C5A059] flex items-center justify-center text-[#C5A059] mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mb-2">
              Order Placed Successfully
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] mb-3">
              Thank you, {formData.fullName}!
            </h2>

            <p className="text-xs font-sans text-[#D4C9BA]/80 leading-relaxed mb-6 font-light">
              Your handcrafted bangle order has been placed. Items have been removed from your shopping bag, and our atelier will prepare your parcel with heartfelt care.
            </p>

            <div className="bg-[#071326] border border-[#162B4C] p-4 rounded-sm text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-[#FAF7F2]/60">Order Number:</span>
                <span className="font-semibold text-[#E5C378]">{orderSuccess}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FAF7F2]/60">Payment Mode:</span>
                <span className="text-[#FAF7F2]">Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FAF7F2]/60">Total Payable:</span>
                <span className="font-bold text-[#E5C378]">{formatBDT(confirmedTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FAF7F2]/60">Delivery Address:</span>
                <span className="text-[#FAF7F2] truncate max-w-xs">{confirmedAddress}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href={`/order-tracking?id=${orderSuccess}&phone=${encodeURIComponent(confirmedPhone)}`}>
                <Button size="md" className="w-full">
                  Track Live Order Status
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="ghost" size="sm" className="w-full">
                  Continue Browsing
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#071326] text-[#FAF7F2] flex flex-col">
        <Header cartCount={cartCount} favouriteCount={favouriteCount} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0B1C36] border border-[#162B4C] rounded-sm p-8 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#071326] border border-[#162B4C] flex items-center justify-center text-[#C5A059] mx-auto mb-4">
              <Truck className="w-8 h-8 stroke-[1.25]" />
            </div>
            <h2 className="font-serif text-2xl text-[#FAF7F2] mb-2">Your Shopping Bag is Empty</h2>
            <p className="text-xs font-sans text-[#D4C9BA]/70 mb-6">
              You do not have any items in your cart to checkout. Please explore our handcrafted collections first.
            </p>
            <Link href="/shop">
              <Button size="md" className="w-full">
                Explore Collections
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071326] text-[#FAF7F2] flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-sans text-[#FAF7F2]/60 hover:text-[#C5A059] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Delivery Form */}
          <div className="lg:col-span-7 bg-[#0B1C36] border border-[#162B4C] p-6 sm:p-8 rounded-sm">
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-[#C5A059] block mb-2">
              Step 1 of 1
            </span>
            <h2 className="font-serif text-3xl text-[#FAF7F2] font-light mb-6">
              Delivery Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Recipient Full Name *"
                placeholder="e.g. Habiba Sultana"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={errors.fullName}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Contact Phone Number *"
                  placeholder="01XXXXXXXXX"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                  helperText="Required for courier delivery call"
                />

                <Input
                  label="Email Address (Optional)"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  helperText="For order updates"
                />
              </div>

              {/* District Selector */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#D4C9BA]">
                  Delivery District *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-[#0B1C36]/70 border border-[#162B4C] rounded-sm px-4 py-3 text-sm text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Dhaka">Dhaka City (৳70 Delivery • 2-3 Days)</option>
                  <option value="Outside Dhaka">Outside Dhaka / Other Districts (৳130 Delivery • 3-5 Days)</option>
                </select>
              </div>

              <Input
                label="Full Delivery Address *"
                placeholder="House No, Road No, Sector / Area, Landmark..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={errors.address}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#D4C9BA]">
                  Special Order Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Bangle size preference (e.g. 2-4, 2-6, 2-8), gate instructions, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#0B1C36]/70 border border-[#162B4C] rounded-sm px-4 py-3 text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Payment Method Notice */}
              <div className="pt-4 border-t border-[#162B4C]">
                <div className="p-4 rounded-sm bg-[#071326] border border-[#C5A059]/30 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-serif text-lg text-[#C5A059]">Cash on Delivery (COD) Only</h5>
                    <p className="text-xs text-[#FAF7F2]/75 leading-relaxed mt-0.5 font-sans">
                      No online advance or card payment required. Simply pay cash to the courier agent upon receiving and inspecting your bangles.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-6"
              >
                Confirm Order with Cash on Delivery ({formatBDT(totalAmount)})
              </Button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-[#0B1C36] border border-[#162B4C] p-6 rounded-sm">
            <h3 className="font-serif text-2xl text-[#FAF7F2] mb-4">Order Summary</h3>

            <div className="space-y-4 divide-y divide-[#162B4C]">
              {cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden border border-[#162B4C] shrink-0 bg-[#071326]">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-base text-[#FAF7F2] truncate">{item.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5A059] block">
                        Qty: {item.quantity}
                      </span>
                      {item.selectedSize && (
                        <span className="text-[10px] text-[#FAF7F2]/60 font-sans">
                          • {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#E5C378] mt-1 block">
                      {formatBDT(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-[#162B4C] space-y-2.5 text-xs font-sans text-[#D4C9BA]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-sm text-[#FAF7F2] font-semibold">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge ({formData.district})</span>
                <span className="text-[#C5A059]">{formatBDT(deliveryCharge)}</span>
              </div>
              <div className="pt-3 border-t border-[#162B4C] flex justify-between text-base font-semibold text-[#E5C378]">
                <span>Total Amount Payable</span>
                <span>{formatBDT(totalAmount)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#162B4C] text-[11px] text-[#FAF7F2]/60 space-y-2 font-sans">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Courier dispatched via Steadfast / Pathao</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Contact 01644-711161 for urgent queries</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
