"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { CategoriesTable } from "./components/categories-table";
import { CategoryFormDialog } from "./components/category-form-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getAllCategoriesWithCount,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "@/services/category-service";
import type { Category } from "@/types/menu";
import type { CategoryFormValues } from "@/lib/validations/category-validation";

export default function CategoriesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCategoriesWithCount();
        setCategories(data);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las categorias",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated, toast]);

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
      const updated = await toggleCategoryStatus(category.id);
      if (updated) {
        setCategories(
          categories.map((c) => (c.id === category.id ? updated : c))
        );
        toast({
          title: updated.isActive ? "Categoria activada" : "Categoria desactivada",
          description: `"${category.name}" ha sido ${updated.isActive ? "activada" : "desactivada"}`,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cambiar el estado",
      });
    }
  };

  const handleSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        // Editar
        const updated = await updateCategory(selectedCategory.id, data);
        if (updated) {
          const refreshed = await getAllCategoriesWithCount();
          setCategories(refreshed);
          toast({
            title: "Categoria actualizada",
            description: `"${data.name}" ha sido actualizada`,
          });
        }
      } else {
        // Crear
        await createCategory({
          ...data,
          description: data.description || '',
        });
        const refreshed = await getAllCategoriesWithCount();
        setCategories(refreshed);
        toast({
          title: "Categoria creada",
          description: `"${data.name}" ha sido agregada`,
        });
      }
      setFormDialogOpen(false);
      setSelectedCategory(null);
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la categoria",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);
    try {
      await deleteCategory(selectedCategory.id);
      setCategories(categories.filter((c) => c.id !== selectedCategory.id));
      toast({
        title: "Categoria eliminada",
        description: `"${selectedCategory.name}" ha sido eliminada`,
      });
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la categoria",
      });
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion de Categorias
          </h1>
          <p className="text-muted-foreground">
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
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Total de Categorias
          </p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-muted-foreground">Activas</p>
          <p className="text-2xl font-bold text-green-600">
            {categories.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Con Platos
          </p>
          <p className="text-2xl font-bold text-orange-600">
            {categories.filter((c) => c.dishCount && c.dishCount > 0).length}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <CategoriesTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />

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

