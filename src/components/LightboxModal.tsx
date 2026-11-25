'use client';

import React, { useEffect } from 'react';
import { Photo, EventItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/i18n/LanguageContext';
import { X, ChevronLeft, ChevronRight, Check, Plus, Hash, Clock, ShieldCheck } from 'lucide-react';

interface LightboxModalProps {
  photo: Photo | null;
  photos: Photo[];
  event: EventItem;
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
}

export default function LightboxModal({
  photo,
  photos,
  event,
  onClose,
  onSelectPhoto,
}: LightboxModalProps) {
  const { isInCart, addToCart, removeFromCart, formatCurrency } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, photos]);

  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const handlePrev = () => {
    if (currentIndex > 0) onSelectPhoto(photos[currentIndex - 1]);
  };
  const handleNext = () => {
    if (currentIndex < photos.length - 1) onSelectPhoto(photos[currentIndex + 1]);
  };

  const inCart = isInCart(photo.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Top Bar Controls */}
      <div className="absolute top-0 inset-x-0 z-10 flex h-16 items-center justify-between border-b border-white/[0.08] bg-black/60 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">
            {event.title}
          </span>
          <span className="hidden rounded-full bg-white/[0.08] px-2.5 py-0.5 text-xs text-gray-300 sm:inline-block">
            {currentIndex + 1} {t.lightbox.photoOf} {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-gray-300 hover:bg-white/[0.15] hover:text-white transition"
            aria-label={t.common.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          aria-label={t.lightbox.prev}
          className="absolute left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 border border-white/10 text-white hover:bg-amber-500 hover:text-black transition"
        >
          <ChevronLeft className="h-6 w-6 stroke-[2.2]" />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={handleNext}
          aria-label={t.lightbox.next}
          className="absolute right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 border border-white/10 text-white hover:bg-amber-500 hover:text-black transition"
        >
          <ChevronRight className="h-6 w-6 stroke-[2.2]" />
        </button>
      )}

      {/* Main Image Viewport with Watermark */}
      <div className="relative max-h-[82vh] max-w-[90vw] select-none">
        <div className="relative overflow-hidden rounded-xl border border-white/[0.08] shadow-2xl">
          <img
            src={photo.url}
            alt="Preview"
            className="max-h-[75vh] w-auto max-w-full object-contain pointer-events-none select-none"
            draggable={false}
          />

          {/* Dynamic Watermark Pattern */}
          <div className="watermark-overlay absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex rotate-[-25deg] scale-150 flex-wrap items-center justify-center gap-16 opacity-35 mix-blend-overlay">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center font-black tracking-widest text-white text-base select-none">
                  <span>FOTOTIME</span>
                  <span className="text-xs font-bold text-amber-300">PREVIEW</span>
                </div>
              ))}
            </div>

            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-black/40 px-6 py-3 backdrop-blur-sm shadow-2xl">
              <span className="font-extrabold tracking-widest text-white text-xl">
                FOTO<span className="text-amber-400">TIME</span>
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                WATERMARK PROTECTED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Details & Cart CTA */}
      <div className="absolute bottom-0 inset-x-0 z-10 flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.08] bg-black/75 px-6 py-4 backdrop-blur-md gap-3">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          {photo.dorsal && (
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Hash className="h-4 w-4" /> {t.lightbox.dorsalLabel}{photo.dorsal}
            </span>
          )}
          {photo.capturedAt && (
            <span className="flex items-center gap-1 text-gray-400">
              <Clock className="h-4 w-4 text-amber-400" /> {t.lightbox.timeLabel} {photo.capturedAt}
            </span>
          )}
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> {t.lightbox.highResGuarantee}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (inCart) removeFromCart(photo.id);
              else addToCart(photo, event);
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-xl transition-all ${
              inCart
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:brightness-110 active:scale-95'
            }`}
          >
            {inCart ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5]" /> {t.lightbox.inCart}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 stroke-[2.5]" /> {t.lightbox.addToCart} {formatCurrency(photo.price)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
