"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RefreshCw, AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logsAPI, type Log, type LogLevel } from '@/lib/api/logs';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function LogsPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  // Detail dialog
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; log: Log | null }>({
    open: false,
    log: null,
  });

  useEffect(() => {
    loadLogs();
  }, [levelFilter, page]);

  // Auto-refresh cada 10 segundos si está activado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadLogs();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, levelFilter, page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await logsAPI.getAll({
        level: levelFilter === 'all' ? undefined : levelFilter,
        limit,
        offset: page * limit,
      });

      if (response.success && response.data) {
        setLogs(response.data.data || []);
        setTotal(response.data.total || 0);
      } else {
        setLogs([]);
        setTotal(0);
      }
    } catch (error: any) {
      setLogs([]);
      setTotal(0);

      // Manejo específico de error 403
      if (error.response?.status === 403) {
        toast({
          variant: 'destructive',
          title: 'Acceso Denegado',
          description: 'Tu sesión expiró o no tienes permisos de SUPERADMIN. Redirigiendo al login...',
        });

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          localStorage.removeItem('auth_token_superadmin');
          window.location.href = '/superadmin/login';
        }, 2000);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los logs',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'info':
        return (
          <Badge className="bg-blue-600 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Info
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-600 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      case 'critical':
        return (
          <Badge className="bg-red-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Critical
          </Badge>
        );
      default:
        return <Badge>{level}</Badge>;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      // Tenants
      tenant_created: 'Tenant Creado',
      tenant_updated: 'Tenant Actualizado',
      tenant_suspended: 'Tenant Suspendido',
      tenant_activated: 'Tenant Activado',
      tenant_deleted: 'Tenant Eliminado',

      // Usuarios
      user_created: 'Usuario Creado',
      user_updated: 'Usuario Actualizado',
      user_deleted: 'Usuario Eliminado',

      // Autenticación
      login_success: 'Login Exitoso',
      login_failed: 'Login Fallido',
      logout: 'Logout',
      token_expired: 'Token Expirado',

      // Configuración
      settings_updated: 'Configuración Actualizada',
      theme_updated: 'Tema Actualizado',

      // Menú y Platos
      category_created: 'Categoría Creada',
      category_updated: 'Categoría Actualizada',
      category_deleted: 'Categoría Eliminada',
      dish_created: 'Plato Creado',
      dish_updated: 'Plato Actualizado',
      dish_deleted: 'Plato Eliminado',

      // Pedidos
      order_created: 'Pedido Creado',
      order_updated: 'Pedido Actualizado',
      order_status_changed: 'Estado de Pedido Cambiado',
      order_cancelled: 'Pedido Cancelado',

      // API
      api_error: 'Error de API',
      api_timeout: 'Timeout de API',
      database_error: 'Error de Base de Datos',
      validation_error: 'Error de Validación',

      // Sistema
      system_startup: 'Sistema Iniciado',
      system_shutdown: 'Sistema Detenido',
      migration_run: 'Migración Ejecutada',
      backup_created: 'Backup Creado',
    };
    return labels[action] || action;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Logs del Sistema</h1>
          <p className="text-slate-400 mt-2">
            {total} {total === 1 ? 'registro' : 'registros'}
            {autoRefresh && <span className="ml-2 text-green-400">● Auto-refresh activo</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant="outline"
            className={`${autoRefresh ? 'bg-green-600 border-green-600 text-white hover:bg-green-700 hover:text-white' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}`}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button
            onClick={loadLogs}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={levelFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLevelFilter('all')}
              className={levelFilter === 'all' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            >
              Todos
            </Button>
            <Button
              variant={levelFilter === 'info' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLevelFilter('info')}
              className={levelFilter === 'info' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            >
              <Info className="mr-1 h-3 w-3" />
              Info
            </Button>
            <Button
              variant={levelFilter === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLevelFilter('warning')}
              className={levelFilter === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            >
              <AlertTriangle className="mr-1 h-3 w-3" />
              Warning
            </Button>
            <Button
              variant={levelFilter === 'error' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLevelFilter('error')}
              className={levelFilter === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            >
              <XCircle className="mr-1 h-3 w-3" />
              Error
            </Button>
            <Button
              variant={levelFilter === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLevelFilter('critical')}
              className={levelFilter === 'critical' ? 'bg-red-800 hover:bg-red-900' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
            >
              <AlertCircle className="mr-1 h-3 w-3" />
              Critical
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-slate-400 mt-4">Cargando...</p>
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No se encontraron logs
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Nivel</TableHead>
                    <TableHead className="text-slate-300">Acción</TableHead>
                    <TableHead className="text-slate-300">Mensaje</TableHead>
                    <TableHead className="text-slate-300">Usuario</TableHead>
                    <TableHead className="text-slate-300">Tenant</TableHead>
                    <TableHead className="text-slate-300">Fecha</TableHead>
                    <TableHead className="text-slate-300 text-right">Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="border-slate-700">
                      <TableCell>{getLevelBadge(log.level)}</TableCell>
                      <TableCell className="text-slate-300">
                        <code className="text-xs bg-slate-800 px-2 py-1 rounded">
                          {getActionLabel(log.action)}
                        </code>
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-md truncate">
                        {log.message}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {log.userEmail ? (
                          <div>
                            <div className="font-medium">{log.user?.name || 'Usuario'}</div>
                            <div className="text-xs text-slate-500">{log.userEmail}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {log.tenantName ? (
                          <div className="text-sm">{log.tenantName}</div>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm">
                        <div>{format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm')}</div>
                        <div className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetailDialog({ open: true, log })}
                          className="text-slate-400"
                        >
                          Ver más
                        </Button>
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

      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} onOpenChange={(open) => setDetailDialog({ open, log: null })}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {detailDialog.log && getLevelBadge(detailDialog.log.level)}
              Detalles del Log
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Información completa del registro de actividad
            </DialogDescription>
          </DialogHeader>

          {detailDialog.log && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500">ID</p>
                  <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                    {detailDialog.log.id}
                  </code>
                </div>
                <div>
                  <p className="text-slate-500">Acción</p>
                  <p className="text-white">{getActionLabel(detailDialog.log.action)}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-500 mb-1">Mensaje</p>
                <p className="text-white bg-slate-800 p-3 rounded">{detailDialog.log.message}</p>
              </div>

              {detailDialog.log.userEmail && (
                <div>
                  <p className="text-slate-500 mb-1">Usuario</p>
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-white">{detailDialog.log.user?.name || 'Usuario'}</p>
                    <p className="text-slate-400 text-xs">{detailDialog.log.userEmail}</p>
                  </div>
                </div>
              )}

              {detailDialog.log.tenantName && (
                <div>
                  <p className="text-slate-500 mb-1">Tenant</p>
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-white">{detailDialog.log.tenantName}</p>
                    <p className="text-slate-400 text-xs">{detailDialog.log.tenant?.slug}</p>
                  </div>
                </div>
              )}

              {detailDialog.log.ipAddress && (
                <div>
                  <p className="text-slate-500">IP Address</p>
                  <p className="text-slate-300">{detailDialog.log.ipAddress}</p>
                </div>
              )}

              {detailDialog.log.userAgent && (
                <div>
                  <p className="text-slate-500 mb-1">User Agent</p>
                  <p className="text-slate-300 text-xs bg-slate-800 p-2 rounded break-all">
                    {detailDialog.log.userAgent}
                  </p>
                </div>
              )}

              {detailDialog.log.details && Object.keys(detailDialog.log.details).length > 0 && (
                <div>
                  <p className="text-slate-500 mb-1">Detalles Adicionales</p>
                  <pre className="text-xs bg-slate-800 p-3 rounded overflow-auto max-h-40 text-slate-300">
                    {JSON.stringify(detailDialog.log.details, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <p className="text-slate-500">Fecha y Hora</p>
                <p className="text-white">
                  {format(new Date(detailDialog.log.createdAt), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es })}
                </p>
                <p className="text-slate-400 text-xs">
                  ({formatDistanceToNow(new Date(detailDialog.log.createdAt), { addSuffix: true, locale: es })})
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

