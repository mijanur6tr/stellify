'use client';

import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { StorySection } from '@/components/home/StorySection';
import { CraftSection } from '@/components/home/CraftSection';
import { ShopByPreference } from '@/components/home/ShopByPreference';
import { HowOrderingWorks } from '@/components/home/HowOrderingWorks';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ChatConcierge } from '@/components/chat/ChatConcierge';
import { FloatingChatLauncher } from '@/components/chat/FloatingChatLauncher';
import { useStore } from '@/context/StoreContext';

export default function HomePage() {
  const [chatOpen, setChatOpen] = React.useState(false);
  const {
    cart,
    cartCount,
    favouriteCount,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  return (
    <div className="min-h-screen bg-[#071326] text-[#FAF7F2] relative selection:bg-[#C5A059]/30">
      {/* Navigation Header */}
      <Header
        cartCount={cartCount}
        favouriteCount={favouriteCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setChatOpen(true)}
      />

      <main>
        {/* 1. Hero Section (Preserved Original Typography) */}
        <div className="hero-font-preserved">
          <HeroSection onOpenChat={() => setChatOpen(true)} />
        </div>

        {/* 2. Featured Collections */}
        <FeaturedCollections />

        {/* 3. Products Showcase Section */}
        <FeaturedProductsSection onAddToCart={addToCart} />

        {/* 4. Brand Story Section */}
        <StorySection />

        {/* 5. Anatomy of Craft Section */}
        <CraftSection />

        {/* 6. Shop-by-Preference Strip */}
        <ShopByPreference />

        {/* 7. How Ordering Works */}
        <HowOrderingWorks />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      {/* AI Style Concierge Chat Panel */}
      <ChatConcierge
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onAddToCart={addToCart}
      />

      {/* Floating Bottom-Right Chat Launcher */}
      <FloatingChatLauncher
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
      />
    </div>
  );
}
