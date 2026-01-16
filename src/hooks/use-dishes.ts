'use client';

import { useState, useEffect, useCallback } from 'react';
import { dishesAPI } from '@/lib/api/dishes';
import type {
  Dish,
  CreateDishInput,
  UpdateDishInput,
  DishFilters
} from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';

export const useDishes = (initialFilters?: DishFilters) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DishFilters>(initialFilters || {});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { toast } = useToast();

  const fetchDishes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dishesAPI.getAll(filters);

      // Manejar diferentes formatos de respuesta del backend
      let dishesData: Dish[] = [];

      if (response) {
        // Caso 1: response.data.data (backend con paginación anidada)
        if ((response as any).data && (response as any).data.data && Array.isArray((response as any).data.data)) {
          dishesData = (response as any).data.data;
          if ((response as any).data.pagination) {
            setPagination((response as any).data.pagination);
          }
        }
        // Caso 2: response.data (respuesta paginada normal)
        else if ((response as any).data && Array.isArray((response as any).data)) {
          dishesData = (response as any).data;
          if ((response as any).pagination) {
            setPagination((response as any).pagination);
          }
        }
        // Caso 3: response es directamente un array
        else if (Array.isArray(response)) {
          dishesData = response;
        }
      }

      // Convertir price a number
      const normalizedDishes = dishesData.map(dish => ({
        ...dish,
        price: Number(dish.price) || 0
      }));

      setDishes(normalizedDishes);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar platos';
      setError(errorMsg);
      setDishes([]);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  // Cargar platos cuando cambien los filtros
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const createDish = async (data: CreateDishInput): Promise<Dish> => {
    try {
      const newDish = await dishesAPI.create(data);
      toast({
        title: "Éxito",
        description: "Plato creado exitosamente",
      });
      await fetchDishes(); // Recargar lista
      return newDish;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear plato';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateDish = async (id: string, data: UpdateDishInput): Promise<Dish> => {
    try {
      const updatedDish = await dishesAPI.update(id, data);
      toast({
        title: "Éxito",
        description: "Plato actualizado exitosamente",
      });
      await fetchDishes(); // Recargar lista
      return updatedDish;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar plato';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteDish = async (id: string): Promise<void> => {
    try {
      await dishesAPI.delete(id);
      setDishes(dishes.filter((dish) => dish.id !== id));
      toast({
        title: "Éxito",
        description: "Plato eliminado exitosamente",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar plato';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const changePage = (page: number) => {
    setFilters({ ...filters, page });
  };

  return {
    dishes,
    isLoading,
    error,
    pagination,
    filters,
    setFilters,
    changePage,
    refetch: fetchDishes,
    createDish,
    updateDish,
    deleteDish,
  };
};

