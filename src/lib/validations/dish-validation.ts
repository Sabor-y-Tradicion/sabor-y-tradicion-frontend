import { z } from 'zod';

/**
 * Schema de validacion para crear/editar platos
 */
export const dishSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),

  price: z
    .number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(9999, 'El precio no puede exceder 9999'),

  category: z
    .string()
    .min(1, 'Debes seleccionar una categoría'),

  categoryId: z
    .string()
    .min(1, 'Debes seleccionar una categoría'),

  image: z
    .string()
    .optional(), // Ya no requiere URL válida, puede ser empty o path de archivo

  tags: z
    .array(z.string())
    .max(5, 'No puedes agregar más de 5 tags')
    .optional(),

  isActive: z.boolean(),

  isPopular: z.boolean().optional(),

  isNew: z.boolean().optional(),


  preparationTime: z
    .number()
    .min(1, 'El tiempo debe ser mayor a 0')
    .max(180, 'El tiempo no puede exceder 180 minutos')
    .optional(),


  allergens: z
    .array(z.string())
    .max(10, 'No puedes agregar más de 10 alérgenos')
    .optional(),
});

export type DishFormValues = z.infer<typeof dishSchema>;

