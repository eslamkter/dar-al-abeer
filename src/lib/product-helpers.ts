import type { Product } from "./types";

/** إعدادات عامة للشارات التلقائية. */
export const LOW_STOCK_THRESHOLD = 5; // "كمية محدودة" لما المخزون أقل من كده
export const NEW_ARRIVAL_DAYS = 30; // "جديد" خلال أول شهر

export interface PriceInfo {
  price: number; // السعر النهائي المعروض
  original: number | null; // السعر قبل الخصم (لو فيه عرض)
  discountPct: number | null;
  hasDiscount: boolean;
  endsAt: string | null; // نهاية العرض (للعدّاد التنازلي)
}

/** يحسب السعر الفعّال — بيحترم نافذة العرض الزمنية. */
export function getPriceInfo(p: Product, now: Date = new Date()): PriceInfo {
  const sale = p.sale_price ?? null;
  const started = !p.discount_start || new Date(p.discount_start) <= now;
  const notEnded = !p.discount_end || new Date(p.discount_end) >= now;
  const active = sale != null && sale < p.price && started && notEnded;

  if (!active) {
    return { price: p.price, original: null, discountPct: null, hasDiscount: false, endsAt: null };
  }
  return {
    price: sale!,
    original: p.price,
    discountPct: Math.round((1 - sale! / p.price) * 100),
    hasDiscount: true,
    endsAt: p.discount_end ?? null,
  };
}

export interface Badge {
  label: string;
  tone: "gold" | "ember" | "new" | "hot";
}

/** الشارات المعروضة على المنتج (تلقائية + يدوية). */
export function getBadges(p: Product, now: Date = new Date()): Badge[] {
  const badges: Badge[] = [];
  const { hasDiscount, discountPct } = getPriceInfo(p, now);

  if (hasDiscount) badges.push({ label: `خصم ${discountPct}%`, tone: "ember" });
  if (p.is_bestseller) badges.push({ label: "الأكثر مبيعًا", tone: "hot" });
  if (isNewArrival(p, now)) badges.push({ label: "جديد", tone: "new" });
  if (p.badge) badges.push({ label: p.badge, tone: "gold" }); // شارة يدوية
  if (p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD)
    badges.push({ label: `باقي ${p.stock}`, tone: "hot" });

  return badges;
}

export function isNewArrival(p: Product, now: Date = new Date()): boolean {
  if (!p.created_at) return false;
  const days = (now.getTime() - new Date(p.created_at).getTime()) / 86400000;
  return days <= NEW_ARRIVAL_DAYS;
}

export function hasActiveDiscount(p: Product, now: Date = new Date()): boolean {
  return getPriceInfo(p, now).hasDiscount;
}
