import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Nota: No incluir Cache-Control, Pragma, Expires aquí
    // porque causan errores CORS si el backend no los permite
  },
  timeout: 10000, // 10 segundos
});

// Crear instancia de axios PÚBLICA (sin autenticación) para endpoints públicos
export const publicApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para API pública - solo agrega tenant domain, NO token
publicApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const tenantDomain = getTenantDomainPublic(hostname);

      if (tenantDomain && config.headers) {
        config.headers['X-Tenant-Domain'] = tenantDomain;
      }

      // Agregar timestamp para evitar caché
      if (config.params) {
        config.params._t = Date.now();
      } else {
        config.params = { _t: Date.now() };
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Helper para obtener tenant domain (versión pública sin side effects)
function getTenantDomainPublic(hostname: string): string {
  if (hostname.endsWith('.james.pe')) return hostname;
  if (hostname === 'james.pe') return hostname;
  if (hostname.endsWith('.test')) return hostname;
  if (hostname.endsWith('.local')) return hostname;
  if (hostname.includes('.') && !hostname.includes('localhost')) return hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.NEXT_PUBLIC_DEV_TENANT_DOMAIN || 'saborytradicion.james.pe';
  }
  return hostname;
}

// Interceptor de Request - Agregar token automáticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Solo en el cliente (browser)
    if (typeof window !== 'undefined') {
      // Determinar el contexto basado en la ruta actual
      const pathname = window.location.pathname;
      let authContext: 'admin' | 'superadmin' | 'orders' = 'admin';

      if (pathname.startsWith('/superadmin')) {
        authContext = 'superadmin';
      } else if (pathname.startsWith('/orders')) {
        authContext = 'orders';
      } else if (pathname.startsWith('/admin')) {
        authContext = 'admin';
      }

      // Obtener el dominio del tenant actual
      const hostname = window.location.hostname;
      const tenantDomain = getTenantDomain(hostname);

      // Generar el sessionId correcto
      const normalizedDomain = tenantDomain ? tenantDomain.replace(/:\d+$/, '').replace(/[^a-zA-Z0-9-]/g, '_') : '';

      // Buscar token según el contexto
      let token: string | null = null;

      if (authContext === 'superadmin') {
        // SuperAdmin tiene su propio token
        token = localStorage.getItem('auth_token_superadmin');
      } else if (tenantDomain) {
        // Para admin y orders, buscar token en orden de prioridad
        const ordersSessionId = `orders_${normalizedDomain}`;
        const adminSessionId = `admin_${normalizedDomain}`;

        if (authContext === 'orders') {
          // En /orders: primero buscar token de orders, si no existe usar token de admin
          token = localStorage.getItem(`auth_token_${ordersSessionId}`)
                  || localStorage.getItem(`auth_token_${adminSessionId}`);
        } else {
          // En /admin: usar token de admin
          token = localStorage.getItem(`auth_token_${adminSessionId}`);
        }
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // NO agregar dominio del tenant en rutas de superadmin
      const url = config.url || '';
      const isSuperAdminRoute = url.includes('superadmin') || url.includes('/logs');

      if (!isSuperAdminRoute && tenantDomain && config.headers) {
        // Agregar dominio del tenant para resolución en backend
        config.headers['X-Tenant-Domain'] = tenantDomain;
      }

      // Agregar timestamp para evitar caché
      if (config.params) {
        config.params._t = Date.now();
      } else {
        config.params = { _t: Date.now() };
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Helper function: Obtener dominio correcto del tenant
// Soporta: subdominios de james.pe, dominios .test, .local, reales, y localhost
function getTenantDomain(hostname: string): string {
  // 1. Subdominios de james.pe (saborytradicion.james.pe, etc.)
  if (hostname.endsWith('.james.pe')) {
    return hostname;
  }

  // james.pe sin subdominio es SuperAdmin
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
    if (typeof window !== 'undefined') {
      // Intentar obtener tenant de query parameter
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
    }

    // Usar la variable de entorno como fallback
    return process.env.NEXT_PUBLIC_DEV_TENANT_DOMAIN || 'saborytradicion.james.pe';
  }

  // Fallback
  return hostname;
}

// Interceptor de Response - Manejo de errores global
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ success: boolean; error: string }>) => {
    // Manejo de errores comunes
    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        // Token inválido o expirado
        if (typeof window !== 'undefined') {
          // Determinar el contexto basado en la ruta actual
          const pathname = window.location.pathname;
          let authContext: 'admin' | 'superadmin' | 'orders' = 'admin';
          let loginPath = '/admin/login';

          if (pathname.startsWith('/superadmin')) {
            authContext = 'superadmin';
            loginPath = '/superadmin/login';
          } else if (pathname.startsWith('/orders')) {
            authContext = 'orders';
            loginPath = '/orders'; // o la ruta de login de orders si existe
          } else if (pathname.startsWith('/admin')) {
            authContext = 'admin';
            loginPath = '/admin/login';
          }

          // Obtener el tenant domain actual
          const hostname = window.location.hostname;
          const tenantDomain = getTenantDomain(hostname);

          // Generar el sessionId correcto
          let sessionId: string = authContext;
          if (authContext !== 'superadmin' && tenantDomain) {
            const normalizedDomain = tenantDomain.replace(/:\d+$/, '').replace(/[^a-zA-Z0-9-]/g, '_');
            sessionId = `${authContext}_${normalizedDomain}`;
          }

          // Limpiar solo las claves del contexto + tenant actual
          localStorage.removeItem(`auth_token_${sessionId}`);
          localStorage.removeItem(`auth_user_${sessionId}`);
          localStorage.removeItem(`auth_user_${sessionId}_domain`);

          // Redirigir al login solo si no estamos ya ahí
          if (!pathname.includes('/login')) {
            window.location.href = loginPath;
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

