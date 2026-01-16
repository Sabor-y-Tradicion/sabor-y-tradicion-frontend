/**
 * Tipos para el Carrito de Compras
 */

import { Dish } from './menu';

export interface CartItem {
  dish: Dish;
  quantity: number;
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  documentType: 'boleta' | 'factura';
  documentNumber?: string; // Opcional para boleta simple, obligatorio para boleta con datos y factura
  businessName?: string; // Solo para factura
  businessAddress?: string; // Solo para factura
}

export interface DeliveryInfo {
  type: 'delivery' | 'pickup';
  address?: string; // Solo si es delivery
  reference?: string; // Referencia de la dirección
}

export interface PaymentInfo {
  method: 'efectivo' | 'tarjeta' | 'billetera';
}

export interface OrderDetails {
  items: CartItem[];
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  payment: PaymentInfo;
  total: number;
  subtotal: number;
  notes?: string;
  orderNumber?: string;
  createdAt?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
}

export interface CartContextType extends CartState {
  addItem: (dish: Dish, quantity?: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

