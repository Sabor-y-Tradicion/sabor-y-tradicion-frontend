"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authAPI } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";

type AuthContext = 'admin' | 'superadmin' | 'orders';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  authContext: AuthContext;
}

const AuthContextReact = createContext<AuthContextType | undefined>(undefined);

/**
 * Determinar el contexto de autenticación basado en la ruta
 */
const getAuthContextFromPath = (pathname: string): AuthContext => {
  if (pathname.startsWith('/superadmin')) {
    return 'superadmin';
  } else if (pathname.startsWith('/orders')) {
    return 'orders';
  }
  return 'admin';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Detectar el contexto según la ruta
  const authContext = getAuthContextFromPath(pathname);

  // Migrar sesiones antiguas al nuevo formato (solo una vez)
  useEffect(() => {
    const migrated = localStorage.getItem('auth_migrated_v2');
    if (!migrated && typeof window !== 'undefined') {
      console.log('🔄 Iniciando migración de sesiones al formato multi-tenant...');

      // Migrar desde el formato v1 (auth_token_admin, etc.) al formato v2 (auth_token_admin_domain)
      const oldContexts: Array<'admin' | 'superadmin' | 'orders'> = ['admin', 'superadmin', 'orders'];

      oldContexts.forEach(context => {
        const oldTokenKey = `auth_token_${context}`;
        const oldUserKey = `auth_user_${context}`;

        const oldToken = localStorage.getItem(oldTokenKey);
        const oldUser = localStorage.getItem(oldUserKey);

        if (oldToken && oldUser) {
          try {
            const userData = JSON.parse(oldUser);

            // Para superadmin, no cambiar el formato (sigue siendo global)
            if (context === 'superadmin') {
              console.log(`✅ Sesión de superadmin ya está en el formato correcto`);
              return;
            }

            // Para admin y orders, agregar el dominio del tenant
            const tenantDomain = process.env.NEXT_PUBLIC_DEV_TENANT_DOMAIN || 'sabor-y-tradicion.tuapp.com';
            const normalizedDomain = tenantDomain.replace(/:\d+$/, '').replace(/[^a-zA-Z0-9-]/g, '_');
            const newSessionId = `${context}_${normalizedDomain}`;

            const newTokenKey = `auth_token_${newSessionId}`;
            const newUserKey = `auth_user_${newSessionId}`;

            // Migrar al nuevo formato
            localStorage.setItem(newTokenKey, oldToken);
            localStorage.setItem(newUserKey, oldUser);
            localStorage.setItem(`${newUserKey}_domain`, tenantDomain);

            // Limpiar claves antiguas
            localStorage.removeItem(oldTokenKey);
            localStorage.removeItem(oldUserKey);

            console.log(`✅ Sesión migrada: ${context} -> ${newSessionId}`);
          } catch (error) {
            console.error(`Error al migrar sesión de ${context}:`, error);
          }
        }
      });

      // Marcar como migrado (v2)
      localStorage.setItem('auth_migrated_v2', 'true');
      console.log('✅ Migración completada');
    }
  }, []);

  // Verificar autenticación al cargar o cambiar de contexto
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext, pathname]); // Agregar pathname para detectar cambios de tenant

  const checkAuth = async () => {
    try {
      // Primero intentar cargar desde localStorage
      const currentUser = authAPI.getCurrentUser(authContext);
      const hasToken = authAPI.isAuthenticated(authContext);

      if (currentUser && hasToken) {
        // Usuario encontrado en localStorage, usarlo inmediatamente
        setUser(currentUser);
        setIsLoading(false);

        // Opcionalmente, verificar con el backend en segundo plano
        try {
          const userData = await authAPI.verify(authContext);
          setUser(userData);
        } catch {
          // Si falla la verificación, mantener el usuario de localStorage
        }
      } else {
        // No hay usuario en localStorage para este contexto + tenant
        setUser(null);
        setIsLoading(false);
      }
    } catch {
      setUser(null);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const authData = await authAPI.login({ email, password });
      setUser(authData.user);

      // Solo retornar el usuario, NO redirigir
      // Cada página de login maneja su propia redirección
      return authData.user;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Credenciales inválidas";
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout(authContext);
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });

    // Redirigir según el contexto
    const loginPath = authContext === 'superadmin' ? '/superadmin/login' : '/login';
    router.push(loginPath);
  };

  return (
    <AuthContextReact.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
        authContext,
      }}
    >
      {children}
    </AuthContextReact.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContextReact);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
