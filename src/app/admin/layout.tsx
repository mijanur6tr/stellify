'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  LogOut,
  ExternalLink,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // If on login page, render without admin navigation frame
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders & COD', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Product Catalog', href: '/admin/products', icon: Package },
    { label: 'AI Listing Studio', href: '/admin/products/new', icon: Sparkles },
    { label: 'Policies & Knowledge (RAG)', href: '/admin/knowledge', icon: BookOpen },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050B16] text-[#FAF7F2] flex">
      {/* Sticky Desktop Sidebar */}
      <aside className="w-64 h-screen shrink-0 bg-[#071326] border-r border-[#162B4C] flex flex-col justify-between p-6 overflow-y-auto hidden md:flex">
        <div>
          <div className="pb-8 border-b border-[#162B4C]">
            <BrandLogo size="sm" showTagline={false} />
            <span className="text-[9px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mt-2 font-medium">
              Atelier Management
            </span>
          </div>

          <nav className="mt-8 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-sans tracking-wide transition-all ${
                    active
                      ? 'bg-[#C5A059] text-[#071326] font-semibold shadow-[0_0_15px_rgba(197,160,89,0.2)]'
                      : 'text-[#FAF7F2]/70 hover:text-[#C5A059] hover:bg-[#0B1C36]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#162B4C] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-[#FAF7F2]/60 hover:text-[#C5A059] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center gap-2 text-xs text-[#E08A93] hover:underline transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-72 h-full bg-[#071326] border-r border-[#162B4C] p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#162B4C]">
                <BrandLogo size="sm" showTagline={false} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#FAF7F2]/70 hover:text-[#C5A059]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-sans tracking-wide transition-all ${
                        active
                          ? 'bg-[#C5A059] text-[#071326] font-semibold'
                          : 'text-[#FAF7F2]/70 hover:text-[#C5A059] hover:bg-[#0B1C36]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#162B4C] space-y-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-xs text-[#FAF7F2]/60 hover:text-[#C5A059]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Store</span>
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-2 text-xs text-[#E08A93]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport: Fixed Top Bar + Scrollable Main Body */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Sticky Fixed Header */}
        <header className="h-16 shrink-0 sticky top-0 z-20 bg-[#071326] border-b border-[#162B4C] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#FAF7F2]/70 hover:text-[#C5A059] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <BrandLogo size="sm" showTagline={false} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs text-[#FAF7F2]/60 hidden sm:inline">
              Logged in as <strong className="text-[#E5C378]">Atelier Administrator</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059] text-xs font-bold font-serif shadow-[0_0_10px_rgba(197,160,89,0.3)]">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Main Body Viewport */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
