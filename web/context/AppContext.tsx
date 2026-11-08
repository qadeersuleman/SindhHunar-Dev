'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/supabase';
import { fetchLiveProducts } from '@/lib/services';
import { translations, Language } from '@/lib/translations';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: typeof translations['en'];
  products: Product[];
  loadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOrdersModalOpen: boolean;
  setIsOrdersModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('sindh_hunar_lang') as Language;
        if (savedLang && ['en', 'sd', 'ur'].includes(savedLang)) return savedLang;
      } catch (e) {
        console.error(e);
      }
    }
    return 'en';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('sindh_hunar_cart');
        if (savedCart) return JSON.parse(savedCart);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  const isRTL = language === 'sd' || language === 'ur';
  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sindh_hunar_lang', lang);
      document.documentElement.dir = (lang === 'sd' || lang === 'ur') ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    } catch (e) {
      console.error(e);
    }
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sindh_hunar_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Fetch real-time products directly from Supabase DB
  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await fetchLiveProducts();
      if (!error && data) {
        setProducts(data);
      } else {
        // Empty state when DB is empty or fails — NO dummy items
        setProducts([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        products,
        loadingProducts,
        refreshProducts: loadProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
