"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { MenuTable } from "./components/menu-table";
import { MenuSearch } from "./components/menu-search";
import { MenuFilters } from "./components/menu-filters";
import { DeleteConfirmDialog } from "./components/delete-confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { getAllDishes, deleteDish } from "@/services/menu-service";
import { getAllCategories } from "@/services/category-service";
import type { Dish, Category } from "@/types/menu";
import { useRouter } from "next/navigation";

export default function AdminMenuPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');

  // Modal de eliminacion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [dishesData, categoriesData] = await Promise.all([
          getAllDishes(),
          getAllCategories(),
        ]);
        setDishes(dishesData);
        setCategories(categoriesData);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...dishes];

    // Filtro de busqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query) ||
          dish.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filtro de categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((dish) => dish.categoryId === selectedCategory);
    }

    // Filtro de disponibilidad
    if (availabilityFilter !== "all") {
      filtered = filtered.filter((dish) =>
        availabilityFilter === "available" ? dish.isAvailable : !dish.isAvailable
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
      const success = await deleteDish(dishToDelete.id);
      if (success) {
        setDishes(dishes.filter((d) => d.id !== dishToDelete.id));
        toast({
          title: "Plato eliminado",
          description: `"${dishToDelete.name}" ha sido eliminado correctamente`,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el plato",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDishToDelete(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Gestion del Menu</h1>
          <p className="text-muted-foreground">
            Administra los platos de tu restaurante
          </p>
        </div>
        <Link href="/admin/menu/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Plato
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-muted-foreground">Total de Platos</p>
          <p className="text-2xl font-bold">{dishes.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
          <p className="text-2xl font-bold text-green-600">
            {dishes.filter((d) => d.isAvailable).length}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-muted-foreground">Resultados</p>
          <p className="text-2xl font-bold text-orange-600">{filteredDishes.length}</p>
        </div>
      </div>

      {/* Busqueda */}
      <MenuSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Filtros */}
      <MenuFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
        onReset={handleResetFilters}
      />

      {/* Tabla */}
      <MenuTable
        dishes={filteredDishes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Modal de confirmacion */}
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

