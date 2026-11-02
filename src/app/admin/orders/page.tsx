'use client';

import * as React from 'react';
import {
  ShoppingBag,
  Search,
  Truck,
  Phone,
  MapPin,
  Clock,
  Filter,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatBDT } from '@/lib/utils/currency';

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  district: string;
  address: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  item: string;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
}

const mockOrders: AdminOrder[] = [
  {
    id: '1',
    orderNumber: 'STL-2026-1042',
    customerName: 'Habiba Sultana',
    phone: '01644-711161',
    district: 'Dhaka',
    address: 'House-47/1, Road-15/1, Block-C, Mirpur-11',
    subtotal: 1650,
    deliveryCharge: 70,
    total: 1720,
    status: 'CONFIRMED',
    item: 'Indra Royal Cobalt Silk Bangle Set (Qty: 1, Size 2-6)',
    notes: 'Please dispatch after 2 PM',
    internalNotes: 'Customer confirmed via telephone call at 15:10',
    createdAt: 'Today, 14:30',
  },
  {
    id: '2',
    orderNumber: 'STL-2026-1041',
    customerName: 'Sadia Rahman',
    phone: '01712-345678',
    district: 'Outside Dhaka (Chittagong)',
    address: 'GEC Circle, Nasirabad, Chittagong',
    subtotal: 1850,
    deliveryCharge: 130,
    total: 1980,
    status: 'PACKED',
    item: 'Mehrish Crimson Mirror & Pearl Bangle Set (Qty: 1)',
    internalNotes: 'Steadfast Courier consignment generated',
    createdAt: 'Today, 12:15',
  },
  {
    id: '3',
    orderNumber: 'STL-2026-1040',
    customerName: 'Nusrat Jahan',
    phone: '01890-123456',
    district: 'Dhaka',
    address: 'Sector 7, Uttara, Dhaka',
    subtotal: 1550,
    deliveryCharge: 70,
    total: 1620,
    status: 'PLACED',
    item: 'Orchidia Lilac Floral Bangle Set (Qty: 1)',
    notes: 'Size 2-4 requested',
    createdAt: 'Today, 10:45',
  },
  {
    id: '4',
    orderNumber: 'STL-2026-1039',
    customerName: 'Tahmina Akter',
    phone: '01911-987654',
    district: 'Dhaka',
    address: 'Dhanmondi 27, Dhaka',
    subtotal: 1650,
    deliveryCharge: 70,
    total: 1720,
    status: 'OUT_FOR_DELIVERY',
    item: 'Gulzar Brushed Gold & Cocoa Bangle Set (Qty: 1)',
    internalNotes: 'Rider on route',
    createdAt: 'Yesterday, 16:20',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<AdminOrder[]>(mockOrders);
  const [filterStatus, setFilterStatus] = React.useState<string>('ALL');
  const [search, setSearch] = React.useState('');
  const [selectedOrder, setSelectedOrder] = React.useState<AdminOrder | null>(mockOrders[0]);
  const [newInternalNote, setNewInternalNote] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Fetch live orders from Neon PostgreSQL
  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        setSelectedOrder((prev) => prev ? (data.orders.find((o: AdminOrder) => o.id === prev.id) || data.orders[0]) : data.orders[0]);
      }
    } catch (err) {
      console.warn('Failed to fetch live orders, using initial display:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }
    return true;
  });

  const updateOrderStatus = async (id: string, status: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = { ...o, status };
          if (selectedOrder?.id === id) setSelectedOrder(updated);
          return updated;
        }
        return o;
      })
    );

    // Persist to Neon DB
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error('Failed to update order status in DB:', err);
    }
  };

  const addNote = async (id: string) => {
    if (!newInternalNote.trim()) return;
    const currentOrder = orders.find((o) => o.id === id);
    const combinedNotes = currentOrder?.internalNotes
      ? `${currentOrder.internalNotes} | ${newInternalNote.trim()}`
      : newInternalNote.trim();

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = {
            ...o,
            internalNotes: combinedNotes,
          };
          if (selectedOrder?.id === id) setSelectedOrder(updated);
          return updated;
        }
        return o;
      })
    );
    setNewInternalNote('');

    // Persist to Neon DB
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, internalNotes: combinedNotes }),
      });
    } catch (err) {
      console.error('Failed to update internal notes in DB:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mb-1">
          Cash on Delivery Fulfillment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light">
          Orders &amp; Dispatch Timeline
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#D4C9BA]/70 mt-1 font-light">
          Manage status updates to drive the customer live tracking timeline across Dhaka &amp; nationwide courier partners.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#162B4C]">
        {['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-sm text-xs font-sans tracking-wide transition-all ${
              filterStatus === st
                ? 'bg-[#C5A059] text-[#071326] font-semibold'
                : 'bg-[#071326] text-[#FAF7F2]/70 hover:text-[#FAF7F2] border border-[#162B4C]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Order List */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.map((o) => {
            const isSelected = selectedOrder?.id === o.id;
            return (
              <div
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`bg-[#071326] border p-5 rounded-sm cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)] bg-[#0B1C36]'
                    : 'border-[#162B4C] hover:border-[#162B4C]/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-[#E5C378] font-sans">
                    {o.orderNumber}
                  </span>
                  <Badge
                    variant={
                      o.status === 'DELIVERED'
                        ? 'emerald'
                        : o.status === 'OUT_FOR_DELIVERY'
                        ? 'cobalt'
                        : 'gold'
                    }
                  >
                    {o.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-[#FAF7F2]/80 font-sans">
                  <span>{o.customerName} ({o.phone})</span>
                  <span className="font-semibold text-[#FAF7F2]">{formatBDT(o.total)}</span>
                </div>

                <p className="text-[11px] text-[#FAF7F2]/60 mt-1 truncate font-sans">{o.item}</p>
                <div className="flex items-center justify-between text-[10px] text-[#FAF7F2]/40 mt-3 pt-2 border-t border-[#162B4C]/60 font-sans">
                  <span>{o.district}</span>
                  <span>{o.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Detail & Status Transition */}
        {selectedOrder && (
          <div className="lg:col-span-5 bg-[#071326] border border-[#C5A059]/30 rounded-sm p-6 sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#162B4C]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block font-sans">
                  Active Order Details
                </span>
                <h3 className="font-serif text-2xl text-[#FAF7F2] font-normal">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <Badge variant="gold">{selectedOrder.status}</Badge>
            </div>

            {/* Quick Status Control */}
            <div className="space-y-2">
              <label className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#D4C9BA] block font-medium">
                Update Customer Tracking Timeline
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as any)}
                className="w-full bg-[#0B1C36] border border-[#C5A059] text-xs text-[#FAF7F2] px-3.5 py-2.5 rounded-sm focus:outline-none"
              >
                <option value="PLACED">PLACED (Order Received)</option>
                <option value="CONFIRMED">CONFIRMED (Verified by Phone)</option>
                <option value="PACKED">PACKED (Wrapped in Keepsake Pouch)</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (Courier On Route)</option>
                <option value="DELIVERED">DELIVERED (Payment Collected)</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* Client Info */}
            <div className="space-y-2 text-xs font-sans text-[#FAF7F2]/80 bg-[#0B1C36] p-4 rounded-sm border border-[#162B4C]">
              <div className="flex items-center gap-2 text-[#FAF7F2] font-semibold">
                <span>{selectedOrder.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <a href={`tel:${selectedOrder.phone}`} className="text-[#C5A059] hover:underline">
                  {selectedOrder.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{selectedOrder.address}, {selectedOrder.district}</span>
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-1.5 text-xs font-sans text-[#FAF7F2]/80">
              <div className="flex justify-between">
                <span>Item Subtotal:</span>
                <span>{formatBDT(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({selectedOrder.district}):</span>
                <span>{formatBDT(selectedOrder.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#E5C378] pt-2 border-t border-[#162B4C]">
                <span>COD Due on Arrival:</span>
                <span>{formatBDT(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="text-xs bg-[#050B16] p-3 rounded-sm border border-[#162B4C]">
                <span className="text-[10px] text-[#C5A059] uppercase tracking-[0.2em] block mb-1 font-sans">
                  Customer Notes:
                </span>
                <p className="italic text-[#FAF7F2]/75">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Internal Notes Thread */}
            <div className="pt-4 border-t border-[#162B4C] space-y-3">
              <span className="text-[10px] text-[#C5A059] uppercase tracking-[0.2em] block font-sans">
                Internal Atelier Notes:
              </span>
              {selectedOrder.internalNotes && (
                <p className="text-xs text-[#FAF7F2]/70 font-sans leading-relaxed bg-[#0B1C36] p-2.5 rounded-sm border border-[#162B4C]">
                  {selectedOrder.internalNotes}
                </p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add dispatch note..."
                  value={newInternalNote}
                  onChange={(e) => setNewInternalNote(e.target.value)}
                  className="flex-1 bg-[#0B1C36] border border-[#162B4C] rounded-sm px-3 py-1.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  onClick={() => addNote(selectedOrder.id)}
                  className="px-3 py-1.5 bg-[#C5A059] text-[#071326] text-xs font-medium rounded-sm uppercase tracking-wide hover:bg-[#E5C378]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
