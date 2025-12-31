"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const routeNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/menu": "Gestión del Menú",
  "/admin/categories": "Categorías",
  "/admin/settings": "Configuración",
  "/admin/settings/contact": "Información de Contacto",
  "/admin/settings/branding": "Logo y Branding",
};

export function AdminHeader() {
  const pathname = usePathname();
  const pageName = routeNames[pathname] || "Admin";

  // Generate breadcrumbs
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = paths.map((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const name = routeNames[href] || path.charAt(0).toUpperCase() + path.slice(1);
    return { href, name };
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pageName}</h1>
        {breadcrumbs.length > 1 && (
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-orange-600 dark:text-orange-400 font-medium"
                      : ""
                  }
                >
                  {crumb.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

