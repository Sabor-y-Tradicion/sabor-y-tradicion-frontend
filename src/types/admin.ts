// Tipos para el Panel de Administracion

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatar?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalDishes: number;
  totalCategories: number;
  lastUpdate: Date;
  popularCategory: string;
  availableDishes: number;
  unavailableDishes: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'dish' | 'category' | 'settings';
  entityId: string;
  entityName: string;
  description: string;
  timestamp: Date;
}

export interface RestaurantSettings {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  currency: 'PEN' | 'USD';
  language: 'es' | 'en';
  theme: 'light' | 'dark' | 'auto';
}

export interface Schedule {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
  twitter?: string;
}

