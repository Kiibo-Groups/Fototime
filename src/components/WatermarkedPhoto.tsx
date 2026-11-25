'use client';

import React from 'react';
import Image from 'next/image';
import { Photo, EventItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Check, Plus, Eye, Clock, Hash } from 'lucide-react';

interface WatermarkedPhotoProps {
  photo: Photo;
  event: EventItem;
  onOpenLightbox: (photo: Photo) => void;
}

export default function WatermarkedPhoto({ photo, event, onOpenLightbox }: WatermarkedPhotoProps) {
  const { isInCart, addToCart, removeFromCart, formatCurrency } = useCart();
  const inCart = isInCart(photo.id);

  const handleCartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) {
      removeFromCart(photo.id);
    } else {
      addToCart(photo, event);
    }
  };

  return (
    <div
      onClick={() => onOpenLightbox(photo)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        <Image
          src={photo.url}
          alt={`Foto ${photo.dorsal ? `Dorsal #${photo.dorsal}` : photo.id}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
        />

        {/* Dynamic Watermark Pattern Overlay */}
        <div className="watermark-overlay absolute inset-0 flex items-center justify-center overflow-hidden bg-black/10">
          {/* Diagonal Tiled Grid Watermark */}
          <div className="absolute inset-0 flex rotate-[-25deg] scale-150 flex-wrap items-center justify-center gap-12 opacity-35 mix-blend-overlay">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center font-black tracking-widest text-white text-xs sm:text-sm drop-shadow-md select-none">
                <span>FOTOTIME</span>
                <span className="text-[10px] font-semibold tracking-wider text-amber-300">PREVIEW</span>
              </div>
            ))}
          </div>

          {/* Central Logo Stamp */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-[2px] shadow-lg select-none">
            <span className="font-extrabold tracking-widest text-white text-sm sm:text-base drop-shadow">
              FOTO<span className="text-amber-400">TIME</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/90">
              MUESTRA PROTEGIDA
            </span>
          </div>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          {photo.dorsal ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-1 text-xs font-bold text-black shadow-md backdrop-blur-md">
              <Hash className="h-3 w-3 stroke-[2.5]" /> {photo.dorsal}
            </span>
          ) : (
            <span />
          )}

          {photo.capturedAt && (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-gray-200 backdrop-blur-md">
              <Clock className="h-3 w-3 text-amber-400" /> {photo.capturedAt}
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/85 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={() => onOpenLightbox(photo)}
            className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md hover:bg-black/90 transition"
          >
            <Eye className="h-3.5 w-3.5" /> Ampliar
          </button>

          <button
            onClick={handleCartToggle}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-lg transition-all ${
              inCart
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95'
            }`}
          >
            {inCart ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" /> En Carrito
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" /> {formatCurrency(photo.price)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
