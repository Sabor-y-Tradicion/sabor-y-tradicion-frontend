'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '@/lib/api/categories';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoriesAPI.getAll();
      // Mapear _count.dishes a dishCount para compatibilidad
      const mappedData = data.map(cat => ({
        ...cat,
        dishCount: cat._count?.dishes || 0
      }));
      setCategories(mappedData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar categorías';
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Cargar categorías al montar
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
    try {
      const newCategory = await categoriesAPI.create(data);
      setCategories([...categories, newCategory]);
      toast({
        title: "Éxito",
        description: "Categoría creada exitosamente",
      });
      return newCategory;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear categoría';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCategory = async (
    id: string,
    data: UpdateCategoryInput
  ): Promise<Category> => {
    try {
      const updatedCategory = await categoriesAPI.update(id, data);
      setCategories(
        categories.map((cat) => (cat.id === id ? updatedCategory : cat))
      );
      toast({
        title: "Éxito",
        description: "Categoría actualizada exitosamente",
      });
      return updatedCategory;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar categoría';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await categoriesAPI.delete(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      toast({
        title: "Éxito",
        description: "Categoría eliminada exitosamente",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar categoría';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const reorderCategories = async (categoryIds: string[]): Promise<void> => {
    try {
      await categoriesAPI.reorder(categoryIds);
      // Reordenar localmente
      const reordered = categoryIds.map(id =>
        categories.find(cat => cat.id === id)!
      ).filter(Boolean);
      setCategories(reordered);
      toast({
        title: "Éxito",
        description: "Categorías reordenadas exitosamente",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al reordenar categorías';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  };
};

