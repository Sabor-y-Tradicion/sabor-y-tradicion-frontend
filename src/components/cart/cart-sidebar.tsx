"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { getDishImage } from "@/lib/constants";
import { CheckoutForm } from "@/components/cart/checkout-form";

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total, itemCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        {!showCheckout ? (
          <>
            {/* Header */}
            <div className="p-6 pb-4 border-b">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <ShoppingBag className="h-6 w-6" />
                Mi Carrito
                {itemCount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h2>
            </div>

            {/* Lista de items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
                <p className="text-muted-foreground text-sm">
                  Agrega algunos platos deliciosos para comenzar tu pedido
                </p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 py-4">
                    {items.map((item) => (
                      <div
                        key={item.dish.id}
                        className="flex gap-4 bg-card rounded-lg border p-3 hover:shadow-md transition-shadow"
                      >
                        {/* Imagen */}
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={getDishImage(item.dish.image)}
                            alt={item.dish.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Detalles */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-1 mb-1">
                            {item.dish.name}
                          </h4>
                          <p className="text-sm text-primary font-bold mb-2">
                            S/ {Number(item.dish.price).toFixed(2)}
                          </p>

                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeItem(item.dish.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="flex flex-col items-end justify-between">
                          <p className="font-bold text-sm">
                            S/ {item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Footer con total y botón */}
                <div className="border-t p-6 space-y-4 bg-muted/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">S/ {total.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">S/ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    Proceder al Pedido
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <CheckoutForm onBack={handleBackToCart} />
        )}
      </SheetContent>
    </Sheet>
  );
}

