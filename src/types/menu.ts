/**
 * Tipos para el Menú y Platos
 */

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  image: string;
  tags: string[];
  isAvailable: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  preparationTime?: number; // en minutos
  servings?: number;
  allergens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  dishCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  image: string;
  tags: string[];
  isAvailable: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  preparationTime?: number;
  servings?: number;
  allergens?: string[];
}

export interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

// Tipos para filtros y búsqueda
export interface MenuFilters {
  category?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  search?: string;
  tags?: string[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: 'name' | 'price' | 'category' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

