"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { categorySchema, type CategoryFormValues } from "@/lib/validations/category-validation";
import { Loader2 } from "lucide-react";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<CategoryFormValues>;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const availableIcons = ["🍽️", "🇵🇪", "⭐", "🥤", "🍰", "🍕", "🍔", "🍜", "🥗", "🍛"];

export function CategoryFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading,
  title = "Nueva Categoría",
  description = "Completa la información de la categoría",
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "🍽️",
      order: initialData?.order || 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const watchIcon = watch("icon");
  const watchIsActive = watch("isActive");

  const handleFormSubmit = async (data: CategoryFormValues) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Platos Principales"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Breve descripción de la categoría..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Icono */}
          <div className="space-y-2">
            <Label>
              Icono <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {availableIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue("icon", icon)}
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-lg border-2 text-2xl
                    transition-all hover:scale-110
                    ${
                      watchIcon === icon
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }
                  `}
                >
                  {icon}
                </button>
              ))}
            </div>
            {errors.icon && (
              <p className="text-sm text-red-500">{errors.icon.message}</p>
            )}
          </div>

          {/* Orden */}
          <div className="space-y-2">
            <Label htmlFor="order">
              Orden <span className="text-red-500">*</span>
            </Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Define el orden en que aparecerá la categoría
            </p>
            {errors.order && (
              <p className="text-sm text-red-500">{errors.order.message}</p>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Categoría Activa</Label>
              <p className="text-sm text-muted-foreground">
                Las categorías inactivas no se muestran en el menú
              </p>
            </div>
            <Switch
              checked={watchIsActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

