"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Página de redirección de /admin/login a /login
 * El login unificado está en /login y redirige según el rol del usuario
 */
export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al login unificado
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </div>
  );
}

