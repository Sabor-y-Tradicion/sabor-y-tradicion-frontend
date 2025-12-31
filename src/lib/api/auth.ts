import apiClient from './client';
import {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User
} from './types';

export const authAPI = {
  /**
   * Iniciar sesión
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );

    if (response.data.success && response.data.data) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.data.user));

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
      // Guardar token y usuario en localStorage
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.data.user));

      return response.data.data;
    }

    throw new Error(response.data.error || 'Error al registrar usuario');
  },

  /**
   * Verificar token actual
   */
  verify: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/verify');

    if (response.data.success && response.data.data) {
      // Actualizar usuario en localStorage
      localStorage.setItem('auth_user', JSON.stringify(response.data.data));

      return response.data.data;
    }

    throw new Error(response.data.error || 'Error al verificar token');
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Verificar si hay una sesión activa
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },
};

export default authAPI;

