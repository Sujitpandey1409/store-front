"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";

const storageKey = "bharat-commerce-cart-v2";
type CartItem = { product: Product; quantity: number; size: string | null };
type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (product: Product, size: string | null) => void;
  changeQuantity: (productId: string, size: string | null, quantity: number) => void;
  removeItem: (productId: string, size: string | null) => void;
};
const CartContext = createContext<CartContextValue | null>(null);

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const product = value as Partial<Product>;
  return typeof product.id === "string" && typeof product.slug === "string" &&
    typeof product.name === "string" && typeof product.price === "number" &&
    Number.isFinite(product.price) && typeof product.image === "string" &&
    typeof product.imageAlt === "string" && Array.isArray(product.sizes) &&
    typeof product.stock === "number" && Number.isInteger(product.stock) && product.stock >= 0 && typeof product.isSample === "boolean" && typeof product.isAvailable === "boolean";
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return isProduct(item.product) && typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) && item.quantity > 0 &&
    (typeof item.size === "string" || item.size === null);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) setItems(parsed.filter(isCartItem));
    } catch {
      try { window.localStorage.removeItem(storageKey); } catch { /* The cart still works in memory. */ }
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (isReady) {
      try { window.localStorage.setItem(storageKey, JSON.stringify(items)); }
      catch { /* Keep the cart usable when browser storage is unavailable. */ }
    }
  }, [isReady, items]);

  function addItem(product: Product, size: string | null) {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id && item.size === size);
      const max = product.isSample ? 99 : product.stock;
      if (existing && existing.quantity >= max) return current;
      if (existing) return current.map((item) => item === existing ? { ...item, product, quantity: item.quantity + 1 } : item);
      return [...current, { product, size, quantity: 1 }];
    });
  }

  function changeQuantity(productId: string, size: string | null, quantity: number) {
    if (quantity < 1) return removeItem(productId, size);
    setItems((current) => current.map((item) => {
      if (item.product.id !== productId || item.size !== size) return item;
      const max = item.product.isSample ? 99 : item.product.stock;
      return { ...item, quantity: Math.min(quantity, max) };
    }));
  }

  function removeItem(productId: string, size: string | null) {
    setItems((current) => current.filter((item) => item.product.id !== productId || item.size !== size));
  }

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    isReady,
    addItem,
    changeQuantity,
    removeItem,
  }), [isReady, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}
