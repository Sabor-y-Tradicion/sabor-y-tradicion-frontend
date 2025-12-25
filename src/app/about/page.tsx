import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function findImage(id: string) {
    return PlaceHolderImages.find((img) => img.id === id)!;
}

export default function AboutPage() {
    const restaurantImage = findImage('about-restaurant');
    const teamImage = findImage('about-team');

    return (
        <div className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <header className="text-center">
                    <h1 className="font-headline text-5xl font-bold md:text-6xl">Nuestra Esencia</h1>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                        Sabor auténtico de Chachapoyas, tradición en cada plato. Somos un restaurante dedicado a preservar y compartir la riqueza gastronómica de nuestra tierra amazonense.
                    </p>
                </header>

                <section className="mt-16 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                    <div className="relative h-96 w-full">
                        <Image
                            src={restaurantImage.imageUrl}
                            alt="Interior del restaurante Sabor y Tradición"
                            fill
                            className="rounded-lg object-cover shadow-xl"
                            data-ai-hint={restaurantImage.imageHint}
                        />
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-headline text-4xl font-semibold">Nuestra Historia</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            Sabor y Tradición nació en el corazón de Chachapoyas, Amazonas, con la misión de rescatar y celebrar la gastronomía tradicional de nuestra región. Fundado por chachapoyanos apasionados por las recetas ancestrales y los ingredientes locales de nuestra tierra, nuestro restaurante es el resultado de años preservando los sabores auténticos que nos heredaron nuestros abuelos.
                        </p>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            Cada plato cuenta la historia de Chachapoyas, preparado con técnicas tradicionales y los mejores productos de nuestra región amazónica, desde las carnes hasta las verduras y tubérculos locales.
                        </p>
                    </div>
                </section>

                <section className="mt-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="font-headline text-4xl font-semibold">Nuestra Filosofía</h2>
                        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                            Nos especializamos en comida típica chachapoyana, manteniendo vivas las recetas tradicionales que definen nuestra identidad cultural. También ofrecemos platos a la carta que complementan nuestra oferta, siempre respetando la esencia de nuestra cocina regional. Trabajamos con productores locales de Amazonas para garantizar ingredientes frescos y auténticos en cada preparación. Nuestra cocina es un homenaje a Chachapoyas y su herencia culinaria.
                        </p>
                    </div>
                </section>

                <section className="mt-24 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                    <div className="space-y-4 md:order-2">
                        <h2 className="font-headline text-4xl font-semibold">Conoce al Equipo</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            Nuestro equipo está conformado por chachapoyanos orgullosos de su tierra, desde nuestro chef que domina las técnicas tradicionales de la cocina regional, hasta nuestro personal de sala que te hará sentir como en casa. Cada miembro del equipo conoce la historia detrás de nuestros platos típicos y está comprometido con ofrecer una experiencia gastronómica auténtica de Chachapoyas.
                        </p>
                    </div>
                    <div className="relative h-96 w-full md:order-1">
                        <Image
                            src={teamImage.imageUrl}
                            alt="El equipo de Sabor y Tradición"
                            fill
                            className="rounded-lg object-cover shadow-xl"
                            data-ai-hint={teamImage.imageHint}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
