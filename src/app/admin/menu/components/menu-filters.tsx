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
import type { Category } from "@/types/menu";

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
    <div className="flex flex-col gap-4 rounded-lg border bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        {/* Filtro de Categoría */}
        <div className="flex-1 md:max-w-[250px]">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro de Disponibilidad */}
        <div className="flex-1 md:max-w-[200px]">
          <Select value={availabilityFilter} onValueChange={onAvailabilityChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="available">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Disponible</Badge>
                </div>
              </SelectItem>
              <SelectItem value="unavailable">
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
            className="gap-2"
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

