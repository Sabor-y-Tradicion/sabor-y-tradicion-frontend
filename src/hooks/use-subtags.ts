import { useState, useEffect } from 'react';
import { subtagsAPI, type Subtag, type CreateSubtagInput } from '@/lib/api/subtags';
import { useToast } from './use-toast';

export function useSubtags() {
  const [subtags, setSubtags] = useState<Subtag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubtags = async () => {
    try {
      setIsLoading(true);
      const data = await subtagsAPI.getAll();
      // Asegurar que siempre sea un array
      setSubtags(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching subtags:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los subtags',
      });
      setSubtags([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubtags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createSubtag = async (data: CreateSubtagInput) => {
    try {
      const newSubtag = await subtagsAPI.create(data);
      setSubtags((prev) => [...prev, newSubtag]);
      toast({
        title: 'Subtag creado',
        description: `"${data.name}" ha sido agregado`,
      });
      return newSubtag;
    } catch (error) {
      console.error('Error creating subtag:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo crear el subtag',
      });
      throw error;
    }
  };

  const updateSubtag = async (id: string, data: CreateSubtagInput) => {
    try {
      const updatedSubtag = await subtagsAPI.update(id, data);
      setSubtags((prev) =>
        prev.map((subtag) => (subtag.id === id ? updatedSubtag : subtag))
      );
      toast({
        title: 'Subtag actualizado',
        description: `"${data.name}" ha sido actualizado`,
      });
      return updatedSubtag;
    } catch (error) {
      console.error('Error updating subtag:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el subtag',
      });
      throw error;
    }
  };

  const deleteSubtag = async (id: string) => {
    try {
      await subtagsAPI.delete(id);
      setSubtags((prev) => prev.filter((subtag) => subtag.id !== id));
      toast({
        title: 'Subtag eliminado',
        description: 'El subtag ha sido eliminado correctamente',
      });
    } catch (error) {
      console.error('Error deleting subtag:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el subtag',
      });
      throw error;
    }
  };

  return {
    subtags,
    isLoading,
    createSubtag,
    updateSubtag,
    deleteSubtag,
    refetch: fetchSubtags,
  };
}

