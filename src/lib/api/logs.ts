import apiClient from './client';
import { ApiResponse } from './types';

export type LogLevel = 'info' | 'warning' | 'error' | 'critical';
export type LogAction =
  // Tenants
  | 'tenant_created'
  | 'tenant_updated'
  | 'tenant_suspended'
  | 'tenant_activated'
  | 'tenant_deleted'
  // Usuarios
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'user_role_changed'
  // Autenticación
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'token_expired'
  | 'token_refreshed'
  | 'password_changed'
  | 'password_reset_requested'
  | 'password_reset_completed'
  // Configuración
  | 'settings_updated'
  | 'theme_updated'
  | 'logo_uploaded'
  | 'location_updated'
  // Menú
  | 'category_created'
  | 'category_updated'
  | 'category_deleted'
  | 'dish_created'
  | 'dish_updated'
  | 'dish_deleted'
  | 'dish_image_uploaded'
  // Pedidos
  | 'order_created'
  | 'order_updated'
  | 'order_status_changed'
  | 'order_cancelled'
  // Errores
  | 'api_error'
  | 'api_timeout'
  | 'database_error'
  | 'validation_error'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  // Sistema
  | 'system_startup'
  | 'system_shutdown'
  | 'migration_run'
  | 'backup_created'
  | 'backup_restored'
  // Permite strings adicionales
  | string;

export interface Log {
  id: string;
  level: LogLevel;
  action: LogAction;
  message: string;
  details?: Record<string, any>;
  userId?: string;
  userEmail?: string;
  tenantId?: string;
  tenantName?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface LogStats {
  totalLogs: number;
  errorLogs: number;
  warningLogs: number;
  recentLogs: number;
}

export const logsAPI = {
  /**
   * Obtener logs (con filtros)
   */
  getAll: async (params?: {
    level?: LogLevel;
    action?: LogAction | string;
    userId?: string;
    tenantId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ data: Log[]; total: number; limit: number; offset: number }>> => {
    const queryParams = new URLSearchParams();
    if (params?.level) queryParams.append('level', params.level);
    if (params?.action) queryParams.append('action', params.action);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.tenantId) queryParams.append('tenantId', params.tenantId);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await apiClient.get<ApiResponse<{ data: Log[]; total: number; limit: number; offset: number }>>(
      `/logs?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Obtener estadísticas de logs
   */
  getStats: async (): Promise<ApiResponse<LogStats>> => {
    const response = await apiClient.get<ApiResponse<LogStats>>('/logs/stats');
    return response.data;
  },
};

export default logsAPI;

