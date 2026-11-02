'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBDT } from '@/lib/utils/currency';

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  district: string;
  total: number;
  status: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [productsCount, setProductsCount] = React.useState<number>(0);
  const [lowStockCount, setLowStockCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      // Fetch orders
      const ordRes = await fetch('/api/admin/orders');
      const ordData = await ordRes.json();
      if (ordRes.ok && ordData.orders) {
        setOrders(ordData.orders);
      }

      // Fetch products
      const prodRes = await fetch('/api/admin/products');
      const prodData = await prodRes.json();
      if (prodRes.ok && prodData.products) {
        setProductsCount(prodData.products.length);
        const lowStock = prodData.products.filter((p: any) => p.stock <= 10).length;
        setLowStockCount(lowStock);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateOrderStatus = async (id: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );

    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update order status in DB:', err);
      fetchDashboardData();
    }
  };

  // Calculations
  const totalCodRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingConfirmations = orders.filter((o) => o.status === 'PLACED').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mb-1">
            Atelier Overview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light">
            Dashboard &amp; Operations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/knowledge">
            <Button variant="outline" size="md" className="gap-2">
              <span>Policies (RAG)</span>
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button size="md" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Listing Studio</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#071326] border border-[#162B4C] p-6 rounded-sm">
          <div className="flex items-center justify-between mb-3 text-[#C5A059]">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#FAF7F2]/60">
              Total Orders
            </span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-3xl font-serif text-[#FAF7F2]">{orders.length}</div>
          <span className="text-[11px] text-emerald-400 font-sans mt-1 block">
            Live from Neon PostgreSQL
          </span>
        </div>

        <div className="bg-[#071326] border border-[#162B4C] p-6 rounded-sm">
          <div className="flex items-center justify-between mb-3 text-[#C5A059]">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#FAF7F2]/60">
              COD Revenue Expected
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-3xl font-serif text-[#E5C378]">{formatBDT(totalCodRevenue)}</div>
          <span className="text-[11px] text-[#FAF7F2]/50 font-sans mt-1 block">
            Across {orders.length} shipments
          </span>
        </div>

        <div className="bg-[#071326] border border-[#162B4C] p-6 rounded-sm">
          <div className="flex items-center justify-between mb-3 text-[#C5A059]">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#FAF7F2]/60">
              Pending Confirmation
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-serif text-[#FAF7F2]">{pendingConfirmations}</div>
          <span className="text-[11px] text-[#C5A059] font-sans mt-1 block">
            {pendingConfirmations > 0 ? 'Require phone check' : 'All orders processed'}
          </span>
        </div>

        <div className="bg-[#071326] border border-[#162B4C] p-6 rounded-sm">
          <div className="flex items-center justify-between mb-3 text-[#7A1C28]">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#FAF7F2]/60">
              Catalog Products
            </span>
            <AlertTriangle className="w-4 h-4 text-[#E08A93]" />
          </div>
          <div className="text-3xl font-serif text-[#E08A93]">{productsCount}</div>
          <span className="text-[11px] text-[#FAF7F2]/50 font-sans mt-1 block">
            {lowStockCount} sets with low stock (&le;10)
          </span>
        </div>
      </div>

      {/* Recent Cash on Delivery Orders Table */}
      <div className="bg-[#071326] border border-[#162B4C] rounded-sm overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#162B4C] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl text-[#FAF7F2]">Recent COD Orders</h3>
            <p className="text-xs font-sans text-[#FAF7F2]/60 mt-0.5">
              Live orders driving the customer tracking timeline.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 font-sans"
          >
            <span>View All in Fulfillment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#162B4C] bg-[#0B1C36] text-[#C5A059]">
                <th className="p-4 uppercase tracking-[0.18em]">Order ID</th>
                <th className="p-4 uppercase tracking-[0.18em]">Customer</th>
                <th className="p-4 uppercase tracking-[0.18em]">District</th>
                <th className="p-4 uppercase tracking-[0.18em]">Payable</th>
                <th className="p-4 uppercase tracking-[0.18em]">Status</th>
                <th className="p-4 uppercase tracking-[0.18em]">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162B4C]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#FAF7F2]/50 italic">
                    No orders recorded yet. Orders placed online or via AI chat will appear here.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 8).map((o) => (
                  <tr key={o.id} className="hover:bg-[#0B1C36]/50 transition-colors">
                    <td className="p-4 font-semibold text-[#E5C378]">
                      {o.orderNumber}
                      <span className="block text-[10px] text-[#FAF7F2]/40 font-normal">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[#FAF7F2] font-medium block">{o.customerName}</span>
                      <span className="text-[#FAF7F2]/50 text-[11px]">{o.phone}</span>
                    </td>
                    <td className="p-4 text-[#FAF7F2]/80">{o.district}</td>
                    <td className="p-4 font-semibold text-[#FAF7F2]">{formatBDT(o.total)}</td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                        className="bg-[#0B1C36] border border-[#162B4C] text-[11px] text-[#FAF7F2] px-2.5 py-1.5 rounded-sm focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
