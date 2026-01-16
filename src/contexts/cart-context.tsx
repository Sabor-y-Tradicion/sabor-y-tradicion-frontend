"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartContextType, CartItem, CartState } from '@/types/cart';
import { Dish } from '@/types/menu';
import { useToast } from '@/hooks/use-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sabor_y_tradicion_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const [state, setState] = useState<CartState>({
    items: [],
    isOpen: false,
    itemCount: 0,
    total: 0
  });

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setState(prev => ({
          ...prev,
          items: parsed.items || [],
          itemCount: calculateItemCount(parsed.items || []),
          total: calculateTotal(parsed.items || [])
        }));
      }
    } catch (error) {
      console.error('Error al cargar carrito desde localStorage:', error);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items: state.items
      }));
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error);
    }
  }, [state.items]);

  const calculateItemCount = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  const addItem = useCallback((dish: Dish, quantity: number = 1) => {
    // Validar que el plato esté activo
    if (!dish.isActive) {
      // Diferir el toast para evitar actualizaciones durante render
      setTimeout(() => {
        toast({
          title: "Plato no disponible",
          description: `Lo sentimos, ${dish.name} no está disponible en este momento.`,
          variant: "destructive"
        });
      }, 0);
      return;
    }

    setState(prev => {
      const existingItemIndex = prev.items.findIndex(item => item.dish.id === dish.id);
      let newItems: CartItem[];
      let toastMessage = { title: '', description: '' };

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si ya existe
        newItems = [...prev.items];
        const newQuantity = newItems[existingItemIndex].quantity + quantity;
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
          subtotal: Number(dish.price) * newQuantity
        };

        toastMessage = {
          title: "Cantidad actualizada",
          description: `${dish.name} - Cantidad: ${newQuantity}`,
        };
      } else {
        // Agregar nuevo item
        newItems = [
          ...prev.items,
          {
            dish,
            quantity,
            subtotal: Number(dish.price) * quantity
          }
        ];

        toastMessage = {
          title: "Agregado al carrito",
          description: `${dish.name} x${quantity}`,
        };
      }

      // Diferir el toast para evitar actualizaciones durante render
      setTimeout(() => {
        toast(toastMessage);
      }, 0);

      return {
        ...prev,
        items: newItems,
        itemCount: calculateItemCount(newItems),
        total: calculateTotal(newItems)
        // NO abrir el carrito automáticamente
      };
    });
  }, [toast]);

  const removeItem = useCallback((dishId: string) => {
    setState(prev => {
      const newItems = prev.items.filter(item => item.dish.id !== dishId);

      return {
        ...prev,
        items: newItems,
        itemCount: calculateItemCount(newItems),
        total: calculateTotal(newItems)
      };
    });

    // Diferir el toast para evitar actualizaciones durante render
    setTimeout(() => {
      toast({
        title: "Eliminado del carrito",
        description: "El plato ha sido eliminado del carrito.",
      });
    }, 0);
  }, [toast]);

  const updateQuantity = useCallback((dishId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(dishId);
      return;
    }

    setState(prev => {
      const newItems = prev.items.map(item => {
        if (item.dish.id === dishId) {
          return {
            ...item,
            quantity,
            subtotal: Number(item.dish.price) * quantity
          };
        }
        return item;
      });

      return {
        ...prev,
        items: newItems,
        itemCount: calculateItemCount(newItems),
        total: calculateTotal(newItems)
      };
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setState({
      items: [],
      isOpen: false,
      itemCount: 0,
      total: 0
    });

    // Diferir el toast para evitar actualizaciones durante render
    setTimeout(() => {
      toast({
        title: "Carrito vaciado",
        description: "Todos los items han sido eliminados del carrito.",
      });
    }, 0);
  }, [toast]);

  const openCart = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closeCart = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggleCart = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
}

