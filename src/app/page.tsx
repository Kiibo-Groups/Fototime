'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Camera,
  Search,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  ScanFace,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { mockEvents } from '@/lib/mock-data';
import { useTranslation } from '@/i18n/LanguageContext';

export default function HomePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500/20 via-amber-600/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[800px] right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.home.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
            {t.home.headline} <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              {t.home.headlineHighlight}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-300 sm:text-lg leading-relaxed">
            {t.home.lead}
          </p>

          {/* Quick Search Bar */}
          <div className="mx-auto mt-10 max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchTerm.trim()) {
                  window.location.href = `/explorar?q=${encodeURIComponent(searchTerm)}`;
                }
              }}
              className="relative flex items-center rounded-2xl border border-white/[0.12] bg-[#11131a]/80 p-2 shadow-2xl backdrop-blur-xl transition focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20"
            >
              <Search className="ml-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.home.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <span>{t.home.searchBtn}</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
              <span>{t.home.popularLabel}</span>
              <Link href="/evento/maraton-cdmx-2026" className="rounded-md bg-white/[0.05] px-2 py-1 text-gray-300 hover:text-amber-400">
                🏃 Medio Maratón CDMX 21K
              </Link>
              <Link href="/evento/gran-fondo-ciclismo-valle-de-bravo" className="rounded-md bg-white/[0.05] px-2 py-1 text-gray-300 hover:text-amber-400">
                🚴 Gran Fondo Valle de Bravo
              </Link>
              <Link href="/evento/boda-sofia-y-mateo" className="rounded-md bg-white/[0.05] px-2 py-1 text-gray-300 hover:text-amber-400">
                💍 Boda San Miguel de Allende
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-y border-white/[0.06] py-8 sm:grid-cols-4">
            <div>
              <p className="font-display text-2xl font-black text-white sm:text-3xl">{t.home.statPhotos}</p>
              <p className="mt-1 text-xs text-gray-400">{t.home.statPhotosDesc}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-amber-400 sm:text-3xl">{t.home.statCurrency}</p>
              <p className="mt-1 text-xs text-gray-400">{t.home.statCurrencyDesc}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-white sm:text-3xl">{t.home.statSpeed}</p>
              <p className="mt-1 text-xs text-gray-400">{t.home.statSpeedDesc}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-emerald-400 sm:text-3xl">{t.home.statPayout}</p>
              <p className="mt-1 text-xs text-gray-400">{t.home.statPayoutDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Live Events */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{t.home.catalogTitle}</span>
              <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                {t.home.catalogHeading}
              </h2>
            </div>
            <Link
              href="/explorar"
              className="flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              {t.home.viewAllEvents} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={`/evento/${event.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-black shadow-md">
                      {event.category}
                    </span>
                  </div>

                  {/* Photo count badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    <Camera className="h-3.5 w-3.5 text-amber-400" />
                    <span>{event.photoCount.toLocaleString()} {t.common.photos}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-white/[0.06] pt-4 flex items-center justify-between text-xs text-gray-400">
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
                      {t.common.from} ${event.pricePerPhoto} MXN
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works (3 Steps) */}
      <section className="border-t border-white/[0.06] bg-[#0c0e14] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{t.home.howEyebrow}</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t.home.howHeading}
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            {t.home.howLead}
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center transition hover:border-amber-500/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Camera className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">{t.home.step1Title}</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                {t.home.step1Desc}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center transition hover:border-amber-500/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ScanFace className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">{t.home.step2Title}</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                {t.home.step2Desc}
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center transition hover:border-amber-500/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">{t.home.step3Title}</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                {t.home.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section in MXN */}
      <section id="precios" className="border-t border-white/[0.06] bg-[#0c0e14] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{t.home.pricingEyebrow}</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-white">
              {t.home.pricingHeading}
            </h2>
            <p className="mt-2 text-xs text-gray-400">
              {t.home.pricingLead}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Starter */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
              <div>
                <h3 className="text-lg font-bold text-white">{t.home.planStarter}</h3>
                <p className="text-xs text-gray-400 mt-1">{t.home.planStarterDesc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-gray-400">MXN / mes</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Hasta 3 eventos activos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 1.500 fotos por evento
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Cobro con Mercado Pago México
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Fee de plataforma 12%
                  </li>
                </ul>
              </div>

              <Link
                href="/registro"
                className="mt-8 flex items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] py-2.5 text-xs font-semibold text-white hover:bg-white/[0.1] transition"
              >
                {t.home.planStarterCta}
              </Link>
            </div>

            {/* Pro (Highlighted) */}
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-amber-500 bg-zinc-900/90 p-8 shadow-2xl shadow-amber-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-[11px] font-bold text-black uppercase tracking-wider">
                {t.home.planProBadge}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t.home.planPro}</h3>
                <p className="text-xs text-gray-400 mt-1">{t.home.planProDesc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black text-amber-400">$399</span>
                  <span className="text-xs text-gray-400">MXN / mes</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" /> Eventos ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" /> Búsqueda por Dorsal OCR + IA Facial
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" /> Fee reducido al 6%
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" /> Perfil público con subdominio personalizado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" /> Soporte prioritario en México
                  </li>
                </ul>
              </div>

              <Link
                href="/registro"
                className="mt-8 flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 transition"
              >
                {t.home.planProCta}
              </Link>
            </div>

            {/* Agencias / Pro+ */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
              <div>
                <h3 className="text-lg font-bold text-white">{t.home.planAgency}</h3>
                <p className="text-xs text-gray-400 mt-1">{t.home.planAgencyDesc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black text-white">$899</span>
                  <span className="text-xs text-gray-400">MXN / mes</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Subida multi-fotógrafo simultánea
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Fee ultra bajo (3.5%)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Marca blanca total (White-label)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Exportación de métricas y leads
                  </li>
                </ul>
              </div>

              <Link
                href="/registro"
                className="mt-8 flex items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] py-2.5 text-xs font-semibold text-white hover:bg-white/[0.1] transition"
              >
                {t.home.planAgencyCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-zinc-900 to-black p-10 sm:p-14">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t.home.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-300">
            {t.home.ctaLead}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/registro"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-bold text-black shadow-xl shadow-amber-500/25 hover:brightness-110 transition"
            >
              <span>{t.home.ctaBtn}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/explorar"
              className="flex w-full sm:w-auto items-center justify-center rounded-xl border border-white/[0.15] bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.1] transition"
            >
              {t.home.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
