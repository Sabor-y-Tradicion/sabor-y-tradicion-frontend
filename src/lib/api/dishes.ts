import apiClient from './client';
import {
  ApiResponse,
  PaginatedResponse,
  Dish,
  CreateDishInput,
  UpdateDishInput,
  DishFilters,
} from './types';

export const dishesAPI = {
  /**
   * Obtener todos los platos con filtros
   */
  getAll: async (filters?: DishFilters): Promise<PaginatedResponse<Dish>> => {
    const response = await apiClient.get<PaginatedResponse<Dish>>('/dishes', {
      params: filters,
    });

    return response.data;
  },

  /**
   * Obtener plato por ID
   */
  getById: async (id: string): Promise<Dish> => {
    const response = await apiClient.get<ApiResponse<Dish>>(`/dishes/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Plato no encontrado');
  },

  /**
   * Obtener plato por slug
   */
  getBySlug: async (slug: string): Promise<Dish> => {
    const response = await apiClient.get<ApiResponse<Dish>>(`/dishes/slug/${slug}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Plato no encontrado');
  },

  /**
   * Crear nuevo plato
   */
  create: async (data: CreateDishInput): Promise<Dish> => {
    const response = await apiClient.post<ApiResponse<Dish>>('/dishes', data);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Error al crear plato');
  },

  /**
   * Actualizar plato
   */
  update: async (id: string, data: UpdateDishInput): Promise<Dish> => {
    const response = await apiClient.put<ApiResponse<Dish>>(`/dishes/${id}`, data);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Error al actualizar plato');
  },

  /**
   * Eliminar plato
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse>(`/dishes/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al eliminar plato');
    }
  },

  /**
   * Reordenar platos
   */
  reorder: async (dishIds: string[]): Promise<void> => {
    const response = await apiClient.post<ApiResponse>('/dishes/reorder', {
      dishIds,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al reordenar platos');
    }
  },
};

export default dishesAPI;

