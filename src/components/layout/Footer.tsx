import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { MapPin, Phone, Mail, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#050B16] text-[#FAF7F2] border-t border-[#C5A059]/20 pt-16 pb-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">


        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#162B4C]">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4">
            <BrandLogo size="md" showTagline={true} />
            <p className="font-serif text-base italic text-[#C5A059]/90 max-w-sm mt-2">
              &ldquo;Each bangle carries a story of its own, shaped by hands that know patience, poured into gold that never rushes itself.&rdquo;
            </p>
            <p className="text-xs text-[#FAF7F2]/60 max-w-sm leading-relaxed">
              Stellify is a celebration of Bangladeshi artisanal craftsmanship. We create thread-wrapped bangles, ornaments, and accessories woven with heartfelt tradition.
            </p>
          </div>

          {/* Signature Collections */}
          <div>
            <h5 className="text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#C5A059] mb-4">
              Collections
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#FAF7F2]/75">
              <li>
                <Link href="/shop?collection=gulzar" className="hover:text-[#C5A059] transition-colors">
                  Gulzar (Cocoa &amp; Gold)
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=indra" className="hover:text-[#C5A059] transition-colors">
                  Indra (Cobalt &amp; Pearl)
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=mehrish" className="hover:text-[#C5A059] transition-colors">
                  Mehrish (Crimson Mirror)
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=sitara" className="hover:text-[#C5A059] transition-colors">
                  Sitara (Fuchsia Zardozi)
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=orchidia" className="hover:text-[#C5A059] transition-colors">
                  Orchidia (Pastel Lilac)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[#C5A059] hover:underline pt-1 inline-block">
                  View All Collections &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Service */}
          <div>
            <h5 className="text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#C5A059] mb-4">
              Client Care
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-[#FAF7F2]/75">
              <li>
                <Link href="/order-tracking" className="hover:text-[#C5A059] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#C5A059] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/favourites" className="hover:text-[#C5A059] transition-colors">
                  Saved Favourites
                </Link>
              </li>
              <li>
                <Link href="/#craft" className="hover:text-[#C5A059] transition-colors">
                  Bangle Sizing &amp; Care
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#C5A059] transition-colors opacity-60">
                  Admin Atelier
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#C5A059] mb-4">
              Atelier &amp; Contact
            </h5>
            <ul className="flex flex-col gap-3 text-xs text-[#FAF7F2]/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="leading-tight">
                  House-47/1, Road-15/1, Block-C, Mirpur-11, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:01644711161" className="hover:text-[#C5A059] transition-colors">
                  01644-711161
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:habibanipa94@gmail.com" className="hover:text-[#C5A059] transition-colors">
                  habibanipa94@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg
                  className="w-4 h-4 text-[#C5A059] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <a
                  href="https://www.instagram.com/_stellify_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C5A059] transition-colors"
                >
                  @_stellify_official
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/50 font-sans">
          <p>&copy; 2026 Stellify. All rights reserved. Handcrafted in Dhaka, Bangladesh.</p>
          <p className="flex items-center gap-2">
            <span>Payment: Cash on Delivery (COD)</span>
            <span>•</span>
            <span className="text-[#C5A059]">Let your style speak uniquely!</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
