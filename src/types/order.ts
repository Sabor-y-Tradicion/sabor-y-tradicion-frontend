/**
 * Tipos para la Gestión de Pedidos
 */

import { CustomerInfo, DeliveryInfo, PaymentInfo } from './cart';

// El backend devuelve en MAYÚSCULAS, pero manejamos ambos casos
export type OrderStatus = 'preparing' | 'delivered' | 'PREPARING' | 'DELIVERED';

export interface OrderItem {
  dishId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  payment: PaymentInfo;
  subtotal: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Función helper para normalizar el estado
export const normalizeOrderStatus = (status: string): 'preparing' | 'delivered' => {
  const normalized = status.toLowerCase();
  return normalized === 'preparing' ? 'preparing' : 'delivered';
};

export interface CreateOrderInput {
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    documentType: 'boleta' | 'factura';
    documentNumber?: string;
    businessName?: string;
    businessAddress?: string;
  };
  delivery: {
    type: 'delivery' | 'pickup';
    address?: string;
    reference?: string;
  };
  payment: {
    method: 'efectivo' | 'tarjeta' | 'billetera';
  };
  subtotal: number;
  total: number;
  notes?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface OrderFilters {
  status?: OrderStatus;
  customerPhone?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface OrderStats {
  total: number;
  preparing: number;
  delivered: number;
  todayTotal: number;
  todayRevenue: number;
}

// Mapeo de estados a colores y labels en español
// Incluye ambas versiones (minúsculas y MAYÚSCULAS) para compatibilidad con el backend
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  preparing: {
    label: 'En Preparación',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-300'
  },
  PREPARING: {
    label: 'En Preparación',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-300'
  },
  delivered: {
    label: 'Entregado',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-300'
  },
  DELIVERED: {
    label: 'Entregado',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-300'
  }
};

// Opciones de métodos de pago en español
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  efectivo: '💵 Efectivo',
  tarjeta: '💳 Tarjeta',
  billetera: '📱 Billetera Digital'
};

// Opciones de tipo de entrega en español
export const DELIVERY_TYPE_LABELS: Record<string, string> = {
  delivery: '🚚 Delivery',
  pickup: '🏪 Recojo en Local'
};

// Opciones de tipo de comprobante en español
export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  boleta: '🧾 Boleta',
  factura: '📄 Factura'
};

