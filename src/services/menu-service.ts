/**
 * Servicio Mock para Gestión de Platos
 * En producción, este servicio se conectará al backend
 */

import type { Dish, MenuFormData, MenuFilters, PaginatedResponse, PaginationParams } from '@/types/menu';

// Datos mock de platos peruanos
// eslint-disable-next-line prefer-const
let mockDishes: Dish[] = [
  {
    id: '1',
    name: 'Ceviche Clásico',
    description: 'Pescado fresco del día marinado en limón, cebolla morada, ají limo y cilantro. Acompañado de camote y choclo.',
    price: 32.00,
    category: 'Platos a la Carta',
    categoryId: 'cat-3',
    image: 'https://images.unsplash.com/photo-1611171711912-e3ea7ff8b0d0?w=800',
    tags: ['marino', 'fresco', 'recomendado', 'popular'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 15,
    servings: 1,
    allergens: ['pescado', 'ají'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '2',
    name: 'Lomo Saltado',
    description: 'Trozos de carne salteados con cebolla, tomate, ají amarillo. Acompañado de papas fritas y arroz blanco.',
    price: 28.00,
    category: 'Platos Tradicionales',
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800',
    tags: ['carne', 'tradicional', 'popular'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 20,
    servings: 1,
    allergens: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-12-15'),
  },
  {
    id: '3',
    name: 'Ají de Gallina',
    description: 'Cremoso guiso de pollo deshilachado en salsa de ají amarillo, leche y pan. Con papas, aceitunas y huevo.',
    price: 25.00,
    category: 'Platos Tradicionales',
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1603073163908-9fa9d21f8b20?w=800',
    tags: ['pollo', 'cremoso', 'tradicional'],
    isAvailable: true,
    isPopular: false,
    isNew: false,
    preparationTime: 25,
    servings: 1,
    allergens: ['lácteos', 'ají'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-11-10'),
  },
  {
    id: '4',
    name: 'Causa Limeña',
    description: 'Papa amarilla prensada con limón y ají amarillo, rellena de pollo, atún o langostino. Con palta y mayonesa.',
    price: 22.00,
    category: 'Platos a la Carta',
    categoryId: 'cat-3',
    image: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800',
    tags: ['entrada', 'frío', 'popular'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 15,
    servings: 1,
    allergens: ['mayonesa', 'ají'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-12-01'),
  },
  {
    id: '5',
    name: 'Arroz con Mariscos',
    description: 'Arroz cocido con caldo de mariscos, langostinos, calamares, conchas y mejillones. Al estilo peruano.',
    price: 35.00,
    category: 'Platos a la Carta',
    categoryId: 'cat-3',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    tags: ['marino', 'arroz', 'abundante'],
    isAvailable: true,
    isPopular: false,
    isNew: true,
    preparationTime: 30,
    servings: 1,
    allergens: ['mariscos'],
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '6',
    name: 'Anticuchos',
    description: 'Brochetas de corazón de res marinadas en ají panca y especias. Con papa dorada y salsa de ají.',
    price: 24.00,
    category: 'Platos a la Carta',
    categoryId: 'cat-3',
    image: 'https://images.unsplash.com/photo-1612392062798-2407b95cb5c8?w=800',
    tags: ['parrilla', 'tradicional', 'picante'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 20,
    servings: 1,
    allergens: ['ají'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2025-11-25'),
  },
  {
    id: '7',
    name: 'Tacu Tacu con Lomo',
    description: 'Mezcla de arroz y frijoles sofritos, acompañado de lomo saltado o bistec a la plancha.',
    price: 30.00,
    category: 'Platos Tradicionales',
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
    tags: ['contundente', 'tradicional', 'carne'],
    isAvailable: true,
    isPopular: false,
    isNew: false,
    preparationTime: 25,
    servings: 1,
    allergens: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-10-15'),
  },
  {
    id: '8',
    name: 'Rocoto Relleno',
    description: 'Rocoto relleno de carne molida, pasas, aceitunas y queso. Gratinado al horno con papa dorada.',
    price: 26.00,
    category: 'Platos Tradicionales',
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800',
    tags: ['picante', 'gratinado', 'tradicional'],
    isAvailable: false,
    isPopular: false,
    isNew: false,
    preparationTime: 35,
    servings: 1,
    allergens: ['lácteos', 'picante'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2025-11-30'),
  },
  {
    id: '9',
    name: 'Menú Ejecutivo',
    description: 'Incluye entrada, plato principal, postre y bebida del día. Opciones variadas diariamente.',
    price: 18.00,
    category: 'Menú del Día',
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    tags: ['menú', 'económico', 'completo'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 20,
    servings: 1,
    allergens: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2025-12-26'),
  },
  {
    id: '10',
    name: 'Menú Económico',
    description: 'Plato principal con arroz, guarnición y refresco del día. La mejor opción calidad-precio.',
    price: 12.00,
    category: 'Menú del Día',
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    tags: ['menú', 'económico', 'rápido'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 15,
    servings: 1,
    allergens: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2025-12-26'),
  },
  {
    id: '11',
    name: 'Chicha Morada',
    description: 'Bebida tradicional peruana de maíz morado con piña, membrillo y especias. Servida bien fría.',
    price: 6.00,
    category: 'Bebidas',
    categoryId: 'cat-4',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    tags: ['bebida', 'tradicional', 'refrescante'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 2,
    servings: 1,
    allergens: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '12',
    name: 'Inca Kola',
    description: 'La bebida peruana por excelencia. Disponible en botella de 500ml o jarra de 1L.',
    price: 5.00,
    category: 'Bebidas',
    categoryId: 'cat-4',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=800',
    tags: ['bebida', 'gaseosa', 'popular'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 1,
    servings: 1,
    allergens: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-12-15'),
  },
  {
    id: '13',
    name: 'Pisco Sour',
    description: 'Cóctel bandera del Perú con pisco, limón, jarabe de goma, clara de huevo y gotas de amargo de angostura.',
    price: 18.00,
    category: 'Bebidas',
    categoryId: 'cat-4',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
    tags: ['cóctel', 'tradicional', 'alcohólico'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 5,
    servings: 1,
    allergens: ['alcohol', 'huevo'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-12-10'),
  },
  {
    id: '14',
    name: 'Suspiro Limeño',
    description: 'Postre cremoso de manjar blanco cubierto con merengue suave y oporto. Un clásico limeño.',
    price: 12.00,
    category: 'Postres',
    categoryId: 'cat-5',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    tags: ['postre', 'dulce', 'tradicional'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 10,
    servings: 1,
    allergens: ['lácteos', 'huevo', 'alcohol'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2025-12-05'),
  },
  {
    id: '15',
    name: 'Mazamorra Morada',
    description: 'Postre tradicional de maíz morado con frutas, canela y clavo de olor. Servido con arroz con leche.',
    price: 8.00,
    category: 'Postres',
    categoryId: 'cat-5',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
    tags: ['postre', 'tradicional', 'dulce'],
    isAvailable: true,
    isPopular: false,
    isNew: false,
    preparationTime: 5,
    servings: 1,
    allergens: ['lácteos'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2025-11-15'),
  },
  {
    id: '16',
    name: 'Arroz con Leche',
    description: 'Postre cremoso de arroz cocido en leche con canela, pasas y esencia de vainilla. Servido frío.',
    price: 7.00,
    category: 'Postres',
    categoryId: 'cat-5',
    image: 'https://images.unsplash.com/photo-1589739900243-c0b4127711e9?w=800',
    tags: ['postre', 'cremoso', 'tradicional'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 5,
    servings: 1,
    allergens: ['lácteos'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2025-12-01'),
  },
  {
    id: '17',
    name: 'Seco de Cabrito',
    description: 'Guiso de cabrito con cilantro, cerveza negra, zanahoria y arvejas. Con frijoles y yuca.',
    price: 32.00,
    category: 'Platos Tradicionales',
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',
    tags: ['guiso', 'tradicional', 'norteño'],
    isAvailable: true,
    isPopular: false,
    isNew: true,
    preparationTime: 40,
    servings: 1,
    allergens: [],
    createdAt: new Date('2025-11-15'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '18',
    name: 'Jalea Mixta',
    description: 'Pescados y mariscos fritos acompañados de yuca frita, salsa criolla y salsa de mariscos.',
    price: 38.00,
    category: 'Platos a la Carta',
    categoryId: 'cat-3',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800',
    tags: ['frito', 'marino', 'compartir'],
    isAvailable: true,
    isPopular: true,
    isNew: false,
    preparationTime: 25,
    servings: 2,
    allergens: ['mariscos', 'pescado'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2025-12-18'),
  },
  {
    id: '19',
    name: 'Carapulcra con Sopa Seca',
    description: 'Papa seca guisada con carne de cerdo y pollo, acompañada de tallarines al pesto. Plato chinchano.',
    price: 28.00,
    category: 'Platos Tradicionales',
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800',
    tags: ['tradicional', 'contundente', 'chinchano'],
    isAvailable: true,
    isPopular: false,
    isNew: false,
    preparationTime: 35,
    servings: 1,
    allergens: [],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-10-20'),
  },
  {
    id: '20',
    name: 'Tiradito de Pescado',
    description: 'Finas láminas de pescado fresco en salsa de ají amarillo, limón y aceite de oliva. Estilo nikkei.',
    price: 30.00,
    category: 'Platos a la Carta',
    categoryId: 'cat-3',
    image: 'https://placehold.co/400x300/14b8a6/white?text=Tiradito',
    tags: ['marino', 'fresco', 'nikkei', 'picante'],
    isAvailable: true,
    isPopular: true,
    isNew: true,
    preparationTime: 10,
    servings: 1,
    allergens: ['pescado', 'ají'],
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2025-12-26'),
  },
];

// Helper para generar delay simulado
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtener todos los platos con filtros opcionales
 */
export async function getAllDishes(filters?: MenuFilters): Promise<Dish[]> {
  await delay(300); // Simular latencia de red

  let filtered = [...mockDishes];

  if (filters) {
    if (filters.category) {
      filtered = filtered.filter(dish => dish.categoryId === filters.category);
    }
    if (filters.isAvailable !== undefined) {
      filtered = filtered.filter(dish => dish.isAvailable === filters.isAvailable);
    }
    if (filters.isPopular !== undefined) {
      filtered = filtered.filter(dish => dish.isPopular === filters.isPopular);
    }
    if (filters.isNew !== undefined) {
      filtered = filtered.filter(dish => dish.isNew === filters.isNew);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(dish =>
        dish.name.toLowerCase().includes(searchLower) ||
        dish.description.toLowerCase().includes(searchLower) ||
        dish.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(dish =>
        filters.tags!.some(tag => dish.tags.includes(tag))
      );
    }
  }

  return filtered;
}

/**
 * Obtener platos con paginación
 */
export async function getDishesPaginated(
  params: PaginationParams,
  filters?: MenuFilters
): Promise<PaginatedResponse<Dish>> {
  const allDishes = await getAllDishes(filters);

  // Ordenamiento
  const sorted = [...allDishes];
  if (params.sortBy) {
    sorted.sort((a, b) => {
      const aVal = a[params.sortBy!];
      const bVal = b[params.sortBy!];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return params.sortOrder === 'desc'
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return params.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      return 0;
    });
  }

  // Paginación
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedData = sorted.slice(start, end);

  return {
    data: paginatedData,
    total: sorted.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(sorted.length / params.pageSize),
  };
}

/**
 * Obtener un plato por ID
 */
export async function getDishById(id: string): Promise<Dish | null> {
  await delay(200);
  return mockDishes.find(dish => dish.id === id) || null;
}

/**
 * Crear un nuevo plato
 */
export async function createDish(data: MenuFormData): Promise<Dish> {
  await delay(500);

  const newDish: Dish = {
    id: `dish-${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockDishes.push(newDish);
  return newDish;
}

/**
 * Actualizar un plato existente
 */
export async function updateDish(id: string, data: Partial<MenuFormData>): Promise<Dish | null> {
  await delay(500);

  const index = mockDishes.findIndex(dish => dish.id === id);
  if (index === -1) return null;

  mockDishes[index] = {
    ...mockDishes[index],
    ...data,
    updatedAt: new Date(),
  };

  return mockDishes[index];
}

/**
 * Eliminar un plato
 */
export async function deleteDish(id: string): Promise<boolean> {
  await delay(400);

  const index = mockDishes.findIndex(dish => dish.id === id);
  if (index === -1) return false;

  mockDishes.splice(index, 1);
  return true;
}

/**
 * Buscar platos
 */
export async function searchDishes(query: string): Promise<Dish[]> {
  return getAllDishes({ search: query });
}

/**
 * Filtrar platos por categoría
 */
export async function filterDishesByCategory(categoryId: string): Promise<Dish[]> {
  return getAllDishes({ category: categoryId });
}

/**
 * Alternar disponibilidad de un plato
 */
export async function toggleDishAvailability(id: string): Promise<Dish | null> {
  await delay(300);

  const index = mockDishes.findIndex(dish => dish.id === id);
  if (index === -1) return null;

  mockDishes[index].isAvailable = !mockDishes[index].isAvailable;
  mockDishes[index].updatedAt = new Date();

  return mockDishes[index];
}

/**
 * Obtener platos populares
 */
export async function getPopularDishes(): Promise<Dish[]> {
  return getAllDishes({ isPopular: true });
}

/**
 * Obtener platos nuevos
 */
export async function getNewDishes(): Promise<Dish[]> {
  return getAllDishes({ isNew: true });
}

/**
 * Obtener todos los tags únicos
 */
export async function getAllTags(): Promise<string[]> {
  await delay(100);
  const tags = new Set<string>();
  mockDishes.forEach(dish => {
    dish.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

