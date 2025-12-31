/**
 * Constantes globales de la aplicación
 */

// Imagen predeterminada cuando un plato no tiene imagen
export const NO_IMAGE_PLACEHOLDER = "/images/menu/Predeterminado/Predeterminado.jpg";

// Helper para obtener la imagen del plato o la imagen predeterminada
export const getDishImage = (imageUrl?: string | null): string => {
  return imageUrl || NO_IMAGE_PLACEHOLDER;
};

