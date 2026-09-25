"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "./types";
import { getPriceInfo } from "./product-helpers";

/**
 * حالة سلة التسوق.
 * بتتخزّن في متصفح العميل (localStorage) عشان تفضل موجودة لو قفل الصفحة.
 */
interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  totalOriginal: number; // إجمالي الأسعار قبل الخصم
  totalSavings: number; // مقدار التوفير
  // السلة المنبثقة
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dar-al-abeer-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // تحميل السلة من المتصفح أول ما الصفحة تفتح.
  useEffect(() => {
    // Read browser storage after hydration; cancel if this provider unmounts.
    const frame=requestAnimationFrame(()=>{
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed.filter((item): item is CartItem => !!item && typeof item.id === "string" && typeof item.name === "string" && Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(item.quantity) && item.quantity > 0).map(item => ({...item,quantity:Math.min(item.quantity,item.stock ?? 99)})).filter(item => item.quantity > 0));
      }
    } catch {
      // تجاهل أي خطأ في القراءة
    }
    setLoaded(true);
    });
    return()=>cancelAnimationFrame(frame);
  }, []);

  // حفظ السلة في المتصفح مع أي تغيير.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // تجاهل أي خطأ في الحفظ
    }
  }, [items, loaded]);

  function addItem(product: Product, quantity = 1) {
    if (product.stock < 1 || !Number.isFinite(quantity) || quantity < 1) return;
    quantity = Math.floor(quantity);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock), stock: product.stock }
            : i
        );
      }
      const info = getPriceInfo(product);
      return [
        ...prev,
        {
          id: product.id,
          productId: product.productId || product.id,
          variantId: product.selectedVariantId,
          slug: product.slug,
          name: product.name,
          price: info.price, // السعر بعد الخصم لو فيه عرض
          originalPrice: info.original ?? info.price,
          image: product.image,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
        },
      ];
    });
    openCart(); // تفتح السلة المنبثقة تلقائيًا
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (!Number.isFinite(quantity)) return;
    quantity = Math.floor(quantity);
    if (quantity < 1) return removeItem(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity,i.stock ?? 99) } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalOriginal = items.reduce(
    (sum, i) => sum + (i.originalPrice ?? i.price) * i.quantity,
    0
  );
  const totalSavings = totalOriginal - totalPrice;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        totalItems,
        totalPrice,
        totalOriginal,
        totalSavings,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart لازم يكون جوّه CartProvider");
  return ctx;
}
