"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: "video" | "square" | "portrait";
  className?: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  aspectRatio = "video",
  className,
  label,
  hint,
  disabled = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        // Dimensiones máximas según el tipo
        const maxWidth = aspectRatio === "video" ? 1920 : 1200;
        const maxHeight = aspectRatio === "video" ? 1080 : 1200;

        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                type: "image/webp",
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Error comprimiendo imagen"));
            }
          },
          "image/webp",
          0.85
        );
      };

      img.onerror = () => reject(new Error("Error cargando imagen"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten imágenes");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("La imagen no debe superar 10MB");
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        // Comprimir imagen
        const compressedFile = await compressImage(file);

        // Convertir a base64 para almacenamiento persistente
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          console.log('Imagen convertida a base64, tamaño:', base64String.length, 'caracteres');
          console.log('Comienza con:', base64String.substring(0, 50));
          onChange(base64String);
          setIsUploading(false);
        };
        reader.onerror = () => {
          setError("Error al procesar la imagen");
          setIsUploading(false);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error("Error procesando imagen:", err);
        setError("Error al procesar la imagen");
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    // Solo revocar URLs blob, no base64
    if (value?.startsWith("blob:")) {
      URL.revokeObjectURL(value);
    }
    onRemove?.();
  }, [value, onRemove]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors",
          aspectRatioClass,
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-700",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={!disabled ? handleDrop : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
      >
        {value ? (
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Cambiar
                </Button>
                {onRemove && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleRemove}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center cursor-pointer",
              disabled && "cursor-not-allowed"
            )}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <p className="mt-2 text-sm text-gray-500">Procesando...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Arrastra una imagen o haz clic
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  PNG, JPG, WEBP (máx. 10MB)
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled || isUploading}
        />
      </div>

      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

