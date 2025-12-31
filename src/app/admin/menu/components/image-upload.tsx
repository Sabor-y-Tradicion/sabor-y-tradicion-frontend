"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { NO_IMAGE_PLACEHOLDER } from "@/lib/constants";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
}


export function ImageUpload({ value, onChange, label = "Imagen del plato", error }: ImageUploadProps) {
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

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es demasiado grande. Máximo 5MB');
            return;
        }

        setIsUploading(true);

        try {
            // Comprimir y redimensionar imagen antes de convertir a base64
            const compressedImage = await compressImage(file);
            onChange(compressedImage);
            setIsUploading(false);
        } catch (error) {
            console.error('Error al subir imagen:', error);
            alert('Error al procesar la imagen. Intenta con una imagen más pequeña.');
            setIsUploading(false);
        }
    };

    // Función para comprimir y redimensionar imagen
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

                    // Redimensionar manteniendo aspecto (máx 1200px de ancho)
                    let width = img.width;
                    let height = img.height;
                    const maxWidth = 1200;
                    const maxHeight = 1200;

                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            height = (height / width) * maxWidth;
                            width = maxWidth;
                        } else {
                            width = (width / height) * maxHeight;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Dibujar imagen redimensionada
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convertir a base64 con compresión (calidad 0.7 = 70%)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

                    // Verificar que no sea muy grande (máx ~500KB en base64)
                    if (compressedBase64.length > 700000) {
                        // Si aún es muy grande, comprimir más
                        const moreCompressed = canvas.toDataURL('image/jpeg', 0.5);
                        resolve(moreCompressed);
                    } else {
                        resolve(compressedBase64);
                    }
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

    // Usar placeholder si no hay imagen
    const displayImage = value || NO_IMAGE_PLACEHOLDER;
    const hasCustomImage = !!value;

    return (
        <div className="space-y-2">
            <Label>{label}</Label>

            <div className="relative">
                <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                    <Image
                        src={displayImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 500px"
                    />
                    {!hasCustomImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <p className="text-sm text-gray-500">Sin imagen</p>
                        </div>
                    )}
                </div>

                {hasCustomImage && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative flex h-32 cursor-pointer flex-col items-center justify-center
          rounded-lg border-2 border-dashed transition-colors
          ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-muted-foreground/25'}
          ${error ? 'border-red-500' : ''}
        `}
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium text-center px-4">
                    {isUploading ? 'Procesando imagen...' : 'Arrastra una imagen o haz clic para seleccionar'}
                </p>
                <p className="text-xs text-muted-foreground text-center px-2">
                    PNG, JPG, WEBP (máx. 5MB) • Se comprimirá automáticamente
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {!hasCustomImage && (
                <p className="text-xs text-muted-foreground">
                    💡 La imagen se redimensionará y comprimirá automáticamente para optimizar el tamaño.
                </p>
            )}
        </div>
    );
}

