"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';

interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

interface SocialMedia {
  whatsapp: string;
  socialNetworks?: Array<{
    id: string;
    name: string;
    url: string;
    icon: string;
  }>;
}

export function Footer() {
    const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
        name: "",
        description: "",
        address: "",
        phone: "",
        email: "",
    });

    const [socialMedia, setSocialMedia] = useState<SocialMedia>({
        whatsapp: "",
        socialNetworks: [],
    });

    useEffect(() => {
        const savedRestaurantInfo = localStorage.getItem("restaurant_info");
        const savedSocialMedia = localStorage.getItem("social_media");

        if (savedRestaurantInfo) {
            try {
                const parsed = JSON.parse(savedRestaurantInfo);
                setRestaurantInfo(parsed);
            } catch {
                // Ignore parsing errors
            }
        }

        if (savedSocialMedia) {
            try {
                const parsed = JSON.parse(savedSocialMedia);
                setSocialMedia(parsed);
            } catch {
                // Ignore parsing errors
            }
        }
    }, []);

    // Función para renderizar el icono de la red social
    const renderSocialIcon = (name: string) => {
        switch (name) {
            case "instagram":
                return <Instagram className="h-5 w-5" />;
            case "facebook":
                return <Facebook className="h-5 w-5" />;
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
                            <Logo useCustomLogo={true} />
                            <span className="font-headline text-2xl font-bold">{restaurantInfo.name}</span>
                        </Link>
                        <p className="text-center md:text-left text-muted-foreground mb-6 max-w-md leading-relaxed">
                            {restaurantInfo.description}
                        </p>
                        <div className="flex items-center gap-3">
                            {socialMedia.socialNetworks && socialMedia.socialNetworks.map((network) => (
                                <Button
                                    key={network.id}
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-primary hover:bg-primary/10"
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
                        <h3 className="font-headline text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                        <nav className="flex flex-col gap-3 text-center md:text-left">
                            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                Inicio
                            </Link>
                            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                Sobre Nosotros
                            </Link>
                            <Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                                Menú
                            </Link>
                            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                Contacto
                            </Link>
                        </nav>
                    </div>

                    {/* Información de contacto */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-headline text-lg font-semibold mb-4">Contacto</h3>
                        <div className="flex flex-col gap-3 text-center md:text-left">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm">{restaurantInfo.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm">{restaurantInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm">{restaurantInfo.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} {restaurantInfo.name}. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
