"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DishForm } from "../../components/dish-form";
import { useToast } from "@/hooks/use-toast";
import { getDishById, updateDish } from "@/services/menu-service";
import { getAllCategories } from "@/services/category-service";
import type { Dish, Category } from "@/types/menu";
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
          getDishById(dishId),
          getAllCategories(),
        ]);

        if (!dishData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se encontro el plato",
          });
          router.push("/admin/menu");
          return;
        }

        setDish(dishData);
        setCategories(categoriesData);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos",
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
      await updateDish(dishId, data);
      toast({
        title: "Plato actualizado",
        description: `"${data.name}" ha sido actualizado correctamente`,
      });
      router.push("/admin/menu");
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el plato",
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
      <div className="flex items-center gap-4">
        <Link href="/admin/menu">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Plato</h1>
          <p className="text-muted-foreground">
            Modifica la informacion de &quot;{dish.name}&quot;
          </p>
        </div>
      </div>

      {/* Formulario */}
      <DishForm
        initialData={dish}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitLabel="Actualizar plato"
      />
    </div>
  );
}

