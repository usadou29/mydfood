import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'dfood_cart';

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // localStorage indisponible ou données corrompues
  }
  return [];
}

function saveCartToStorage(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // silencieux si localStorage indisponible
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCartFromStorage);

  // Persister le panier à chaque changement
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === (item.type || 'plat'));
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.type === existing.type
            ? { ...i, quantite: i.quantite + 1 }
            : i
        );
      }
      return [...prev, {
        id: item.id,
        type: item.type || 'plat', // 'plat' ou 'menu_famille'
        nom: item.nom,
        prix: Number(item.prix),
        image_url: item.image_url,
        quantite: 1,
      }];
    });
  }, []);

  const removeFromCart = useCallback((itemId, type = 'plat') => {
    setCart(prev => prev.filter(i => !(i.id === itemId && i.type === type)));
  }, []);

  const updateQuantite = useCallback((itemId, delta, type = 'plat') => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId && item.type === type) {
        const newQty = Math.max(0, item.quantite + delta);
        return newQty === 0 ? null : { ...item, quantite: newQty };
      }
      return item;
    }).filter(Boolean));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantite, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.prix * item.quantite, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantite,
    clearCart,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
}
