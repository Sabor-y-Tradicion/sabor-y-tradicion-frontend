"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  UtensilsCrossed,
  FolderOpen,
  Clock,
  TrendingUp,
  Plus,
  Edit,
  Settings as SettingsIcon
} from "lucide-react";
import { menuData } from "@/app/menu/menu-data";

export function AdminDashboard() {
  // Mock data - en producción vendrá del backend
  const totalDishes = menuData.length;
  const categories = [...new Set(menuData.map(item => item.category))];
  const totalCategories = categories.length;
  const lastUpdate = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calcular platos por categoría
  const dishesPerCategory = categories.map(categoryName => ({
    name: categoryName,
    count: menuData.filter(item => item.category === categoryName).length,
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Platos</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDishes}</div>
            <p className="text-xs text-muted-foreground">
              Platos activos en el menú
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Categorías disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Actualización</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{lastUpdate}</div>
            <p className="text-xs text-muted-foreground">
              Fecha de última modificación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Más Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {dishesPerCategory.length > 0
                ? dishesPerCategory.reduce((prev, current) =>
                    (prev.count > current.count) ? prev : current
                  ).name
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Categoría con más platos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/menu/new">
            <Button className="h-auto w-full flex-col gap-2 py-6" variant="outline">
              <Plus className="h-6 w-6" />
              <span>Agregar Nuevo Plato</span>
            </Button>
          </Link>
          <Link href="/admin/menu">
            <Button className="h-auto w-full flex-col gap-2 py-6" variant="outline">
              <Edit className="h-6 w-6" />
              <span>Editar Menú</span>
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button className="h-auto w-full flex-col gap-2 py-6" variant="outline">
              <SettingsIcon className="h-6 w-6" />
              <span>Configuración</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Dishes per Category */}
      <Card>
        <CardHeader>
          <CardTitle>Platos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dishesPerCategory.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-orange-600">
                    {category.count}
                  </span>
                  <span className="text-sm text-muted-foreground">platos</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Mock */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Modificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Sistema inicializado</p>
                <p className="text-xs text-muted-foreground">
                  El panel de administración está listo para usar
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Hoy</span>
            </div>
            <div className="text-center py-4 text-muted-foreground">
              <p>No hay modificaciones recientes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

