import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { AdminLayoutWrapper } from "./components/admin-layout-wrapper";

export const metadata = {
  title: "Admin - Sabor y Tradición",
  description: "Panel de administración del restaurante",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
      <Toaster />
    </AuthProvider>
  );
}
