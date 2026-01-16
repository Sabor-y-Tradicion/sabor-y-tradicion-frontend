"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useTenant } from "@/contexts/tenant-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);

      // Verificar que NO sea SUPERADMIN (debe usar /superadmin/login)
      if (user.role === "SUPERADMIN") {
        toast({
          variant: "destructive",
          title: "Acceso Denegado",
          description: "Use el login de SuperAdmin para acceder al panel de control del sistema.",
        });
        return;
      }

      toast({
        title: "Bienvenido",
        description: `Hola ${user.name}`,
      });

      // Redirigir según el rol
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "ORDERS_MANAGER") {
        router.push("/orders");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Credenciales inválidas";
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras carga el tenant
  if (tenantLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  // Obtener el logo del tenant o usar el por defecto
  const logoUrl = tenant?.settings?.logo || "/images/logo/logo.png";
  const restaurantName = tenant?.name || "Restaurante";
  const isBase64Logo = logoUrl.startsWith('data:');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20 overflow-hidden">
            <Image
              src={logoUrl}
              alt={restaurantName}
              width={60}
              height={60}
              className="object-contain"
              unoptimized={isBase64Logo}
            />
          </div>
          <CardTitle className="text-2xl font-bold">
            {restaurantName}
          </CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Volver al menú
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

