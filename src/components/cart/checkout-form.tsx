"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/contexts/tenant-context";
import { CustomerInfo, DeliveryInfo, PaymentInfo, OrderDetails } from "@/types/cart";
import { sendOrderToWhatsApp, generateOrderNumber } from "@/lib/whatsapp-formatter";
import { ordersAPI } from "@/lib/api/orders";

interface CheckoutFormProps {
  onBack: () => void;
}

export function CheckoutForm({ onBack }: CheckoutFormProps) {
  const { items, total, clearCart, closeCart } = useCart();
  const { toast } = useToast();
  const { tenant } = useTenant();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  // Estados del formulario
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    documentType: "boleta",
  });

  const [delivery, setDelivery] = useState<DeliveryInfo>({
    type: "pickup",
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    method: "efectivo",
  });

  const [notes, setNotes] = useState("");

  // Cargar datos del restaurante desde el tenant
  useEffect(() => {
    if (tenant) {
      // Nombre del restaurante
      setRestaurantName(tenant.name || "Restaurante");

      // Dirección del restaurante desde settings
      const settings = tenant.settings || {};
      const address = settings.address || settings.location?.address || "";
      setRestaurantAddress(address || "Dirección no configurada");

      // Número de WhatsApp - buscar en diferentes posibles ubicaciones en orden de prioridad
      const whatsapp = settings.whatsapp || // Guardado desde redes sociales
                       settings.socialNetworks?.find((sn: { platform: string; url: string }) =>
                         sn.platform?.toLowerCase() === 'whatsapp'
                       )?.url ||
                       settings.phone || // Fallback al teléfono general
                       "";
      setWhatsappNumber(whatsapp);
    }
  }, [tenant]);

  // Validación de documento
  const validateDocument = (): boolean => {
    if (customer.documentType === "factura") {
      if (!customer.documentNumber || customer.documentNumber.length !== 11) {
        toast({
          title: "RUC inválido",
          description: "El RUC debe tener 11 dígitos",
          variant: "destructive",
        });
        return false;
      }
    } else if (customer.documentNumber && customer.documentNumber.length !== 8) {
      toast({
        title: "DNI inválido",
        description: "El DNI debe tener 8 dígitos",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Validación de teléfono
  const validatePhone = (): boolean => {
    const phoneDigits = customer.phone.replace(/[^0-9]/g, "");
    if (phoneDigits.length !== 9) {
      toast({
        title: "Teléfono inválido",
        description: "Ingrese un número de teléfono válido de 9 dígitos",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Siguiente paso
  const handleNext = () => {
    if (step === 1) {
      if (!customer.name.trim()) {
        toast({
          title: "Nombre requerido",
          description: "Por favor ingrese su nombre",
          variant: "destructive",
        });
        return;
      }
      if (!validatePhone()) return;
    }

    if (step === 2) {
      if (!validateDocument()) return;
    }

    if (step === 3) {
      if (delivery.type === "delivery" && !delivery.address?.trim()) {
        toast({
          title: "Dirección requerida",
          description: "Por favor ingrese la dirección de entrega",
          variant: "destructive",
        });
        return;
      }
    }

    setStep(step + 1);
  };

  // Procesar pedido
  const handleSubmit = async () => {
    // Validar que haya número de WhatsApp configurado
    if (!whatsappNumber) {
      toast({
        title: "Error de configuración",
        description: "El restaurante no tiene configurado un número de WhatsApp. Contacta al administrador.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();

      const orderDetails: OrderDetails = {
        items,
        customer,
        delivery,
        payment,
        total,
        subtotal: total,
        notes: notes.trim() || undefined,
        orderNumber,
        createdAt: new Date().toISOString(),
      };

      // Intentar crear el pedido en el backend usando endpoint público
      try {
        // Limpiar el teléfono y agregar +51
        const cleanPhone = customer.phone.replace(/\D/g, "");
        const phoneWithPrefix = `+51${cleanPhone}`;

        const orderPayload = {
          items: orderDetails.items.map(item => ({
            dishId: item.dish.id,
            name: item.dish.name,
            quantity: item.quantity,
            unitPrice: Number(item.dish.price),
            subtotal: item.subtotal,
          })),
          customer: {
            name: orderDetails.customer.name,
            phone: phoneWithPrefix, // Enviar con +51
            documentType: orderDetails.customer.documentType,
            documentNumber: orderDetails.customer.documentNumber || undefined,
            businessName: orderDetails.customer.businessName || undefined,
          },
          delivery: {
            type: orderDetails.delivery.type,
            address: orderDetails.delivery.address || undefined,
          },
          payment: {
            method: orderDetails.payment.method,
          },
          subtotal: orderDetails.subtotal,
          total: orderDetails.total,
          notes: orderDetails.notes || undefined,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await ordersAPI.createPublic(orderPayload as any);
      } catch {
        // Si falla guardar en backend, el pedido igual se envía por WhatsApp
      }

      // Enviar por WhatsApp con el número y nombre del restaurante
      sendOrderToWhatsApp(orderDetails, whatsappNumber, restaurantName);

      toast({
        title: "¡Pedido enviado!",
        description: "Tu pedido ha sido enviado por WhatsApp. Te contactaremos pronto.",
      });

      // Limpiar carrito y cerrar
      clearCart();
      closeCart();
    } catch (error) {
      console.error("Error al procesar pedido:", error);
      toast({
        title: "Error",
        description: "Hubo un error al procesar tu pedido. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">
              {step === 5 ? "Confirmar Pedido" : "Completar Pedido"}
            </h2>
            <p className="text-sm text-muted-foreground">Paso {step} de 5</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenido del formulario */}
      <ScrollArea className="flex-1 px-6 py-4">
        {/* Paso 1: Datos del cliente */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-4">Datos del Cliente</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre completo *</Label>
                  <Input
                    id="name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Ingrese su nombre"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <div className="flex gap-2">
                    <div className="w-16 flex items-center justify-center border rounded-md bg-muted px-3 text-sm font-medium">
                      +51
                    </div>
                    <Input
                      id="phone"
                      value={customer.phone}
                      onChange={(e) => {
                        // Solo números, máximo 9 dígitos
                        const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                        // Formatear en grupos de 3: XXX XXX XXX
                        let formatted = value;
                        if (value.length > 3) {
                          formatted = value.slice(0, 3);
                          if (value.length > 6) {
                            formatted += " " + value.slice(3, 6) + " " + value.slice(6);
                          } else {
                            formatted += " " + value.slice(3);
                          }
                        }
                        setCustomer({ ...customer, phone: formatted });
                      }}
                      placeholder="999 999 999"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    9 dígitos (ej: 932 217 652)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Tipo de comprobante */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-4">Tipo de Comprobante</h3>

              <RadioGroup
                value={customer.documentType}
                onValueChange={(value: "boleta" | "factura") =>
                  setCustomer({ ...customer, documentType: value, documentNumber: "", businessName: "", businessAddress: "" })
                }
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="boleta" id="boleta" />
                  <Label htmlFor="boleta" className="flex-1 cursor-pointer">
                    <div className="font-medium">🧾 Boleta</div>
                    <div className="text-sm text-muted-foreground">DNI opcional</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="factura" id="factura" />
                  <Label htmlFor="factura" className="flex-1 cursor-pointer">
                    <div className="font-medium">📄 Factura</div>
                    <div className="text-sm text-muted-foreground">RUC obligatorio</div>
                  </Label>
                </div>
              </RadioGroup>

              {customer.documentType === "boleta" && (
                <div className="mt-4">
                  <Label htmlFor="dni">DNI (Opcional)</Label>
                  <Input
                    id="dni"
                    value={customer.documentNumber || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                      setCustomer({ ...customer, documentNumber: value });
                    }}
                    placeholder="8 dígitos"
                    maxLength={8}
                  />
                </div>
              )}

              {customer.documentType === "factura" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="ruc">RUC *</Label>
                    <Input
                      id="ruc"
                      value={customer.documentNumber || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                        setCustomer({ ...customer, documentNumber: value });
                      }}
                      placeholder="11 dígitos"
                      maxLength={11}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paso 3: Método de entrega */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-4">Método de Entrega</h3>

              <RadioGroup
                value={delivery.type}
                onValueChange={(value: "delivery" | "pickup") =>
                  setDelivery({ type: value, address: value === "pickup" ? undefined : "" })
                }
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                    <div className="font-medium">🏪 Recojo en Local</div>
                    <div className="text-sm text-muted-foreground">{restaurantAddress}</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                    <div className="font-medium">🚚 Delivery</div>
                    <div className="text-sm text-muted-foreground">Entrega a domicilio</div>
                  </Label>
                </div>
              </RadioGroup>

              {delivery.type === "delivery" && (
                <div className="mt-4">
                  <Label htmlFor="address">Dirección de Entrega *</Label>
                  <Textarea
                    id="address"
                    value={delivery.address || ""}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                    placeholder="Ingrese su dirección completa (calle, número, referencia)"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paso 4: Método de pago */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-4">Método de Pago</h3>
              <p className="text-sm text-muted-foreground mb-4">
                El pago se realizará {delivery.type === "delivery" ? "al recibir" : "en el local"}
              </p>

              <RadioGroup
                value={payment.method}
                onValueChange={(value: "efectivo" | "tarjeta" | "billetera") =>
                  setPayment({ method: value })
                }
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="efectivo" id="efectivo" />
                  <Label htmlFor="efectivo" className="flex-1 cursor-pointer">
                    <div className="font-medium">💵 Efectivo</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="tarjeta" id="tarjeta" />
                  <Label htmlFor="tarjeta" className="flex-1 cursor-pointer">
                    <div className="font-medium">💳 Tarjeta</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="billetera" id="billetera" />
                  <Label htmlFor="billetera" className="flex-1 cursor-pointer">
                    <div className="font-medium">📱 Billetera Digital</div>
                    <div className="text-sm text-muted-foreground">Yape, Plin, etc.</div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-4">
                <Label htmlFor="notes">Notas adicionales (Opcional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Sin cebolla, extra picante, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 5: Resumen y confirmación */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Resumen del Pedido</h3>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Platos</h4>
              {items.map((item) => (
                <div key={item.dish.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.dish.name}
                  </span>
                  <span className="font-medium">S/ {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Cliente */}
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Cliente</h4>
              <div className="text-sm space-y-1">
                <p>{customer.name}</p>
                <p>{customer.phone}</p>
                <p>
                  {customer.documentType === "factura" ? "📄 Factura" : "🧾 Boleta"}
                  {customer.documentNumber && ` - ${customer.documentNumber}`}
                </p>
              </div>
            </div>

            <Separator />

            {/* Entrega */}
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Entrega</h4>
              <div className="text-sm space-y-1">
                <p>{delivery.type === "delivery" ? "🚚 Delivery" : "🏪 Recojo en Local"}</p>
                <p className="text-muted-foreground">
                  {delivery.type === "delivery" ? delivery.address : restaurantAddress}
                </p>
              </div>
            </div>

            <Separator />

            {/* Pago */}
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Pago</h4>
              <p className="text-sm">
                {payment.method === "efectivo"
                  ? "💵 Efectivo"
                  : payment.method === "tarjeta"
                  ? "💳 Tarjeta"
                  : "📱 Billetera Digital"}
              </p>
            </div>

            {notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Notas</h4>
                  <p className="text-sm">{notes}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">S/ {total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Footer con botones */}
      <div className="border-t p-6">
        {step < 5 ? (
          <Button onClick={handleNext} className="w-full" size="lg">
            Continuar
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Procesando...</>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Enviar Pedido
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

