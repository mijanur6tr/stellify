'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, CheckCircle2, Circle, Truck, Package, Clock, Phone, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBDT } from '@/lib/utils/currency';

interface OrderTimelineStep {
  title: string;
  desc: string;
  time?: string;
  done: boolean;
  current: boolean;
}

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderNumber, setOrderNumber] = React.useState(initialId);
  const [phone, setPhone] = React.useState(initialPhone);
  const [trackedOrder, setTrackedOrder] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLookup = React.useCallback(async (idToSearch = orderNumber, phoneToSearch = phone) => {
    if (!idToSearch.trim()) {
      setError('Please enter your Stellify Order Number (e.g. STL-2026-1042)');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: idToSearch.trim(),
          phone: phoneToSearch.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.orderNumber) {
        setTrackedOrder({
          orderNumber: data.orderNumber,
          date: new Date(data.createdAt).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          customerName: data.customerName,
          phone: phoneToSearch || '01644-711161',
          status: data.status,
          deliveryMethod: data.courier || 'Cash on Delivery (Steadfast Courier)',
          total: data.totalAmount,
          district: data.district,
          items: data.items,
          steps: data.milestones.map((m: any) => ({
            title: m.title,
            desc: m.description,
            time: m.timestamp,
            done: m.done,
            current: m.status === data.status,
          })) as OrderTimelineStep[],
        });
      } else {
        setError(data.error || `Order ${idToSearch} could not be located in our records.`);
      }
    } catch (err: any) {
      console.error('Track lookup failed:', err);
      setError('Failed to query order tracking service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [orderNumber, phone]);

  // If initial params provided, trigger auto-lookup
  React.useEffect(() => {
    if (initialId) {
      handleLookup(initialId, initialPhone);
    }
  }, [initialId, initialPhone, handleLookup]);

  return (
    <div className="min-h-screen bg-[#071326] text-[#FAF7F2] flex flex-col">
      <Header />

      <main className="flex-1 py-14 px-6 sm:px-12 max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] block mb-2">
            Real-time Status
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-light tracking-tight">
            Track Your <span className="italic text-[#C5A059]">Order</span>
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#D4C9BA]/70 mt-3 font-light">
            Enter your order number to follow the journey of your handcrafted bangles from our Mirpur atelier to your door.
          </p>
        </div>

        {/* Lookup Box */}
        <div className="bg-[#0B1C36] border border-[#162B4C] p-6 sm:p-8 rounded-sm mb-12 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Order Number *"
              placeholder="e.g. STL-2026-1042"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <Input
              label="Contact Phone Number"
              placeholder="e.g. 01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {error && <p className="text-xs text-[#E08A93] font-sans mb-4">{error}</p>}

          <Button
            size="md"
            onClick={() => handleLookup()}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            <span>Track Order</span>
          </Button>
        </div>

        {/* Order Details & Visual Timeline */}
        {trackedOrder && (
          <div className="bg-[#0B1C36] border border-[#C5A059]/30 rounded-sm p-6 sm:p-8 shadow-2xl animate-in fade-in duration-500 space-y-6">
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#162B4C]">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#FAF7F2]/60 block">
                  Order Reference
                </span>
                <h3 className="font-serif text-2xl text-[#E5C378] font-normal">
                  {trackedOrder.orderNumber}
                </h3>
                <span className="text-xs text-[#FAF7F2]/70 font-sans block mt-1">
                  Placed on {trackedOrder.date} &bull; Recipient: <strong className="text-[#FAF7F2]">{trackedOrder.customerName}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="gold">Status: {trackedOrder.status}</Badge>
                <Badge variant="subtle">Cash on Delivery</Badge>
              </div>
            </div>

            {/* Items Summary */}
            {trackedOrder.items && trackedOrder.items.length > 0 && (
              <div className="bg-[#071326] p-4 rounded-sm border border-[#162B4C] text-xs font-sans space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block font-semibold">
                  Ordered Creations
                </span>
                <div className="divide-y divide-[#162B4C]">
                  {trackedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="py-1.5 flex justify-between items-center text-[#FAF7F2]/80">
                      <span>{item.name} &times; {item.quantity}</span>
                      <span className="text-[#E5C378] font-medium">{formatBDT(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between items-center font-semibold text-[#E5C378]">
                    <span>Total Payable on Delivery ({trackedOrder.district}):</span>
                    <span>{formatBDT(trackedOrder.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="py-4">
              <h4 className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#C5A059] mb-8">
                Delivery Journey
              </h4>

              <div className="space-y-8 relative before:absolute before:inset-0 before:left-[17px] before:w-[2px] before:bg-[#162B4C]">
                {trackedOrder.steps.map((step: OrderTimelineStep, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-5">
                    {/* Circle Node */}
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        step.done
                          ? 'bg-[#C5A059] text-[#071326] border-[#C5A059]'
                          : step.current
                          ? 'bg-[#071326] text-[#C5A059] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.4)]'
                          : 'bg-[#0B1C36] text-[#FAF7F2]/30 border-[#162B4C]'
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 fill-current" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5
                          className={`font-serif text-lg ${
                            step.done || step.current ? 'text-[#FAF7F2]' : 'text-[#FAF7F2]/40'
                          }`}
                        >
                          {step.title}
                        </h5>
                        {step.time && (
                          <span className="text-[11px] font-sans text-[#E5C378]">
                            {step.time}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-sans text-[#FAF7F2]/65 mt-1 font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Courier Notice */}
            <div className="pt-6 border-t border-[#162B4C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans text-[#FAF7F2]/70">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A059]" />
                <span>Courier Service: {trackedOrder.deliveryMethod}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>Urgent Support: 01644-711161</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#071326] flex items-center justify-center text-[#C5A059]">
          <span className="font-serif text-xl tracking-widest animate-pulse">STELLIFY ATELIER TRACKING...</span>
        </div>
      }
    >
      <OrderTrackingContent />
    </React.Suspense>
  );
}
