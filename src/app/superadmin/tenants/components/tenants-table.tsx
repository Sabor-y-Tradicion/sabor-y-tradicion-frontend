"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, MoreVertical, Eye, Edit, Ban, CheckCircle, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Tenant } from '@/types/tenant';

interface TenantsTableProps {
  tenants: Tenant[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onSuspend: (id: string) => Promise<void>;
  onActivate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export function TenantsTable({
  tenants,
  isLoading,
  pagination,
  onPageChange,
  onSuspend,
  onActivate,
  onDelete,
  onRefresh,
}: TenantsTableProps) {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; tenant: Tenant | null }>({
    open: false,
    tenant: null,
  });

  const handleSuspend = async (tenant: Tenant) => {
    try {
      setActionLoading(tenant.id);
      await onSuspend(tenant.id);
      toast({
        title: 'Tenant suspendido',
        description: `${tenant.name} ha sido suspendido exitosamente`,
      });
      onRefresh();
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo suspender el tenant',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (tenant: Tenant) => {
    try {
      setActionLoading(tenant.id);
      await onActivate(tenant.id);
      toast({
        title: 'Tenant activado',
        description: `${tenant.name} ha sido activado exitosamente`,
      });
      onRefresh();
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo activar el tenant',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialog.tenant) return;

    try {
      setActionLoading(deleteDialog.tenant.id);
      await onDelete(deleteDialog.tenant.id);
      toast({
        title: 'Tenant eliminado',
        description: `${deleteDialog.tenant.name} ha sido eliminado exitosamente`,
      });
      onRefresh();
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el tenant',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
      setDeleteDialog({ open: false, tenant: null });
    }
  };

  const getStatusBadge = (status: Tenant['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      suspended: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    };

    return (
      <Badge className={variants[status]} variant="outline">
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: Tenant['plan']) => {
    const variants = {
      free: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      premium: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      enterprise: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    };

    return (
      <Badge className={variants[plan]} variant="outline">
        {plan}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando tenants...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground mb-4">No se encontraron tenants</p>
          <Link href="/superadmin/tenants/new">
            <Button>Crear Primer Tenant</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Dominio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-muted-foreground">{tenant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{tenant.domain}</span>
                      <a
                        href={`http://${tenant.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell>{getPlanBadge(tenant.plan)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(tenant.createdAt).toLocaleDateString('es-PE')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={actionLoading === tenant.id}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/superadmin/tenants/${tenant.id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/superadmin/tenants/${tenant.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        {tenant.status === 'active' ? (
                          <DropdownMenuItem onClick={() => handleSuspend(tenant)}>
                            <Ban className="mr-2 h-4 w-4" />
                            Suspender
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleActivate(tenant)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ open: true, tenant })}
                          className="text-red-600"
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
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {tenants.length} de {pagination.total} tenants
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, tenant: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente{' '}
              <strong>{deleteDialog.tenant?.name}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

