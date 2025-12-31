"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import { TagInput } from "./tag-input";
import { dishSchema, type DishFormValues } from "@/lib/validations/dish-validation";
import type { Category } from "@/types/menu";
import { Loader2, Save } from "lucide-react";

interface DishFormProps {
  initialData?: Partial<DishFormValues>;
  categories: Category[];
  onSubmit: (data: DishFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function DishForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = "Guardar plato",
}: DishFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      categoryId: initialData?.categoryId || "",
      image: initialData?.image || "",
      tags: initialData?.tags || [],
      isActive: initialData?.isActive ?? true,
      isPopular: initialData?.isPopular || false,
      isNew: initialData?.isNew || false,
      preparationTime: initialData?.preparationTime || undefined,
      servings: initialData?.servings || 1,
      allergens: initialData?.allergens || [],
    },
  });

  const watchImage = watch("image");
  const watchTags = watch("tags");
  const watchIsActive = watch("isActive");
  const watchIsPopular = watch("isPopular");
  const watchIsNew = watch("isNew");

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setValue("categoryId", categoryId);
      setValue("category", category.name);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información básica */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Información Básica
        </h3>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-gray-200">
              Nombre del plato <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Ceviche Clásico"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-gray-200">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe el plato, sus ingredientes y preparación..."
              rows={4}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Precio y Categoría */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price" className="dark:text-gray-200">
                Precio (S/) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId" className="dark:text-gray-200">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("categoryId")}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="dark:text-white dark:focus:bg-gray-600"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detalles Adicionales */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Detalles Adicionales
        </h3>

        <div className="space-y-4">
          {/* Tags */}
          <div className="space-y-2">
            <Label className="dark:text-gray-200">Tags</Label>
            <TagInput
              value={watchTags || []}
              onChange={(tags) => setValue("tags", tags)}
            />
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Presiona Enter para agregar 0/5 tags
            </p>
          </div>

          {/* Tiempo de preparación y Porciones */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preparationTime" className="dark:text-gray-200">
                Tiempo de preparación (min)
              </Label>
              <Input
                id="preparationTime"
                type="number"
                {...register("preparationTime", { valueAsNumber: true })}
                placeholder="30"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings" className="dark:text-gray-200">
                Porciones
              </Label>
              <Input
                id="servings"
                type="number"
                {...register("servings", { valueAsNumber: true })}
                placeholder="1"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Estados */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4">
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">
                  Estado del plato
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Activar o desactivar la disponibilidad
                </p>
              </div>
              <Switch
                checked={watchIsActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4">
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">
                  Plato popular
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Destacar como plato popular
                </p>
              </div>
              <Switch
                checked={watchIsPopular}
                onCheckedChange={(checked) => setValue("isPopular", checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4">
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">
                  Plato nuevo
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Marcar como novedad
                </p>
              </div>
              <Switch
                checked={watchIsNew}
                onCheckedChange={(checked) => setValue("isNew", checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Imagen */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Imagen del Plato
        </h3>
        <ImageUpload
          value={watchImage || ""}
          onChange={(value) => setValue("image", value)}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

