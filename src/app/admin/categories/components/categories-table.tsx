"use client";

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
import { Edit, Trash2 } from "lucide-react";
import type { Category } from "@/types/menu";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  isLoading?: boolean;
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
}: CategoriesTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white">
        <div className="p-8 text-center text-muted-foreground">
          Cargando categorias...
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border bg-white">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No hay categorias</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Icono</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-center">Platos</TableHead>
            <TableHead className="text-center">Orden</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-2xl">
                  {category.icon}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">{category.name}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {category.description || "Sin descripción"}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{category.dishCount || 0}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{category.order}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <button onClick={() => onToggleStatus(category)}>
                  <Badge
                    variant={category.isActive ? "default" : "destructive"}
                    className={category.isActive ? "bg-green-600 cursor-pointer" : "cursor-pointer"}
                  >
                    {category.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </button>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(category)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(category)}
                    title="Eliminar"
                    className="text-red-600 hover:text-red-700"
                    disabled={!!category.dishCount && category.dishCount > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

