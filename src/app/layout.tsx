import type { Metadata } from 'next';
import './globals.css';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { AuthProvider } from '@/contexts/auth-context';
import { TenantProvider } from '@/contexts/tenant-context';
import { TenantThemeProvider } from '@/contexts/tenant-theme-context';
import { Toaster } from '@/components/ui/toaster';
import { TenantHead } from '@/components/tenant-head';

// Importar herramientas de debug en desarrollo
if (process.env.NODE_ENV === 'development') {
    import('@/lib/debug-sessions');
}

export const metadata: Metadata = {
    title: 'Restaurante - Menú Digital',
    description: 'Menú digital de restaurante. Descubre nuestros platos y realiza tu pedido.',
    keywords: ['restaurante', 'menú digital', 'comida', 'pedidos online'],
    authors: [{ name: 'Sistema de Restaurantes' }],
    openGraph: {
        title: 'Restaurante - Menú Digital',
        description: 'Menú digital de restaurante',
        type: 'website',
        locale: 'es_PE',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        <head>
            <meta name="ethereum-provider-detection" content="disabled" />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        // Prevenir inyección de MetaMask y otras wallets Web3
                        if (typeof window !== 'undefined') {
                            Object.defineProperty(window, 'ethereum', {
                                value: undefined,
                                writable: false,
                                configurable: false
                            });
                            Object.defineProperty(window, 'web3', {
                                value: undefined,
                                writable: false,
                                configurable: false
                            });
                        }
                    `,
                }}
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className="font-body antialiased">
        <AuthProvider>
            <TenantProvider>
                <TenantThemeProvider>
                    <TenantHead />
                    <LayoutWrapper>{children}</LayoutWrapper>
                    <Toaster />
                </TenantThemeProvider>
            </TenantProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
