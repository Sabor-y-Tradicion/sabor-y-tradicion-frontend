"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, AlertCircle, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { CreateTenantModal } from './components/create-tenant-modal';
import { superadminAPI, type DashboardStats } from '@/lib/api/superadmin';
import { useToast } from '@/hooks/use-toast';

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    tenantStats: {
      totalTenants: 0,
      activeTenants: 0,
      suspendedTenants: 0,
      newTenantsThisMonth: 0,
    },
    recentTenants: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);

      const response = await superadminAPI.getDashboard();

      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error al cargar dashboard:', error);

      // Manejo específico de error 403/401
      if (error.response?.status === 403 || error.response?.status === 401) {
        toast({
          variant: 'destructive',
          title: 'Acceso Denegado',
          description: 'Tu sesión expiró. Redirigiendo al login...',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo cargar el dashboard',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard SuperAdmin</h1>
          <p className="text-slate-400 mt-2">
            Vista general del sistema multitenant
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadDashboard}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear Tenant
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Tenants
            </CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.tenantStats.totalTenants}
            </div>
            <p className="text-xs text-slate-400">
              Restaurantes registrados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Activos
            </CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {stats.tenantStats.activeTenants}
            </div>
            <p className="text-xs text-slate-400">
              Tenants operando
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Suspendidos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {stats.tenantStats.suspendedTenants}
            </div>
            <p className="text-xs text-slate-400">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Nuevos Este Mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {stats.tenantStats.newTenantsThisMonth}
            </div>
            <p className="text-xs text-slate-400">
              Registros recientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Recientes */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Tenants Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-slate-400 mt-4">Cargando...</p>
            </div>
          ) : stats.recentTenants.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No hay tenants registrados
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentTenants.map((tenant: any) => (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700"
                >
                  <div>
                    <h3 className="font-semibold text-white">{tenant.name}</h3>
                    <a
                      href={`http://${tenant.domain}/admin/login`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                    >
                      {tenant.domain}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        tenant.status === 'active'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-orange-900/50 text-orange-400'
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Crear Tenant */}
      <CreateTenantModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={loadDashboard}
      />
    </div>
  );
}

