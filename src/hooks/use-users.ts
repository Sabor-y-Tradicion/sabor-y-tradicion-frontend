import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '@/lib/api/users';
import type { User } from '@/lib/api/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await usersAPI.getAll();
      setUsers(response.data || []);
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'ORDERS_MANAGER';
  }) => {
    try {
      const newUser = await usersAPI.create(data);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err: any) {
      console.error('Error al crear usuario:', err);
      throw new Error(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      const updatedUser = await usersAPI.update(id, data);
      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
      return updatedUser;
    } catch (err: any) {
      console.error('Error al actualizar usuario:', err);
      throw new Error(err.response?.data?.error || 'Error al actualizar usuario');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersAPI.delete(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      console.error('Error al eliminar usuario:', err);
      throw new Error(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  const refreshUsers = () => {
    fetchUsers();
  };

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
  };
}

