import apiClient from './client';
import { ApiResponse } from './types';
import type { Tenant, TenantStats } from '@/types/tenant';

export const tenantsAPI = {
  /**
   * Obtener todos los tenants (con filtros)
   */
  getAll: async (params?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Tenant[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await apiClient.get<ApiResponse<Tenant[]>>(
      `/tenants?${queryParams.toString()}`
    );

    return response.data;
  },

  /**
   * Obtener estadísticas de tenants
   */
  getStats: async (): Promise<ApiResponse<TenantStats>> => {
    const response = await apiClient.get<ApiResponse<TenantStats>>('/tenants/stats');
    return response.data;
  },

  /**
   * Obtener tenant por ID
   */
  getById: async (id: string): Promise<ApiResponse<Tenant>> => {
    const response = await apiClient.get<ApiResponse<Tenant>>(`/tenants/${id}`);
    return response.data;
  },

  /**
   * Suspender tenant
   */
  suspend: async (id: string): Promise<ApiResponse<Tenant>> => {
    const response = await apiClient.patch<ApiResponse<Tenant>>(`/tenants/${id}/suspend`);
    return response.data;
  },

  /**
   * Activar tenant
   */
  activate: async (id: string): Promise<ApiResponse<Tenant>> => {
    const response = await apiClient.patch<ApiResponse<Tenant>>(`/tenants/${id}/activate`);
    return response.data;
  },

  /**
   * Eliminar tenant
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/tenants/${id}`);
    return response.data;
  },
};

export default tenantsAPI;

