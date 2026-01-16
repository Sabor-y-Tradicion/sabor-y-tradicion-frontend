"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Clock, User, Phone, MapPin, CreditCard, FileText, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Order, OrderStatus, ORDER_STATUS_CONFIG, PAYMENT_METHOD_LABELS, DELIVERY_TYPE_LABELS, DOCUMENT_TYPE_LABELS, normalizeOrderStatus } from '@/types/order';
import { getDishImage } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/contexts/tenant-context';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onDelete: (orderId: string) => void;
}

export function OrderCard({ order, onStatusChange, onDelete }: OrderCardProps) {
  const { toast } = useToast();
  const { tenant } = useTenant();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeliverDialog, setShowDeliverDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Normalizar el estado para obtener la configuración correcta
  const normalizedStatus = normalizeOrderStatus(order.status);
  const statusConfig = ORDER_STATUS_CONFIG[normalizedStatus];

  // Función para enviar mensaje de WhatsApp
  const sendWhatsAppNotification = () => {
    const customerPhone = order.customer?.phone || '';

    if (!customerPhone) {
      return;
    }

    // Limpiar el número: solo dígitos
    let cleanNumber = customerPhone.replace(/[^0-9]/g, '');

    // Si el número tiene 11 dígitos y empieza con 51, quitar el código de país
    if (cleanNumber.length === 11 && cleanNumber.startsWith('51')) {
      cleanNumber = cleanNumber.substring(2); // Quitar el '51'
    }

    // Validar que tenga exactamente 9 dígitos
    if (cleanNumber.length !== 9) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'El número de teléfono del cliente debe tener 9 dígitos.',
      });
      return;
    }

    const customerName = order.customer?.name || 'Cliente';
    const restaurantName = tenant?.name || 'Restaurante';
    const orderNumber = order.orderNumber;

    // Determinar el tipo de mensaje según el tipo de entrega
    const isDelivery = order.delivery?.type?.toLowerCase() === 'delivery';

    let message = '';
    if (isDelivery) {
      message = `¡Hola ${customerName}! 🎉\n\n` +
                `Tu pedido #${orderNumber} de *${restaurantName}* ya ha sido enviado y está en camino. 🚚\n\n` +
                `Pronto llegará a tu dirección.\n\n` +
                `¡Gracias por tu preferencia! 😊`;
    } else {
      message = `¡Hola ${customerName}! 🎉\n\n` +
                `Tu pedido #${orderNumber} de *${restaurantName}* ya está listo para recoger. ✅\n\n` +
                `Puedes pasar a recogerlo cuando gustes.\n\n` +
                `¡Te esperamos! 😊`;
    }

    // Crear URL de WhatsApp (agregar código de país 51)
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/51${cleanNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva ventana
    window.open(whatsappUrl, '_blank');
  };

  const handleMarkAsDelivered = async () => {
    setIsUpdating(true);

    try {
      // Enviar en MAYÚSCULAS para que coincida con el backend
      await onStatusChange(order.id, 'DELIVERED' as OrderStatus);

      toast({
        title: '¡Pedido entregado!',
        description: `Pedido #${order.orderNumber} marcado como entregado`,
      });

      // Intentar enviar el mensaje de WhatsApp DESPUÉS de actualizar el estado
      try {
        sendWhatsAppNotification();
      } catch {
        // No mostramos error al usuario, el pedido ya se actualizó correctamente
      }

    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del pedido',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
      setShowDeliverDialog(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(order.id);
      toast({
        title: 'Pedido eliminado',
        description: `Pedido #${order.orderNumber} ha sido eliminado`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el pedido',
        variant: 'destructive',
      });
    }
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2 dark:text-white">
                Pedido #{order.orderNumber}
                <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border`}>
                  {statusConfig.label}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 dark:text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(order.createdAt)}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Items del pedido */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm dark:text-gray-200">Platos:</h4>
            {order.items.map((item, index) => {
              // Compatibilidad con diferentes estructuras de datos
              const itemName = (item as any).dish?.name || item.name || 'Plato';
              const itemImage = (item as any).dish?.image || null;
              const itemPrice = (item as any).dish?.price || item.unitPrice || 0;

              return (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-muted">
                    <Image
                      src={getDishImage(itemImage)}
                      alt={itemName}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1 dark:text-gray-200">{itemName}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      Cantidad: {item.quantity} x S/ {Number(itemPrice).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold dark:text-gray-200">
                    S/ {Number(item.subtotal).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Información del cliente */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm dark:text-gray-200">Cliente:</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="dark:text-gray-300">{order.customer?.name || 'Cliente'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="dark:text-gray-300">{order.customer?.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="dark:text-gray-300">
                  {DOCUMENT_TYPE_LABELS[order.customer?.documentType] || order.customer?.documentType || 'Boleta'}
                  {order.customer?.documentNumber && ` - ${order.customer.documentNumber}`}
                </span>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Información de entrega */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm dark:text-gray-200">Entrega:</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="dark:text-gray-300">
                  {DELIVERY_TYPE_LABELS[order.delivery?.type] || order.delivery?.type || 'Recojo'}
                </span>
              </div>
              {order.delivery?.address && (
                <p className="text-muted-foreground ml-6 dark:text-gray-400">
                  {order.delivery.address}
                </p>
              )}
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Información de pago */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm dark:text-gray-200">Pago:</h4>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="dark:text-gray-300">
                  {PAYMENT_METHOD_LABELS[order.payment?.method] || order.payment?.method || 'Efectivo'}
                </span>
              </div>
            </div>
          </div>

          {/* Notas */}
          {order.notes && !showDeliverDialog && !isUpdating && (
            <>
              <Separator className="dark:bg-gray-700" />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm dark:text-gray-200">Notas:</h4>
                <p className="text-sm text-muted-foreground dark:text-gray-400">{order.notes}</p>
              </div>
            </>
          )}

          <Separator className="dark:bg-gray-700" />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="dark:text-gray-200">Total:</span>
            <span className="text-primary dark:text-orange-500">S/ {Number(order.total || 0).toFixed(2)}</span>
          </div>

          {/* Botón de marcar como entregado */}
          <Button
            onClick={() => setShowDeliverDialog(true)}
            disabled={isUpdating}
            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Marcar como Entregado
          </Button>
        </CardContent>
      </Card>

      {/* Dialog de confirmación de entrega */}
      <AlertDialog open={showDeliverDialog} onOpenChange={setShowDeliverDialog}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">¿Marcar pedido como entregado?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Se notificará a <span className="font-semibold">{order.customer?.name}</span> que su pedido está {order.delivery?.type?.toLowerCase() === 'delivery' ? 'en camino 🚚' : 'listo para recoger ✅'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkAsDelivered}
              disabled={isUpdating}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isUpdating ? 'Procesando...' : 'Sí, marcar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">¿Eliminar pedido?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Esta acción no se puede deshacer. El pedido #{order.orderNumber} será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

