/** عنصر داخل سلة التسوق. */
export interface CartItem {
  productId?: string;
  variantId?: string;
  id: string;
  slug: string;
  name: string;
  price: number; // السعر المدفوع (بعد الخصم لو فيه عرض)
  originalPrice?: number; // السعر قبل الخصم (لحساب التوفير)
  image: string;
  quantity: number;
  stock?: number;
}

/** بيانات العميل عند تأكيد الطلب. */
export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

/** حالات الطلب في الداشبورد لاحقًا. */
export type OrderStatus = "جديد" | "قيد التنفيذ" | "تم التسليم";

/** الطلب المسجّل في قاعدة البيانات. */
export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

/** نوع المنتج — نفس الشكل في قاعدة بيانات Supabase لاحقًا. */
export interface Product {
  brand?: string;
  unitPrice?: { quantity: number; referenceQuantity: number; unit: string };
  productId?: string;
  selectedVariantId?: string;
  kind?: "perfume" | "incense" | "oud";
  concentration?: string;
  intensity?: string;
  size?: string;
  origin?: string;
  usage?: string;
  care?: string;
  variants?: { unitPrice?: { quantity:number;referenceQuantity:number;unit:string }; id: string; label: string; price: number; stock: number; image?: string; gallery?: string[] }[];
  id: string;
  slug: string;
  name: string;
  price: number;
  /** وصف مختصر يظهر في الكتالوج. */
  shortDescription: string;
  /** وصف كامل يظهر في صفحة المنتج. */
  description: string;
  /** رابط الصورة الرئيسية. */
  image: string;
  /** صور إضافية لصفحة التفاصيل. */
  gallery?: string[];
  /** الكمية المتاحة في المخزون. */
  stock: number;
  category?: string;
  /** الجنس المستهدف: رجالي / نسائي / للجنسين. */
  gender?: string;
  /** سعر بعد الخصم (لو موجود وأقل من السعر = فيه عرض). */
  sale_price?: number | null;
  /** نافذة العرض الاختيارية — العرض يبدأ/ينتهي تلقائيًا. */
  discount_start?: string | null;
  discount_end?: string | null;
  /** مفاتيح يدوية للتاجر (تتجاوز التلقائي). */
  is_featured?: boolean;
  is_bestseller?: boolean;
  /** شارة ترويجية يدوية، مثال: "أفضل قيمة". */
  badge?: string | null;
  created_at?: string;
  /** إعدادات SEO (اختيارية) — تُدار من الداشبورد. */
  seo_title?: string;
  seo_description?: string;
}
