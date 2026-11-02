import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Playfair_Display, Inter } from 'next/font/google';
import { StoreProvider } from '@/context/StoreContext';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Stellify | Handcrafted Thread-Wrapped Bangles & Accessories',
    template: '%s | Stellify',
  },
  description:
    'Handcrafted with soul. Discover bespoke, thread-wrapped artisanal bangles adorned with pearls, mirrors, and botanical motifs. Cash on delivery across Bangladesh.',
  keywords: [
    'Stellify',
    'handcrafted bangles',
    'thread bangles',
    'Bangladeshi jewelry',
    'wedding bangles',
    'artisanal accessories',
    'cash on delivery bangles',
    'Gulzar',
    'Indra',
    'Mehrish',
  ],
  authors: [{ name: 'Stellify' }],
  creator: 'Stellify',
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: 'https://stellify.com.bd',
    siteName: 'Stellify',
    title: 'Stellify | Handcrafted with soul',
    description: 'Let your style speak uniquely with artisanal thread-wrapped bangle sets.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} ${jakarta.variable} scroll-smooth dark`}
    >
      <body className="min-h-screen bg-[#071326] text-[#FAF7F2] font-sans antialiased selection:bg-[#C5A059]/30 selection:text-white">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
