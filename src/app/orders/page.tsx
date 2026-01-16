"use client";

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Package, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ordersAPI } from '@/lib/api/orders';
import { Order, OrderStatus } from '@/types/order';
import { OrderCard } from './components';
import { useOrderNotifications } from '@/hooks/use-order-notifications';

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtros simples
  const [searchTerm, setSearchTerm] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Habilitar notificaciones de nuevos pedidos
  useOrderNotifications({
    enabled: true,
    pollingInterval: 10000, // 10 segundos - más tiempo real
    onNewOrder: (_newOrder) => {
      loadOrders(); // Recargar lista de pedidos
    },
  });

  // Cargar pedidos activos (solo los que están en preparación)
  const loadOrders = useCallback(async () => {
    try {
      const filters: Record<string, string> = {
        status: 'preparing' // Solo pedidos en preparación
      };

      if (customerPhone.trim()) {
        filters.customerPhone = customerPhone.trim();
      }

      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
      }

      const response = await ordersAPI.getAll(filters);
      let ordersData = response.data || [];

      // Asegurar que solo mostramos pedidos en preparación
      // Normalizar a mayúsculas para comparar
      ordersData = ordersData.filter(
        (order: Order) => order.status?.toUpperCase() === 'PREPARING'
      );

      setOrders(ordersData);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los pedidos',
        variant: 'destructive',
      });
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [customerPhone, searchTerm, toast]);

  // Cargar pedidos al montar y cuando cambien los filtros
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Refrescar pedidos
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrders();
  };

  // Actualizar estado de un pedido (marcar como entregado)
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });

      // Si el pedido se marcó como entregado, quitarlo de la lista activa
      // Normalizar a mayúsculas para comparar correctamente
      if (newStatus.toUpperCase() === 'DELIVERED') {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        toast({
          title: '¡Pedido entregado!',
          description: 'El pedido se ha movido al historial',
        });
      }
    } catch (error) {
      throw error; // Propagar error para que OrderCard lo maneje
    }
  };

  // Eliminar pedido
  const handleDelete = async (orderId: string) => {
    try {
      await ordersAPI.delete(orderId);

      // Eliminar el pedido de la lista local
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (error) {
      throw error; // Propagar error para que OrderCard lo maneje
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Gestión de Pedidos</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Pedidos en preparación ({orders.length})
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/orders/history">
            <Button variant="outline" className="gap-2">
              <History className="h-4 w-4" />
              Historial
            </Button>
          </Link>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros simplificados */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por número de pedido o nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md dark:bg-gray-800 dark:border-gray-700"
        />
        <Input
          placeholder="Teléfono del cliente"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="max-w-xs dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Lista de pedidos */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-20 w-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2 dark:text-white">No hay pedidos en preparación</h3>
          <p className="text-muted-foreground dark:text-gray-400">
            {searchTerm || customerPhone
              ? 'No se encontraron pedidos con los filtros seleccionados'
              : 'Todos los pedidos han sido entregados'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

