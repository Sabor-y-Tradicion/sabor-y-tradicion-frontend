"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Search, MoreVertical, Ban, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tenantsAPI, type Tenant } from '@/lib/api/tenants';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TenantsPage() {
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 10;

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; tenant: Tenant | null }>({
    open: false,
    tenant: null,
  });

  useEffect(() => {
    loadTenants();
  }, [search, statusFilter, page]);

  const loadTenants = async () => {
    try {
      setLoading(true);

      const response = await tenantsAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        limit,
        offset: page * limit,
      });

      if (response.success && response.data) {
        // El backend devuelve: { success, data: Tenant[], pagination }
        const tenantsData = Array.isArray(response.data) ? response.data : [];
        const totalCount = (response as any).pagination?.total || tenantsData.length;

        setTenants(tenantsData);
        setTotal(totalCount);
      } else {
        setTenants([]);
        setTotal(0);
      }
    } catch (error: any) {
      setTenants([]);
      setTotal(0);

      // Manejo específico de error 403
      if (error.response?.status === 403) {
        toast({
          variant: 'destructive',
          title: 'Acceso Denegado',
          description: 'Tu sesión expiró o no tienes permisos de SUPERADMIN. Por favor inicia sesión nuevamente.',
        });

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          window.location.href = '/superadmin/login';
        }, 2000);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.response?.data?.error || 'No se pudieron cargar los tenants',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (tenant: Tenant) => {
    try {
      await tenantsAPI.suspend(tenant.id);
      toast({
        title: 'Tenant suspendido',
        description: `${tenant.name} ha sido suspendido`,
      });
      loadTenants();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo suspender el tenant',
      });
    }
  };

  const handleActivate = async (tenant: Tenant) => {
    try {
      await tenantsAPI.activate(tenant.id);
      toast({
        title: 'Tenant activado',
        description: `${tenant.name} ha sido activado`,
      });
      loadTenants();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo activar el tenant',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.tenant) return;

    try {
      await tenantsAPI.delete(deleteDialog.tenant.id);
      toast({
        title: 'Tenant eliminado',
        description: `${deleteDialog.tenant.name} ha sido eliminado`,
      });
      setDeleteDialog({ open: false, tenant: null });
      loadTenants();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.error || 'No se pudo eliminar el tenant',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Activo</Badge>;
      case 'suspended':
        return <Badge className="bg-orange-600">Suspendido</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-600">Inactivo</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Tenants</h1>
          <p className="text-slate-400 mt-2">
            {total} {total === 1 ? 'restaurante registrado' : 'restaurantes registrados'}
          </p>
        </div>
        <Button
          onClick={loadTenants}
          className="bg-slate-700 hover:bg-slate-600 text-white"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nombre, slug o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
            <select
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="suspended">Suspendidos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-slate-400 mt-4">Cargando...</p>
            </div>
          ) : !tenants || tenants.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No se encontraron tenants
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Nombre</TableHead>
                    <TableHead className="text-slate-300">Dominio</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">Estado</TableHead>
                    <TableHead className="text-slate-300">Plan</TableHead>
                    <TableHead className="text-slate-300">Usuarios</TableHead>
                    <TableHead className="text-slate-300">Creado</TableHead>
                    <TableHead className="text-slate-300 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id} className="border-slate-700">
                      <TableCell className="font-medium text-white">{tenant.name}</TableCell>
                      <TableCell className="text-slate-300">
                        <a
                          href={`http://${tenant.domain}/admin/login`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                          title="Ir al panel de administración"
                        >
                          <code className="text-xs bg-slate-800 px-2 py-1 rounded">
                            {tenant.domain}
                          </code>
                        </a>
                      </TableCell>
                      <TableCell className="text-slate-300">{tenant.email}</TableCell>
                      <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                      <TableCell className="text-slate-300 capitalize">{tenant.plan}</TableCell>
                      <TableCell className="text-slate-300">
                        {tenant._count?.users || 0}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm">
                        {formatDistanceToNow(new Date(tenant.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            {tenant.status === 'active' ? (
                              <DropdownMenuItem
                                onClick={() => handleSuspend(tenant)}
                                className="text-orange-400"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspender
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleActivate(tenant)}
                                className="text-green-400"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog({ open: true, tenant })}
                              className="text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {total > limit && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400">
                    Mostrando {page * limit + 1} a {Math.min((page + 1) * limit, total)} de {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 0}
                      className="border-slate-600 text-slate-300"
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={(page + 1) * limit >= total}
                      className="border-slate-600 text-slate-300"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, tenant: null })}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar tenant?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              ¿Estás seguro de eliminar <strong>{deleteDialog.tenant?.name}</strong>?
              Esta acción no se puede deshacer y eliminará todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

