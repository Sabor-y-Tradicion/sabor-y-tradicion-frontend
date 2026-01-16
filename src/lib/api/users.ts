import { apiClient } from './client';
import type { ApiResponse, User } from './types';

export const usersAPI = {
  /**
   * Obtener todos los usuarios del tenant
   */
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/admin/users', {
      params: { _t: Date.now() },
    });
    return response.data;
  },

  /**
   * Obtener usuario por ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/admin/users/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al obtener usuario');
    }
    return response.data.data;
  },

  /**
   * Crear nuevo usuario
   */
  create: async (data: {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'ORDERS_MANAGER';
  }): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/admin/users', data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al crear usuario');
    }
    return response.data.data;
  },

  /**
   * Actualizar usuario
   */
  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al actualizar usuario');
    }
    return response.data.data;
  },

  /**
   * Eliminar usuario
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse>(`/admin/users/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al eliminar usuario');
    }
  },

  /**
   * Cambiar contraseña
   */
  changePassword: async (
    id: string,
    data: { currentPassword: string; newPassword: string }
  ): Promise<void> => {
    const response = await apiClient.patch<ApiResponse>(`/admin/users/${id}/password`, data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al cambiar contraseña');
    }
  },
};

