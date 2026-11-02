'use client';

import * as React from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  collectionName?: string;
  slug?: string;
}

export interface FavItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  collection: string;
  addedAt?: number;
}

interface StoreContextType {
  // Cart State & Actions
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: {
      id: string;
      productId?: string;
      name: string;
      price: number;
      image: string;
      collection?: string;
      collectionName?: string;
      slug?: string;
    },
    quantity?: number,
    options?: { size?: string; color?: string }
  ) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Favourites State & Actions
  favourites: FavItem[];
  favouriteCount: number;
  isFav: (productId: string) => boolean;
  toggleFav: (product: {
    id: string;
    productId?: string;
    name: string;
    slug?: string;
    price: number;
    image: string;
    collection?: string;
  }) => boolean;
  removeFromFav: (productId: string) => void;
  clearFavourites: () => void;
}

const CART_KEY = 'stellify_local_cart_v1';
const FAV_KEY = 'stellify_local_fav_v1';

const StoreContext = React.createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [favourites, setFavourites] = React.useState<FavItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // 1. Initial Client Hydration from localStorage
  React.useEffect(() => {
    setIsMounted(true);
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
    }

    try {
      const storedFav = localStorage.getItem(FAV_KEY);
      if (storedFav) {
        const parsed = JSON.parse(storedFav);
        if (Array.isArray(parsed)) setFavourites(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse favourites from localStorage:', e);
    }
  }, []);

  // 2. Cross-tab & window synchronization
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_KEY && e.newValue) {
        try {
          setCart(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === FAV_KEY && e.newValue) {
        try {
          setFavourites(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save Cart Helper
  const persistCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      } catch (e) {
        console.warn('Error saving cart to localStorage:', e);
      }
    }
  };

  // Save Favs Helper
  const persistFav = (updatedFavs: FavItem[]) => {
    setFavourites(updatedFavs);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(updatedFavs));
      } catch (e) {
        console.warn('Error saving favourites to localStorage:', e);
      }
    }
  };

  // 3. Cart Functions
  const addToCart = (
    product: {
      id: string;
      productId?: string;
      name: string;
      price: number;
      image: string;
      collection?: string;
      collectionName?: string;
      slug?: string;
    },
    quantity = 1,
    options?: { size?: string; color?: string }
  ) => {
    const pId = product.productId || product.id;
    const selectedSize = options?.size || '2-6 (Standard)';
    const selectedColor = options?.color;

    const existingIndex = cart.findIndex(
      (item) => item.productId === pId && item.selectedSize === selectedSize
    );

    let nextCart: CartItem[];
    if (existingIndex > -1) {
      nextCart = cart.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${pId}-${Date.now()}`,
        productId: pId,
        name: product.name,
        price: Number(product.price),
        quantity,
        image: product.image,
        selectedSize,
        selectedColor,
        collectionName: product.collectionName || product.collection || 'Atelier',
        slug: product.slug,
      };
      nextCart = [...cart, newItem];
    }

    persistCart(nextCart);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    const nextCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    persistCart(nextCart);
  };

  const removeFromCart = (id: string) => {
    const nextCart = cart.filter((item) => item.id !== id);
    persistCart(nextCart);
  };

  const clearCart = () => {
    persistCart([]);
  };

  // 4. Favourites Functions (Selecting & Deselecting)
  const isFav = React.useCallback(
    (productId: string) => {
      return favourites.some(
        (item) => item.id === productId || item.productId === productId
      );
    },
    [favourites]
  );

  const toggleFav = (product: {
    id: string;
    productId?: string;
    name: string;
    slug?: string;
    price: number;
    image: string;
    collection?: string;
  }) => {
    const pId = product.productId || product.id;
    const exists = favourites.some(
      (item) => item.id === pId || item.productId === pId
    );

    let nextFavs: FavItem[];
    let isNowFav = false;

    if (exists) {
      // DESELECT: Remove from favorites
      nextFavs = favourites.filter(
        (item) => item.id !== pId && item.productId !== pId
      );
      isNowFav = false;
    } else {
      // SELECT: Add to favorites
      const newFav: FavItem = {
        id: pId,
        productId: pId,
        name: product.name,
        slug:
          product.slug ||
          product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: Number(product.price),
        image: product.image,
        collection: product.collection || 'Atelier',
        addedAt: Date.now(),
      };
      nextFavs = [newFav, ...favourites];
      isNowFav = true;
    }

    persistFav(nextFavs);
    return isNowFav;
  };

  const removeFromFav = (productId: string) => {
    const nextFavs = favourites.filter(
      (item) => item.id !== productId && item.productId !== productId
    );
    persistFav(nextFavs);
  };

  const clearFavourites = () => {
    persistFav([]);
  };

  const cartCount = React.useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = React.useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const favouriteCount = favourites.length;

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        favourites,
        favouriteCount,
        isFav,
        toggleFav,
        removeFromFav,
        clearFavourites,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
