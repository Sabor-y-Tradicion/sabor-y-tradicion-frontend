/**
 * Servicio Mock para Gestión de Categorías
 * En producción, este servicio se conectará al backend
 */

import type { Category, CategoryFormData } from '@/types/menu';
import { getAllDishes } from './menu-service';

// Datos mock de categorías
// eslint-disable-next-line prefer-const
let mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Menú del Día',
    description: 'Opciones económicas y completas para el almuerzo diario',
    icon: '🍽️',
    order: 1,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2025-12-26'),
  },
  {
    id: 'cat-2',
    name: 'Platos Tradicionales',
    description: 'Los sabores clásicos de la cocina peruana casera',
    icon: '🇵🇪',
    order: 2,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: 'cat-3',
    name: 'Platos a la Carta',
    description: 'Nuestra selección premium de especialidades',
    icon: '⭐',
    order: 3,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2025-12-15'),
  },
  {
    id: 'cat-4',
    name: 'Bebidas',
    description: 'Refrescos, jugos, chichas y cócteles tradicionales',
    icon: '🥤',
    order: 4,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2025-12-10'),
  },
  {
    id: 'cat-5',
    name: 'Postres',
    description: 'Dulces tradicionales peruanos para culminar tu comida',
    icon: '🍰',
    order: 5,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-12-05'),
  },
];

// Helper para generar delay simulado
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtener todas las categorías
 */
export async function getAllCategories(includeInactive = false): Promise<Category[]> {
  await delay(200);

  if (includeInactive) {
    return [...mockCategories];
  }

  return mockCategories.filter(cat => cat.isActive);
}

/**
 * Obtener todas las categorías con contador de platos
 */
export async function getAllCategoriesWithCount(): Promise<Category[]> {
  await delay(300);

  const dishes = await getAllDishes();
  const categories = [...mockCategories];

  return categories.map(category => ({
    ...category,
    dishCount: dishes.filter(dish => dish.categoryId === category.id).length,
  }));
}

/**
 * Obtener una categoría por ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  await delay(150);
  return mockCategories.find(cat => cat.id === id) || null;
}

/**
 * Obtener una categoría con contador de platos
 */
export async function getCategoryWithDishCount(id: string): Promise<Category | null> {
  await delay(250);

  const category = mockCategories.find(cat => cat.id === id);
  if (!category) return null;

  const dishes = await getAllDishes();
  const dishCount = dishes.filter(dish => dish.categoryId === id).length;

  return {
    ...category,
    dishCount,
  };
}

/**
 * Crear una nueva categoría
 */
export async function createCategory(data: CategoryFormData): Promise<Category> {
  await delay(400);

  // Verificar si ya existe una categoría con ese nombre
  const exists = mockCategories.some(
    cat => cat.name.toLowerCase() === data.name.toLowerCase()
  );

  if (exists) {
    throw new Error('Ya existe una categoría con ese nombre');
  }

  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    ...data,
    dishCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockCategories.push(newCategory);

  // Reordenar categorías
  mockCategories.sort((a, b) => a.order - b.order);

  return newCategory;
}

/**
 * Actualizar una categoría existente
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
): Promise<Category | null> {
  await delay(400);

  const index = mockCategories.findIndex(cat => cat.id === id);
  if (index === -1) return null;

  // Si se está actualizando el nombre, verificar que no exista
  if (data.name) {
    const exists = mockCategories.some(
      cat => cat.id !== id && cat.name.toLowerCase() === data.name!.toLowerCase()
    );

    if (exists) {
      throw new Error('Ya existe una categoría con ese nombre');
    }
  }

  mockCategories[index] = {
    ...mockCategories[index],
    ...data,
    updatedAt: new Date(),
  };

  // Si se actualizó el orden, reordenar
  if (data.order !== undefined) {
    mockCategories.sort((a, b) => a.order - b.order);
  }

  return mockCategories[index];
}

/**
 * Eliminar una categoría
 * Solo permite eliminar si no tiene platos asociados
 */
export async function deleteCategory(id: string): Promise<boolean> {
  await delay(400);

  // Verificar si tiene platos asociados
  const dishes = await getAllDishes();
  const hasDishes = dishes.some(dish => dish.categoryId === id);

  if (hasDishes) {
    throw new Error('No se puede eliminar una categoría que tiene platos asociados');
  }

  const index = mockCategories.findIndex(cat => cat.id === id);
  if (index === -1) return false;

  mockCategories.splice(index, 1);
  return true;
}

/**
 * Alternar estado activo/inactivo de una categoría
 */
export async function toggleCategoryStatus(id: string): Promise<Category | null> {
  await delay(300);

  const index = mockCategories.findIndex(cat => cat.id === id);
  if (index === -1) return null;

  mockCategories[index].isActive = !mockCategories[index].isActive;
  mockCategories[index].updatedAt = new Date();

  return mockCategories[index];
}

/**
 * Reordenar categorías
 */
export async function reorderCategories(categoryIds: string[]): Promise<Category[]> {
  await delay(400);

  categoryIds.forEach((id, index) => {
    const category = mockCategories.find(cat => cat.id === id);
    if (category) {
      category.order = index + 1;
      category.updatedAt = new Date();
    }
  });

  mockCategories.sort((a, b) => a.order - b.order);
  return [...mockCategories];
}

/**
 * Verificar si una categoría tiene platos
 */
export async function categoryHasDishes(id: string): Promise<boolean> {
  await delay(100);

  const dishes = await getAllDishes();
  return dishes.some(dish => dish.categoryId === id);
}

/**
 * Obtener estadísticas de categorías
 */
export async function getCategoriesStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  withDishes: number;
  empty: number;
}> {
  await delay(200);

  const dishes = await getAllDishes();
  const categoriesWithDishes = new Set(dishes.map(dish => dish.categoryId));

  return {
    total: mockCategories.length,
    active: mockCategories.filter(cat => cat.isActive).length,
    inactive: mockCategories.filter(cat => !cat.isActive).length,
    withDishes: categoriesWithDishes.size,
    empty: mockCategories.length - categoriesWithDishes.size,
  };
}

