'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales no válidas');
      }

      // Save real user session in AuthContext & LocalStorage
      if (data.user) {
        login(data.user);
      }

      setSuccess(true);
      setTimeout(() => {
        if (data.user?.role === 'PHOTOGRAPHER') {
          router.push(redirectUrl);
        } else {
          router.push('/explorar');
        }
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo size="lg" showBadge={true} />
          </Link>
          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Iniciar Sesión
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Ingresa a tu cuenta de fotógrafo o comprador en Fototime México
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#11131a]/90 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>¡Acceso correcto! Redirigiendo a tu panel...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-amber-500/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-300">
                  Contraseña
                </label>
                <a href="#" className="text-[11px] text-amber-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:border-amber-500/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/20 bg-black/40 text-amber-500 accent-amber-500 focus:ring-0"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-gray-400">
                Mantener sesión iniciada
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Verificando credenciales...</span>
                </div>
              ) : (
                <>
                  <span>Entrar a mi cuenta</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <button
              type="button"
              onClick={() => {
                setEmail('marcos@fototime.co');
                setPassword('Admin15978xy.');
              }}
              className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition text-center flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Autocompletar con Fotógrafo Real (Marcos Benítez)</span>
            </button>
          </div>
        </div>

        {/* Register Footer Link */}
        <p className="text-center text-xs text-gray-400">
          ¿Aún no tienes cuenta?{' '}
          <Link href="/registro" className="font-bold text-amber-400 hover:underline">
            Crear cuenta gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090a0f]" />}>
      <LoginFormContent />
    </Suspense>
  );
}
