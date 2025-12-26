import { z } from 'zod';

/**
 * Schema de validacion para crear/editar categorias
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),

  description: z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),

  icon: z
    .string()
    .min(1, 'Debes seleccionar un icono'),

  order: z
    .number()
    .min(0, 'El orden debe ser mayor o igual a 0')
    .max(99, 'El orden no puede exceder 99'),

  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

