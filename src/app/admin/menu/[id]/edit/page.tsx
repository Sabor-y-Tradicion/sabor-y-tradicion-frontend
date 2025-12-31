"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DishForm } from "../../components/dish-form";
import { useToast } from "@/hooks/use-toast";
import { dishesAPI } from "@/lib/api/dishes";
import { categoriesAPI } from "@/lib/api/categories";
import type { Dish, Category } from "@/lib/api/types";
import type { DishFormValues } from "@/lib/validations/dish-validation";

export default function EditDishPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const dishId = params.id as string;

  const [dish, setDish] = useState<Dish | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsDataLoading(true);
        const [dishData, categoriesData] = await Promise.all([
          dishesAPI.getById(dishId),
          categoriesAPI.getAll(),
        ]);

        if (!dishData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se encontró el plato",
          });
          router.push("/admin/menu");
          return;
        }

        setDish(dishData);
        setCategories(categoriesData || []);
      } catch (error: unknown) {
        const err = error as { message?: string };
        toast({
          variant: "destructive",
          title: "Error",
          description: err?.message || "No se pudieron cargar los datos",
        });
        router.push("/admin/menu");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isAuthenticated && dishId) {
      loadData();
    }
  }, [isAuthenticated, dishId, router, toast]);

  const handleSubmit = async (data: DishFormValues) => {
    setIsLoading(true);
    try {
      // Mapear datos del formulario al formato de la API
      const updateData = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        image: data.image === "" ? null : data.image,  // Si está vacío, enviar null para eliminar
        isActive: data.isActive,
        isFeatured: data.isPopular || false,
        allergens: data.allergens || [],
        tags: data.tags || [],
        preparationTime: data.preparationTime,
        servings: data.servings,
        order: dish?.order || 0,
      };

      await dishesAPI.update(dishId, updateData);

      toast({
        title: "Plato actualizado",
        description: `"${data.name}" ha sido actualizado correctamente`,
      });
      router.push("/admin/menu");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "No se pudo actualizar el plato",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/menu");
  };


  if (isDataLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground">Cargando plato...</p>
        </div>
      </div>
    );
  }

  if (!dish) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Editar Plato</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Modifica la informacion de &quot;{dish?.name || ''}&quot;
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/admin/menu">Volver</Link>
        </Button>
      </div>

      {/* Form Card */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <DishForm
          initialData={{
            name: dish.name,
            description: dish.description,
            price: dish.price,
            category: typeof dish.category === 'string' ? dish.category : dish.category?.name || '',
            categoryId: dish.categoryId,
            image: dish.image || '',
            tags: dish.tags || [],
            isActive: dish.isActive,
            isPopular: dish.isFeatured || false,
            isNew: dish.isNew || false,
            preparationTime: dish.preparationTime,
            servings: dish.servings,
            allergens: dish.allergens || [],
          }}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitLabel="Actualizar plato"
        />
      </div>
    </div>
  );
}
