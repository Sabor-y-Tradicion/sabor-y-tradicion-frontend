"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BASE_DOMAIN } from "@/lib/constants";

interface CreateTenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Callback para recargar la lista
}

export function CreateTenantModal({ open, onOpenChange, onSuccess }: CreateTenantModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error al escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Auto-generar subdomain desde el nombre
    if (field === "name" && !formData.subdomain) {
      const slug = value
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, subdomain: slug }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del restaurante es requerido";
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = "El subdominio es requerido";
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = "Solo letras minúsculas, números y guiones";
    }

    if (!formData.adminName.trim()) {
      newErrors.adminName = "El nombre del administrador es requerido";
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = "Email inválido";
    }

    if (!formData.adminPassword) {
      newErrors.adminPassword = "La contraseña es requerida";
    } else if (formData.adminPassword.length < 8) {
      newErrors.adminPassword = "Mínimo 8 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Buscar el token del superadmin
      const token = localStorage.getItem('auth_token_superadmin');

      if (!token) {
        throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
      }

      // Llamar al API para crear el tenant
      const payload = {
        name: formData.name.trim(),
        subdomain: formData.subdomain.trim(),
        adminName: formData.adminName.trim(),
        adminEmail: formData.adminEmail.trim(),
        adminPassword: formData.adminPassword,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Mostrar detalles del error si existen
        if (data.details) {
          const detailsMessage = Object.entries(data.details)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
          throw new Error(`${data.error || 'Error al crear tenant'}\n${detailsMessage}`);
        }
        throw new Error(data.error || data.message || 'Error al crear tenant');
      }

      toast({
        title: "¡Tenant creado!",
        description: `${formData.name} ha sido creado exitosamente.`,
      });

      // Reset form
      setFormData({
        name: "",
        subdomain: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
      });
      setErrors({});

      // Llamar al callback para recargar la lista
      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error al crear tenant";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Crear Nuevo Tenant</DialogTitle>
          <DialogDescription className="text-slate-400">
            Registra un nuevo restaurante en el sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre del Restaurante */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-200">
              Nombre del Restaurante *
            </Label>
            <Input
              id="name"
              placeholder="Ej: Sabor y Tradición"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Subdominio */}
          <div className="space-y-2">
            <Label htmlFor="subdomain" className="text-slate-200">
              Subdominio *
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="subdomain"
                placeholder="sabor-y-tradicion"
                value={formData.subdomain}
                onChange={(e) => handleChange("subdomain", e.target.value)}
                className={`bg-slate-800 border-slate-600 text-white ${
                  errors.subdomain ? "border-red-500" : ""
                }`}
              />
              <span className="text-sm text-slate-400 whitespace-nowrap">
                .{BASE_DOMAIN}
              </span>
            </div>
            {errors.subdomain && (
              <p className="text-sm text-red-500">{errors.subdomain}</p>
            )}
            <p className="text-xs text-slate-500">
              Solo letras minúsculas, números y guiones
            </p>
          </div>

          {/* Nombre del Administrador */}
          <div className="space-y-2">
            <Label htmlFor="adminName" className="text-slate-200">
              Nombre del Administrador *
            </Label>
            <Input
              id="adminName"
              placeholder="Juan Pérez"
              value={formData.adminName}
              onChange={(e) => handleChange("adminName", e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${
                errors.adminName ? "border-red-500" : ""
              }`}
            />
            {errors.adminName && (
              <p className="text-sm text-red-500">{errors.adminName}</p>
            )}
          </div>

          {/* Email de Acceso */}
          <div className="space-y-2">
            <Label htmlFor="adminEmail" className="text-slate-200">
              Email de Acceso del Admin *
            </Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@restaurante.com"
              value={formData.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${
                errors.adminEmail ? "border-red-500" : ""
              }`}
            />
            {errors.adminEmail && (
              <p className="text-sm text-red-500">{errors.adminEmail}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="adminPassword" className="text-slate-200">
              Contraseña del Admin *
            </Label>
            <Input
              id="adminPassword"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.adminPassword}
              onChange={(e) => handleChange("adminPassword", e.target.value)}
              className={`bg-slate-800 border-slate-600 text-white ${
                errors.adminPassword ? "border-red-500" : ""
              }`}
            />
            {errors.adminPassword && (
              <p className="text-sm text-red-500">{errors.adminPassword}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Tenant"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

