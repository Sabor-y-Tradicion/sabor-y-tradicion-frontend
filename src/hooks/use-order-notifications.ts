"use client";

import { useEffect, useCallback, useRef, useState } from 'react';
import { useToast } from './use-toast';
import { ordersAPI } from '@/lib/api/orders';
import { Order } from '@/types/order';

interface UseOrderNotificationsOptions {
  enabled?: boolean;
  pollingInterval?: number; // en milisegundos
  onNewOrder?: (order: Order) => void;
}

/**
 * Hook para manejar notificaciones de nuevos pedidos
 * Incluye polling para verificar nuevos pedidos y reproducir sonido
 */
export function useOrderNotifications(options: UseOrderNotificationsOptions = {}) {
  const { enabled = true, pollingInterval = 10000, onNewOrder } = options; // 10 segundos por defecto
  const { toast } = useToast();
  const lastCheckRef = useRef<Date>(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());

  // Inicializar audio de notificación
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Crear la URL del audio usando la ubicación actual del navegador
        const audioUrl = `${window.location.origin}/sounds/notification.mp3`;
        audioRef.current = new Audio(audioUrl);
        audioRef.current.volume = 0.7;
        audioRef.current.preload = 'auto';
        setIsInitialized(true);
      } catch {
        // Si falla la carga del audio, simplemente no habrá sonido
        setIsInitialized(true);
      }
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      if (audioRef.current) {
        // Reiniciar el audio al inicio
        audioRef.current.currentTime = 0;

        // Intentar reproducir el audio
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silenciar error de reproducción
          });
        }
      }
    } catch {
      // Silenciar error
    }
  }, []);

  const checkForNewOrders = useCallback(async () => {
    try {
      const currentCheck = new Date();

      // Buscar pedidos desde 30 segundos antes del último check
      // Esto asegura que no se pierdan pedidos creados justo después del último polling
      const searchFrom = new Date(lastCheckRef.current.getTime() - 30000); // 30 segundos antes

      // Obtener pedidos en preparación desde la búsqueda ajustada
      const response = await ordersAPI.getAll({
        status: 'preparing',
        dateFrom: searchFrom.toISOString(),
      });

      const newOrders = response.data || [];

      // Filtrar solo los pedidos que no hemos visto antes
      const actuallyNewOrders = newOrders.filter(order => !knownOrderIdsRef.current.has(order.id));

      if (actuallyNewOrders.length > 0) {
        // Reproducir sonido una vez para nuevos pedidos
        playNotificationSound();

        // Registrar los nuevos pedidos como conocidos
        actuallyNewOrders.forEach((order) => {
          knownOrderIdsRef.current.add(order.id);

          toast({
            title: '🔔 ¡Nuevo Pedido!',
            description: `Pedido #${order.orderNumber} - ${order.customer.name}`,
            duration: 10000,
          });

          // Callback personalizado si se proporciona
          if (onNewOrder) {
            onNewOrder(order);
          }
        });
      }

      lastCheckRef.current = currentCheck;
    } catch {
      // Silenciar errores (evita spam de logs)
    }
  }, [toast, playNotificationSound, onNewOrder]);

  useEffect(() => {
    if (!enabled || !isInitialized) return;

    // Verificar inmediatamente al montar
    checkForNewOrders();

    // Configurar polling
    const intervalId = setInterval(checkForNewOrders, pollingInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, pollingInterval, checkForNewOrders, isInitialized]);

  return {
    playNotificationSound,
    checkForNewOrders,
  };
}

