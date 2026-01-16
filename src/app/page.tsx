"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/tenant-context';
import type { FeatureItem } from '@/types/tenant';

export default function HomePage() {
    const { tenant } = useTenant();

    // Obtener datos del webContent
    const webContent = tenant?.webContent;
    const heroData = webContent?.home?.hero || {};
    const features = webContent?.home?.features || [];
    const ctaSection = webContent?.home?.ctaSection || {};

    return (
        <div>
            {/* Hero Section */}
            {heroData.title && (
                <section className="relative h-[600px] md:h-[700px] overflow-hidden">
                    {/* Imagen de fondo */}
                    {heroData.backgroundImage && (
                        <div className="absolute inset-0">
                            <Image
                                src={heroData.backgroundImage}
                                alt={heroData.title}
                                fill
                                className="object-cover brightness-50 animate-ken-burns"
                                priority
                            />
                        </div>
                    )}

                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

                    {/* Partículas flotantes */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float-slow"></div>
                        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-float-delayed"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float"></div>
                        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white rounded-full animate-float-slow"></div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="container mx-auto px-4 text-center text-white">
                            <h1 className="font-headline text-5xl font-bold md:text-7xl lg:text-8xl animate-in fade-in slide-in-from-bottom-4 duration-1000 drop-shadow-2xl">
                                {heroData.title}
                            </h1>
                            {heroData.subtitle && (
                                <p className="mt-6 text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 leading-relaxed drop-shadow-lg">
                                    {heroData.subtitle}
                                </p>
                            )}
                            {heroData.ctaText && (
                                <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                                    <Button asChild size="lg" className="text-lg px-8 py-6 shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110 animate-pulse-subtle">
                                        <Link href={heroData.ctaLink || "/menu"}>{heroData.ctaText}</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            {features && features.length > 0 && (
                <section className="bg-gradient-to-b from-secondary via-secondary/80 to-background py-20 md:py-32">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                            {features.sort((a: FeatureItem, b: FeatureItem) => a.order - b.order).map((feature: FeatureItem) => (
                                <div key={feature.id} className="group flex flex-col items-center text-center relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>

                                    {feature.image && (
                                        <div className="relative mb-6 h-72 w-full overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3">
                                            <Image
                                                src={feature.image}
                                                alt={feature.title || "Feature"}
                                                fill
                                                className="rounded-3xl object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500 ease-out"></div>
                                            </div>
                                        </div>
                                    )}

                                    {feature.title && (
                                        <h3 className="mb-3 font-headline text-2xl md:text-3xl font-semibold transition-all duration-300 group-hover:text-primary group-hover:scale-105">
                                            {feature.title}
                                        </h3>
                                    )}

                                    {feature.description && (
                                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm">
                                            {feature.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            {ctaSection.title && (
                <section className="py-20 md:py-32 bg-background relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <h2 className="font-headline text-4xl font-bold md:text-5xl lg:text-6xl leading-tight">
                                {ctaSection.title}
                            </h2>
                            {ctaSection.description && (
                                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                                    {ctaSection.description}
                                </p>
                            )}
                            {ctaSection.buttonText && (
                                <div className="pt-4">
                                    <Button asChild size="lg" className="text-lg px-8 py-6">
                                        <Link href={ctaSection.buttonLink || "/menu"}>
                                            {ctaSection.buttonText}
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
