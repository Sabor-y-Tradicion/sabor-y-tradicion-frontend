"use client";

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Package, ArrowLeft, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ordersAPI } from '@/lib/api/orders';
import { Order } from '@/types/order';

export default function OrderHistoryPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Cargar pedidos del historial (solo entregados)
  const loadOrders = useCallback(async () => {
    try {
      const filters: Record<string, string> = {
        status: 'DELIVERED' // Backend espera MAYÚSCULAS
      };

      if (dateFrom) {
        // Crear fecha con formato YYYY-MM-DD y agregar la hora local
        const [year, month, day] = dateFrom.split('-').map(Number);
        const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        filters.dateFrom = startDate.toISOString();
      }

      if (dateTo) {
        // Crear fecha con formato YYYY-MM-DD y agregar la hora local
        const [year, month, day] = dateTo.split('-').map(Number);
        const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
        filters.dateTo = endDate.toISOString();
      } else if (dateFrom) {
        // Si solo se selecciona "desde", también buscar hasta el final de ese día
        const [year, month, day] = dateFrom.split('-').map(Number);
        const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
        filters.dateTo = endDate.toISOString();
      }

      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
      }

      const response = await ordersAPI.getAll(filters);
      let ordersData = response.data || [];

      // Filtrar solo pedidos entregados (normalizar a mayúsculas para comparar)
      ordersData = ordersData.filter(
        (order: Order) => order.status?.toUpperCase() === 'DELIVERED'
      );

      // Filtrar por búsqueda local
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        ordersData = ordersData.filter(
          (order: Order) =>
            order.orderNumber?.toLowerCase().includes(term) ||
            order.customer?.name?.toLowerCase().includes(term) ||
            order.customer?.phone?.includes(term)
        );
      }

      // Ordenar por fecha más reciente
      ordersData.sort((a: Order, b: Order) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(ordersData);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el historial de pedidos',
        variant: 'destructive',
      });
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [dateFrom, dateTo, searchTerm, toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrders();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
  };

  // Manejar cambio de fecha "Desde"
  const handleDateFromChange = (newDateFrom: string) => {
    setDateFrom(newDateFrom);

    // Si la nueva fecha "Desde" es posterior a la fecha "Hasta" actual, limpiar "Hasta"
    if (newDateFrom && dateTo && newDateFrom > dateTo) {
      setDateTo('');
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">Historial de Pedidos</h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Pedidos entregados
            </p>
          </div>
        </div>
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

      {/* Filtros */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
            <Calendar className="h-5 w-5" />
            Filtros por Fecha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="dark:text-gray-200">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Número, nombre o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Fecha desde */}
            <div>
              <Label htmlFor="dateFrom" className="dark:text-gray-200">Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Fecha hasta */}
            <div>
              <Label htmlFor="dateTo" className="dark:text-gray-200">Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                min={dateFrom || undefined}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(searchTerm || dateFrom || dateTo) && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={clearFilters} className="text-sm">
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {orders.length}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Pedidos entregados</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary dark:text-orange-400">
              S/ {orders
                .reduce((sum, o) => sum + Number(o.total || 0), 0)
                .toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Total facturado</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pedidos */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-20 w-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2 dark:text-white">No hay pedidos en el historial</h3>
          <p className="text-muted-foreground dark:text-gray-400">
            {searchTerm || dateFrom || dateTo
              ? 'No se encontraron pedidos con los filtros seleccionados'
              : 'Los pedidos entregados aparecerán aquí'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const total = Number(order.total || 0);

            return (
              <Card key={order.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Info principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold dark:text-white">
                          Pedido #{order.orderNumber}
                        </span>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border">
                          Entregado
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400 space-y-1">
                        <p><span className="font-medium">Cliente:</span> {order.customer?.name || 'N/A'}</p>
                        <p><span className="font-medium">Teléfono:</span> {order.customer?.phone || 'N/A'}</p>
                        <p><span className="font-medium">Fecha:</span> {formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    {/* Items resumidos */}
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-gray-200 mb-1">Items:</p>
                      <div className="text-sm text-muted-foreground dark:text-gray-400">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <p key={idx}>• {item.quantity}x {item.name}</p>
                        ))}
                        {order.items && order.items.length > 3 && (
                          <p className="text-xs">... y {order.items.length - 3} más</p>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-primary dark:text-orange-400">
                        S/ {total.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
                        {order.payment?.method === 'efectivo' ? '💵 Efectivo' :
                         order.payment?.method === 'tarjeta' ? '💳 Tarjeta' : '📱 Billetera'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

