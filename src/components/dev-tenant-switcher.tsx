"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

// Lista de tenants de desarrollo predefinidos
const DEV_TENANTS = [
  { name: "Sabor y Tradición", domain: "sabor-tradicion.test" },
  { name: "Otro Restaurante", domain: "otro-restaurante.test" },
  { name: "Demo Restaurant", domain: "demo-restaurant.test" },
];

/**
 * Componente de desarrollo para cambiar entre tenants
 * Solo se muestra en modo desarrollo cuando estamos en localhost puro
 * NO se muestra si ya estás usando dominios .test o .local (Laragon)
 */
export function DevTenantSwitcher() {
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const [customTenant, setCustomTenant] = useState("");
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;

      // Solo mostrar si estamos en localhost puro (no con dominios configurados)
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      const isDev = process.env.NODE_ENV === 'development';

      // NO mostrar si ya tenemos un dominio .test o .local
      const hasCustomDomain = hostname.endsWith('.test') || hostname.endsWith('.local');

      setShouldShow(isDev && isLocalhost && !hasCustomDomain);

      // Obtener tenant actual
      if (isLocalhost) {
        const savedTenant = sessionStorage.getItem('dev_tenant_domain');
        setCurrentTenant(savedTenant || process.env.NEXT_PUBLIC_DEV_TENANT_DOMAIN || 'sabor-tradicion.test');
      } else {
        setCurrentTenant(hostname);
      }
    }
  }, []);

  const switchTenant = (domain: string) => {
    sessionStorage.setItem('dev_tenant_domain', domain);
    const url = new URL(window.location.href);
    url.searchParams.set('tenant', domain);
    window.location.href = url.toString();
  };

  const handleCustomTenant = () => {
    if (customTenant.trim()) {
      switchTenant(customTenant.trim());
    }
  };

  // No mostrar si no cumple las condiciones
  if (!shouldShow) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200"
        >
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">DEV: {currentTenant}</span>
          <span className="sm:hidden">DEV</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-yellow-600">
          🛠️ Cambiar Tenant (Solo Dev)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2 text-xs text-blue-600 bg-blue-50 rounded mx-2 mb-2">
          💡 <strong>Tip:</strong> Configura Laragon para usar dominios .test
          <br />Ver: <code>SETUP_LARAGON.md</code>
        </div>

        {DEV_TENANTS.map((tenant) => (
          <DropdownMenuItem
            key={tenant.domain}
            onClick={() => switchTenant(tenant.domain)}
            className={currentTenant === tenant.domain ? "bg-yellow-100" : ""}
          >
            <Building2 className="h-4 w-4 mr-2" />
            <div className="flex-1">
              <p className="font-medium">{tenant.name}</p>
              <p className="text-xs text-muted-foreground">{tenant.domain}</p>
            </div>
            {currentTenant === tenant.domain && (
              <span className="text-xs text-yellow-600">✓ Actual</span>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-xs text-muted-foreground mb-2">Tenant personalizado:</p>
          <div className="flex gap-2">
            <Input
              placeholder="dominio.test"
              value={customTenant}
              onChange={(e) => setCustomTenant(e.target.value)}
              className="h-8 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleCustomTenant()}
            />
            <Button
              size="sm"
              className="h-8"
              onClick={handleCustomTenant}
              disabled={!customTenant.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DevTenantSwitcher;
