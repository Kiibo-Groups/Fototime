import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';

export const metadata: Metadata = {
  title: 'FOTOTIME - Venta de Fotos de Carreras, Bodas y Eventos en México',
  description:
    'La plataforma más rápida y moderna para fotógrafos de eventos deportivos y sociales en México. Galerías protegidas, búsqueda por dorsal e IA facial, y cobros automatizados con Mercado Pago México y Stripe.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#090a0f] text-gray-100 antialiased selection:bg-amber-500 selection:text-black">
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <AppLayoutWrapper>{children}</AppLayoutWrapper>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
