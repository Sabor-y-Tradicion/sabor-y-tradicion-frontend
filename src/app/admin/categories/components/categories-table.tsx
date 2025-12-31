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
import type { Category } from "@/lib/api/types";

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
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-8 text-center text-muted-foreground dark:text-gray-400">
          Cargando categorias...
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-8 text-center">
          <p className="text-muted-foreground dark:text-gray-400">No hay categorias</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-700">
          <TableRow className="dark:border-gray-600">
            <TableHead className="w-16 dark:text-gray-300">Icono</TableHead>
            <TableHead className="dark:text-gray-300">Nombre</TableHead>
            <TableHead className="dark:text-gray-300">Descripción</TableHead>
            <TableHead className="text-center dark:text-gray-300">Platos</TableHead>
            <TableHead className="text-center dark:text-gray-300">Orden</TableHead>
            <TableHead className="text-center dark:text-gray-300">Estado</TableHead>
            <TableHead className="text-right dark:text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="dark:bg-gray-800">
          {categories.map((category) => (
            <TableRow key={category.id} className="dark:border-gray-700">
              <TableCell>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-2xl">
                  {category.icon}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium dark:text-white">{category.name}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground dark:text-gray-400">
                  {category.description || "Sin descripción"}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                  {category.dishCount || 0}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="font-mono dark:bg-gray-700 dark:text-gray-300"
                >
                  {category.order || 0}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={category.isActive ? "default" : "secondary"}
                  className={category.isActive ? "bg-green-600" : "dark:bg-gray-700"}
                  onClick={() => onToggleStatus(category)}
                  style={{ cursor: "pointer" }}
                >
                  {category.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                    className="dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category)}
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
