"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DishForm } from "../components/dish-form";
import { useToast } from "@/hooks/use-toast";
import { createDish } from "@/services/menu-service";
import { getAllCategories } from "@/services/category-service";
import type { Category } from "@/types/menu";
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
        const data = await getAllCategories();
        setCategories(data);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las categorias",
        });
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
      await createDish(data);
      toast({
        title: "Plato creado",
        description: `"${data.name}" ha sido agregado al menu`,
      });
      router.push("/admin/menu");
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el plato",
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
      <div className="flex items-center gap-4">
        <Link href="/admin/menu">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agregar Nuevo Plato</h1>
          <p className="text-muted-foreground">
            Completa la información del plato para agregarlo al menu
          </p>
        </div>
      </div>

      {/* Formulario */}
      <DishForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitLabel="Crear plato"
      />
    </div>
  );
}

