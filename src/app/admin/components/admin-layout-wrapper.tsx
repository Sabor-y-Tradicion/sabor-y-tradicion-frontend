"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { AdminSidebar } from "../components/sidebar";
import { AdminHeader } from "../components/admin-header";
import { GoogleMapsProvider } from "@/contexts/google-maps-context";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Aplicar tema guardado
  useTheme();

  // Permitir acceso a la página de login sin verificación (redirección)
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Solo ejecutar redirecciones cuando terminó de cargar
    if (isLoading) return;

    // Si no está autenticado y no es la página de login, redirigir al login unificado
    if (!isAuthenticated && !isLoginPage) {
      router.push("/login");
      return;
    }

    // Si es ORDERS_MANAGER, redirigir a /orders (solo si user existe)
    if (isAuthenticated && user && user.role === 'ORDERS_MANAGER' && !isLoginPage) {
      router.push("/orders");
      return;
    }
  }, [isAuthenticated, isLoading, isLoginPage, user, router, pathname]);

  // Mostrar loading solo si no es la página de login
  if (isLoading && !isLoginPage) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si es la página de login (redirección), mostrar sin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Si no está autenticado y no es login, no mostrar nada (esperando redirección)
  if (!isLoading && !isAuthenticated && !isLoginPage) {
    return null;
  }

  // Layout completo del admin para páginas protegidas con GoogleMapsProvider
  return (
    <GoogleMapsProvider>
      <div className="flex min-h-screen max-h-screen bg-white dark:bg-gray-900">
        <AdminSidebar />
        <div className="flex flex-1 flex-col min-h-screen max-h-screen">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
            {children}
          </main>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}

