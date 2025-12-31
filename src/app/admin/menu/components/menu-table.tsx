"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import type { Dish } from "@/lib/api/types";
import { getDishImage } from "@/lib/constants";

interface MenuTableProps {
  dishes: Dish[];
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
  onView?: (dish: Dish) => void;
  isLoading?: boolean;
}

export function MenuTable({ dishes, onEdit, onDelete, onView, isLoading }: MenuTableProps) {
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDishes(dishes.map((dish) => dish.id));
    } else {
      setSelectedDishes([]);
    }
  };

  const handleSelectDish = (dishId: string, checked: boolean) => {
    if (checked) {
      setSelectedDishes([...selectedDishes, dishId]);
    } else {
      setSelectedDishes(selectedDishes.filter((id) => id !== dishId));
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-8 text-center text-muted-foreground dark:text-gray-400">
          Cargando platos...
        </div>
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-8 text-center text-muted-foreground dark:text-gray-400">
          No hay platos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-700">
          <TableRow className="dark:border-gray-600">
            <TableHead className="w-[50px] dark:text-gray-300">
              <Checkbox
                checked={selectedDishes.length === dishes.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="dark:text-gray-300">Imagen</TableHead>
            <TableHead className="dark:text-gray-300">Nombre</TableHead>
            <TableHead className="dark:text-gray-300">Categoría</TableHead>
            <TableHead className="text-right dark:text-gray-300">Precio</TableHead>
            <TableHead className="text-center dark:text-gray-300">Estado</TableHead>
            <TableHead className="text-right dark:text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="dark:bg-gray-800">
          {dishes.map((dish) => (
            <TableRow key={dish.id} className="dark:border-gray-700">
              <TableCell>
                <Checkbox
                  checked={selectedDishes.includes(dish.id)}
                  onCheckedChange={(checked) =>
                    handleSelectDish(dish.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                  <Image
                    src={getDishImage(dish.image || "")}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium dark:text-white">{dish.name}</TableCell>
              <TableCell className="dark:text-gray-300">
                {typeof dish.category === 'string' ? dish.category : dish.category?.name || 'Sin categoría'}
              </TableCell>
              <TableCell className="text-right font-semibold dark:text-white">
                S/ {Number(dish.price).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={dish.isActive ? "default" : "secondary"}
                  className={dish.isActive ? "bg-green-600" : ""}
                >
                  {dish.isActive ? "Disponible" : "No disponible"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(dish)}
                      className="dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(dish)}
                    className="dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(dish)}
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedDishes.length > 0 && (
        <div className="border-t bg-muted/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedDishes.length} plato(s) seleccionado(s)
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedDishes([])}
              >
                Limpiar selección
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  // Aquí iría la lógica de eliminación masiva
                  console.log("Eliminar:", selectedDishes);
                }}
              >
                Eliminar seleccionados
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

