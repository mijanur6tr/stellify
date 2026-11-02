'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useStore } from '@/context/StoreContext';

interface HeaderProps {
  cartCount?: number;
  favouriteCount?: number;
  onOpenCart?: () => void;
  onOpenChat?: () => void;
}

export function Header({
  cartCount: propCartCount,
  favouriteCount: propFavCount,
  onOpenCart: propOnOpenCart,
}: HeaderProps) {
  let store: ReturnType<typeof useStore> | null = null;
  try {
    store = useStore();
  } catch {}

  const cartCount = propCartCount !== undefined ? propCartCount : store?.cartCount ?? 0;
  const favouriteCount = propFavCount !== undefined ? propFavCount : store?.favouriteCount ?? 0;
  const onOpenCart = propOnOpenCart || (() => store?.setIsCartOpen(true));

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Collections', href: '/#collections' },
    { label: 'Our Story', href: '/#story' },
    { label: 'Artisanal Craft', href: '/#craft' },
    { label: 'Track Order', href: '/order-tracking' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Main Navigation Bar */}
      <nav
        className={`w-full px-4 sm:px-8 lg:px-12 transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-[#071326]/95 backdrop-blur-md py-3 border-[#C5A059]/25 shadow-xl'
            : 'bg-[#071326]/85 backdrop-blur-sm py-4 border-[#162B4C]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#FAF7F2] hover:text-[#C5A059] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.25]" /> : <Menu className="w-6 h-6 stroke-[1.25]" />}
          </button>

          {/* Desktop Left Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 3).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.22em] font-medium transition-colors duration-300 relative py-1 ${
                    isActive ? 'text-[#C5A059]' : 'text-[#FAF7F2]/80 hover:text-[#C5A059]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A059]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Center Brand Identity (Smooth Scaled Logo) */}
          <div className="flex-1 lg:flex-none flex justify-center">
            <div
              className={`transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                isScrolled ? 'scale-[0.84] -translate-y-0.5' : 'scale-100 translate-y-0'
              }`}
            >
              <BrandLogo size="md" />
            </div>
          </div>

          {/* Desktop Right Links & Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden lg:flex items-center gap-8 mr-2">
              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#FAF7F2]/80 hover:text-[#C5A059] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Link */}
            <Link
              href="/shop"
              className="p-1.5 text-[#FAF7F2]/80 hover:text-[#C5A059] transition-colors"
              aria-label="Search Collection"
            >
              <Search className="w-5 h-5 stroke-[1.25]" />
            </Link>

            {/* Favourites Heart */}
            <Link
              href="/favourites"
              className="p-1.5 text-[#FAF7F2]/80 hover:text-[#C5A059] transition-colors relative"
              aria-label="View Favourites"
            >
              <Heart className="w-5 h-5 stroke-[1.25]" />
              {favouriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7A1C28] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {favouriteCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="p-1.5 text-[#FAF7F2]/80 hover:text-[#C5A059] transition-colors relative"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.25]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#071326] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-[#162B4C] flex flex-col gap-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] font-medium text-[#FAF7F2]/90 hover:text-[#C5A059] py-2 px-1 border-b border-[#162B4C]/40"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
export default Header;
