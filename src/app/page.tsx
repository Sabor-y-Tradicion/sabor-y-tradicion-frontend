import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function findImage(id: string) {
    return PlaceHolderImages.find((img) => img.id === id)!;
}

export default function HomePage() {
    const heroImage = findImage('landing-hero');
    const feature1 = findImage('culinary-highlight-1');
    const feature2 = findImage('culinary-highlight-2');
    const feature3 = findImage('culinary-highlight-3');
    const restaurantImage = findImage('about-restaurant');

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[600px] md:h-[700px] overflow-hidden">
                {/* Imagen con animación Ken Burns */}
                <div className="absolute inset-0">
                    <Image
                        src={heroImage.imageUrl}
                        alt="Interior del restaurante Sabor y Tradición"
                        fill
                        className="object-cover brightness-50 animate-ken-burns"
                        priority
                        data-ai-hint={heroImage.imageHint}
                    />
                </div>

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
                            Sabor y Tradición
                        </h1>
                        <p className="mt-6 text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 leading-relaxed drop-shadow-lg">
                            Cocina tradicional chachapoyana en el corazón de Amazonas.
                        </p>
                        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110 animate-pulse-subtle">
                                <Link href="/menu">Ver Nuestro Menú</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gradient-to-b from-secondary via-secondary/80 to-background py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <h2 className="mb-4 text-center font-headline text-4xl font-bold md:text-5xl lg:text-6xl">
                        El Corazón de Nuestra Cocina
                    </h2>
                    <p className="mx-auto mb-16 max-w-2xl text-center text-lg md:text-xl text-muted-foreground">
                        Descubre lo que nos hace especiales.
                    </p>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
                        {/* Card 1 */}
                        <div className="group flex flex-col items-center text-center relative">
                            {/* Borde animado con gradiente */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>

                            <div className="relative mb-6 h-72 w-full overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3">
                                <Image
                                    src={feature1.imageUrl}
                                    alt="Ingredientes Frescos"
                                    fill
                                    className="rounded-3xl object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    data-ai-hint={feature1.imageHint}
                                />
                                {/* Overlay que aparece en hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Efecto de brillo que se mueve */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500 ease-out"></div>
                                </div>
                            </div>
                            <h3 className="mb-3 font-headline text-2xl md:text-3xl font-semibold transition-all duration-300 group-hover:text-primary group-hover:scale-105">
                                Ingredientes Frescos
                            </h3>
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm">
                                Seleccionamos los mejores productos locales para garantizar frescura y sabor en cada plato.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group flex flex-col items-center text-center relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>

                            <div className="relative mb-6 h-72 w-full overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3">
                                <Image
                                    src={feature2.imageUrl}
                                    alt="Hecho con Pasión"
                                    fill
                                    className="rounded-3xl object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    data-ai-hint={feature2.imageHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500 ease-out"></div>
                                </div>
                            </div>
                            <h3 className="mb-3 font-headline text-2xl md:text-3xl font-semibold transition-all duration-300 group-hover:text-primary group-hover:scale-105">
                                Hecho con Pasión
                            </h3>
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm">
                                Nuestra cocina combina técnicas tradicionales con un toque moderno, todo preparado con amor.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group flex flex-col items-center text-center relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>

                            <div className="relative mb-6 h-72 w-full overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3">
                                <Image
                                    src={feature3.imageUrl}
                                    alt="Ambiente Acogedor"
                                    fill
                                    className="rounded-3xl object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    data-ai-hint={feature3.imageHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500 ease-out"></div>
                                </div>
                            </div>
                            <h3 className="mb-3 font-headline text-2xl md:text-3xl font-semibold transition-all duration-300 group-hover:text-primary group-hover:scale-105">
                                Sabor Chachapoyana
                            </h3>
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm">
                                Vive la auténtica experiencia gastronómica de Chachapoyas en cada bocado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 md:py-32 bg-background relative overflow-hidden">
                {/* Elemento decorativo de fondo */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 items-center gap-12 lg:gap-16 md:grid-cols-2">
                        <div className="relative h-[400px] w-full md:h-[550px] group overflow-hidden rounded-2xl">
                            {/* Borde brillante animado */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl opacity-0 group-hover:opacity-75 blur transition-opacity duration-500"></div>

                            <div className="relative h-full w-full">
                                <Image
                                    src={restaurantImage.imageUrl}
                                    alt="El restaurante Sabor y Tradición"
                                    fill
                                    className="rounded-2xl object-cover shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                                    data-ai-hint={restaurantImage.imageHint}
                                />

                                {/* Efecto de brillo que se mueve */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                                </div>

                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="inline-block animate-in fade-in slide-in-from-left-4 duration-700">
                                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Nuestra Esencia</span>
                            </div>
                            <h2 className="font-headline text-4xl font-bold md:text-5xl lg:text-6xl leading-tight animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                                Nuestra Historia
                            </h2>
                            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                                Sabor y Tradición nació en Chachapoyas, Amazonas, con la misión de preservar y compartir la rica gastronomía tradicional de nuestra región. Fundado por chachapoyanos apasionados por las recetas ancestrales, nuestro restaurante mantiene vivas las preparaciones que nos heredaron nuestros abuelos.
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                                Cada plato representa la identidad cultural de Chachapoyas, preparado con ingredientes locales de nuestra región amazónica y siguiendo técnicas tradicionales que han pasado de generación en generación.
                            </p>
                            <div className="pt-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-400">
                                <Button asChild variant="outline" size="lg" className="group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                    <Link href="/about">
                                        Conoce más sobre nosotros
                                        <span className="inline-block transition-transform group-hover/btn:translate-x-1 ml-1">→</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
