'use client';

import React, { useState, useMemo, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ScanFace,
  Clock,
  ArrowLeft,
  Calendar,
  MapPin,
  Camera,
  ShoppingBag,
  FilterX,
} from 'lucide-react';
import { mockEvents, mockPhotos } from '@/lib/mock-data';
import { Photo } from '@/lib/types';
import WatermarkedPhoto from '@/components/WatermarkedPhoto';
import LightboxModal from '@/components/LightboxModal';
import FaceSearchModal from '@/components/FaceSearchModal';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/i18n/LanguageContext';

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = useTranslation();
  const resolvedParams = use(params);
  const event = mockEvents.find((e) => e.slug === resolvedParams.slug) || mockEvents[0];

  const [dorsalSearch, setDorsalSearch] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('ALL');
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [matchedFaceId, setMatchedFaceId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const { addToCart, formatCurrency } = useCart();

  // Filter photos by event, dorsal, time, and face matching
  const filteredPhotos = useMemo(() => {
    return mockPhotos.filter((p) => {
      // 1. Dorsal filter
      if (dorsalSearch.trim() && p.dorsal !== dorsalSearch.trim()) {
        return false;
      }

      // 2. Face recognition filter
      if (matchedFaceId && (!p.faceIds || !p.faceIds.includes(matchedFaceId))) {
        return false;
      }

      // 3. Time filter
      if (selectedTimeRange !== 'ALL') {
        const [start, end] = selectedTimeRange.split('-');
        if (p.capturedAt < start || p.capturedAt > end) {
          return false;
        }
      }

      return true;
    });
  }, [dorsalSearch, matchedFaceId, selectedTimeRange]);

  const handleResetFilters = () => {
    setDorsalSearch('');
    setSelectedTimeRange('ALL');
    setMatchedFaceId(null);
  };

  const handleBuyAll = () => {
    filteredPhotos.forEach((photo) => addToCart(photo, event));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Event Header Banner */}
      <div className="relative border-b border-white/[0.08] bg-zinc-950">
        <div className="absolute inset-0 h-80 overflow-hidden opacity-30">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover blur-md"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090a0f]/80 to-[#090a0f]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-8 sm:px-6 lg:px-8">
          <Link
            href="/explorar"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> {t.gallery.backToCatalog}
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
                {event.category}
              </span>
              <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
                {event.title}
              </h1>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                {event.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-amber-400" /> {event.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-amber-400" /> {event.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-amber-400" /> {event.photoCount.toLocaleString()} {t.gallery.photosAvailable}
                </span>
              </div>
            </div>

            {/* Photographer card & Buy Full Album CTA */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 backdrop-blur-md">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={event.photographer.avatar}
                    alt={event.photographer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400">{t.gallery.officialPhotographer}</p>
                  <p className="text-sm font-bold text-white">{event.photographer.name}</p>
                </div>
              </div>

              <button
                onClick={handleBuyAll}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
                <span>{t.gallery.buyFullAlbum} ({formatCurrency(event.fullAlbumPrice)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Triple Search Toolbar (Dorsal, Selfie, Horario EXIF) */}
      <div className="sticky top-16 z-30 border-b border-white/[0.08] bg-[#0c0e14]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left: Search by Dorsal & Selfie Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Dorsal search box */}
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-amber-400" />
                <input
                  type="text"
                  placeholder={t.gallery.dorsalPlaceholder}
                  value={dorsalSearch}
                  onChange={(e) => setDorsalSearch(e.target.value)}
                  className="h-10 rounded-xl border border-white/[0.12] bg-zinc-900/90 pl-10 pr-4 text-xs font-medium text-white placeholder-gray-400 focus:border-amber-500/60 focus:outline-none w-56 sm:w-64"
                />
              </div>

              {/* Face Search Button */}
              <button
                onClick={() => setIsFaceModalOpen(true)}
                className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition shadow-sm ${
                  matchedFaceId
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                    : 'border-white/[0.12] bg-white/[0.04] text-white hover:border-amber-500/40 hover:bg-white/[0.08]'
                }`}
              >
                <ScanFace className="h-4 w-4 text-amber-400" />
                <span>{matchedFaceId ? t.gallery.faceSearchActive : t.gallery.faceSearchBtn}</span>
              </button>

              {/* Time Range Filter (EXIF) */}
              <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] px-3 h-10">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="bg-transparent text-xs text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-zinc-900">{t.gallery.timeFilterAll}</option>
                  <option value="08:00-09:00" className="bg-zinc-900">{t.gallery.timeFilterStart}</option>
                  <option value="09:00-09:30" className="bg-zinc-900">{t.gallery.timeFilterMid}</option>
                  <option value="09:30-10:00" className="bg-zinc-900">{t.gallery.timeFilterFinish}</option>
                  <option value="10:00-11:00" className="bg-zinc-900">{t.gallery.timeFilterCelebration}</option>
                </select>
              </div>

              {/* Reset filter button if any filter is active */}
              {(dorsalSearch || matchedFaceId || selectedTimeRange !== 'ALL') && (
                <button
                  onClick={handleResetFilters}
                  className="flex h-10 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
                >
                  <FilterX className="h-3.5 w-3.5" /> {t.gallery.clearFilters}
                </button>
              )}
            </div>

            {/* Right: Active status message */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>
                {t.gallery.showingCount} <strong className="text-white">{filteredPhotos.length}</strong> {t.common.photos}
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="hidden sm:inline text-emerald-400">
                ⚡ {t.gallery.highResNote}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Photos Masonry / Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <WatermarkedPhoto
                key={photo.id}
                photo={photo}
                event={event}
                onOpenLightbox={(p) => setSelectedPhoto(p)}
              />
            ))}
          </div>
        ) : (
          <div className="my-16 rounded-2xl border border-white/[0.08] bg-[#11131a] p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <h3 className="text-base font-bold text-white">{t.gallery.noPhotosTitle}</h3>
            <p className="mt-1 text-xs text-gray-400 max-w-md mx-auto">
              {t.gallery.noPhotosDesc}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition"
            >
              {t.gallery.viewAllPhotos}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        photo={selectedPhoto}
        photos={filteredPhotos}
        event={event}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
      />

      {/* Face Recognition Modal */}
      <FaceSearchModal
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        onFindMatch={(faceId) => setMatchedFaceId(faceId)}
      />
    </div>
  );
}
