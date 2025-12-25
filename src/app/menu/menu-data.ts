import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: string;
    category: 'Menú del Día' | 'Platos Tradicionales' | 'Platos a la Carta' | 'Bebidas' | 'Postres';
    image: ImagePlaceholder;
    tags: string[];
}

const findImage = (id: string): ImagePlaceholder => {
    const image = PlaceHolderImages.find((img) => img.id === id);
    if (!image) {
        return {
            id: 'fallback',
            description: 'A delicious dish',
            imageUrl: 'https://picsum.photos/seed/fallback/400/300',
            imageHint: 'food dish',
        };
    }
    return image;
};

export const menuData: MenuItem[] = [
    // Menú del Día
    {
        id: 1,
        name: 'Menú Ejecutivo',
        description: 'Incluye entrada, plato principal, postre y bebida del día.',
        price: 'S/ 18.00',
        category: 'Menú del Día',
        image: findImage('menu-appetizer-1'),
        tags: [],
    },
    {
        id: 2,
        name: 'Menú Económico',
        description: 'Plato principal con arroz, guarnición y refresco.',
        price: 'S/ 12.00',
        category: 'Menú del Día',
        image: findImage('menu-appetizer-2'),
        tags: [],
    },
    {
        id: 3,
        name: 'Menú Especial',
        description: 'Plato típico del día con entrada y chicha morada.',
        price: 'S/ 22.00',
        category: 'Menú del Día',
        image: findImage('menu-appetizer-3'),
        tags: [],
    },

    // Platos Tradicionales
    {
        id: 10,
        name: 'Purtumute',
        description: 'Sopa tradicional chachapoyana con frijoles, maíz, trigo y carne de res.',
        price: 'S/ 25.00',
        category: 'Platos Tradicionales',
        image: findImage('menu-main-1'),
        tags: ['plato típico'],
    },
    {
        id: 11,
        name: 'Cuy Frito con Papas',
        description: 'Cuy crocante frito acompañado de papas doradas y ensalada fresca.',
        price: 'S/ 35.00',
        category: 'Platos Tradicionales',
        image: findImage('menu-main-2'),
        tags: ['plato típico', 'especialidad'],
    },
    {
        id: 12,
        name: 'Cecina con Tacacho',
        description: 'Cecina ahumada servida con tacacho de plátano verde y chorizo regional.',
        price: 'S/ 28.00',
        category: 'Platos Tradicionales',
        image: findImage('menu-main-3'),
        tags: ['plato típico', 'amazónico'],
    },
    {
        id: 13,
        name: 'Juane de Gallina',
        description: 'Arroz con gallina envuelto en hoja de bijao, estilo amazónico.',
        price: 'S/ 22.00',
        category: 'Platos Tradicionales',
        image: findImage('menu-main-4'),
        tags: ['plato típico', 'amazónico'],
    },
    {
        id: 14,
        name: 'Sopa de Gallina Criolla',
        description: 'Reconfortante sopa de gallina de campo con fideos y verduras.',
        price: 'S/ 18.00',
        category: 'Platos Tradicionales',
        image: findImage('menu-main-5'),
        tags: ['plato típico'],
    },
    {
        id: 15,
        name: 'Trucha Frita',
        description: 'Trucha fresca de la región, frita y acompañada con arroz y ensalada.',
        price: 'S/ 26.00',
        category: 'Platos Tradicionales',
        image: findImage('menu-main-6'),
        tags: ['pescado', 'plato típico'],
    },
    {
        id: 16,
        name: 'Chicharrón con Mote',
        description: 'Chicharrón de cerdo crocante servido con mote y salsa criolla.',
        price: 'S/ 24.00',
        category: 'Platos Tradicionales',
        image: findImage('menu-main-7'),
        tags: ['plato típico'],
    },

    // Platos a la Carta
    {
        id: 20,
        name: 'Lomo Saltado',
        description: 'Clásico peruano con carne de res, papas fritas, cebolla y tomate.',
        price: 'S/ 28.00',
        category: 'Platos a la Carta',
        image: findImage('menu-main-8'),
        tags: [],
    },
    {
        id: 21,
        name: 'Arroz con Pollo',
        description: 'Arroz verde con pollo tierno, papa y salsa criolla.',
        price: 'S/ 22.00',
        category: 'Platos a la Carta',
        image: findImage('menu-main-9'),
        tags: [],
    },
    {
        id: 22,
        name: 'Tallarines Verdes con Bistec',
        description: 'Pasta en salsa de espinaca y albahaca con bistec a la plancha.',
        price: 'S/ 26.00',
        category: 'Platos a la Carta',
        image: findImage('menu-main-10'),
        tags: [],
    },
    {
        id: 23,
        name: 'Ají de Gallina',
        description: 'Cremoso ají de gallina con papas, aceitunas y huevo.',
        price: 'S/ 24.00',
        category: 'Platos a la Carta',
        image: findImage('menu-appetizer-4'),
        tags: [],
    },
    {
        id: 24,
        name: 'Seco de Carne',
        description: 'Guiso tradicional de carne con culantro, acompañado de frijoles y arroz.',
        price: 'S/ 25.00',
        category: 'Platos a la Carta',
        image: findImage('menu-appetizer-5'),
        tags: [],
    },

    // Postres
    {
        id: 30,
        name: 'Suspiro Limeño',
        description: 'Postre tradicional peruano de manjar blanco con merengue y canela.',
        price: 'S/ 10.00',
        category: 'Postres',
        image: findImage('menu-dessert-1'),
        tags: ['postre tradicional'],
    },
    {
        id: 31,
        name: 'Mazamorra Morada',
        description: 'Postre de maíz morado con frutas y especias aromáticas.',
        price: 'S/ 8.00',
        category: 'Postres',
        image: findImage('menu-dessert-2'),
        tags: ['postre tradicional'],
    },
    {
        id: 32,
        name: 'Arroz con Leche',
        description: 'Cremoso arroz con leche y un toque de canela.',
        price: 'S/ 8.00',
        category: 'Postres',
        image: findImage('menu-dessert-3'),
        tags: ['postre tradicional'],
    },
    {
        id: 33,
        name: 'Picarones',
        description: 'Buñuelos de zapallo bañados en miel de chancaca.',
        price: 'S/ 10.00',
        category: 'Postres',
        image: findImage('menu-dessert-4'),
        tags: ['postre tradicional'],
    },
    {
        id: 34,
        name: 'Turrón de Doña Pepa',
        description: 'Dulce tradicional limeño con capas de masa y miel de chancaca.',
        price: 'S/ 12.00',
        category: 'Postres',
        image: findImage('menu-dessert-5'),
        tags: ['postre tradicional'],
    },
    {
        id: 35,
        name: 'Flan de Leche',
        description: 'Suave flan casero con caramelo.',
        price: 'S/ 9.00',
        category: 'Postres',
        image: findImage('menu-dessert-6'),
        tags: [],
    },

    // Bebidas
    {
        id: 40,
        name: 'Chicha Morada',
        description: 'Refrescante bebida de maíz morado con piña y especias.',
        price: 'S/ 5.00',
        category: 'Bebidas',
        image: findImage('menu-drink-1'),
        tags: ['bebida tradicional'],
    },
    {
        id: 41,
        name: 'Emoliente',
        description: 'Bebida caliente de hierbas medicinales, ideal para cualquier momento.',
        price: 'S/ 4.00',
        category: 'Bebidas',
        image: findImage('menu-drink-2'),
        tags: ['bebida tradicional'],
    },
    {
        id: 42,
        name: 'Jugo de Papaya',
        description: 'Jugo natural de papaya fresca.',
        price: 'S/ 6.00',
        category: 'Bebidas',
        image: findImage('menu-drink-3'),
        tags: [],
    },
    {
        id: 43,
        name: 'Limonada Frozen',
        description: 'Refrescante limonada helada con hierbabuena.',
        price: 'S/ 7.00',
        category: 'Bebidas',
        image: findImage('menu-drink-4'),
        tags: [],
    },
    {
        id: 44,
        name: 'Agua Mineral',
        description: 'Agua mineral con o sin gas.',
        price: 'S/ 4.00',
        category: 'Bebidas',
        image: findImage('menu-drink-5'),
        tags: [],
    },
    {
        id: 45,
        name: 'Café Pasado',
        description: 'Café tradicional peruano preparado al momento.',
        price: 'S/ 5.00',
        category: 'Bebidas',
        image: findImage('menu-drink-6'),
        tags: ['bebida tradicional'],
    },
    {
        id: 46,
        name: 'Inca Kola',
        description: 'La bebida del Perú, con su sabor único y refrescante.',
        price: 'S/ 5.00',
        category: 'Bebidas',
        image: findImage('menu-drink-7'),
        tags: [],
    },
    {
        id: 47,
        name: 'Chicha de Jora',
        description: 'Bebida fermentada tradicional de maíz germinado.',
        price: 'S/ 6.00',
        category: 'Bebidas',
        image: findImage('menu-drink-8'),
        tags: ['bebida tradicional', 'alcohol'],
    },
];

