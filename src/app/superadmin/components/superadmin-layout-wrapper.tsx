"use client";

import { SuperAdminSidebar } from "./superadmin-sidebar";

interface SuperAdminLayoutWrapperProps {
  children: React.ReactNode;
}

export function SuperAdminLayoutWrapper({ children }: SuperAdminLayoutWrapperProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

