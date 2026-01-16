import { apiClient } from './client';

export interface Subtag {
  id: string;
  name: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubtagInput {
  name: string;
}

export const subtagsAPI = {
  // Obtener todos los subtags
  getAll: async (): Promise<Subtag[]> => {
    const response = await apiClient.get('/subtags');
    // El backend puede devolver { success: true, data: [...] } o directamente [...]
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  // Obtener un subtag por ID
  getById: async (id: string): Promise<Subtag> => {
    const response = await apiClient.get(`/subtags/${id}`);
    // El backend puede devolver { success: true, data: {...} } o directamente {...}
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  // Crear un nuevo subtag
  create: async (data: CreateSubtagInput): Promise<Subtag> => {
    const response = await apiClient.post('/subtags', data);
    // El backend puede devolver { success: true, data: {...} } o directamente {...}
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  // Actualizar un subtag
  update: async (id: string, data: CreateSubtagInput): Promise<Subtag> => {
    const response = await apiClient.patch(`/subtags/${id}`, data);
    // El backend puede devolver { success: true, data: {...} } o directamente {...}
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  // Eliminar un subtag
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/subtags/${id}`);
  },
};

