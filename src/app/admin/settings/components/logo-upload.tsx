"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface LogoUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const DEFAULT_LOGO = "/images/logo/logo.png";

export function LogoUpload({ value, onChange, label = "Logo del Restaurante" }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen');
      return;
    }

    // Validar tamaño (máximo 2MB para logos)
    if (file.size > 2 * 1024 * 1024) {
      alert('El logo es demasiado grande. Máximo 2MB');
      return;
    }

    setIsUploading(true);

    try {
      const compressedImage = await compressImage(file);
      onChange(compressedImage);
    } catch (error) {
      console.error('Error al procesar logo:', error);
      alert('Error al procesar el logo. Intenta con una imagen más pequeña.');
    } finally {
      setIsUploading(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('No se pudo crear el canvas'));
            return;
          }

          // Redimensionar manteniendo aspecto (máx 400px)
          let width = img.width;
          let height = img.height;
          const maxSize = 400;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Dibujar imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a PNG para mantener transparencia
          const compressedBase64 = canvas.toDataURL('image/png', 0.9);

          resolve(compressedBase64);
        };
        img.onerror = () => {
          reject(new Error('Error al cargar la imagen'));
        };
      };
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
    });
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayLogo = value || DEFAULT_LOGO;
  const hasCustomLogo = !!value;
  const isBase64 = displayLogo.startsWith('data:');

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div className="flex gap-6 items-start">
        {/* Vista previa del logo */}
        <div className="relative">
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
            {value || hasCustomLogo ? (
              <Image
                src={displayLogo}
                alt="Logo del restaurante"
                width={120}
                height={120}
                className="object-contain"
                unoptimized={isBase64}
              />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <span className="text-xs">Sin logo</span>
              </div>
            )}
          </div>
          {hasCustomLogo && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Zona de carga */}
        <div className="flex-1">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragging 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
              }
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />

            {isUploading ? (
              <p className="text-sm text-muted-foreground">Procesando...</p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  Arrastra tu logo aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG o SVG. Máximo 2MB. Recomendado: 400x400px
                </p>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            💡 El logo se mostrará en el header, footer, sidebar de administración y página de login.
          </p>
        </div>
      </div>
    </div>
  );
}

