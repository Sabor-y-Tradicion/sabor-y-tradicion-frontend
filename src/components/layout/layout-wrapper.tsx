"use client";

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { WhatsAppFloat } from '../whatsapp-float';
import { useTenant } from '@/contexts/tenant-context';
import { Skeleton } from '@/components/ui/skeleton';
import { GoogleMapsProvider } from '@/contexts/google-maps-context';

function PublicLayoutSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-18" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </header>

      {/* Content skeleton */}
      <main className="flex-grow container py-8">
        <Skeleton className="h-64 w-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </main>

      {/* Footer skeleton */}
      <footer className="bg-secondary/50 border-t py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useTenant();

  const isAdminRoute = pathname?.startsWith('/admin');
  const isOrdersRoute = pathname?.startsWith('/orders');
  const isSuperAdminRoute = pathname?.startsWith('/superadmin');

  // Para rutas de admin, orders y superadmin, NO envolver en nada
  // Sus propios layouts manejan todo (incluyendo GoogleMapsProvider si lo necesitan)
  if (isAdminRoute || isOrdersRoute || isSuperAdminRoute) {
    return <>{children}</>;
  }

  // Mostrar skeleton mientras carga el tenant
  if (loading) {
    return <PublicLayoutSkeleton />;
  }

  // Para rutas públicas, renderizamos con Header, Footer y WhatsApp flotante
  return (
    <GoogleMapsProvider>
      <Header />
      <main className="min-h-screen flex-grow">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </GoogleMapsProvider>
  );
}

