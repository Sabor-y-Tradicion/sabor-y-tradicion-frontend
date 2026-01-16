"use client";

import { useState } from "react";
import { MessageCircle, X, Calendar, FileText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/tenant-context";

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const { tenant } = useTenant();

  // Intentar obtener el estado del carrito, pero sin lanzar error si no está disponible
  let isCartOpen = false;
  try {
    // Usar import dinámico para evitar error si no está en CartProvider
    const { useCart } = require("@/contexts/cart-context");
    const cartContext = useCart();
    isCartOpen = cartContext.isOpen;
  } catch (error) {
    // Si falla, simplemente no ocultamos el botón
    isCartOpen = false;
  }

  // Obtener el número de WhatsApp desde los settings del tenant
  const whatsappNumber = tenant?.settings?.whatsapp || "";

  const handleWhatsAppClick = (message: string) => {
    // Limpiar el número de espacios y caracteres especiales
    const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  const options = [
    {
      icon: Calendar,
      label: "Información para reservas",
      message: "Hola, me gustaría obtener información para hacer una reserva.",
      color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
    },
    {
      icon: FileText,
      label: "Deseo una proforma",
      message: "Hola, me gustaría recibir una proforma detallada.",
      color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
    },
    {
      icon: Phone,
      label: "Consulta general",
      message: "Hola, tengo una consulta sobre sus servicios.",
      color: "text-green-600 bg-green-50 hover:bg-green-100",
    },
  ];

  // No mostrar el botón si no hay número de WhatsApp configurado o si el carrito está abierto
  if (!whatsappNumber || isCartOpen) {
    return null;
  }

  return (
    <>
      {/* Botón principal flotante - posicionado arriba del carrito */}
      <div className="fixed bottom-28 right-6 z-40 flex flex-col items-end gap-3">
        {/* Opciones desplegables */}
        {isOpen && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleWhatsAppClick(option.message)}
                className={`
                  flex items-center gap-3 rounded-full px-4 py-3 shadow-lg 
                  transition-all duration-300 hover:scale-105 hover:shadow-xl
                  ${option.color}
                  animate-in fade-in slide-in-from-right-4
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <option.icon className="h-5 w-5" />
                <span className="font-medium text-sm whitespace-nowrap">{option.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Botón toggle */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={`
            h-14 w-14 rounded-full shadow-2xl transition-all duration-300
            ${isOpen ? 'bg-red-600 hover:bg-red-700 rotate-90' : 'bg-green-600 hover:bg-green-700 hover:scale-110'}
          `}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Overlay para cerrar al hacer clic fuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
