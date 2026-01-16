"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DishForm } from "../components/dish-form";
import { useToast } from "@/hooks/use-toast";
import { dishesAPI } from "@/lib/api/dishes";
import { categoriesAPI } from "@/lib/api/categories";
import type { Category } from "@/lib/api/types";
import type { DishFormValues } from "@/lib/validations/dish-validation";

export default function NewDishPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data || []);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las categorías",
        });
        setCategories([]);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated, toast]);

  const handleSubmit = async (data: DishFormValues) => {
    setIsLoading(true);
    try {
      // Mapear datos del formulario al formato de la API
      const dishData = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        image: data.image === "" ? null : data.image,  // Si está vacío, enviar null
        isActive: data.isActive,
        isFeatured: data.isPopular || false,
        allergens: data.allergens || [],
        tags: data.tags || [],
        preparationTime: data.preparationTime,
        order: 0,
      };

      await dishesAPI.create(dishData);

      toast({
        title: "Plato creado",
        description: `"${data.name}" ha sido agregado al menú`,
      });
      router.push("/admin/menu");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "No se pudo crear el plato",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/menu");
  };


  if (isCategoriesLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Agregar Nuevo Plato</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Completa la informacion del plato para agregarlo al menu
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/admin/menu">Volver</Link>
        </Button>
      </div>

      {/* Form Card */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <DishForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitLabel="Crear plato"
        />
      </div>
    </div>
  );
}
