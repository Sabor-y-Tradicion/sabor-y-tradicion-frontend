"use client";

import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  error?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Escribe un tag y presiona Enter",
  maxTags = 5,
  error,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Eliminar el último tag si backspace y el input está vacío
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim().toLowerCase();

    if (!trimmedValue) return;

    if (value.length >= maxTags) {
      return;
    }

    if (value.includes(trimmedValue)) {
      setInputValue("");
      return;
    }

    onChange([...value, trimmedValue]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div
        className={`
          flex min-h-[42px] flex-wrap gap-2 rounded-md border p-2
          dark:bg-gray-700 dark:border-gray-600
          ${error ? 'border-red-500' : 'border-input'}
        `}
      >
        {value.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="gap-1 px-2 py-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {value.length < maxTags && (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={value.length === 0 ? placeholder : ""}
            className="h-auto flex-1 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-gray-400">
        <span>
          {value.length}/{maxTags} tags
        </span>
        {value.length >= maxTags && (
          <span className="text-orange-500">Máximo alcanzado</span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

