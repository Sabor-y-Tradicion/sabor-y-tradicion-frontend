/**
 * Tipos para el Menú y Platos
 */

export interface Dish {
  id: string;
  name: string;
  slug?: string;         // Agregado para compatibilidad con API
  description: string;
  price: number;
  category?: string;     // Opcional
  categoryId: string;
  image?: string;        // Opcional
  imageUrl?: string;     // API usa imageUrl
  tags?: string[];       // Opcional
  isActive: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;  // API incluye este campo
  isVegetarian?: boolean; // API incluye este campo
  isVegan?: boolean;     // API incluye este campo
  isGlutenFree?: boolean; // API incluye este campo
  isSpicy?: boolean;     // API incluye este campo
  preparationTime?: number; // en minutos
  servings?: number;
  allergens?: string[];
  order?: number;        // API incluye este campo
  createdAt: Date | string;  // Puede ser Date o string desde API
  updatedAt: Date | string;  // Puede ser Date o string desde API
}

export interface Category {
  id: string;
  name: string;
  description?: string;  // Opcional para compatibilidad con API
  icon?: string;         // Opcional para compatibilidad con API
  slug?: string;         // Agregado para compatibilidad con API
  order: number;
  isActive: boolean;
  dishCount?: number;
  createdAt: Date | string;  // Puede ser Date o string desde API
  updatedAt: Date | string;  // Puede ser Date o string desde API
}

export interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category?: string;      // Opcional
  categoryId: string;
  image?: string;         // Opcional
  imageUrl?: string;      // API usa imageUrl
  tags?: string[];        // Opcional
  isActive: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  preparationTime?: number;
  servings?: number;
  allergens?: string[];
  order?: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;  // Opcional
  icon?: string;         // Opcional
  order: number;
  isActive: boolean;
}

// Tipos para filtros y búsqueda
export interface MenuFilters {
  category?: string;
  isActive?: boolean;
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

