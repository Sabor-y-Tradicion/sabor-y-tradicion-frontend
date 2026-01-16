import apiClient from './client';
import {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User
} from './types';

// Tipos de contexto para sesiones múltiples
type AuthContext = 'admin' | 'superadmin' | 'orders';

/**
 * Obtiene el dominio del tenant actual
 * Soporta múltiples configuraciones:
 * 1. Subdominios de james.pe (saborytradicion.james.pe, etc.)
 * 2. Dominios .test (Laragon)
 * 3. Dominios .local
 * 4. Dominios reales (producción)
 * 5. Query parameter ?tenant= (desarrollo simple)
 */
const getCurrentTenantDomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;

  // 1. Detectar subdominios de james.pe (desarrollo con dominio personal)
  //    saborytradicion.james.pe → tenant: saborytradicion.james.pe
  //    james.pe (sin subdominio) → superadmin (no tenant)
  if (hostname.endsWith('.james.pe')) {
    return hostname;
  }

  // james.pe sin subdominio es el SuperAdmin, no necesita tenant
  if (hostname === 'james.pe') {
    return hostname;
  }

  // 2. Si es un dominio .test (Laragon/Nginx style)
  if (hostname.endsWith('.test')) {
    return hostname;
  }

  // 3. Si es un dominio .local configurado en hosts
  if (hostname.endsWith('.local')) {
    return hostname;
  }

  // 4. Si es un dominio real (tiene punto y no es localhost)
  if (hostname.includes('.') && !hostname.includes('localhost')) {
    return hostname;
  }

  // 5. En desarrollo local puro (localhost o 127.0.0.1)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Intentar obtener tenant de query parameter (?tenant=dominio)
    const urlParams = new URLSearchParams(window.location.search);
    const tenantFromQuery = urlParams.get('tenant');

    if (tenantFromQuery) {
      sessionStorage.setItem('dev_tenant_domain', tenantFromQuery);
      return tenantFromQuery;
    }

    // Intentar recuperar de sessionStorage
    const savedTenant = sessionStorage.getItem('dev_tenant_domain');
    if (savedTenant) {
      return savedTenant;
    }

    // Usar la variable de entorno como fallback
    const envTenant = process.env.NEXT_PUBLIC_DEV_TENANT_DOMAIN || 'saborytradicion.james.pe';
    return envTenant;
  }

  // Fallback
  return hostname;
};

/**
 * Determina el contexto de autenticación basado en el rol del usuario
 */
const getAuthContextFromRole = (role: string): AuthContext => {
  switch (role) {
    case 'SUPERADMIN':
      return 'superadmin';
    case 'ORDERS_MANAGER':
      return 'orders';
    case 'ADMIN':
    default:
      return 'admin';
  }
};

/**
 * Genera el identificador único de sesión
 * Formato: context (+ tenant si no es superadmin)
 */
const getSessionId = (context: AuthContext, tenantDomain?: string | null): string => {
  // SUPERADMIN no necesita tenant (es global)
  if (context === 'superadmin') {
    return 'superadmin';
  }

  // Para ADMIN y ORDERS, incluir el dominio del tenant
  const domain = tenantDomain || getCurrentTenantDomain() || 'default';
  // Normalizar el dominio para usar como clave (remover puertos, etc)
  const normalizedDomain = domain.replace(/:\d+$/, '').replace(/[^a-zA-Z0-9-]/g, '_');
  return `${context}_${normalizedDomain}`;
};

/**
 * Obtiene las claves de localStorage según el contexto y tenant
 */
const getStorageKeys = (context: AuthContext, tenantDomain?: string | null) => {
  const sessionId = getSessionId(context, tenantDomain);
  return {
    token: `auth_token_${sessionId}`,
    user: `auth_user_${sessionId}`,
  };
};

