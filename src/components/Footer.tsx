'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Zap, Heart } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageContext';
import Logo from '@/components/Logo';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/[0.08] bg-[#07080b] py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block">
              <Logo size="md" showBadge={true} />
            </Link>
            <p className="max-w-md text-sm text-gray-400 leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-400" /> {t.footer.securePayments}
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400" /> {t.footer.instantDelivery}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t.footer.exploreTitle}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/explorar" className="hover:text-amber-400 transition-colors">
                  {t.categories.all}
                </Link>
              </li>
              <li>
                <Link href="/explorar?cat=RUNNING" className="hover:text-amber-400 transition-colors">
                  {t.categories.running}
                </Link>
              </li>
              <li>
                <Link href="/explorar?cat=CYCLING" className="hover:text-amber-400 transition-colors">
                  {t.categories.cycling}
                </Link>
              </li>
              <li>
                <Link href="/explorar?cat=WEDDING" className="hover:text-amber-400 transition-colors">
                  {t.categories.wedding}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t.footer.photographersTitle}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/registro" className="hover:text-amber-400 transition-colors">
                  {t.nav.register}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  {t.nav.login}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                  {t.nav.dashboard}
                </Link>
              </li>
              <li>
                <Link href="/#precios" className="hover:text-amber-400 transition-colors">
                  {t.nav.pricing}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {t.footer.allRightsReserved}</p>
          <div className="mt-2 sm:mt-0 flex gap-6">
            <span className="hover:text-gray-300">{t.footer.terms}</span>
            <span className="hover:text-gray-300">{t.footer.privacy}</span>
            <span className="flex items-center gap-1 text-gray-400">
              <Heart className="h-3 w-3 text-red-500 fill-red-500" /> {t.footer.madeWith}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
