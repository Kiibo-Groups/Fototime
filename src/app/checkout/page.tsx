'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Download,
  Mail,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, subtotal, discount, total, discountPercent, clearCart, formatCurrency } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'stripe'>('mercadopago');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState(items);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsProcessing(true);
    // Simulate real gateway processing in MXN
    setTimeout(() => {
      setPurchasedItems(items);
      setIsProcessing(false);
      setIsPaid(true);
      clearCart();
    }, 2000);
  };

  if (isPaid) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-[#11131a] to-[#090a0f] p-8 text-center sm:p-12 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="mt-6 inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            ¡Pago Aprobado y Confirmado!
          </span>

          <h1 className="mt-3 font-display text-3xl font-extrabold text-white">
            ¡Tus fotos originales están listas!
          </h1>

          <p className="mx-auto mt-3 max-w-md text-xs text-gray-300 leading-relaxed">
            Hemos acreditado tu pago en Pesos Mexicanos (MXN) mediante {paymentMethod === 'mercadopago' ? 'Mercado Pago México' : 'Stripe'}. Enviamos también un enlace seguro permanente a <strong className="text-white">{email}</strong>.
          </p>

          {/* Download Original High-Res Files Grid */}
          <div className="mt-8 space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Descarga inmediata de tus {purchasedItems.length} fotos originales en máxima resolución:
            </h3>

            {purchasedItems.map((item, idx) => (
              <div
                key={item.photo.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-black">
                    <Image
                      src={item.photo.url}
                      alt="Foto comprada"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Foto #{idx + 1} {item.photo.dorsal ? `(Dorsal #${item.photo.dorsal})` : ''}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      JPEG • 24.2 MP • 6000x4000 px • Sin marca
                    </p>
                  </div>
                </div>

                <a
                  href={item.photo.highResUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 active:scale-95 transition"
                >
                  <Download className="h-3.5 w-3.5" /> Descargar Original
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/explorar"
              className="w-full sm:w-auto rounded-xl bg-white/[0.08] px-6 py-3 text-xs font-semibold text-white hover:bg-white/[0.15] transition"
            >
              Explorar más eventos en México
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a la galería
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left Form */}
        <div className="lg:col-span-7">
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Finalizar Compra
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Sin registros forzados. Solo tus datos de contacto para enviarte las fotos originales.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Contact Details */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500" /> Datos de Entrega
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Mendoza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:border-amber-500/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Correo Electrónico (Para recibir tus enlaces de descarga) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:border-amber-500/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  WhatsApp (Para aviso inmediato en México)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-white/[0.1] bg-white/[0.04] px-3 text-xs text-gray-400">
                    🇲🇽 +52
                  </span>
                  <input
                    type="tel"
                    placeholder="55 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-r-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:border-amber-500/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-500" /> Método de Pago
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mercado Pago México */}
                <label
                  onClick={() => setPaymentMethod('mercadopago')}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                    paymentMethod === 'mercadopago'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={() => setPaymentMethod('mercadopago')}
                      className="accent-amber-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Mercado Pago México</p>
                      <p className="text-[10px] text-gray-400">Tarjetas, Débito, SPEI, OXXO Pay</p>
                    </div>
                  </div>
                  <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-bold text-sky-400">
                    MXN
                  </span>
                </label>

                {/* Stripe */}
                <label
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                    paymentMethod === 'stripe'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="accent-amber-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Stripe / Tarjetas Int.</p>
                      <p className="text-[10px] text-gray-400">Visa, Mastercard, AMEX, Apple Pay</p>
                    </div>
                  </div>
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-400">
                    GLOBAL
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Cobro seguro en Pesos Mexicanos (MXN). Encriptación bancaria SSL de 256 bits.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || items.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-4 text-sm font-bold text-black shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Procesando pago seguro...</span>
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 stroke-[2.2]" />
                  <span>Pagar Ahora {formatCurrency(total)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Order Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-6 sticky top-24 space-y-4">
            <h2 className="text-sm font-bold text-white">Resumen del Pedido (MXN)</h2>

            {items.length === 0 ? (
              <p className="text-xs text-gray-400">No hay fotos en el carrito.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {items.map((item) => (
                  <div key={item.photo.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-12 overflow-hidden rounded bg-black">
                        <Image
                          src={item.photo.url}
                          alt="Foto"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-[160px] truncate">
                        <p className="text-white font-medium truncate">{item.event.title}</p>
                        <p className="text-[10px] text-gray-400">
                          {item.photo.dorsal ? `Dorsal #${item.photo.dorsal}` : 'Foto evento'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-amber-400">
                      {formatCurrency(item.photo.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-white/[0.08] pt-3 space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} fotos):</span>
                <span className="text-gray-200 font-medium">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Descuento Pack ({discountPercent}%):
                  </span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-white/[0.08] pt-3 text-base font-black text-white">
                <span>Total a pagar:</span>
                <span className="text-amber-400">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] p-3 text-[11px] text-gray-400 space-y-1">
              <p className="text-gray-300 font-semibold flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-400" /> Entrega digital inmediata
              </p>
              <p>
                Los enlaces de descarga de alta resolución se activan al instante una vez confirmado el pago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