export const authAPI = {
  /**
   * Iniciar sesión
   * IMPORTANTE: Siempre guarda la sesión con el dominio ACTUAL donde se está iniciando sesión
   * Esto permite múltiples sesiones del mismo usuario en diferentes dominios
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );

    if (response.data.success && response.data.data) {
      const { token, user } = response.data.data;
      const context = getAuthContextFromRole(user.role);

      // CRÍTICO: Usar SIEMPRE el dominio actual del navegador para guardar la sesión
      // Esto asegura que cada dominio tenga su propia sesión independiente
      const tenantDomain = getCurrentTenantDomain();
      const sessionId = getSessionId(context, tenantDomain);
      const keys = getStorageKeys(context, tenantDomain);

      // Guardar token y usuario en localStorage con clave específica del contexto + tenant
      localStorage.setItem(keys.token, token);
      localStorage.setItem(keys.user, JSON.stringify(user));

      // Guardar también el dominio del tenant para esta sesión (solo si no es superadmin)
      if (context !== 'superadmin' && tenantDomain) {
        localStorage.setItem(`${keys.user}_domain`, tenantDomain);
      }


      return response.data.data;
    }

    throw new Error(response.data.error || 'Error al iniciar sesión');
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );

    if (response.data.success && response.data.data) {
      const { token, user } = response.data.data;
      const context = getAuthContextFromRole(user.role);
      const tenantDomain = getCurrentTenantDomain();
      const keys = getStorageKeys(context, tenantDomain);

      // Guardar token y usuario en localStorage con clave específica del contexto + tenant
      localStorage.setItem(keys.token, token);
      localStorage.setItem(keys.user, JSON.stringify(user));

      // Guardar también el dominio del tenant para esta sesión (solo si no es superadmin)
      if (context !== 'superadmin' && tenantDomain) {
        localStorage.setItem(`${keys.user}_domain`, tenantDomain);
      }

      return response.data.data;
    }

    throw new Error(response.data.error || 'Error al registrar usuario');
  },

  /**
   * Verificar token actual (usando el contexto proporcionado)
   */
  verify: async (context?: AuthContext, tenantDomain?: string | null): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/verify');

    if (response.data.success && response.data.data) {
      const verifiedUser = response.data.data;
      const authContext = context || getAuthContextFromRole(verifiedUser.role);
      const domain = tenantDomain || getCurrentTenantDomain();
      const keys = getStorageKeys(authContext, domain);

      // Obtener usuario actual del localStorage para preservar campos que el backend no devuelve
      const currentUserStr = localStorage.getItem(keys.user);
      let currentUser: User | null = null;
      if (currentUserStr) {
        try {
          currentUser = JSON.parse(currentUserStr);
        } catch {
          currentUser = null;
        }
      }

      // Combinar: usar datos del backend pero preservar name si no viene
      const user: User = {
        ...verifiedUser,
        name: verifiedUser.name || currentUser?.name || 'Usuario',
      };

      // Actualizar usuario en localStorage
      localStorage.setItem(keys.user, JSON.stringify(user));

      return user;
    }

    throw new Error(response.data.error || 'Error al verificar token');
  },

  /**
   * Cerrar sesión (del contexto específico + tenant)
   */
  logout: (context: AuthContext, tenantDomain?: string | null) => {
    const domain = tenantDomain || getCurrentTenantDomain();
    const keys = getStorageKeys(context, domain);
    localStorage.removeItem(keys.token);
    localStorage.removeItem(keys.user);
    localStorage.removeItem(`${keys.user}_domain`);
  },

  /**
   * Obtener usuario actual del localStorage (del contexto específico + tenant)
   * Para contexto 'orders', también busca el usuario de 'admin' si no hay sesión de orders
   */
  getCurrentUser: (context: AuthContext, tenantDomain?: string | null): User | null => {
    if (typeof window === 'undefined') return null;

    const domain = tenantDomain || getCurrentTenantDomain();
    const keys = getStorageKeys(context, domain);
    const userStr = localStorage.getItem(keys.user);

    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        // Si falla el parse, intentar con admin si estamos en orders
      }
    }

    // Si estamos en orders y no hay usuario, buscar usuario de admin
    if (context === 'orders') {
      const adminKeys = getStorageKeys('admin', domain);
      const adminUserStr = localStorage.getItem(adminKeys.user);
      if (adminUserStr) {
        try {
          const adminUser = JSON.parse(adminUserStr);
          // Solo permitir si el usuario tiene rol ADMIN (puede acceder a todo)
          if (adminUser.role === 'ADMIN' || adminUser.role === 'ORDERS_MANAGER') {
            return adminUser;
          }
        } catch {
          return null;
        }
      }
    }

    return null;
  },

  /**
   * Obtener token actual (del contexto específico + tenant)
   * Para contexto 'orders', también busca el token de 'admin' si no hay token de orders
   */
  getToken: (context: AuthContext, tenantDomain?: string | null): string | null => {
    if (typeof window === 'undefined') return null;
    const domain = tenantDomain || getCurrentTenantDomain();
    const keys = getStorageKeys(context, domain);
    const token = localStorage.getItem(keys.token);

    if (token) return token;

    // Si estamos en orders y no hay token, buscar token de admin
    if (context === 'orders') {
      const adminKeys = getStorageKeys('admin', domain);
      return localStorage.getItem(adminKeys.token);
    }

    return null;
  },

  /**
   * Verificar si hay una sesión activa (en el contexto específico + tenant)
   * Para contexto 'orders', también verifica sesión de 'admin'
   */
  isAuthenticated: (context: AuthContext, tenantDomain?: string | null): boolean => {
    if (typeof window === 'undefined') return false;
    const domain = tenantDomain || getCurrentTenantDomain();
    const keys = getStorageKeys(context, domain);

    if (localStorage.getItem(keys.token)) return true;

    // Si estamos en orders, también verificar si hay sesión de admin activa
    if (context === 'orders') {
      const adminKeys = getStorageKeys('admin', domain);
      return !!localStorage.getItem(adminKeys.token);
    }

    return false;
  },

  /**
   * Obtener todas las sesiones activas (incluyendo multi-tenant)
   */
  getAllActiveSessions: (): { context: AuthContext; user: User; tenantDomain: string | null; sessionId: string }[] => {
    if (typeof window === 'undefined') return [];

    const sessions: { context: AuthContext; user: User; tenantDomain: string | null; sessionId: string }[] = [];

    // Buscar todas las claves que empiecen con "auth_user_"
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('auth_user_') && !key.endsWith('_domain')) {
        try {
          const userStr = localStorage.getItem(key);
          if (userStr) {
            const user = JSON.parse(userStr);
            const context = getAuthContextFromRole(user.role);

            // Extraer el sessionId de la clave
            const sessionId = key.replace('auth_user_', '');

            // Obtener el dominio del tenant si existe
            let tenantDomain: string | null = null;
            if (context !== 'superadmin') {
              const domainKey = `${key}_domain`;
              tenantDomain = localStorage.getItem(domainKey);
            }

            sessions.push({
              context,
              user,
              tenantDomain,
              sessionId
            });
          }
        } catch (error) {
          console.error('Error al parsear sesión:', error);
        }
      }
    }

    return sessions;
  },

  /**
   * Cambiar a una sesión específica (cambiar de tenant/rol)
   */
  switchSession: (sessionId: string): string => {
    if (typeof window === 'undefined') return '/';

    // Determinar la ruta de redirección basada en el sessionId
    if (sessionId === 'superadmin') {
      return '/superadmin';
    } else if (sessionId.startsWith('orders_')) {
      return '/orders';
    } else if (sessionId.startsWith('admin_')) {
      return '/admin';
    }

    return '/';
  },
};

export default authAPI;

