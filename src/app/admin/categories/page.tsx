"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { CategoriesTable } from "./components/categories-table";
import { CategoryFormDialog } from "./components/category-form-dialog";
import { useCategories } from "@/hooks/use-categories";
import type { Category } from "@/lib/api/types";
import type { CategoryFormValues } from "@/lib/validations/category-validation";

export default function CategoriesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);


  const handleCreate = () => {
    setSelectedCategory(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await updateCategory(category.id, { isActive: !category.isActive });
    } catch {
      // El error ya se maneja en el hook
    }
  };

  const handleSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        // Editar
        await updateCategory(selectedCategory.id, data);
      } else {
        // Crear
        await createCategory({
          ...data,
          description: data.description || '',
        });
      }
      setFormDialogOpen(false);
      setSelectedCategory(null);
    } catch {
      // El error ya se maneja en el hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);
    try {
      await deleteCategory(selectedCategory.id);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch {
      // El error ya se maneja en el hook
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gestion de Categorias</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Administra las categorias del menu
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoria
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Total de Categorias</p>
          <p className="text-2xl font-bold dark:text-white">{categories.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Activas</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {categories.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Con Platos</p>
          <p className="text-2xl font-bold dark:text-white">
            {categories.filter((c) => c.dishCount && c.dishCount > 0).length}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CategoriesTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          isLoading={isLoading}
        />
      </div>

      {/* Modal de formulario */}
      <CategoryFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        initialData={selectedCategory || undefined}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        title={selectedCategory ? "Editar Categoria" : "Nueva Categoria"}
        description={
          selectedCategory
            ? "Modifica la informacion de la categoria"
            : "Completa la informacion de la nueva categoria"
        }
      />

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCategory && (
                <>
                  Estas a punto de eliminar la categoria{" "}
                  <span className="font-semibold text-foreground">
                    &quot;{selectedCategory.name}&quot;
                  </span>
                  .{" "}
                  {selectedCategory.dishCount && selectedCategory.dishCount > 0
                    ? "Esta categoria tiene platos asociados y no puede ser eliminada."
                    : "Esta accion no se puede deshacer."}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={
                isDeleting ||
                (!!selectedCategory?.dishCount && selectedCategory.dishCount > 0)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
