/**
 * Utilidades para formatear pedidos y enviarlos por WhatsApp
 */

import { OrderDetails } from '@/types/cart';
import { PAYMENT_METHOD_LABELS, DELIVERY_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '@/types/order';

/**
 * Formatea un pedido para enviarlo por WhatsApp
 * @param order - Detalles del pedido
 * @param restaurantName - Nombre del restaurante (opcional)
 */
export function formatOrderForWhatsApp(order: OrderDetails, restaurantName?: string): string {
  const lines: string[] = [];

  // Encabezado con el nombre del restaurante
  const headerName = restaurantName || 'RESTAURANTE';
  lines.push(`🍽️ *NUEVO PEDIDO - ${headerName.toUpperCase()}*`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  // Número de pedido (si existe)
  if (order.orderNumber) {
    lines.push(`📋 *Pedido:* #${order.orderNumber}`);
    lines.push('');
  }

  // Items del pedido
  lines.push('🛒 *PEDIDO:*');
  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. *${item.dish.name}*`);
    lines.push(`   Cantidad: ${item.quantity}`);
    lines.push(`   Precio unitario: S/ ${Number(item.dish.price).toFixed(2)}`);
    lines.push(`   Subtotal: S/ ${item.subtotal.toFixed(2)}`);
    lines.push('');
  });

  // Total
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`💰 *TOTAL: S/ ${order.total.toFixed(2)}*`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  // Datos del cliente
  lines.push('👤 *DATOS DEL CLIENTE:*');
  lines.push(`Nombre: ${order.customer.name}`);
  // Formatear teléfono con +51 si solo tiene 9 dígitos
  const phoneDigits = order.customer.phone.replace(/[^0-9]/g, '');
  const formattedPhone = phoneDigits.length === 9 ? `+51 ${phoneDigits}` : order.customer.phone;
  lines.push(`Teléfono: ${formattedPhone}`);

  // Tipo de comprobante
  const documentLabel = DOCUMENT_TYPE_LABELS[order.customer.documentType] || order.customer.documentType;
  lines.push(`Comprobante: ${documentLabel}`);
  
  if (order.customer.documentType === 'factura') {
    lines.push(`RUC: ${order.customer.documentNumber || 'No especificado'}`);
  } else if (order.customer.documentNumber) {
    lines.push(`DNI: ${order.customer.documentNumber}`);
  }
  lines.push('');

  // Método de entrega
  lines.push('📦 *ENTREGA:*');
  const deliveryLabel = DELIVERY_TYPE_LABELS[order.delivery.type] || order.delivery.type;
  lines.push(`Tipo: ${deliveryLabel}`);
  
  if (order.delivery.type === 'delivery' && order.delivery.address) {
    lines.push(`Dirección: ${order.delivery.address}`);
  }
  lines.push('');

  // Método de pago
  lines.push('💳 *MÉTODO DE PAGO:*');
  const paymentLabel = PAYMENT_METHOD_LABELS[order.payment.method] || order.payment.method;
  lines.push(paymentLabel);
  lines.push('');

  // Notas adicionales
  if (order.notes) {
    lines.push('📝 *NOTAS:*');
    lines.push(order.notes);
    lines.push('');
  }

  // Fecha y hora
  if (order.createdAt) {
    const date = new Date(order.createdAt);
    lines.push(`🕐 ${date.toLocaleDateString('es-PE')} ${date.toLocaleTimeString('es-PE')}`);
  }

  return lines.join('\n');
}

/**
 * Abre WhatsApp con el mensaje del pedido
 * @param order - Detalles del pedido
 * @param whatsappNumber - Número de WhatsApp (opcional, si no se proporciona, se intenta obtener del tenant settings)
 * @param restaurantName - Nombre del restaurante (opcional)
 */
export function sendOrderToWhatsApp(order: OrderDetails, whatsappNumber?: string, restaurantName?: string): void {
  // Si no se proporciona el número, intentar obtenerlo del localStorage como fallback
  let phoneNumber = whatsappNumber || '';

  if (!phoneNumber) {
    try {
      // Intentar obtener de los settings del tenant guardados en localStorage
      const tenantSettings = localStorage.getItem('tenant_settings');
      if (tenantSettings) {
        const parsed = JSON.parse(tenantSettings);
        phoneNumber = parsed.whatsapp || parsed.phone || '';
      }

      // Fallback a social_media si no hay en tenant_settings
      if (!phoneNumber) {
        const savedSocialMedia = localStorage.getItem('social_media');
        if (savedSocialMedia) {
          const parsed = JSON.parse(savedSocialMedia);
          phoneNumber = parsed.whatsapp || '';
        }
      }
    } catch (error) {
      console.error('Error al obtener número de WhatsApp:', error);
    }
  }

  if (!phoneNumber) {
    console.error('Número de WhatsApp no configurado');
    alert('El número de WhatsApp no está configurado. Contacta al administrador del restaurante.');
    return;
  }

  // Limpiar el número de espacios y caracteres especiales
  let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  // Asegurar que tenga el código de país (51 para Perú)
  if (cleanNumber.length === 9) {
    cleanNumber = '51' + cleanNumber;
  }

  // Formatear el mensaje con el nombre del restaurante si se proporciona
  const message = formatOrderForWhatsApp(order, restaurantName);

  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Crear URL de WhatsApp
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  // Abrir WhatsApp en una nueva ventana
  window.open(whatsappUrl, '_blank');
}

/**
 * Genera un número de pedido único
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${year}${month}${day}${random}`;
}

