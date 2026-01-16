/**
 * Constantes globales de la aplicación
 */

// Dominio base para los tenants (subdominios)
// En desarrollo: james.pe (configurado en Laragon)
// En producción: cambiar al dominio real
export const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'james.pe';

// Genera el dominio completo de un tenant a partir del slug
export const getTenantDomain = (slug: string): string => {
  return `${slug}.${BASE_DOMAIN}`;
};

// Imagen predeterminada cuando un plato no tiene imagen
export const NO_IMAGE_PLACEHOLDER = "/images/menu/Predeterminado/Predeterminado.jpg";

// Helper para obtener la imagen del plato o la imagen predeterminada
export const getDishImage = (imageUrl?: string | null): string => {
  return imageUrl || NO_IMAGE_PLACEHOLDER;
};

