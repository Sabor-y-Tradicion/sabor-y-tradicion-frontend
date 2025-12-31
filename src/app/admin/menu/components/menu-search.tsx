"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MenuSearch({
  value,
  onChange,
  placeholder = "Buscar platos..."
}: MenuSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
      />
      {value && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

