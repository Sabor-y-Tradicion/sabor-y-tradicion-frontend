"use client";

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/tenant-context';
import { TenantSocialNetwork } from '@/types/tenant';

// Función para determinar si un color es claro u oscuro
function isColorLight(hexColor: string): boolean {
    // Eliminar # si existe
    const hex = hexColor.replace('#', '');

    // Convertir a RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calcular luminosidad (fórmula estándar)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
}

export function Footer() {
    const { tenant } = useTenant();

    // Datos del restaurante desde el tenant (sin valores predeterminados hardcodeados)
    const restaurantName = tenant?.name || 'Restaurante';
    const description = tenant?.settings?.description || '';
    const address = tenant?.settings?.location?.address || '';
    const phone = tenant?.settings?.phone || '';
    const email = tenant?.settings?.email || '';
    const socialNetworks: TenantSocialNetwork[] = tenant?.settings?.socialNetworks || [];
    const logoUrl = tenant?.settings?.logo;

    // Footer text siempre usa el nombre del restaurante dinámicamente
    const currentYear = new Date().getFullYear();
    const footerText = `© ${currentYear} ${restaurantName}. Todos los derechos reservados.`;

    // Obtener color secundario para determinar si el texto debe ser claro u oscuro
    const secondaryColor = tenant?.settings?.personalization?.secondaryColor || '#C4A484';
    const isLightBackground = isColorLight(secondaryColor);

    // Clases de texto basadas en el fondo
    const textClass = isLightBackground ? 'text-gray-800' : 'text-white';
    const textMutedClass = isLightBackground ? 'text-gray-600' : 'text-white/80';
    const hoverClass = isLightBackground ? 'hover:text-gray-900' : 'hover:text-white';
    const iconClass = isLightBackground ? 'text-gray-700' : 'text-white/90';
    const borderClass = isLightBackground ? 'border-gray-300' : 'border-white/20';

    // Función para renderizar el icono de la red social
    const renderSocialIcon = (name: string) => {
        switch (name) {
            case "instagram":
                return (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                );
            case "facebook":
                return (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                );
            case "x":
                return (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                );
            case "tiktok":
                return (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <footer className="bg-gradient-to-b from-secondary to-secondary/80 border-t">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo y descripción */}
                    <div className="flex flex-col items-center md:items-start lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <Logo useCustomLogo={true} logoUrl={logoUrl} />
                            <span className={`font-headline text-2xl font-bold ${textClass}`}>{restaurantName}</span>
                        </Link>
                        <p className={`text-center md:text-left mb-6 max-w-md leading-relaxed ${textMutedClass}`}>
                            {description}
                        </p>
                        <div className="flex items-center gap-3">
                            {socialNetworks && socialNetworks.map((network: TenantSocialNetwork) => (
                                <Button
                                    key={network.id}
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className={`${textMutedClass} ${hoverClass} hover:bg-black/10`}
                                >
                                    <a href={network.url} target="_blank" rel="noopener noreferrer" aria-label={network.name}>
                                        {renderSocialIcon(network.name)}
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className={`font-headline text-lg font-semibold mb-4 ${textClass}`}>Enlaces Rápidos</h3>
                        <nav className="flex flex-col gap-3 text-center md:text-left">
                            <Link href="/" className={`${textMutedClass} ${hoverClass} transition-colors`}>
                                Inicio
                            </Link>
                            <Link href="/about" className={`${textMutedClass} ${hoverClass} transition-colors`}>
                                Sobre Nosotros
                            </Link>
                            <Link href="/menu" className={`${textMutedClass} ${hoverClass} transition-colors`}>
                                Menú
                            </Link>
                            <Link href="/contact" className={`${textMutedClass} ${hoverClass} transition-colors`}>
                                Contacto
                            </Link>
                        </nav>
                    </div>

                    {/* Información de contacto */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className={`font-headline text-lg font-semibold mb-4 ${textClass}`}>Contacto</h3>
                        <div className="flex flex-col gap-3 text-center md:text-left">
                            {address && (
                                <div className={`flex items-center gap-2 ${textMutedClass}`}>
                                    <MapPin className={`h-4 w-4 ${iconClass} flex-shrink-0`} />
                                    <span className="text-sm">{address}</span>
                                </div>
                            )}
                            {phone && (
                                <div className={`flex items-center gap-2 ${textMutedClass}`}>
                                    <Phone className={`h-4 w-4 ${iconClass} flex-shrink-0`} />
                                    <span className="text-sm">{phone}</span>
                                </div>
                            )}
                            {email && (
                                <div className={`flex items-center gap-2 ${textMutedClass}`}>
                                    <Mail className={`h-4 w-4 ${iconClass} flex-shrink-0`} />
                                    <span className="text-sm">{email}</span>
                                </div>
                            )}
                            {!address && !phone && !email && (
                                <p className={`text-sm ${textMutedClass}`}>
                                    Configura la información de contacto en el panel de administración.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className={`mt-12 border-t ${borderClass} pt-8 text-center`}>
                    <p className={`text-sm ${textMutedClass}`}>
                        {footerText}
                    </p>
                </div>
            </div>
        </footer>
    );
}
