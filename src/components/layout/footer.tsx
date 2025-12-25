import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';

export function Footer() {
    return (
        <footer className="bg-gradient-to-b from-secondary to-secondary/80 border-t">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo y descripción */}
                    <div className="flex flex-col items-center md:items-start lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <Logo useCustomLogo={true} />
                            <span className="font-headline text-2xl font-bold">Sabor y Tradición</span>
                        </Link>
                        <p className="text-center md:text-left text-muted-foreground mb-6 max-w-md leading-relaxed">
                            Cocina auténtica peruana en el corazón de Chachapoyas. Celebramos los sabores de nuestra tierra con pasión y creatividad.
                        </p>
                        <div className="flex items-center gap-3">
                            <Button asChild variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <Instagram className="h-5 w-5" />
                                </a>
                            </Button>
                            <Button asChild variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            </Button>
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
                                <span className="text-sm">Jr Bolivia 715, Chachapoyas</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm">(+51) 941 234 567</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm">contacto@saborytradicion.pe</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Sabor y Tradición. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
