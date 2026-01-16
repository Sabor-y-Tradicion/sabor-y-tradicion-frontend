"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { ImageUploader } from "./image-uploader";
import { CarouselItem } from "@/types/tenant";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface CarouselEditorProps {
  items: CarouselItem[];
  onChange: (items: CarouselItem[]) => void;
  maxItems?: number;
}

export function CarouselEditor({
  items,
  onChange,
  maxItems = 10,
}: CarouselEditorProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleAddItem = useCallback(() => {
    if (items.length >= maxItems) return;

    const newItem: CarouselItem = {
      id: uuidv4(),
      image: "",
      title: "",
      description: "",
      order: items.length,
    };

    onChange([...items, newItem]);
    setExpandedItem(newItem.id);
  }, [items, maxItems, onChange]);

  const handleRemoveItem = useCallback(
    (id: string) => {
      const newItems = items
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, order: index }));
      onChange(newItems);
      if (expandedItem === id) {
        setExpandedItem(null);
      }
    },
    [items, onChange, expandedItem]
  );

  const handleUpdateItem = useCallback(
    (id: string, updates: Partial<CarouselItem>) => {
      const newItems = items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      onChange(newItems);
    },
    [items, onChange]
  );

  const handleMoveItem = useCallback(
    (id: string, direction: "up" | "down") => {
      const currentIndex = items.findIndex((item) => item.id === id);
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === items.length - 1)
      ) {
        return;
      }

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const newItems = [...items];
      const [movedItem] = newItems.splice(currentIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      // Actualizar order
      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        order: index,
      }));

      onChange(reorderedItems);
    },
    [items, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Lista de items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p>No hay elementos en el carrusel</p>
            <p className="text-sm mt-1">Agrega tu primer elemento</p>
          </div>
        ) : (
          items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <Card
                key={item.id}
                className={cn(
                  "transition-all",
                  expandedItem === item.id && "ring-2 ring-primary"
                )}
              >
                <CardContent className="p-4">
                  {/* Header colapsable */}
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() =>
                      setExpandedItem(expandedItem === item.id ? null : item.id)
                    }
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveItem(item.id, "up");
                        }}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveItem(item.id, "down");
                        }}
                        disabled={index === items.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Plus className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {item.title || `Elemento ${index + 1}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {item.description || "Sin descripción"}
                      </p>
                    </div>

                    {/* Delete */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Contenido expandido */}
                  {expandedItem === item.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                      <ImageUploader
                        value={item.image}
                        onChange={(url) => handleUpdateItem(item.id, { image: url })}
                        onRemove={() => handleUpdateItem(item.id, { image: "" })}
                        aspectRatio="video"
                        label="Imagen"
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Título</Label>
                          <Input
                            value={item.title}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { title: e.target.value })
                            }
                            placeholder="Ej: Ambiente acogedor"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Descripción</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) =>
                              handleUpdateItem(item.id, {
                                description: e.target.value,
                              })
                            }
                            placeholder="Descripción breve del elemento"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </div>

      {/* Botón agregar */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleAddItem}
        disabled={items.length >= maxItems}
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar elemento
        {items.length > 0 && (
          <span className="ml-2 text-gray-500">
            ({items.length}/{maxItems})
          </span>
        )}
      </Button>
    </div>
  );
}

