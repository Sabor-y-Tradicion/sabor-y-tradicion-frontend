"use client";

import { useState, useEffect } from "react";
import { X, Plus, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSubtags } from "@/hooks/use-subtags";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SubtagSelectorProps {
  value: string[]; // Array de IDs de subtags seleccionados
  onChange: (value: string[]) => void;
}

export function SubtagSelector({ value = [], onChange }: SubtagSelectorProps) {
  const { subtags, isLoading } = useSubtags();
  const [open, setOpen] = useState(false);

  // Filtrar subtags seleccionados
  const selectedSubtags = subtags.filter((subtag) => value.includes(subtag.id));
  const availableSubtags = subtags.filter((subtag) => !value.includes(subtag.id));

  const handleSelect = (subtagId: string) => {
    if (value.includes(subtagId)) {
      // Deseleccionar
      onChange(value.filter((id) => id !== subtagId));
    } else {
      // Seleccionar
      onChange([...value, subtagId]);
    }
  };

  const handleRemove = (subtagId: string) => {
    onChange(value.filter((id) => id !== subtagId));
  };

  return (
    <div className="space-y-3">
      {/* Subtags seleccionados */}
      {selectedSubtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSubtags.map((subtag) => (
            <Badge
              key={subtag.id}
              variant="secondary"
              className="gap-1 pr-1 dark:bg-gray-700 dark:text-gray-200"
            >
              <Tag className="h-3 w-3" />
              {subtag.name}
              <button
                type="button"
                onClick={() => handleRemove(subtag.id)}
                className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Selector dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            type="button"
          >
            {selectedSubtags.length > 0
              ? `${selectedSubtags.length} subtag${selectedSubtags.length > 1 ? 's' : ''} seleccionado${selectedSubtags.length > 1 ? 's' : ''}`
              : "Selecciona subtags"}
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
          <Command className="dark:bg-gray-800">
            <CommandInput
              placeholder="Buscar subtags..."
              className="h-9 dark:bg-gray-800 dark:text-white"
            />
            <CommandEmpty className="py-6 text-center text-sm dark:text-gray-400">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                  <p>Cargando subtags...</p>
                </div>
              ) : subtags.length === 0 ? (
                <div className="flex flex-col items-center gap-2">
                  <p>No hay subtags disponibles.</p>
                  <Link href="/admin/menu/subtags">
                    <Button size="sm" variant="link" className="text-orange-600">
                      Crear subtags
                    </Button>
                  </Link>
                </div>
              ) : (
                <p>No se encontraron subtags.</p>
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {availableSubtags.map((subtag) => (
                <CommandItem
                  key={subtag.id}
                  value={subtag.name}
                  onSelect={() => {
                    handleSelect(subtag.id);
                  }}
                  className="dark:hover:bg-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      value.includes(subtag.id)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <Tag className="mr-2 h-4 w-4 opacity-50" />
                  {subtag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Mensaje de ayuda */}
      <p className="text-xs text-muted-foreground dark:text-gray-400">
        {subtags.length === 0 ? (
          <>
            No hay subtags creados.{" "}
            <Link href="/admin/menu/subtags" className="text-orange-600 hover:underline">
              Crear subtags primero
            </Link>
          </>
        ) : (
          `${availableSubtags.length} subtag${availableSubtags.length !== 1 ? 's' : ''} disponible${availableSubtags.length !== 1 ? 's' : ''}`
        )}
      </p>
    </div>
  );
}

