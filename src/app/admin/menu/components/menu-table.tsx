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
import type { Dish } from "@/types/menu";

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
      <div className="rounded-lg border bg-white">
        <div className="p-8 text-center text-muted-foreground">
          Cargando platos...
        </div>
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="rounded-lg border bg-white">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No se encontraron platos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedDishes.length === dishes.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-20">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dishes.map((dish) => (
            <TableRow key={dish.id}>
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
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{dish.name}</span>
                  {dish.isPopular && (
                    <Badge variant="secondary" className="mt-1 w-fit text-xs">
                      Popular
                    </Badge>
                  )}
                  {dish.isNew && (
                    <Badge className="mt-1 w-fit bg-green-600 text-xs">
                      Nuevo
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{dish.category}</Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                S/ {dish.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={dish.isAvailable ? "default" : "destructive"}
                  className={dish.isAvailable ? "bg-green-600" : ""}
                >
                  {dish.isAvailable ? "Disponible" : "No disponible"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(dish)}
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(dish)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(dish)}
                    title="Eliminar"
                    className="text-red-600 hover:text-red-700"
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

