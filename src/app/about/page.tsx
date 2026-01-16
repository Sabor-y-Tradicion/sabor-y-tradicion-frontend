"use client";

import { useTenant } from '@/contexts/tenant-context';

export default function AboutPage() {
    const { tenant } = useTenant();

    // Obtener datos del aboutPage desde settings
    const aboutPage = tenant?.settings?.aboutPage;
    const headerData = aboutPage?.header || {};
    const historyData = aboutPage?.history || {};
    const philosophyData = aboutPage?.philosophy || {};
    const teamData = aboutPage?.team || {};

    return (
        <div className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                {(headerData.title || headerData.subtitle) && (
                    <header className="text-center mb-16">
                        {headerData.title && (
                            <h1 className="font-headline text-5xl font-bold md:text-6xl">
                                {headerData.title}
                            </h1>
                        )}
                        {headerData.subtitle && (
                            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
                                {headerData.subtitle}
                            </p>
                        )}
                    </header>
                )}

                {/* History Section */}
                {historyData.enabled && (historyData.image || historyData.title || historyData.content) && (
                    <section className="mt-16 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                        {historyData.image && (
                            <div className="relative h-96 w-full group overflow-hidden rounded-2xl">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl opacity-0 group-hover:opacity-75 blur transition-opacity duration-500"></div>
                                <div className="relative h-full w-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={historyData.image}
                                        alt={historyData.title || "Nuestra Historia"}
                                        className="w-full h-full rounded-2xl object-cover shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                                </div>
                            </div>
                        )}
                        <div className="space-y-4">
                            {historyData.title && (
                                <h2 className="font-headline text-4xl font-semibold">{historyData.title}</h2>
                            )}
                            {historyData.content && (
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {historyData.content}
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* Philosophy Section */}
                {philosophyData.enabled && (philosophyData.image || philosophyData.title || philosophyData.content) && (
                    <section className="mt-24 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                        <div className="space-y-4 md:order-2">
                            {philosophyData.title && (
                                <h2 className="font-headline text-4xl font-semibold">{philosophyData.title}</h2>
                            )}
                            {philosophyData.content && (
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {philosophyData.content}
                                </p>
                            )}
                        </div>
                        {philosophyData.image && (
                            <div className="relative h-96 w-full group overflow-hidden rounded-2xl md:order-1">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl opacity-0 group-hover:opacity-75 blur transition-opacity duration-500"></div>
                                <div className="relative h-full w-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={philosophyData.image}
                                        alt={philosophyData.title || "Nuestra Filosofía"}
                                        className="w-full h-full rounded-2xl object-cover shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Team Section */}
                {teamData.enabled && (teamData.image || teamData.title || teamData.content) && (
                    <section className="mt-24 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                        {teamData.image && (
                            <div className="relative h-96 w-full group overflow-hidden rounded-2xl">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl opacity-0 group-hover:opacity-75 blur transition-opacity duration-500"></div>
                                <div className="relative h-full w-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={teamData.image}
                                        alt={teamData.title || "Nuestro Equipo"}
                                        className="w-full h-full rounded-2xl object-cover shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                                </div>
                            </div>
                        )}
                        <div className="space-y-4">
                            {teamData.title && (
                                <h2 className="font-headline text-4xl font-semibold">{teamData.title}</h2>
                            )}
                            {teamData.content && (
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {teamData.content}
                                </p>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
