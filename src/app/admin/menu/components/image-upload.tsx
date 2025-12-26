"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export function ImageUpload({ value, onChange, label = "Imagen del plato", error }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // En producción, aquí se subiría el archivo
    // Por ahora solo mostramos un placeholder
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Simular URL
      const fakeUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800`;
      onChange(fakeUrl);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // En producción, aquí se subiría el archivo
      const fakeUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800`;
      onChange(fakeUrl);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden rounded-lg border">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute right-2 top-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex h-48 cursor-pointer flex-col items-center justify-center
            rounded-lg border-2 border-dashed transition-colors
            ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-muted-foreground/25'}
            ${error ? 'border-red-500' : ''}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">
            Arrastra una imagen aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP hasta 5MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* Opción de URL manual */}
      <div className="space-y-2">
        <Label htmlFor="image-url" className="text-sm text-muted-foreground">
          O pega una URL de imagen
        </Label>
        <div className="flex gap-2">
          <Input
            id="image-url"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!value && !error && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <ImageIcon className="h-3 w-3" />
          Nota: El upload de archivos se implementará con el backend
        </p>
      )}
    </div>
  );
}

