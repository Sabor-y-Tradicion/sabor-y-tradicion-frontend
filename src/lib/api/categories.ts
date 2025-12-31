import apiClient from './client';
import {
  ApiResponse,
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from './types';

export const categoriesAPI = {
  /**
   * Obtener todas las categorías
   */
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    return [];
  },

  /**
   * Obtener categoría por ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Categoría no encontrada');
  },

  /**
   * Obtener categoría por slug
   */
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Categoría no encontrada');
  },

  /**
   * Crear nueva categoría
   */
  create: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Error al crear categoría');
  },

  /**
   * Actualizar categoría
   */
  update: async (id: string, data: UpdateCategoryInput): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Error al actualizar categoría');
  },

  /**
   * Eliminar categoría
   */
  delete: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiResponse>(`/categories/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Error al eliminar categoría');
      }
    } catch (error: any) {
      // Capturar el error específico de categoría con platos
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error || '';

        if (errorMessage.includes('associated dishes') || errorMessage.includes('platos asociados')) {
          throw new Error(
            'No se puede eliminar esta categoría porque tiene platos asociados. ' +
            'Primero debes eliminar o reasignar los platos a otra categoría.'
          );
        }

        // Si hay otro mensaje de error del backend, usarlo
        if (error.response.data?.error) {
          throw new Error(error.response.data.error);
        }
      }

      // Para otros errores, intentar extraer el mensaje
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      }

      throw new Error('Error al eliminar categoría');
    }
  },

  /**
   * Reordenar categorías
   */
  reorder: async (categoryIds: string[]): Promise<void> => {
    const response = await apiClient.post<ApiResponse>('/categories/reorder', {
      categoryIds,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al reordenar categorías');
    }
  },
};

export default categoriesAPI;

