"use client";

import { useState } from 'react';
import type { MenuItem } from '../menu-data';
import Image from 'next/image';

interface MenuClientPageProps {
  menuItems: MenuItem[];
}

type Category = 'Menú del Día' | 'Platos Tradicionales' | 'Platos a la Carta' | 'Bebidas' | 'Postres';

const categories: Category[] = ['Menú del Día', 'Platos Tradicionales', 'Platos a la Carta', 'Bebidas', 'Postres'];

export default function MenuClientPage({ menuItems }: MenuClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Platos Tradicionales');

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="mt-16">
      {/* Pestañas de categorías */}
      <div className="mb-12 flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid de items con animación */}
      <div className="max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group rounded-2xl border bg-card shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Imagen del plato */}
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <Image
                  src={item.image.imageUrl}
                  alt={item.image.description}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Precio flotante */}
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
                  {item.price}
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-5">
                <h3 className="text-xl font-semibold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-3 py-1 text-xs capitalize font-medium border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

