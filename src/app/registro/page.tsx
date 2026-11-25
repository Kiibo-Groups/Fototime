'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Camera,
  Award,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Phone,
  AtSign,
  Eye,
  EyeOff,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<'PHOTOGRAPHER' | 'CUSTOMER'>('PHOTOGRAPHER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-generate username from name if not manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!username) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 20);
      setUsername(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          username: role === 'PHOTOGRAPHER' ? username : undefined,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar la cuenta');
      }

      if (data.user) {
        login(data.user);
      }

      setSuccess(true);
      setTimeout(() => {
        if (role === 'PHOTOGRAPHER') {
          router.push('/dashboard');
        } else {
          router.push('/explorar');
        }
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo size="lg" showBadge={true} />
          </Link>
          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Crear Cuenta Gratis
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Únete a la plataforma de fotografía deportiva y de eventos en México
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#11131a]/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Role Selector Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-black/40 p-1.5 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setRole('PHOTOGRAPHER')}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                role === 'PHOTOGRAPHER'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>Soy Fotógrafo</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                role === 'CUSTOMER'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Soy Atleta / Invitado</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>¡Cuenta creada con éxito! Redirigiendo...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Rodrigo Álvarez"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-amber-500/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Correo Electrónico *
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

            {/* Photographer username for public URL */}
            {role === 'PHOTOGRAPHER' && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Nombre de usuario público (Tu enlace de vitrina)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-white/[0.1] bg-white/[0.04] px-3 text-[11px] text-gray-400 font-mono">
                    fototime.mx/p/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="rodrigo-fotos"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="w-full rounded-r-xl border border-white/[0.1] bg-black/40 px-3 py-2.5 text-xs text-amber-400 font-medium placeholder-gray-500 focus:border-amber-500/60 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Teléfono / WhatsApp (México)
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
                  className="w-full rounded-r-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-amber-500/60 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mín. 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.1] bg-black/40 pl-10 pr-9 py-2.5 text-xs text-white placeholder-gray-500 focus:border-amber-500/60 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.1] bg-black/40 pl-10 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:border-amber-500/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              Al registrarte aceptas los Términos de Servicio y el Aviso de Privacidad de Fototime México.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Creando tu cuenta en México...</span>
                </div>
              ) : (
                <>
                  <span>{role === 'PHOTOGRAPHER' ? 'Crear Cuenta de Fotógrafo' : 'Crear Cuenta Gratis'}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Footer Link */}
        <p className="text-center text-xs text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-bold text-amber-400 hover:underline">
            Iniciar sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
