"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/superadmin",
    icon: LayoutDashboard,
  },
  {
    name: "Tenants",
    href: "/superadmin/tenants",
    icon: Building2,
  },
  {
    name: "Logs",
    href: "/superadmin/logs",
    icon: FileText,
  },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/superadmin/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden bg-slate-800 text-white hover:bg-slate-700"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-slate-900 text-white transition-transform duration-300 md:relative md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-purple-400">
              SuperAdmin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info & Logout */}
        <div className="border-t border-slate-700 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">
                {user?.name || "SuperAdmin"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email || "superadmin@james.pe"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  );
}

