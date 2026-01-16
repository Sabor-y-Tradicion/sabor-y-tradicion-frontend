/**
 * API de Pedidos
 */

import axios from 'axios';
import { apiClient, publicApiClient } from './client';
import { ApiResponse, PaginatedResponse } from './types';
import { Order, CreateOrderInput, UpdateOrderStatusInput, OrderFilters, OrderStats } from '@/types/order';

export const ordersAPI = {
  /**
   * Obtener todos los pedidos con filtros opcionales
   */
  getAll: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.customerPhone) params.append('customerPhone', filters.customerPhone);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.searchTerm) params.append('search', filters.searchTerm);

    const url = `/orders?${params.toString()}`;
    const response = await apiClient.get<PaginatedResponse<Order>>(url);
    return response.data;
  },

  /**
   * Obtener un pedido por ID
   */
  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener pedido');
    }
    return response.data.data;
  },

  /**
   * Crear un nuevo pedido (requiere autenticación)
   */
  create: async (orderData: CreateOrderInput): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al crear pedido');
    }
    return response.data.data;
  },

  /**
   * Crear un nuevo pedido PÚBLICO (sin autenticación - para clientes)
   * Usa el endpoint /orders/public que no requiere token
   */
  createPublic: async (orderData: CreateOrderInput): Promise<Order> => {
    try {
      const response = await publicApiClient.post<ApiResponse<Order>>('/orders/public', orderData);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Error al crear pedido');
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Error al crear el pedido');
      }
      throw error;
    }
  },

  /**
   * Actualizar el estado de un pedido
   */
  updateStatus: async (id: string, data: UpdateOrderStatusInput): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al actualizar estado del pedido');
    }
    return response.data.data;
  },

  /**
   * Eliminar un pedido
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse>(`/orders/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al eliminar pedido');
    }
  },

  /**
   * Obtener estadísticas de pedidos
   */
  getStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<ApiResponse<OrderStats>>('/orders/stats');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al obtener estadísticas');
    }
    return response.data.data;
  },

  /**
   * Buscar pedidos por número de teléfono del cliente
   */
  searchByCustomer: async (phone: string): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      `/orders/customer/${encodeURIComponent(phone)}`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Error al buscar pedidos');
    }
    return response.data.data;
  }
};

