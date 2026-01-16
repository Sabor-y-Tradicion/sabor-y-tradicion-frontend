"use client";

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatus, ORDER_STATUS_CONFIG } from '@/types/order';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatus | 'all';
  onStatusFilterChange: (value: OrderStatus | 'all') => void;
  customerPhone: string;
  onCustomerPhoneChange: (value: string) => void;
}

export function OrderFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  customerPhone,
  onCustomerPhoneChange,
}: OrderFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Búsqueda por número de pedido o nombre */}
      <div>
        <Label htmlFor="search" className="dark:text-gray-200">Buscar pedido</Label>
        <div className="relative mt-1.5">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Número de pedido o nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Filtro por estado */}
      <div>
        <Label htmlFor="status" className="dark:text-gray-200">Estado</Label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger id="status" className="mt-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all" className="dark:text-gray-200 dark:hover:bg-gray-700">
              Todos los estados
            </SelectItem>
            {Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => (
              <SelectItem
                key={status}
                value={status}
                className="dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por teléfono del cliente */}
      <div>
        <Label htmlFor="phone" className="dark:text-gray-200">Teléfono del cliente</Label>
        <Input
          id="phone"
          placeholder="+51 999 999 999"
          value={customerPhone}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
          className="mt-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
}

