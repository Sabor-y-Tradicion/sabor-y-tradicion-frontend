"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTenantManagement } from '@/hooks/use-tenant-management';
import { BASE_DOMAIN } from '@/lib/constants';
import type { TenantPlan } from '@/types/tenant';

export default function NewTenantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createTenant } = useTenantManagement({ autoLoad: false });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Tenant Info
    name: '',
    slug: '',
    email: '',
    plan: 'free' as TenantPlan,

    // Admin User
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',

    // Optional Settings
    primaryColor: '#ff6b35',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-generate slug from name
    if (field === 'name' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Tenant validations
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.slug.trim()) newErrors.slug = 'El slug es requerido';
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Solo letras minúsculas, números y guiones';
    }
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Admin validations
    if (!formData.adminName.trim()) newErrors.adminName = 'El nombre del admin es requerido';
    if (!formData.adminEmail.trim()) newErrors.adminEmail = 'El email del admin es requerido';
    if (formData.adminEmail && !/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Email inválido';
    }
    if (!formData.adminPassword) newErrors.adminPassword = 'La contraseña es requerida';
    if (formData.adminPassword && formData.adminPassword.length < 8) {
      newErrors.adminPassword = 'Mínimo 8 caracteres';
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor corrige los errores en el formulario',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newTenant = await createTenant({
        name: formData.name,
        slug: formData.slug,
        email: formData.email,
        plan: formData.plan,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        settings: {
          colors: {
            primary: formData.primaryColor,
            secondary: '#f7931e',
            accent: '#c1121f',
          },
          phone: formData.phone,
          location: {
            address: formData.address,
          },
        },
      });

      toast({
        title: '¡Tenant creado!',
        description: `${newTenant.name} ha sido creado exitosamente`,
      });

      router.push('/superadmin/tenants');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al crear tenant';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/superadmin/tenants">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Crear Nuevo Tenant</h1>
          <p className="text-muted-foreground mt-2">
            Registra un nuevo restaurante en la plataforma
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Restaurante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información del Restaurante
            </CardTitle>
            <CardDescription>
              Datos básicos del nuevo tenant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Restaurante *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Sabor y Tradición"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug (URL) *
                  <span className="text-xs text-muted-foreground ml-2">
                    {formData.slug ? `${formData.slug}.${BASE_DOMAIN}` : 'ej: tu restaurante'}
                  </span>
                </Label>
                <Input
                  id="slug"
                  placeholder="sabor-y-tradicion"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email de Contacto *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@restaurante.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => handleChange('plan', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  placeholder="+51 941 234 567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección (opcional)</Label>
                <Input
                  id="address"
                  placeholder="Jr Bolivia 715, Chachapoyas"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">Color Primario</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  placeholder="#ff6b35"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usuario Administrador */}
        <Card>
          <CardHeader>
            <CardTitle>Usuario Administrador</CardTitle>
            <CardDescription>
              Se creará un usuario ADMIN para gestionar este tenant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adminName">Nombre Completo *</Label>
                <Input
                  id="adminName"
                  placeholder="Juan Pérez"
                  value={formData.adminName}
                  onChange={(e) => handleChange('adminName', e.target.value)}
                  className={errors.adminName ? 'border-red-500' : ''}
                />
                {errors.adminName && (
                  <p className="text-sm text-red-500">{errors.adminName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@restaurante.com"
                  value={formData.adminEmail}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                  className={errors.adminEmail ? 'border-red-500' : ''}
                />
                {errors.adminEmail && (
                  <p className="text-sm text-red-500">{errors.adminEmail}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Contraseña *</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.adminPassword}
                  onChange={(e) => handleChange('adminPassword', e.target.value)}
                  className={errors.adminPassword ? 'border-red-500' : ''}
                />
                {errors.adminPassword && (
                  <p className="text-sm text-red-500">{errors.adminPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite la contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 El administrador recibirá un email con sus credenciales de acceso al completar el registro.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/superadmin/tenants">
            <Button variant="outline" type="button" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Tenant'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

