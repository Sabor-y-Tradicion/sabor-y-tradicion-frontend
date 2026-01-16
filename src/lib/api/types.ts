// Tipos de respuesta de la API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos de Usuario
export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'ORDERS_MANAGER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  tenantId?: string; // ID del tenant al que pertenece (null para SUPERADMIN)
}

// Tipos de Autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Tipos de Categoría
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    dishes: number;
  };
  // Compatibilidad con tipos existentes
  dishCount?: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// Tipos de Plato
export interface Dish {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string;  // Compatibilidad con tipo antiguo
  categoryId: string;
  category?: {
    id: string;
    name: string;
  } | string;  // Puede ser objeto o string para compatibilidad
  isActive: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  isFeatured: boolean;
  isPopular?: boolean;  // Compatibilidad con tipo antiguo
  isNew?: boolean;  // Compatibilidad con tipo antiguo
  tags?: string[];  // Compatibilidad con tipo antiguo
  allergens: string[];
  order: number;
  preparationTime?: number;  // Compatibilidad con tipo antiguo
  servings?: number;  // Compatibilidad con tipo antiguo
  createdAt: string;
  updatedAt: string;
}

export interface CreateDishInput {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string | null;  // Acepta string, null o undefined
  isActive?: boolean;
  isFeatured?: boolean;
  allergens?: string[];
  tags?: string[];
  preparationTime?: number;
  servings?: number;
  order?: number;
}

export type UpdateDishInput = Partial<CreateDishInput>;

export interface DishFilters {
  categoryId?: string;
  search?: string;
  isActive?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

