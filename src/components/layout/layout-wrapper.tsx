"use client";

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Para rutas de admin, solo renderizamos el children sin Header ni Footer
    return <>{children}</>;
  }

  // Para rutas públicas, renderizamos con Header y Footer
  return (
    <>
      <Header />
      <main className="min-h-screen flex-grow">{children}</main>
      <Footer />
    </>
  );
}

