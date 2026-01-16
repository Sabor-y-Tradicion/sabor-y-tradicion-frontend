"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { SuperAdminLayoutWrapper } from "./components/superadmin-layout-wrapper";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Rutas públicas que NO requieren autenticación
  const isPublicRoute = pathname === "/superadmin/login";

  useEffect(() => {
    // No proteger rutas públicas
    if (isPublicRoute) return;

    // Proteger rutas privadas SOLO cuando ya terminó de cargar
    if (!isLoading) {
      if (!isAuthenticated) {
        // No autenticado, redirigir al login de superadmin
        router.push("/superadmin/login");
      }
      // NO redirigir si tiene otro rol - los logins son independientes
    }
  }, [isAuthenticated, isLoading, user, router, pathname, isPublicRoute]);

  // Mostrar loading solo en rutas protegidas
  if (!isPublicRoute && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Bloquear acceso solo en rutas protegidas si no está autenticado
  if (!isPublicRoute && !isLoading && !isAuthenticated) {
    return null;
  }

  // Si es ruta pública (login), renderizar sin layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Para rutas protegidas, usar el layout con sidebar
  return <SuperAdminLayoutWrapper>{children}</SuperAdminLayoutWrapper>;
}

