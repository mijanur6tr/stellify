'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Trash2, Eye, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBDT } from '@/lib/utils/currency';

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  stock: number;
  image: string;
  published: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.ok && data.products) {
        setProducts(
          data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            collection: p.collection,
            price: p.price,
            stock: p.stock,
            image: p.image,
            published: p.isPublished,
          }))
        );
      }
    } catch (err) {
      console.warn('Could not fetch live products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const togglePublish = async (id: string, currentPublished: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !currentPublished } : p))
    );

    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isPublished: !currentPublished,
        }),
      });
    } catch (err) {
      console.error('Failed to toggle publish status in DB:', err);
      loadProducts();
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from the atelier catalog?`)) {
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete product in DB:', err);
      loadProducts();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mb-1">
            Inventory &amp; Listings
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light">
            Bangle Collection Catalog
          </h1>
        </div>

        <Link href="/admin/products/new">
          <Button size="md" className="gap-2">
            <Sparkles className="w-4 h-4" />
            <span>AI-Assisted Listing</span>
          </Button>
        </Link>
      </div>

      <div className="bg-[#071326] border border-[#162B4C] rounded-sm overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#162B4C] flex items-center justify-between">
          <h3 className="font-serif text-2xl text-[#FAF7F2]">All {products.length} Products</h3>
          <span className="text-xs text-[#FAF7F2]/60 font-sans">
            Synced with Neon PostgreSQL for AI Style Concierge
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#162B4C] bg-[#0B1C36] text-[#C5A059]">
                <th className="p-4 uppercase tracking-[0.18em]">Product</th>
                <th className="p-4 uppercase tracking-[0.18em]">Collection</th>
                <th className="p-4 uppercase tracking-[0.18em]">Price</th>
                <th className="p-4 uppercase tracking-[0.18em]">Stock</th>
                <th className="p-4 uppercase tracking-[0.18em]">Status</th>
                <th className="p-4 uppercase tracking-[0.18em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162B4C]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#0B1C36]/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-[#162B4C] shrink-0 bg-[#050B16]">
                      <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <span className="font-medium text-[#FAF7F2] block">{p.name}</span>
                      <span className="text-[11px] text-[#FAF7F2]/40">/{p.slug}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#C5A059] font-medium">{p.collection}</td>
                  <td className="p-4 font-semibold text-[#E5C378]">{formatBDT(p.price)}</td>
                  <td className="p-4 text-[#FAF7F2]/80">{p.stock} sets</td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublish(p.id, p.published)}
                      className={`text-[10px] uppercase font-sans tracking-[0.18em] px-2.5 py-1 rounded-sm border transition-all ${
                        p.published
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#162B4C] text-[#FAF7F2]/50 border-transparent'
                      }`}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-sm hover:text-[#C5A059] text-[#FAF7F2]/60 transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-sm hover:text-[#E08A93] text-[#FAF7F2]/40 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
