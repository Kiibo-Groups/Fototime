'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/i18n/LanguageContext';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    total,
    discountPercent,
    formatCurrency,
  } = useCart();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-[#0c0e14] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-white">{t.cart.title}</h2>
            <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs font-semibold text-gray-300">
              {items.length} {t.cart.photosCount}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/[0.06] hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Pack Promotion Alert */}
        <div className="mx-4 mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{t.cart.discountNotice}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[11px]">
            <div className={`rounded-lg p-1.5 border ${items.length >= 1 ? 'border-amber-500/40 bg-amber-500/20 font-bold text-white' : 'border-white/5 bg-white/5 text-gray-400'}`}>
              {t.cart.pack1}
            </div>
            <div className={`rounded-lg p-1.5 border ${items.length >= 3 && items.length < 5 ? 'border-emerald-500/50 bg-emerald-500/20 font-bold text-emerald-300' : 'border-white/5 bg-white/5 text-gray-400'}`}>
              {t.cart.pack2}
            </div>
            <div className={`rounded-lg p-1.5 border ${items.length >= 5 ? 'border-emerald-500/50 bg-emerald-500/20 font-bold text-emerald-300' : 'border-white/5 bg-white/5 text-gray-400'}`}>
              {t.cart.pack3}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
              <ShoppingBag className="h-12 w-12 stroke-[1.5] text-gray-600 mb-3" />
              <p className="text-base font-semibold text-gray-300">{t.cart.emptyTitle}</p>
              <p className="mt-1 text-xs text-gray-400 max-w-xs">
                {t.cart.emptyDesc}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.photo.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition hover:border-white/[0.12]"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-black">
                  <Image
                    src={item.photo.url}
                    alt="Foto en carrito"
                    fill
                    className="object-cover"
                  />
                  {item.photo.dorsal && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-bold text-amber-400">
                      #{item.photo.dorsal}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-200">
                    {item.event.title}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {t.cart.maxResolutionNote}
                  </p>
                  <p className="mt-1 text-xs font-bold text-amber-400">
                    {formatCurrency(item.photo.price)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.photo.id)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition"
                  title="Eliminar del carrito"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-white/[0.08] bg-[#090a0f] p-5 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>{t.cart.subtotal} ({items.length} {t.cart.photosCount}):</span>
                <span className="text-gray-200 font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t.cart.packDiscount} ({discountPercent}%):
                  </span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/[0.08] pt-2 text-base font-bold text-white">
                <span>{t.cart.total}</span>
                <span className="text-amber-400">{formatCurrency(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
            >
              <span>{t.cart.checkoutBtn} ({formatCurrency(total)})</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-center text-[11px] text-gray-400 hover:text-red-400 transition"
            >
              {t.cart.emptyCartBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
