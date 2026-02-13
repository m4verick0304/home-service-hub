import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

export interface CartItem {
  service: Service;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalAmount: 0,
});

export const useCart = () => useContext(CartContext);

function parsePriceRange(priceRange: string | null): number {
  if (!priceRange) return 0;
  // Extract first number from strings like "₹199–499", "₹299", "₹500-1500"
  const match = priceRange.match(/(\d[\d,]*)/);
  if (match) return parseInt(match[1].replace(/,/g, ""), 10);
  return 0;
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem("sh-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem("sh-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (service: Service) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.service.id === service.id);
      if (existing) {
        return prev.map((i) =>
          i.service.id === service.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems((prev) => prev.filter((i) => i.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.service.id === serviceId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + parsePriceRange(i.service.price_range) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};
