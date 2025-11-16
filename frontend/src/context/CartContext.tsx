import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Sweet } from '../services/api';

export interface CartItem {
  sweet: Sweet;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (sweet: Sweet, quantity?: number) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (sweet: Sweet, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => (item.sweet._id || item.sweet.id) === (sweet._id || sweet.id));
      if (existing) {
        return prev.map((item) =>
          (item.sweet._id || item.sweet.id) === (sweet._id || sweet.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { sweet, quantity }];
    });
  };

  const removeFromCart = (sweetId: string) => {
    setItems((prev) => prev.filter((item) => (item.sweet._id || item.sweet.id) !== sweetId));
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        (item.sweet._id || item.sweet.id) === sweetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.sweet.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

