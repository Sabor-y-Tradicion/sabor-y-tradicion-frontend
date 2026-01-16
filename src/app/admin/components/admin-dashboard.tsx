"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  UtensilsCrossed,
  FolderOpen,
  Clock,
  TrendingUp,
  Plus,
  Edit,
  Settings as SettingsIcon,
  RefreshCw
} from "lucide-react";
import { categoriesAPI } from "@/lib/api/categories";
import { dishesAPI } from "@/lib/api/dishes";
import type { Category, Dish } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";

export function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshTime = useRef<number>(0);
  const { toast } = useToast();

  // Cargar datos reales del backend
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [categoriesData, dishesResponse] = await Promise.all([
        categoriesAPI.getAll(),
        dishesAPI.getAll() // Sin filtros para obtener todos los platos
      ]);

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      // dishesAPI.getAll retorna PaginatedResponse<Dish>
      // La respuesta tiene la estructura: { success, data: Dish[], pagination }
      let dishesData: Dish[] = [];

      if (dishesResponse) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resp = dishesResponse as any;

        // Caso principal: PaginatedResponse con data como array
        if (Array.isArray(resp.data)) {
          dishesData = resp.data;
        }
        // Caso alternativo: respuesta anidada con data.data
        else if (resp.data && Array.isArray(resp.data.data)) {
          dishesData = resp.data.data;
        }
        // Caso: respuesta directamente como array
        else if (Array.isArray(resp)) {
          dishesData = resp;
        }
      }

      // Normalizar price a number
      const normalizedDishes = dishesData.map(dish => ({
        ...dish,
        price: Number(dish.price) || 0
      }));

      setDishes(normalizedDishes);
    } catch (error: unknown) {
      console.error('Error al cargar datos del dashboard:', error);
      setCategories([]);
      setDishes([]);

      // Manejo específico del error 429
      const err = error as { response?: { status?: number }; message?: string };
      if (err?.response?.status === 429) {
        toast({
          title: "Demasiadas peticiones",
          description: "Por favor, espera unos segundos antes de actualizar nuevamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al cargar datos",
          description: err?.message || "No se pudieron cargar los datos del dashboard",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  // Cargar datos reales del backend
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = async () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime.current;

    // Evitar múltiples refreshes en menos de 2 segundos
    if (timeSinceLastRefresh < 2000) {
      toast({
        title: "Espera un momento",
        description: `Por favor, espera ${Math.ceil((2000 - timeSinceLastRefresh) / 1000)} segundos antes de actualizar.`,
        variant: "default",
      });
      return;
    }

    lastRefreshTime.current = now;
    setIsRefreshing(true);
    await loadDashboardData();
  };

  const totalDishes = Array.isArray(dishes) ? dishes.length : 0;
  const totalCategories = Array.isArray(categories) ? categories.length : 0;
  const lastUpdate = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calcular platos por categoría (con verificación de arrays)
  const dishesPerCategory = Array.isArray(categories) && Array.isArray(dishes)
    ? categories.map(category => ({
        name: category.name,
        count: dishes.filter(dish => dish.categoryId === category.id).length,
      }))
    : [];

  // Categoría más popular (con más platos)
  const mostPopularCategory = dishesPerCategory.length > 0
    ? dishesPerCategory.reduce((prev, current) =>
        (prev.count > current.count) ? prev : current
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Botón de refrescar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-muted-foreground dark:text-gray-400">Resumen de tu restaurante</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground dark:text-gray-400">Cargando datos...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Total de Platos</CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{totalDishes}</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Platos activos en el menú
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Categorías</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{totalCategories}</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Categorías disponibles
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Última Actualización</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold dark:text-white">{lastUpdate}</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Fecha de última modificación
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Más Popular</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold dark:text-white">
                  {mostPopularCategory?.name || "Sin categorías"}
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Categoría con más platos ({mostPopularCategory?.count || 0})
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Link href="/admin/menu/new">
                <Button className="h-auto w-full flex-col gap-2 py-6 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" variant="outline">
                  <Plus className="h-6 w-6" />
                  <span>Agregar Nuevo Plato</span>
                </Button>
              </Link>
              <Link href="/admin/menu">
                <Button className="h-auto w-full flex-col gap-2 py-6 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" variant="outline">
                  <Edit className="h-6 w-6" />
                  <span>Editar Menú</span>
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button className="h-auto w-full flex-col gap-2 py-6 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" variant="outline">
                  <SettingsIcon className="h-6 w-6" />
                  <span>Configuración</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Platos por Categoría */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Platos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {dishesPerCategory.length > 0 ? (
                <div className="space-y-4">
                  {dishesPerCategory.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                          <UtensilsCrossed className="h-5 w-5" />
                        </div>
                        <span className="font-medium dark:text-white">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {category.count}
                        </span>
                        <span className="text-sm text-muted-foreground dark:text-gray-400">platos</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground dark:text-gray-400">
                    No hay categorías creadas.{" "}
                    <Link href="/admin/categories" className="text-primary hover:underline dark:text-orange-400">
                      Crear primera categoría
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

