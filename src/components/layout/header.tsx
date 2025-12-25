'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/about', label: 'Sobre Nosotros' },
    { href: '/menu', label: 'Menú' },
    { href: '/contact', label: 'Contacto' },
];

export function Header() {
    const pathname = usePathname();
    const [isSheetOpen, setSheetOpen] = useState(false);

    const NavLink = ({ href, label, isMobile = false }: { href: string; label: string; isMobile?: boolean }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={cn(
                    'text-lg font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-foreground/80',
                    isMobile ? 'py-4 text-center text-2xl' : ''
                )}
                onClick={() => setSheetOpen(false)}
            >
                {label}
            </Link>
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
                    <Logo useCustomLogo={true} className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold">Sabor y Tradición</span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <NavLink key={link.href} {...link} />
                    ))}
                </nav>

                <div className="md:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full bg-background p-0">
                            <div className="flex h-full flex-col">
                                <div className="flex h-20 items-center justify-between border-b px-6">
                                    <Link href="/" className="flex items-center gap-3" onClick={() => setSheetOpen(false)}>
                                        <Logo useCustomLogo={true} />
                                        <span className="font-headline text-2xl font-bold">Sabor y Tradición</span>
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={() => setSheetOpen(false)}>
                                        <X className="h-6 w-6" />
                                        <span className="sr-only">Cerrar menú</span>
                                    </Button>
                                </div>
                                <nav className="flex flex-col items-center justify-center gap-y-8 pt-12">
                                    {navLinks.map((link) => (
                                        <NavLink key={link.href} {...link} isMobile />
                                    ))}
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
