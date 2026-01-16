import apiClient from './client';
import { ApiResponse } from './types';
import { Tenant } from './tenants';

export interface DashboardStats {
  tenantStats: {
    totalTenants: number;
    activeTenants: number;
    suspendedTenants: number;
    newTenantsThisMonth: number;
  };
  recentTenants: Tenant[];
}

export const superadminAPI = {
  /**
   * Obtener estadísticas del dashboard de superadmin
   */
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/superadmin/dashboard');
    return response.data;
  },
};

export default superadminAPI;

