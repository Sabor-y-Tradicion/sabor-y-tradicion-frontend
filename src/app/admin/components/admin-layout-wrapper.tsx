"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "../components/sidebar";
import { AdminHeader } from "../components/admin-header";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Permitir acceso a la página de login sin verificación
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

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

  // Si es la página de login, mostrar sin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Si no está autenticado, no mostrar nada (esperando redirección)
  if (!isAuthenticated) {
    return null;
  }

  // Layout completo del admin para páginas protegidas
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

