'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, User, Search, LogIn, Globe, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

export default function Navbar() {
  const { items, toggleCart, formatCurrency, total } = useCart();
  const { language, toggleLanguage, t } = useTranslation();
  const { user, logout } = useAuth();

  const dashboardHref = user ? '/dashboard' : '/login?redirect=/dashboard';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand with Logo */}
        <Link href="/" className="group flex items-center">
          <Logo size="md" showBadge={true} />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/explorar"
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <Search className="h-4 w-4 text-gray-400" />
            {t.nav.explore}
          </Link>
          <Link
            href="/#precios"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            {t.nav.pricing}
          </Link>
          <Link
            href={dashboardHref}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-amber-400/90 transition-colors hover:bg-amber-500/10 hover:text-amber-300"
          >
            <Sparkles className="h-4 w-4" />
            {t.nav.dashboard}
          </Link>
        </nav>

        {/* Right Actions: Language Switcher, Cart & Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher Pill */}
          <button
            onClick={toggleLanguage}
            title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            className="flex h-9 items-center gap-1 rounded-full border border-white/[0.12] bg-white/[0.03] px-2.5 text-[11px] font-bold tracking-wider text-gray-300 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-white"
          >
            <Globe className="h-3.5 w-3.5 text-amber-400" />
            <span className={language === 'es' ? 'text-amber-400 font-extrabold' : 'text-gray-400'}>ES</span>
            <span className="text-gray-600">/</span>
            <span className={language === 'en' ? 'text-amber-400 font-extrabold' : 'text-gray-400'}>EN</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            aria-label="Abrir carrito"
            className="relative flex h-10 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 text-sm font-medium text-gray-200 transition-all hover:border-amber-500/40 hover:bg-white/[0.06]"
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            {items.length > 0 ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <span>{items.length}</span>
                <span className="hidden sm:inline">({formatCurrency(total)})</span>
              </span>
            ) : (
              <span className="hidden sm:inline text-xs">{t.nav.cart}</span>
            )}
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-black">
                {items.length}
              </span>
            )}
          </button>

          {/* Authentication State */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex h-10 items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate">{user.name}</span>
              </Link>

              <button
                onClick={logout}
                title="Cerrar sesión"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] text-gray-400 hover:text-red-400 hover:border-red-500/30 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Login Button */}
              <Link
                href="/login"
                className="hidden sm:flex h-10 items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 text-xs font-semibold text-gray-300 transition-all hover:bg-white/[0.08] hover:text-white"
              >
                <LogIn className="h-3.5 w-3.5 text-gray-400" />
                <span>{t.nav.login}</span>
              </Link>

              {/* Register / Sell Photos CTA */}
              <Link
                href="/registro"
                className="flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 sm:px-4 text-xs sm:text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 active:scale-95"
              >
                <User className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{t.nav.sellPhotos}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
