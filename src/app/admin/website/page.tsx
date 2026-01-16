"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, ArrowRight, Eye, Settings2 } from "lucide-react";
import Link from "next/link";
import { useTenant } from "@/contexts/tenant-context";

export default function WebsiteDashboardPage() {
  const { tenant } = useTenant();

  const pages = [
    {
      title: "Página de Inicio",
      description: "Edita el banner principal, carrusel de características y sección de historia",
      icon: Home,
      href: "/admin/website/home",
      color: "bg-blue-500",
      sections: ["Hero/Banner", "Carrusel de Features", "Nuestra Historia"],
    },
    {
      title: "Sobre Nosotros",
      description: "Personaliza la página de información del restaurante",
      icon: Users,
      href: "/admin/website/about",
      color: "bg-green-500",
      sections: ["Encabezado", "Historia", "Filosofía", "Equipo"],
    },
  ];

  // Generar URL de la página web
  const getWebsiteUrl = () => {
    if (typeof window === "undefined") return "";
    const domain = tenant?.domain || window.location.host;
    const protocol = window.location.protocol;
    return `${protocol}//${domain}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editor de Página Web
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Personaliza el contenido de tu sitio web
          </p>
        </div>
        <Button asChild variant="outline">
          <a href={getWebsiteUrl()} target="_blank" rel="noopener noreferrer">
            <Eye className="w-4 h-4 mr-2" />
            Ver Sitio Web
          </a>
        </Button>
      </div>

      {/* Cards de páginas */}
      <div className="grid gap-6 md:grid-cols-2">
        {pages.map((page) => (
          <Card key={page.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${page.color}`}>
                  <page.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secciones editables:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {page.sections.map((section) => (
                      <span
                        key={section}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={page.href}>
                    Editar Página
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Información
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-medium text-blue-700 dark:text-blue-300">Vista Previa</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Todos los cambios se muestran en tiempo real antes de guardar
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <h3 className="font-medium text-green-700 dark:text-green-300">Imágenes</h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Sube tus propias imágenes para personalizar cada sección
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <h3 className="font-medium text-purple-700 dark:text-purple-300">Carrusel</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Agrega tantas imágenes como desees al carrusel de características
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

