"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { MenuTable } from "./components/menu-table";
import { MenuSearch } from "./components/menu-search";
import { MenuFilters } from "./components/menu-filters";
import { DeleteConfirmDialog } from "./components/delete-confirm-dialog";
import { useDishes } from "@/hooks/use-dishes";
import { useCategories } from "@/hooks/use-categories";
import type { Dish } from "@/lib/api/types";
import { useRouter } from "next/navigation";

export default function AdminMenuPage() {
  const router = useRouter();

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');

  // Hooks de API
  const {
    dishes,
    isLoading: dishesLoading,
    deleteDish,
    refetch: refetchDishes
  } = useDishes();

  const {
    categories,
    isLoading: categoriesLoading
  } = useCategories();

  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const isLoading = dishesLoading || categoriesLoading;

  // Modal de eliminacion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Aplicar filtros localmente
  useEffect(() => {
    // Verificar que dishes sea un array antes de filtrar
    if (!Array.isArray(dishes)) {
      setFilteredDishes([]);
      return;
    }

    let filtered = [...dishes];

    // Filtro de busqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
      );
    }

    // Filtro de categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((dish) => dish.categoryId === selectedCategory);
    }

    // Filtro de disponibilidad
    if (availabilityFilter !== "all") {
      filtered = filtered.filter((dish) =>
        availabilityFilter === "available" ? dish.isActive : !dish.isActive
      );
    }

    setFilteredDishes(filtered);
  }, [dishes, searchQuery, selectedCategory, availabilityFilter]);

  // Handlers
  const handleEdit = (dish: Dish) => {
    router.push(`/admin/menu/${dish.id}/edit`);
  };

  const handleDelete = (dish: Dish) => {
    setDishToDelete(dish);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!dishToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDish(dishToDelete.id);
      setDeleteDialogOpen(false);
      setDishToDelete(null);
    } catch {
      // El error ya se maneja en el hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setAvailabilityFilter("all");
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gestion del Menu</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Administra los platos de tu restaurante
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetchDishes()}
            disabled={isLoading}
            className="gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Link href="/admin/menu/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Plato
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Total de Platos</p>
          <p className="text-2xl font-bold dark:text-white">{Array.isArray(dishes) ? dishes.length : 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Disponibles</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Array.isArray(dishes) ? dishes.filter((d) => d.isActive).length : 0}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Categorías</p>
          <p className="text-2xl font-bold dark:text-white">{Array.isArray(categories) ? categories.length : 0}</p>
        </div>
      </div>

      {/* Filters */}
      <MenuFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
        onReset={handleResetFilters}
      />

      {/* Search */}
      <MenuSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <MenuTable
          dishes={filteredDishes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        dish={dishToDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
