"use client";

import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";

type AuthContext = 'admin' | 'superadmin' | 'orders';

export default function SessionDebugPage() {
  const [sessions, setSessions] = useState<Array<{ context: AuthContext; user: User }>>([]);
  const [storageKeys, setStorageKeys] = useState<string[]>([]);

  const loadData = () => {
    setSessions(authAPI.getAllActiveSessions());

    // Obtener todas las claves de localStorage relacionadas con auth
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('auth_')) {
        keys.push(key);
      }
    }
    setStorageKeys(keys);
  };

  useEffect(() => {
    loadData();
  }, []);

  const clearAllSessions = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todas las sesiones?')) {
      localStorage.clear();
      loadData();
    }
  };

  const clearSession = (context: AuthContext) => {
    if (confirm(`¿Eliminar sesión de ${context}?`)) {
      authAPI.logout(context);
      loadData();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Debug de Sesiones Múltiples</h1>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={clearAllSessions} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar Todo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sesiones Activas ({sessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">No hay sesiones activas</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.context}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={session.context === 'superadmin' ? 'destructive' : 'default'}>
                        {session.context.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{session.user.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                    <p className="text-xs text-muted-foreground">Rol: {session.user.role}</p>
                  </div>
                  <Button
                    onClick={() => clearSession(session.context)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claves en localStorage ({storageKeys.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {storageKeys.length === 0 ? (
            <p className="text-muted-foreground">No hay claves de autenticación</p>
          ) : (
            <div className="space-y-2">
              {storageKeys.map((key) => {
                const value = localStorage.getItem(key);
                const isToken = key.includes('token');
                const displayValue = isToken
                  ? value?.substring(0, 20) + '...'
                  : value;

                return (
                  <div key={key} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">{key}</code>
                      {isToken && <Badge variant="secondary">Token</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      {displayValue}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Migración completada:</span>
            <Badge variant={localStorage.getItem('auth_migrated') ? 'default' : 'destructive'}>
              {localStorage.getItem('auth_migrated') ? 'Sí' : 'No'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">URL actual:</span>
            <code className="text-xs">{typeof window !== 'undefined' ? window.location.pathname : '/'}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total claves localStorage:</span>
            <span>{typeof window !== 'undefined' ? localStorage.length : 0}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

