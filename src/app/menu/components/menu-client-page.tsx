"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categoriesAPI } from '@/lib/api/categories';
import { dishesAPI } from '@/lib/api/dishes';
import type { Category, Dish } from '@/lib/api/types';
import { getDishImage } from '@/lib/constants';
import { useCart } from '@/contexts/cart-context';
import { useSubtags } from '@/hooks/use-subtags';

export default function MenuClientPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { addItem } = useCart();
  const { subtags } = useSubtags();

  // Crear un mapa de ID a nombre de subtags para búsqueda rápida
  const subtagMap = subtags.reduce((acc, subtag) => {
    acc[subtag.id] = subtag.name;
    return acc;
  }, {} as Record<string, string>);

  // Cargar categorías y platos al montar
  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, dishesResponse] = await Promise.all([
        categoriesAPI.getAll(),
        dishesAPI.getAll({ isActive: true }) // Solo platos activos
      ]);

      // Filtrar solo categorías activas y asegurar que sea un array
      const activeCategories = Array.isArray(categoriesData)
        ? categoriesData.filter(cat => cat.isActive)
        : [];
      setCategories(activeCategories);

      // Obtener platos con manejo robusto de diferentes formatos de respuesta
      let dishesData: Dish[] = [];

      if (dishesResponse) {
        // Caso 1: response.data.data (backend con paginación anidada)
        if ((dishesResponse as any).data && (dishesResponse as any).data.data && Array.isArray((dishesResponse as any).data.data)) {
          dishesData = (dishesResponse as any).data.data;
        }
        // Caso 2: response.data (respuesta paginada normal)
        else if ((dishesResponse as any).data && Array.isArray((dishesResponse as any).data)) {
          dishesData = (dishesResponse as any).data;
        }
        // Caso 3: response es directamente un array
        else if (Array.isArray(dishesResponse)) {
          dishesData = dishesResponse;
        }
      }

      console.log('🍽️ Platos cargados en menú público:', dishesData.length);

      // Normalizar price a number
      const normalizedDishes = dishesData.map(dish => ({
        ...dish,
        price: Number(dish.price) || 0
      }));

      setDishes(normalizedDishes);

      // Inicializar cantidades en 1 para cada plato
      const initialQuantities: Record<string, number> = {};
      normalizedDishes.forEach(dish => {
        initialQuantities[dish.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error al cargar datos del menú:', error);
      setCategories([]);
      setDishes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (dishId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: Math.max(1, (prev[dishId] || 1) + delta)
    }));
  };

  // Agregar al carrito
  const handleAddToCart = (dish: Dish) => {
    const quantity = quantities[dish.id] || 1;
    addItem(dish, quantity);
    // Resetear cantidad a 1 después de agregar
    setQuantities(prev => ({
      ...prev,
      [dish.id]: 1
    }));
  };

  // Filtrar platos por categoría seleccionada
  const filteredDishes = !Array.isArray(dishes)
    ? []
    : selectedCategoryId === 'all'
      ? dishes
      : dishes.filter(dish => dish.categoryId === selectedCategoryId);

  if (isLoading) {
    return (
      <div className="mt-16 text-center py-20">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Cargando menú...</p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* Pestañas de categorías */}
      <div className="mb-12 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            selectedCategoryId === 'all'
              ? 'bg-primary text-primary-foreground shadow-lg scale-105'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105'
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedCategoryId === category.id
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105'
            }`}
          >
            {category.icon && <span>{category.icon}</span>}
            {category.name}
          </button>
        ))}
      </div>

      {/* Mensaje si no hay platos */}
      {filteredDishes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            No hay platos disponibles en esta categoría
          </p>
        </div>
      )}

      {/* Grid de items con animación */}
      {filteredDishes.length > 0 && (
        <div className="max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDishes.map((dish, index) => (
              <div
                key={dish.id}
                className="group rounded-2xl border bg-card shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Imagen del plato */}
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <Image
                    src={getDishImage(dish.image)}
                    alt={dish.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Precio flotante */}
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
                    S/ {(Number(dish.price) || 0).toFixed(2)}
                  </div>

                  {/* Badges especiales */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {dish.isFeatured && (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ⭐ Destacado
                      </span>
                    )}
                    {dish.isNew && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        🆕 Nuevo
                      </span>
                    )}
                    {dish.isVegetarian && (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        🥬 Vegetariano
                      </span>
                    )}
                    {dish.isVegan && (
                      <span className="bg-green-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        🌱 Vegano
                      </span>
                    )}
                    {dish.isSpicy && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        🌶️ Picante
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {dish.name}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {dish.description}
                  </p>

                  {/* Alérgenos */}
                  {dish.allergens && dish.allergens.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        <span className="font-semibold">Alérgenos:</span> {dish.allergens.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Tags (Subtags) */}
                  {dish.tags && dish.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dish.tags.map((tagId) => {
                        // Obtener el nombre del subtag desde el mapa
                        const subtagName = subtagMap[tagId];
                        // Solo mostrar si existe el subtag
                        if (!subtagName) return null;

                        return (
                          <span
                            key={tagId}
                            className="rounded-full bg-secondary px-3 py-1 text-xs capitalize font-medium border border-border"
                          >
                            {subtagName}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Control de cantidad y botón de agregar al carrito */}
                  <div className="flex items-center gap-3 mt-4">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-muted"
                        onClick={() => handleQuantityChange(dish.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-semibold w-8 text-center">
                        {quantities[dish.id] || 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-muted"
                        onClick={() => handleQuantityChange(dish.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Botón agregar al carrito */}
                    <Button
                      className="flex-1 h-9 gap-2"
                      onClick={() => handleAddToCart(dish)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}
