'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Photo, EventItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (photo: Photo, event: EventItem) => void;
  removeFromCart: (photoId: string) => void;
  clearCart: () => void;
  isInCart: (photoId: string) => boolean;
  subtotal: number;
  discount: number;
  total: number;
  discountPercent: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleCart: () => void;
  formatCurrency: (amount: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fototime_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('fototime_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addToCart = (photo: Photo, event: EventItem) => {
    setItems((prev) => {
      if (prev.some((item) => item.photo.id === photo.id)) return prev;
      return [
        ...prev,
        {
          photo,
          event: {
            id: event.id,
            title: event.title,
            slug: event.slug,
            pricePerPhoto: event.pricePerPhoto,
          },
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (photoId: string) => {
    setItems((prev) => prev.filter((item) => item.photo.id !== photoId));
  };

  const clearCart = () => setItems([]);

  const isInCart = (photoId: string) => items.some((item) => item.photo.id === photoId);

  const toggleCart = () => setIsOpen((prev) => !prev);

  // Mexican Pesos Pack Discount:
  // 1-2 fotos: precio base
  // 3-4 fotos: 15% OFF
  // 5+ fotos: 25% OFF
  const subtotal = items.reduce((acc, item) => acc + item.photo.price, 0);

  let discountPercent = 0;
  if (items.length >= 5) {
    discountPercent = 25;
  } else if (items.length >= 3) {
    discountPercent = 15;
  }

  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discount;

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-MX')} MXN`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        subtotal,
        discount,
        total,
        discountPercent,
        isOpen,
        setIsOpen,
        toggleCart,
        formatCurrency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
