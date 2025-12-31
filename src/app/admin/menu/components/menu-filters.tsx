"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import type { Category } from "@/lib/api/types";

interface MenuFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  availabilityFilter: 'all' | 'available' | 'unavailable';
  onAvailabilityChange: (filter: 'all' | 'available' | 'unavailable') => void;
  onReset: () => void;
}

export function MenuFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  availabilityFilter,
  onAvailabilityChange,
  onReset,
}: MenuFiltersProps) {
  const hasActiveFilters = selectedCategory !== 'all' || availabilityFilter !== 'all';

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">Filtros:</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        {/* Filtro de Categoría */}
        <div className="flex-1 md:max-w-[250px]">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="all" className="dark:text-white dark:focus:bg-gray-600">
                Todas las categorías
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="dark:text-white dark:focus:bg-gray-600"
                >
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro de Disponibilidad */}
        <div className="flex-1 md:max-w-[200px]">
          <Select value={availabilityFilter} onValueChange={onAvailabilityChange}>
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="all" className="dark:text-white dark:focus:bg-gray-600">
                Todos los estados
              </SelectItem>
              <SelectItem value="available" className="dark:text-white dark:focus:bg-gray-600">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Disponible</Badge>
                </div>
              </SelectItem>
              <SelectItem value="unavailable" className="dark:text-white dark:focus:bg-gray-600">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">No disponible</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botón Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Contador de resultados activos */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Filtros activos
        </div>
      )}
    </div>
  );
}

