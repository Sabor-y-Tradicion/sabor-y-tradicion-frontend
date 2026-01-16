"use client";

import { useEffect } from 'react';
import { useTenant } from '@/contexts/tenant-context';
import { usePathname } from 'next/navigation';

/**
 * Componente que actualiza dinámicamente el título de la pestaña
 * según el tenant actual y la página visitada
 */
export function TenantHead() {
  const { tenant, loading } = useTenant();
  const pathname = usePathname();

  useEffect(() => {
    // Esperar a que termine de cargar
    if (loading) return;

    // Para rutas de superadmin, usar título específico
    if (pathname.startsWith('/superadmin')) {
      document.title = 'SuperAdmin - Panel de Control';
      return;
    }

    // Si no hay tenant cargado, no actualizar el título
    if (!tenant?.name) return;

    // Determinar el título según la ruta
    let pageTitle: string;

    if (pathname === '/' || pathname === '/menu') {
      pageTitle = tenant.name;
    } else if (pathname === '/login') {
      pageTitle = `${tenant.name} - Iniciar Sesión`;
    } else if (pathname.startsWith('/admin')) {
      pageTitle = `${tenant.name} - Admin`;
    } else if (pathname.startsWith('/orders')) {
      pageTitle = `${tenant.name} - Pedidos`;
    } else {
      pageTitle = tenant.name;
    }

    // Actualizar el título del documento
    document.title = pageTitle;

    // También actualizar el meta description si el tenant tiene descripción
    if (tenant?.settings?.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', tenant.settings.description);
      }
    }

  }, [tenant, loading, pathname]);

  // Este componente no renderiza nada visible
  return null;
}

