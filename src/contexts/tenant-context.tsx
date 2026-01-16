"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TenantSettings {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  logo?: string;
  theme?: string;
  features?: {
    delivery?: boolean;
    reservations?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  email: string;
  plan: string;
  status: string;
  settings: TenantSettings;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  updateTenantSettings: (settings: Partial<TenantSettings>) => Promise<boolean>;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  error: null,
  reload: async () => {},
  updateTenantSettings: async () => false,
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateTenantSettings = async (settings: Partial<TenantSettings>): Promise<boolean> => {
    if (!tenant) return false;

    try {
      // Obtener el token correcto según el dominio y contexto
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      let tenantDomain = hostname;

      // Normalizar dominio para buscar token
      const normalizedDomain = tenantDomain.replace(/:\d+$/, '').replace(/[^a-zA-Z0-9-]/g, '_');

      // Buscar token en diferentes claves posibles
      const possibleKeys = [
        `auth_token_admin_${normalizedDomain}`,
        `auth_token_orders_${normalizedDomain}`,
        'auth_token_superadmin'
      ];

      let token: string | null = null;
      for (const key of possibleKeys) {
        token = localStorage.getItem(key);
        if (token) break;
      }

      if (!token) {
        throw new Error('No autenticado');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tenants/${tenant.id}/settings`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Tenant-Domain': tenantDomain,
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar configuración');
      }

      if (data.success) {
        // El backend puede devolver diferentes estructuras
        let newSettings: Partial<TenantSettings>;

        if (data.data?.settings && Object.keys(data.data.settings).length > 0) {
          newSettings = data.data.settings;
        } else if (data.data && !data.data.id && Object.keys(data.data).length > 0) {
          newSettings = data.data;
        } else {
          // Fallback: usar los settings que enviamos
          newSettings = settings;
        }

        setTenant(prev => {
          if (!prev) return null;
          return {
            ...prev,
            settings: {
              ...prev.settings,
              ...newSettings
            }
          };
        });

        applyTenantTheme(newSettings as TenantSettings);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error actualizando configuración:', err);
      return false;
    }
  };

  const loadTenant = async () => {
    try {
      // Solo omitir carga en superadmin (no tiene tenant específico)
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/superadmin')) {
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);

      // Obtener dominio
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const domain = getDomainForAPI(hostname);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tenants/domain/${domain}`
      );

      if (!response.ok) {
        throw new Error('Restaurante no encontrado');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setTenant(data.data);
        applyTenantTheme(data.data.settings);
      } else {
        throw new Error('No se pudo cargar el restaurante');
      }
    } catch (err: any) {
      console.error('Error cargando tenant:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error, reload: loadTenant, updateTenantSettings }}>
      {children}
    </TenantContext.Provider>
  );
}

// Hook personalizado
export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant debe ser usado dentro de TenantProvider');
  }
  return context;
}

// Helper: Obtener dominio correcto
function getDomainForAPI(hostname: string): string {
  // En desarrollo local
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
    return process.env.NEXT_PUBLIC_DEV_TENANT_DOMAIN || 'saborytradicion.james.pe';
  }

  // En producción
  return hostname;
}

// Aplicar tema del tenant dinámicamente
function applyTenantTheme(settings: TenantSettings) {
  if (typeof window === 'undefined') return;
  if (!settings.colors) return;

  const root = document.documentElement;

  if (settings.colors.primary) {
    root.style.setProperty('--color-primary', settings.colors.primary);
  }

  if (settings.colors.secondary) {
    root.style.setProperty('--color-secondary', settings.colors.secondary);
  }

  if (settings.colors.accent) {
    root.style.setProperty('--color-accent', settings.colors.accent);
  }
}

