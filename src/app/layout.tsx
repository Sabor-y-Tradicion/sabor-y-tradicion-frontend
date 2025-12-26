import type { Metadata } from 'next';
import './globals.css';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
    title: 'Sabor y Tradición - Restaurante Chachapoyana',
    description: 'Cocina tradicional chachapoyana en el corazón de Amazonas. Platos típicos, menú del día y opciones a la carta.',
    keywords: ['restaurante', 'Chachapoyas', 'comida chachapoyana', 'comida tradicional', 'Amazonas', 'Perú'],
    authors: [{ name: 'Sabor y Tradición' }],
    openGraph: {
        title: 'Sabor y Tradición - Restaurante Chachapoyana',
        description: 'Cocina tradicional chachapoyana en el corazón de Amazonas',
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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className="font-body antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster />
        </body>
        </html>
    );
}
