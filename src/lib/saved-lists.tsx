"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type SavedItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
};

const COMPARE_LIMIT = 4;

type SavedListsValue = {
  wishlist: SavedItem[];
  compare: SavedItem[];
  toggleWishlist: (item: SavedItem) => void;
  toggleCompare: (item: SavedItem) => void;
  isWishlisted: (slug: string) => boolean;
  isCompared: (slug: string) => boolean;
};

const SavedListsContext = createContext<SavedListsValue | null>(null);

const WISHLIST_KEY = "dar-al-abeer-wishlist";
const COMPARE_KEY = "dar-al-abeer-compare";

function readList(key: string): SavedItem[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * قوائم "المفضلة" و"المقارنة" الحقيقية — بتتخزّن محليًا (localStorage)
 * وتتزامن مع زرار SaveToggleButtons في كل بطاقة منتج، والأزرار العائمة
 * في FloatingButtons. مفعّلة في دار العبير بس (عنده لوحة تحكم منتجات
 * حقيقية) — الثيمات التانية مش بتفعّل الأزرار العائمة دي أصلًا.
 */
export function SavedListsProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<SavedItem[]>([]);
  const [compare, setCompare] = useState<SavedItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWishlist(readList(WISHLIST_KEY));
    setCompare(readList(COMPARE_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // تجاهل
    }
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
    } catch {
      // تجاهل
    }
  }, [compare, hydrated]);

  function toggleWishlist(item: SavedItem) {
    setWishlist((prev) =>
      prev.some((p) => p.slug === item.slug)
        ? prev.filter((p) => p.slug !== item.slug)
        : [...prev, item]
    );
  }

  function toggleCompare(item: SavedItem) {
    setCompare((prev) => {
      if (prev.some((p) => p.slug === item.slug)) {
        return prev.filter((p) => p.slug !== item.slug);
      }
      if (prev.length >= COMPARE_LIMIT) return prev;
      return [...prev, item];
    });
  }

  return (
    <SavedListsContext.Provider
      value={{
        wishlist,
        compare,
        toggleWishlist,
        toggleCompare,
        isWishlisted: (slug) => wishlist.some((p) => p.slug === slug),
        isCompared: (slug) => compare.some((p) => p.slug === slug),
      }}
    >
      {children}
    </SavedListsContext.Provider>
  );
}

export function useSavedLists() {
  const ctx = useContext(SavedListsContext);
  if (!ctx) throw new Error("useSavedLists must be used inside SavedListsProvider");
  return ctx;
}

export const COMPARE_LIMIT_EXPORT = COMPARE_LIMIT;
