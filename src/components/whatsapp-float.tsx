"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Calendar, FileText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialMedia {
  whatsapp: string;
  socialNetworks?: Array<{
    id: string;
    name: string;
    url: string;
    icon: string;
  }>;
}

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    const savedSocialMedia = localStorage.getItem("social_media");
    if (savedSocialMedia) {
      try {
        const parsed: SocialMedia = JSON.parse(savedSocialMedia);
        if (parsed.whatsapp) {
          setWhatsappNumber(parsed.whatsapp);
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

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

  // No mostrar el botón si no hay número de WhatsApp configurado
  if (!whatsappNumber) {
    return null;
  }

  return (
    <>
      {/* Botón principal flotante */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
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
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

