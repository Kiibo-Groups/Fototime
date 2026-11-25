'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Tag,
  Zap,
  Palette,
  User,
  ExternalLink,
  Plus,
  Sparkles,
  Lock,
  Gift,
  CheckCircle2,
  AlertCircle,
  Upload,
  Globe,
  LogOut,
  FolderOpen,
  DollarSign,
  TrendingUp,
  Camera,
  Layers,
  ArrowRight,
  Shield,
  Trash2,
  Copy,
  ChevronRight,
  Sliders,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useTranslation } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { mockEvents } from '@/lib/mock-data';

type DashboardTab = 'resumen' | 'eventos' | 'ventas' | 'cupones' | 'planes' | 'marca' | 'perfil';

export default function DashboardPage() {
  const router = useRouter();
  const { language, toggleLanguage } = useTranslation();
  const { user, isLoading, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>('resumen');
  const [mode, setMode] = useState<'sales' | 'storage'>('sales');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Photographer profile editable state
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editClabe, setEditClabe] = useState('012180001234567890');
  const [profileSaved, setProfileSaved] = useState(false);

  const [trialActive, setTrialActive] = useState(false);
  const [showChecklist, setShowChecklist] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [useSampleData, setUseSampleData] = useState(false);

  // Sync state with authenticated user
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditUsername(user.username || user.email.split('@')[0]);
      if (user.clabe) setEditClabe(user.clabe);
    }
  }, [user]);

  // Route protection: redirect to /login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [user, isLoading, router]);

  // Modals & form states
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isPaymentConfigOpen, setIsPaymentConfigOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventPrice, setNewEventPrice] = useState('120');

  // Mercado Pago config state
  const [mpPublicKey, setMpPublicKey] = useState('');
  const [mpAccessToken, setMpAccessToken] = useState('');
  const [mpConfigured, setMpConfigured] = useState(false);

  // Watermark state
  const [watermarkText, setWatermarkText] = useState('FOTOTIME • PREVIEW');
  const [watermarkOpacity, setWatermarkOpacity] = useState(35);

  // Cupones state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('15');
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'BIENVENIDO10', discount: 10, uses: 14, active: true },
    { id: '2', code: 'RUNNER20', discount: 20, uses: 32, active: true },
  ]);

  // Mass upload simulator
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setCoupons((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        code: couponCode.toUpperCase().trim(),
        discount: Number(couponDiscount),
        uses: 0,
        active: true,
      },
    ]);
    setCouponCode('');
  };

  const handleSimulateBatchUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedCount(450);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090a0f] text-gray-400">
        <div className="text-center space-y-4">
          <Logo size="lg" showBadge={true} />
          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-semibold">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <span>Verificando credenciales de acceso...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090a0f] text-gray-400">
        <div className="text-center space-y-3">
          <Logo size="lg" showBadge={true} />
          <p className="text-xs text-gray-400">Acceso restringido a fotógrafos autenticados.</p>
          <Link
            href="/login?redirect=/dashboard"
            className="inline-block rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.name || 'Marcos Benítez';
  const displayUsername = user.username || editUsername || user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col font-sans">
      {/* 1. TOP BAR (Matching the exact screenshot layout) */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-white/[0.08] bg-[#0c0d13]/95 px-4 backdrop-blur-md">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Logo size="sm" showBadge={true} />
          </Link>
        </div>

        {/* Center: Mode Switcher (Venta de fotos | Almacenamiento) */}
        <div className="hidden sm:flex items-center rounded-lg bg-black/60 p-1 border border-white/[0.08]">
          <button
            onClick={() => setMode('sales')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${
              mode === 'sales'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Venta de fotos</span>
          </button>
          <button
            onClick={() => setMode('storage')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${
              mode === 'storage'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Almacenamiento</span>
          </button>
        </div>

        {/* Right: Actions, Language, Upgrade, Profile, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <button
            onClick={toggleLanguage}
            className="flex h-8 items-center gap-1 rounded-md border border-white/[0.1] bg-white/[0.03] px-2 text-[11px] font-bold text-gray-300 hover:bg-white/[0.08] hover:text-white"
          >
            <span>{language.toUpperCase()}</span>
            <span className="text-[10px] text-gray-400">▾</span>
          </button>

          {/* Mejorar plan button */}
          <button
            onClick={() => setActiveTab('planes')}
            className="flex h-8 items-center gap-1.5 rounded-md bg-amber-400 px-3 text-xs font-bold text-black shadow-md hover:bg-amber-300 active:scale-95 transition"
          >
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden md:inline">Mejorar plan</span>
          </button>

          {/* Mi página */}
          <Link
            href="/evento/maraton-cdmx-2026"
            target="_blank"
            className="hidden sm:flex h-8 items-center gap-1 text-xs font-medium text-gray-300 hover:text-white px-2 rounded-md hover:bg-white/[0.05]"
          >
            <span>Mi página</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </Link>

          {/* Cuenta con nombre real */}
          <button
            onClick={() => setActiveTab('perfil')}
            className="flex h-8 items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white px-2 rounded-md hover:bg-white/[0.05]"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-black">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-bold">{displayName}</span>
          </button>

          {/* Salir */}
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex h-8 items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-400 px-2 rounded-md hover:bg-red-500/10 transition"
            title="Cerrar sesión"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* 2. DASHBOARD BODY (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`flex flex-col justify-between border-r border-white/[0.08] bg-[#0c0d13] transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-56 sm:w-60'
          }`}
        >
          {/* Nav Items */}
          <div className="p-3">
            {/* Header label */}
            <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {!sidebarCollapsed && <span>Fotógrafo</span>}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="rounded p-1 text-gray-400 hover:bg-white/[0.08] hover:text-white"
                title={sidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Menu Links */}
            <nav className="mt-2 space-y-1">
              {[
                { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
                { id: 'eventos', label: 'Eventos', icon: Calendar },
                { id: 'ventas', label: 'Ventas', icon: CreditCard },
                { id: 'cupones', label: 'Cupones', icon: Tag },
                { id: 'planes', label: 'Planes', icon: Zap },
                { id: 'marca', label: 'Marca', icon: Palette },
                { id: 'perfil', label: 'Perfil', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as DashboardTab)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                      isActive
                        ? 'bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20'
                        : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Action: Mejorar plan */}
          <div className="p-3 border-t border-white/[0.08]">
            <button
              onClick={() => setActiveTab('planes')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-400/20 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {!sidebarCollapsed && <span>Mejorar plan</span>}
            </button>
          </div>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#090a0f] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* ============================================================== */}
            {/* VIEW 1: RESUMEN (Exact match to screenshot)                     */}
            {/* ============================================================== */}
            {activeTab === 'resumen' && (
              <>
                {/* A. Free Trial Alert Banner */}
                <div className="rounded-2xl border border-amber-500/30 bg-[#16140c]/80 p-5 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <Lock className="h-4 w-4 text-amber-400" />
                    <span>
                      {trialActive
                        ? 'Prueba Free activa: Tienes 7 días de acceso sin comisiones (50 fotos).'
                        : 'Tienes disponible una prueba Free de 7 días (50 fotos).'}
                    </span>
                  </div>

                  {/* Big Amber Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => setTrialActive(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-xs sm:text-sm font-bold text-black shadow-md hover:bg-amber-300 active:scale-[0.99] transition"
                    >
                      <Gift className="h-4 w-4 stroke-[2.5]" />
                      <span>{trialActive ? 'Prueba de 7 Días Activada ✓' : 'Activar 7 días gratis'}</span>
                    </button>
                  </div>

                  <p className="mt-2.5 text-[11px] text-gray-400">
                    50 fotos · sin comisión Fototime. Después puedes suscribirte a Pro o Pro+.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveTab('planes')}
                      className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-white/[0.08] transition"
                    >
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      <span>Ver planes y suscribirme</span>
                    </button>
                    <button
                      onClick={() => alert('Función de administración de cuenta.')}
                      className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-red-400 hover:border-red-500/30 transition"
                    >
                      Eliminar cuenta
                    </button>
                  </div>
                </div>

                {/* B. Header Greeting Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                      Resumen
                    </span>
                    <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
                      Hola, @{displayUsername}
                    </h1>
                    <p className="text-xs text-gray-400">
                      Resumen de tu actividad en Fototime México · <span className="text-amber-400/90 font-mono">{user.email}</span>
                    </p>
                  </div>

                  <Link
                    href="/evento/maraton-cdmx-2026"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-bold text-gray-200 hover:bg-white/[0.08] hover:text-white transition w-fit"
                  >
                    <span>Ver perfil público</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* C. Onboarding Checklist ("Primeros pasos") */}
                {showChecklist && (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                      <h2 className="text-sm font-bold text-white">Primeros pasos</h2>
                      <span className="text-xs text-gray-400 font-medium">
                        {completedSteps.length} de 5
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {[
                        {
                          num: 1,
                          title: 'Elige cómo cobrar',
                          desc: 'Mercado Pago México, Stripe o transferencia. Sin esto no se puede crear un álbum.',
                          action: () => setIsPaymentConfigOpen(true),
                        },
                        {
                          num: 2,
                          title: 'Configura tu página',
                          desc: 'Logo, portada y, con Pro, tu marca de agua personalizada.',
                          action: () => setActiveTab('marca'),
                        },
                        {
                          num: 3,
                          title: 'Crea tu primer álbum',
                          desc: 'Uno por evento, con su fecha y lugar en México.',
                          action: () => setIsCreateEventOpen(true),
                        },
                        {
                          num: 4,
                          title: 'Sube fotos y videos',
                          desc: 'Se procesan solos: marca de agua y detección de dorsales.',
                          action: () => setActiveTab('eventos'),
                        },
                        {
                          num: 5,
                          title: 'Publica y comparte el link',
                          desc: 'Así aparece en tu página y se puede comprar. Mándalo por WhatsApp o redes.',
                          action: () => setActiveTab('eventos'),
                        },
                      ].map((step) => {
                        const isDone = completedSteps.includes(step.num);
                        return (
                          <div
                            key={step.num}
                            onClick={() => toggleStep(step.num)}
                            className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 transition cursor-pointer ${
                              isDone
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  isDone
                                    ? 'bg-emerald-500 text-black'
                                    : 'border border-gray-600 text-gray-400'
                                }`}
                              >
                                {isDone ? '✓' : step.num}
                              </div>
                              <div>
                                <h3
                                  className={`text-xs font-bold ${
                                    isDone ? 'line-through text-gray-400' : 'text-gray-200'
                                  }`}
                                >
                                  {step.title}
                                </h3>
                                <p className="mt-0.5 text-[11px] text-gray-400 leading-relaxed">
                                  {step.desc}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                step.action();
                              }}
                              className="rounded-lg p-1.5 text-gray-500 hover:text-amber-400"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setShowChecklist(false)}
                        className="text-xs font-medium text-gray-400 hover:text-white"
                      >
                        Omitir
                      </button>
                    </div>
                  </div>
                )}

                {/* D. Stats Row (4 Counters matching screenshot) */}
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px] text-gray-500 font-medium">
                    {useSampleData ? 'Mostrando métricas con datos activos de muestra' : 'Métricas en tiempo real (Cuenta inicial)'}
                  </div>
                  <button
                    onClick={() => setUseSampleData(!useSampleData)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline"
                  >
                    {useSampleData ? '← Ver estado inicial (como en la captura)' : 'Simular datos con ventas y fotos →'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Álbumes
                    </span>
                    <p className="mt-2 font-display text-2xl font-black text-white">
                      {useSampleData ? mockEvents.length : 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Archivos Subidos
                    </span>
                    <p className="mt-2 font-display text-2xl font-black text-white">
                      {useSampleData ? '4,200' : 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Ventas
                    </span>
                    <p className="mt-2 font-display text-2xl font-black text-white">
                      {useSampleData ? '154' : 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Ingresos Netos
                    </span>
                    <p className="mt-2 font-display text-2xl font-black text-white">
                      {useSampleData ? '$18,450 MXN' : '$0.00'}
                    </p>
                  </div>
                </div>

                {/* E. Bottom 2 Big Cards Grid (Matching screenshot) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Card 1: Venta de fotos y videos */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <Camera className="h-4 w-4 text-amber-400" />
                        <span>Venta de fotos y videos</span>
                      </div>
                      <p className="mt-3 text-xs text-gray-400">
                        {useSampleData
                          ? `Tienes ${mockEvents.length} álbumes activos publicados en México.`
                          : 'Todavía no creaste ningún álbum.'}
                      </p>
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={() => setIsCreateEventOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-white/[0.08] px-4 py-2 text-xs font-bold text-white hover:bg-white/[0.15] transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Crear nuevo álbum</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Ventas recientes */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <CreditCard className="h-4 w-4 text-amber-400" />
                        <span>Ventas recientes</span>
                      </div>
                      <p className="mt-3 text-xs text-gray-400">
                        {mpConfigured
                          ? 'Mercado Pago México y Stripe están vinculados. Tus ingresos se transfieren directo a tu cuenta.'
                          : 'Vinculá Stripe o Mercado Pago para empezar a cobrar tus álbumes.'}
                      </p>
                    </div>

                    <div className="mt-5">
                      {mpConfigured ? (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Configurado correctamente</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsPaymentConfigOpen(true)}
                          className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300 transition"
                        >
                          <span>Pendiente de configurar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ============================================================== */}
            {/* VIEW 2: EVENTOS (List + Create + Mass Upload)                   */}
            {/* ============================================================== */}
            {activeTab === 'eventos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-white">
                      Mis Álbumes y Eventos
                    </h1>
                    <p className="text-xs text-gray-400">
                      Administra tus galerías, sube fotos y define precios en Pesos Mexicanos (MXN).
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreateEventOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Nuevo Álbum</span>
                  </button>
                </div>

                {/* Mass Upload Simulator Card */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-6 shadow-xl">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Upload className="h-4 w-4 text-amber-400" /> Subida Masiva con IA y Detección de Dorsales
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Arrastra hasta 5,000 fotos directas de tu cámara. Las miniaturas se procesan localmente en tu navegador.
                  </p>

                  <div
                    onClick={handleSimulateBatchUpload}
                    className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/[0.15] bg-white/[0.02] p-8 text-center cursor-pointer hover:border-amber-400/50 hover:bg-amber-400/[0.03] transition"
                  >
                    {isUploading ? (
                      <div className="w-full max-w-sm space-y-3">
                        <div className="flex justify-between text-xs text-gray-300 font-semibold">
                          <span>Subiendo y aplicando marcas de agua...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-gray-400">
                          Detectando dorsales de corredores por OCR en segundo plano...
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-amber-400 mb-2" />
                        <p className="text-xs font-bold text-white">
                          Arrastra tu carpeta de fotos aquí o haz clic para seleccionar
                        </p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          Compatible con JPG, PNG y RAW. Extrae automáticamente metadatos de hora EXIF.
                        </p>
                      </>
                    )}
                  </div>

                  {uploadedCount > 0 && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                      <span>✓ ¡{uploadedCount} fotos subidas con éxito! 398 dorsales indexados.</span>
                      <Link href="/evento/maraton-cdmx-2026" className="font-bold underline hover:text-white">
                        Ver galería
                      </Link>
                    </div>
                  )}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11131a] transition hover:border-white/[0.15]"
                    >
                      <div className="relative aspect-[16/9] w-full bg-black">
                        <Image src={ev.coverImage} alt={ev.title} fill className="object-cover" />
                        <span className="absolute top-2 left-2 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-black text-black">
                          {ev.category}
                        </span>
                        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[11px] font-medium text-white">
                          {ev.photoCount} fotos
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <h3 className="font-bold text-white text-sm line-clamp-1">{ev.title}</h3>
                          <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{ev.location}</p>
                          <p className="mt-2 text-xs font-extrabold text-amber-400">
                            ${ev.pricePerPhoto} MXN / foto
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
                          <Link
                            href={`/evento/${ev.slug}`}
                            target="_blank"
                            className="flex items-center gap-1 text-amber-400 hover:underline"
                          >
                            <span>Ver galería</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>

                          <button
                            onClick={handleSimulateBatchUpload}
                            className="rounded-lg bg-white/[0.08] px-3 py-1 text-[11px] font-semibold text-white hover:bg-white/[0.15]"
                          >
                            Subir más fotos
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 3: VENTAS (Orders, Fees & Net Earnings)                    */}
            {/* ============================================================== */}
            {activeTab === 'ventas' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    Historial de Ventas
                  </h1>
                  <p className="text-xs text-gray-400">
                    Control detallado de cada foto vendida, comisiones y liquidación en Pesos Mexicanos (MXN).
                  </p>
                </div>

                {/* Sales Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-5">
                    <span className="text-xs text-gray-400 font-medium">Ingresos Brutos</span>
                    <p className="mt-2 font-display text-2xl font-black text-white">$19,620 MXN</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-5">
                    <span className="text-xs text-gray-400 font-medium">Fee Fototime (6%)</span>
                    <p className="mt-2 font-display text-2xl font-black text-gray-400">-$1,170 MXN</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                    <span className="text-xs text-emerald-300 font-medium">Neto Liquidado</span>
                    <p className="mt-2 font-display text-2xl font-black text-emerald-400">$18,450 MXN</p>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11131a]">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/[0.08] bg-white/[0.02] text-gray-400">
                      <tr>
                        <th className="p-3.5 font-semibold">Comprador</th>
                        <th className="p-3.5 font-semibold">Evento</th>
                        <th className="p-3.5 font-semibold">Dorsal</th>
                        <th className="p-3.5 font-semibold">Método</th>
                        <th className="p-3.5 font-semibold">Monto</th>
                        <th className="p-3.5 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-gray-300">
                      {[
                        { buyer: 'lucas.garcia@gmail.com', event: 'Medio Maratón CDMX', dorsal: '#104', method: 'Mercado Pago', amount: 360, status: 'Completado' },
                        { buyer: 'sofia.valdes@yahoo.com', event: 'Medio Maratón CDMX', dorsal: '#342', method: 'Mercado Pago', amount: 120, status: 'Completado' },
                        { buyer: 'carlos.mendoza@outlook.com', event: 'Gran Fondo Valle de Bravo', dorsal: '#889', method: 'Stripe', amount: 690, status: 'Completado' },
                        { buyer: 'ana.martinez@gmail.com', event: 'Medio Maratón CDMX', dorsal: '#1205', method: 'Mercado Pago', amount: 240, status: 'Completado' },
                      ].map((order, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="p-3.5 font-medium text-white">{order.buyer}</td>
                          <td className="p-3.5">{order.event}</td>
                          <td className="p-3.5 font-bold text-amber-400">{order.dorsal}</td>
                          <td className="p-3.5">{order.method}</td>
                          <td className="p-3.5 font-bold text-white">${order.amount} MXN</td>
                          <td className="p-3.5">
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 4: CUPONES (Discounts Creator)                             */}
            {/* ============================================================== */}
            {activeTab === 'cupones' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    Cupones de Descuento
                  </h1>
                  <p className="text-xs text-gray-400">
                    Crea códigos promocionales para clubes de running, parejas de novios o amigos.
                  </p>
                </div>

                {/* Create Coupon Form */}
                <form
                  onSubmit={handleCreateCoupon}
                  className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-5 space-y-4"
                >
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tag className="h-4 w-4 text-amber-400" /> Crear Nuevo Cupón
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Código del Cupón</label>
                      <input
                        type="text"
                        required
                        placeholder="EJ. MARATON15"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Porcentaje de Descuento</label>
                      <select
                        value={couponDiscount}
                        onChange={(e) => setCouponDiscount(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white"
                      >
                        <option value="10">10% de Descuento</option>
                        <option value="15">15% de Descuento</option>
                        <option value="20">20% de Descuento</option>
                        <option value="30">30% de Descuento</option>
                        <option value="50">50% de Descuento</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition"
                      >
                        Generar Cupón
                      </button>
                    </div>
                  </div>
                </form>

                {/* Coupons List */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#11131a] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                          <Tag className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-mono text-sm font-bold text-white tracking-wider">{c.code}</p>
                          <p className="text-[11px] text-gray-400">{c.discount}% OFF • {c.uses} compras aplicadas</p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        Activo
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 5: PLANES (Subscription Tiers in MXN)                      */}
            {/* ============================================================== */}
            {activeTab === 'planes' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    Planes y Suscripción
                  </h1>
                  <p className="text-xs text-gray-400">
                    Elige el plan que mejor se adapte a tu volumen de carreras y eventos en México.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {/* Starter */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">Starter</h3>
                      <p className="text-xs text-gray-400 mt-1">Para fotógrafos que inician</p>
                      <p className="mt-4 font-display text-3xl font-black text-white">$0 <span className="text-xs font-normal text-gray-400">MXN/mes</span></p>
                      <ul className="mt-5 space-y-2.5 text-xs text-gray-300">
                        <li className="flex items-center gap-2">✓ Hasta 3 eventos activos</li>
                        <li className="flex items-center gap-2">✓ 1.500 fotos por evento</li>
                        <li className="flex items-center gap-2">✓ Fee de plataforma 12%</li>
                      </ul>
                    </div>
                    <button className="mt-6 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-2 text-xs font-semibold text-gray-300">
                      Plan Actual
                    </button>
                  </div>

                  {/* Pro */}
                  <div className="rounded-2xl border-2 border-amber-400 bg-zinc-900/90 p-6 flex flex-col justify-between shadow-2xl relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-[10px] font-bold text-black uppercase">
                      Recomendado
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">Pro Eventos</h3>
                      <p className="text-xs text-gray-400 mt-1">Para fotógrafos profesionales</p>
                      <p className="mt-4 font-display text-3xl font-black text-amber-400">$399 <span className="text-xs font-normal text-gray-400">MXN/mes</span></p>
                      <ul className="mt-5 space-y-2.5 text-xs text-gray-300">
                        <li className="flex items-center gap-2">✓ Eventos ilimitados</li>
                        <li className="flex items-center gap-2">✓ Búsqueda por Dorsal e IA Facial</li>
                        <li className="flex items-center gap-2">✓ Fee reducido al 6%</li>
                        <li className="flex items-center gap-2">✓ Marca de agua personalizada</li>
                      </ul>
                    </div>
                    <button className="mt-6 w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition">
                      Activar Plan Pro
                    </button>
                  </div>

                  {/* Agencias */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">Agencias</h3>
                      <p className="text-xs text-gray-400 mt-1">Torneos y equipos de fotógrafos</p>
                      <p className="mt-4 font-display text-3xl font-black text-white">$899 <span className="text-xs font-normal text-gray-400">MXN/mes</span></p>
                      <ul className="mt-5 space-y-2.5 text-xs text-gray-300">
                        <li className="flex items-center gap-2">✓ Multi-fotógrafo simultáneo</li>
                        <li className="flex items-center gap-2">✓ Fee ultra bajo (3.5%)</li>
                        <li className="flex items-center gap-2">✓ Marca blanca total</li>
                      </ul>
                    </div>
                    <button className="mt-6 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-2 text-xs font-semibold text-gray-300 hover:bg-white/[0.08]">
                      Contactar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 6: MARCA (Branding & Watermark Customization)              */}
            {/* ============================================================== */}
            {activeTab === 'marca' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    Personalización de Marca y Watermark
                  </h1>
                  <p className="text-xs text-gray-400">
                    Configura la marca de agua que protege tus fotos antes de que el cliente las compre.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Controls */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Texto de la Marca de Agua Central
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1">
                        <span>Opacidad del Sello</span>
                        <span className="text-amber-400">{watermarkOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="75"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                        className="w-full accent-amber-400"
                      />
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3 text-[11px] text-gray-400">
                      💡 La marca de agua se aplica dinámicamente en patrón diagonal de 45° bloqueando capturas de pantalla limpias y arrastre del ratón.
                    </div>

                    <button
                      onClick={() => alert('¡Configuración de marca guardada!')}
                      className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300 transition"
                    >
                      Guardar Cambios
                    </button>
                  </div>

                  {/* Live Watermark Preview */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Vista Previa en Vivo
                    </h2>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black">
                      <Image
                        src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80"
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center select-none"
                        style={{ opacity: watermarkOpacity / 100 }}
                      >
                        <div className="rounded-2xl border-2 border-white/50 bg-black/60 px-6 py-3 text-center">
                          <p className="font-black text-white text-base tracking-widest">{watermarkText}</p>
                          <p className="text-[10px] text-amber-300 font-bold uppercase">Muestra Digital Protegida</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 7: PERFIL (Profile & Payout Accounts)                      */}
            {/* ============================================================== */}
            {activeTab === 'perfil' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-white">
                    Perfil y Medios de Cobro
                  </h1>
                  <p className="text-xs text-gray-400">
                    Configura tu cuenta de Mercado Pago México o Stripe para recibir las liquidaciones directas.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#11131a] p-6 space-y-5">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-amber-400" /> Medios de Cobro (México)
                  </h2>

                  <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Mercado Pago México</p>
                      <p className="text-[11px] text-gray-400">Recibe pagos con Tarjeta, Débito, SPEI y OXXO Pay</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                      Conectado ✓
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Nombre Público de Fotógrafo</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Usuario de Vitrina (URL)</label>
                      <div className="flex">
                        <span className="inline-flex items-center rounded-l-xl border border-r-0 border-white/[0.1] bg-white/[0.04] px-3 text-[11px] text-gray-400">
                          fototime.mx/p/
                        </span>
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full rounded-r-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white font-mono text-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Correo Electrónico (Cuenta)</label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">CLABE Interbancaria (Para depósitos en México)</label>
                      <input
                        type="text"
                        maxLength={18}
                        placeholder="18 dígitos CLABE"
                        value={editClabe}
                        onChange={(e) => setEditClabe(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  {profileSaved && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>¡Perfil y vitrina actualizados con éxito!</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      updateUser({ name: editName, username: editUsername, clabe: editClabe });
                      setProfileSaved(true);
                      setTimeout(() => setProfileSaved(false), 3000);
                    }}
                    className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300 transition"
                  >
                    Guardar Perfil
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL: Crear Nuevo Álbum */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#11131a] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400" /> Crear Nuevo Álbum en México
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Título del Evento *</label>
                <input
                  type="text"
                  placeholder="Ej. Medio Maratón Monterrey 21K"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Fecha del Evento *</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Ubicación / Ciudad *</label>
                <input
                  type="text"
                  placeholder="Ej. Parque Fundidora, Monterrey, N.L."
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Precio por Foto (MXN) *</label>
                <input
                  type="number"
                  placeholder="120"
                  value={newEventPrice}
                  onChange={(e) => setNewEventPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreateEventOpen(false)}
                className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/[0.05]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert(`Álbum "${newEventTitle || 'Nuevo Álbum'}" creado exitosamente.`);
                  setIsCreateEventOpen(false);
                  setActiveTab('eventos');
                }}
                className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300"
              >
                Crear Álbum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Configurar Cobros (Mercado Pago México & Stripe) */}
      {isPaymentConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#11131a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Vincular Medios de Cobro</h3>
              </div>
              <button
                onClick={() => setIsPaymentConfigOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5 text-amber-300">
                <p className="font-bold">Mercado Pago México & SPEI</p>
                <p className="mt-1 text-[11px] text-gray-300">
                  Permite a tus clientes pagar en Pesos Mexicanos (MXN) con tarjeta, transferencia SPEI en tiempo real o en efectivo vía OXXO Pay.
                </p>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Public Key de Mercado Pago México
                </label>
                <input
                  type="text"
                  placeholder="APP_USR-xxxxxx-xxxxxx"
                  value={mpPublicKey}
                  onChange={(e) => setMpPublicKey(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Access Token de Producción
                </label>
                <input
                  type="password"
                  placeholder="APP_USR-xxxxxxxxxxxxxxxxxxxx"
                  value={mpAccessToken}
                  onChange={(e) => setMpAccessToken(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  CLABE Interbancaria en México (18 dígitos para tus depósitos automáticos)
                </label>
                <input
                  type="text"
                  maxLength={18}
                  placeholder="012180001234567890"
                  defaultValue="012180001234567890"
                  className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
              <button
                onClick={() => setIsPaymentConfigOpen(false)}
                className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/[0.05]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setMpConfigured(true);
                  setIsPaymentConfigOpen(false);
                  if (!completedSteps.includes(1)) {
                    setCompletedSteps((prev) => [...prev, 1]);
                  }
                }}
                className="rounded-xl bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300 transition"
              >
                Guardar y Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
