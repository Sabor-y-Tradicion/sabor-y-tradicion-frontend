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
      isAvailable: initialData?.isAvailable ?? true,
      isPopular: initialData?.isPopular || false,
      isNew: initialData?.isNew || false,
      preparationTime: initialData?.preparationTime || undefined,
      servings: initialData?.servings || 1,
      allergens: initialData?.allergens || [],
    },
  });

  const watchImage = watch("image");
  const watchTags = watch("tags");
  const watchIsAvailable = watch("isAvailable");
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
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Información Básica</h3>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre del plato <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Ceviche Clásico"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe el plato, sus ingredientes y preparación..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Precio y Categoría */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">
                Precio (S/) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("categoryId")}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
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

      {/* Imagen */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Imagen</h3>
        <ImageUpload
          value={watchImage}
          onChange={(value) => setValue("image", value)}
          error={errors.image?.message}
        />
      </div>

      {/* Detalles adicionales */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Detalles Adicionales</h3>

        <div className="space-y-4">
          {/* Tags */}
          <TagInput
            value={watchTags}
            onChange={(tags) => setValue("tags", tags)}
            error={errors.tags?.message}
          />

          {/* Tiempo de preparación y porciones */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preparationTime">Tiempo de preparación (min)</Label>
              <Input
                id="preparationTime"
                type="number"
                {...register("preparationTime", { valueAsNumber: true })}
                placeholder="30"
              />
              {errors.preparationTime && (
                <p className="text-sm text-red-500">{errors.preparationTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings">Porciones</Label>
              <Input
                id="servings"
                type="number"
                {...register("servings", { valueAsNumber: true })}
                placeholder="1"
              />
              {errors.servings && (
                <p className="text-sm text-red-500">{errors.servings.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estados */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Estado del Plato</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Disponible</Label>
              <p className="text-sm text-muted-foreground">
                El plato está disponible para ordenar
              </p>
            </div>
            <Switch
              checked={watchIsAvailable}
              onCheckedChange={(checked) => setValue("isAvailable", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Plato Popular</Label>
              <p className="text-sm text-muted-foreground">
                Marcar como uno de los platos más populares
              </p>
            </div>
            <Switch
              checked={watchIsPopular}
              onCheckedChange={(checked) => setValue("isPopular", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Plato Nuevo</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar como novedad en el menú
              </p>
            </div>
            <Switch
              checked={watchIsNew}
              onCheckedChange={(checked) => setValue("isNew", checked)}
            />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
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

