import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  timeout: 10000, // 10 segundos
});

// Interceptor de Request - Agregar token automáticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Solo en el cliente (browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
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

// Interceptor de Response - Manejo de errores global
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ success: boolean; error: string }>) => {
    // Manejo de errores comunes
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Token inválido o expirado
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');

          // Redirigir al login solo si no estamos ya ahí
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/admin/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

