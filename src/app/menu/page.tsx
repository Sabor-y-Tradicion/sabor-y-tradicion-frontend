import MenuClientPage from './components/menu-client-page';
import { CartProvider } from '@/contexts/cart-context';
import { CartButton, CartSidebar } from '@/components/cart';

export default function MenuPage() {
    return (
        <CartProvider>
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <header className="text-center">
                        <h1 className="font-headline text-5xl font-bold md:text-6xl">Nuestro Menú</h1>
                        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                            Descubre nuestra selección de platos tradicionales chachapoyanos y opciones a la carta, preparados con ingredientes frescos de Amazonas.
                        </p>
                    </header>
                    <MenuClientPage />
                </div>
            </div>

            {/* Componentes del carrito */}
            <CartSidebar />
            <CartButton />
        </CartProvider>
    );
}
