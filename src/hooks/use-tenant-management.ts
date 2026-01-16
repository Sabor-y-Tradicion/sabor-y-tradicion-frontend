import { useState, useEffect, useCallback } from 'react';
import { tenantsAPI } from '@/lib/api/tenants';
import type { Tenant, CreateTenantInput, UpdateTenantInput, TenantStats } from '@/types/tenant';

interface UseTenantManagementOptions {
  autoLoad?: boolean;
  page?: number;
  limit?: number;
  status?: string;
  plan?: string;
  search?: string;
}

export function useTenantManagement(options: UseTenantManagementOptions = {}) {
  const {
    autoLoad = true,
    page = 1,
    limit = 10,
    status,
    plan,
    search,
  } = options;

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchTenants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await tenantsAPI.getAll({
        page,
        limit,
        status,
        plan,
        search,
      });

      setTenants(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar tenants';
      setError(errorMessage);
      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, status, plan, search]);

  const createTenant = async (data: CreateTenantInput): Promise<Tenant> => {
    try {
      setError(null);
      const newTenant = await tenantsAPI.create(data);
      await fetchTenants(); // Recargar lista
      return newTenant;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear tenant';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTenant = async (id: string, data: UpdateTenantInput): Promise<Tenant> => {
    try {
      setError(null);
      const updatedTenant = await tenantsAPI.update(id, data);

      // Actualizar en la lista local
      setTenants(prev =>
        prev.map(t => (t.id === id ? updatedTenant : t))
      );

      return updatedTenant;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar tenant';
      setError(errorMessage);
      throw err;
    }
  };

  const suspendTenant = async (id: string): Promise<void> => {
    try {
      setError(null);
      await tenantsAPI.suspend(id);
      await fetchTenants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al suspender tenant';
      setError(errorMessage);
      throw err;
    }
  };

  const activateTenant = async (id: string): Promise<void> => {
    try {
      setError(null);
      await tenantsAPI.activate(id);
      await fetchTenants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al activar tenant';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTenant = async (id: string): Promise<void> => {
    try {
      setError(null);
      await tenantsAPI.delete(id);
      await fetchTenants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar tenant';
      setError(errorMessage);
      throw err;
    }
  };

  const getTenantStats = async (id: string): Promise<TenantStats> => {
    try {
      setError(null);
      return await tenantsAPI.getStats(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener estadísticas';
      setError(errorMessage);
      throw err;
    }
  };

  const verifyDomain = async (id: string): Promise<{ verified: boolean; message: string }> => {
    try {
      setError(null);
      return await tenantsAPI.verifyDomain(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar dominio';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    if (autoLoad) {
      fetchTenants();
    }
  }, [autoLoad, fetchTenants]);

  return {
    tenants,
    isLoading,
    error,
    pagination,
    fetchTenants,
    createTenant,
    updateTenant,
    suspendTenant,
    activateTenant,
    deleteTenant,
    getTenantStats,
    verifyDomain,
  };
}

