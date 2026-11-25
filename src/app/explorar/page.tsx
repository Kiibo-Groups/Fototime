'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Calendar, Camera } from 'lucide-react';
import { mockEvents } from '@/lib/mock-data';
import { Category } from '@/lib/types';
import { useTranslation } from '@/i18n/LanguageContext';

export default function ExplorePage() {
  const { t } = useTranslation();
  const [selectedCat, setSelectedCat] = useState<Category | 'ALL'>('ALL');
  const [query, setQuery] = useState('');

  const CATEGORIES: { label: string; value: Category | 'ALL' }[] = [
    { label: t.categories.all, value: 'ALL' },
    { label: t.categories.running, value: 'RUNNING' },
    { label: t.categories.cycling, value: 'CYCLING' },
    { label: t.categories.wedding, value: 'WEDDING' },
    { label: t.categories.sports, value: 'SPORTS' },
    { label: t.categories.corporate, value: 'CORPORATE' },
  ];

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((ev) => {
      const matchCat = selectedCat === 'ALL' || ev.category === selectedCat;
      const matchQuery =
        !query.trim() ||
        ev.title.toLowerCase().includes(query.toLowerCase()) ||
        ev.location.toLowerCase().includes(query.toLowerCase()) ||
        ev.photographer.name.toLowerCase().includes(query.toLowerCase()) ||
        ev.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCat, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title & Description */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{t.explore.eyebrow}</span>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
          {t.explore.heading}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {t.explore.lead}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t.explore.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.1] bg-[#11131a] pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCat(c.value)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedCat === c.value
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'border border-white/[0.08] bg-white/[0.03] text-gray-300 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-6 text-xs text-gray-400">
        {t.gallery.showingCount} <strong className="text-white">{filteredEvents.length}</strong> {t.explore.resultsCount}
      </div>

      {/* Event Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Link
            key={event.id}
            href={`/evento/${event.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/60 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-black shadow">
                {event.category}
              </span>

              <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-gray-200 backdrop-blur-md">
                <Camera className="h-3 w-3 text-amber-400" />
                <span>{event.photoCount.toLocaleString()} {t.common.photos}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <h3 className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                  {event.description}
                </p>

                <div className="mt-3 space-y-1 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-amber-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-white/[0.06] pt-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full">
                    <Image
                      src={event.photographer.avatar}
                      alt={event.photographer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-gray-300 font-medium">{event.photographer.name}</span>
                </div>

                <span className="font-bold text-amber-400">
                  ${event.pricePerPhoto} MXN {t.common.perPhoto}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="mt-12 rounded-2xl border border-white/[0.08] bg-[#11131a] p-12 text-center text-gray-400">
          <Search className="mx-auto h-10 w-10 text-gray-600 mb-3" />
          <p className="text-base font-bold text-white">{t.explore.noResultsTitle}</p>
          <p className="mt-1 text-xs text-gray-400">
            {t.explore.noResultsDesc}
          </p>
        </div>
      )}
    </div>
  );
}
