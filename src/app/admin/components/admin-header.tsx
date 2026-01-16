"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const routeNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/menu": "Platos",
  "/admin/menu/new": "Nuevo",
  "/admin/menu/subtags": "Subtags",
  "/admin/categories": "Categorías",
  "/admin/categories/new": "Nuevo",
  "/admin/settings": "Configuración",
  "/admin/settings/contact": "Información de Contacto",
  "/admin/settings/branding": "Logo y Branding",
  "/admin/users": "Usuarios",
  "/admin/users/new": "Nuevo",
};

export function AdminHeader() {
  const pathname = usePathname();

  // Detectar si estamos en una ruta de edición
  const isEditRoute = pathname?.includes("/edit");
  const isNewRoute = pathname?.endsWith("/new");

  // Determinar el nombre de la página
  let pageName = routeNames[pathname || ""];

  if (!pageName) {
    if (isEditRoute) {
      pageName = "Editar";
    } else if (isNewRoute) {
      pageName = "Nuevo";
    } else {
      pageName = "Admin";
    }
  }

  // Generate breadcrumbs
  const paths = pathname?.split("/").filter(Boolean) || [];
  const breadcrumbs = paths.map((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    let name = routeNames[href];

    // Si no hay nombre definido, usar lógica especial
    if (!name) {
      if (path === "new") {
        name = "Nuevo";
      } else if (path === "edit") {
        name = "Editar";
      } else {
        // Capitalizar primera letra
        name = path.charAt(0).toUpperCase() + path.slice(1);
      }
    }

    return { href, name };
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pageName}</h1>
        {breadcrumbs.length > 1 && (
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <div key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4" />}
                  {isLast ? (
                    // Último elemento: no clickeable, solo texto resaltado
                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                      {crumb.name}
                    </span>
                  ) : (
                    // Elementos anteriores: clickeables como enlaces
                    <Link
                      href={crumb.href}
                      className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer hover:underline"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}

