"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Badge } from "@/components/ui/badge";

export function CartButton() {
  const { itemCount, toggleCart, isOpen } = useCart();

  // No mostrar el botón si no hay items O si el sidebar está abierto
  if (itemCount === 0 || isOpen) {
    return null;
  }

  return (
    <Button
      onClick={toggleCart}
      size="lg"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-primary hover:bg-primary/90"
      aria-label="Abrir carrito"
    >
      <div className="relative">
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <Badge
            className="absolute -top-3 -right-3 h-6 w-6 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 text-white border-2 border-white"
          >
            {itemCount}
          </Badge>
        )}
      </div>
    </Button>
  );
}

