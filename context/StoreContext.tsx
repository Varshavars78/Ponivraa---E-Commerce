import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, User, Review, PaymentSettings } from '../types';
import { StorageService } from '../services/storage';

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  user: User | null;
  isAdmin: boolean;
  refreshAuth: () => void;
  products: Product[];
  refreshProducts: () => void;
  deleteProduct: (id: string) => void;
  addProductReview: (productId: string, review: Review) => void;
  deleteProductReview: (productId: string, reviewId: string) => void;
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: PaymentSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({ upiEnabled: true, razorpayEnabled: false });

  useEffect(() => {
    const savedCart = localStorage.getItem('ponivraa_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    refreshAuth();
    refreshProducts();
    refreshSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('ponivraa_cart', JSON.stringify(cart));
  }, [cart]);

  const refreshAuth = () => {
    setUser(StorageService.getCurrentUser());
  };

  const refreshProducts = () => {
    setProducts(StorageService.getProducts());
  };
  
  const refreshSettings = () => {
    setPaymentSettings(StorageService.getPaymentSettings());
  };

  const deleteProduct = (id: string) => {
    // Delete from storage and get the updated list immediately
    const updatedList = StorageService.deleteProduct(id);
    // Set the state to the updated list directly
    setProducts(updatedList);
  };

  const addProductReview = (productId: string, review: Review) => {
    StorageService.addReview(productId, review);
    refreshProducts(); // Refresh to get updated rating
  };

  const deleteProductReview = (productId: string, reviewId: string) => {
    StorageService.deleteReview(productId, reviewId);
    refreshProducts();
  };

  const updatePaymentSettings = (settings: PaymentSettings) => {
    StorageService.savePaymentSettings(settings);
    setPaymentSettings(settings);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <StoreContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal,
      user, isAdmin: user?.role === 'admin', refreshAuth, products, refreshProducts, deleteProduct, addProductReview, deleteProductReview,
      paymentSettings, updatePaymentSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};