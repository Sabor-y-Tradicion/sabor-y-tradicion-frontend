"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Users, ShoppingBag, TrendingUp, Globe, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { tenantsAPI } from '@/lib/api/tenants';
import type { Tenant, TenantStats } from '@/types/tenant';

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTenantData();
  }, [id]);

  const loadTenantData = async () => {
    try {
      setIsLoading(true);
      const [tenantData, statsData] = await Promise.all([
        tenantsAPI.getById(id),
        tenantsAPI.getStats(id),
      ]);
      setTenant(tenantData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar tenant:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la información del tenant',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!tenant) return;

    try {
      await tenantsAPI.suspend(id);
      toast({
        title: 'Tenant suspendido',
        description: `${tenant.name} ha sido suspendido`,
      });
      loadTenantData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo suspender el tenant',
        variant: 'destructive',
      });
    }
  };

  const handleActivate = async () => {
    if (!tenant) return;

    try {
      await tenantsAPI.activate(id);
      toast({
        title: 'Tenant activado',
        description: `${tenant.name} ha sido activado`,
      });
      loadTenantData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo activar el tenant',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!tenant) return;

    try {
      setIsDeleting(true);
      await tenantsAPI.delete(id);
      toast({
        title: 'Tenant eliminado',
        description: `${tenant.name} ha sido eliminado permanentemente`,
      });
      router.push('/superadmin/tenants');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el tenant',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialog(false);
    }
  };

  const handleVerifyDomain = async () => {
    try {
      const result = await tenantsAPI.verifyDomain(id);
      toast({
        title: result.verified ? 'Dominio verificado' : 'Verificación fallida',
        description: result.message,
        variant: result.verified ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo verificar el dominio',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tenant...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Tenant no encontrado</p>
        <Link href="/superadmin/tenants">
          <Button variant="outline" className="mt-4">Volver a Tenants</Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = () => {
    const variants = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      suspended: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    };

    return (
      <Badge className={variants[tenant.status]} variant="outline">
        {tenant.status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/superadmin/tenants">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{tenant.name}</h1>
              {getStatusBadge()}
            </div>
            <p className="text-muted-foreground mt-2">{tenant.domain}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/superadmin/tenants/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>

          {tenant.status === 'active' ? (
            <Button variant="outline" onClick={handleSuspend}>
              Suspender
            </Button>
          ) : (
            <Button variant="outline" onClick={handleActivate}>
              Activar
            </Button>
          )}

          <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.ordersThisMonth || 0} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {stats?.totalRevenue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              S/ {stats?.revenueThisMonth?.toFixed(2) || '0.00'} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Usuarios activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDishes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeCategories || 0} categorías
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="domain">Dominio</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="text-sm">{tenant.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Slug</p>
                  <p className="text-sm">{tenant.slug}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{tenant.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plan</p>
                  <p className="text-sm capitalize">{tenant.plan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Creado</p>
                  <p className="text-sm">
                    {new Date(tenant.createdAt).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última actualización</p>
                  <p className="text-sm">
                    {new Date(tenant.updatedAt).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Tenant</CardTitle>
              <CardDescription>
                Configuración personalizada del restaurante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(tenant.settings, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuración de Dominio
              </CardTitle>
              <CardDescription>
                Gestiona los dominios asociados a este tenant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Dominio Principal
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {tenant.domain}
                  </code>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>

              {tenant.customDomain && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Dominio Personalizado
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {tenant.customDomain}
                    </code>
                    <Button variant="outline" size="sm" onClick={handleVerifyDomain}>
                      Verificar DNS
                    </Button>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  💡 Para configurar un dominio personalizado, el tenant debe crear un registro CNAME
                  apuntando a <code>james.pe</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente <strong>{tenant.name}</strong>
              {' '}y todos sus datos asociados incluyendo usuarios, platos, categorías y pedidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar permanentemente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

