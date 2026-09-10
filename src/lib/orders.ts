import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "./supabase";
import type { CartItem, CustomerInfo, Order } from "./types";

/**
 * تسجيل طلب جديد في قاعدة البيانات (جدول "orders").
 * الطلب بيتخزّن على الخادم، فصاحب المتجر يشوفه من الداشبورد
 * مهما كان الجهاز أو المتصفح اللي اتبعت منه.
 *
 * لو Supabase مش مفعّل (بيئة تطوير بدون مفاتيح)، بيحفظ محليًا كاحتياط.
 */
export async function createOrder(
  customer: CustomerInfo,
  items: CartItem[],
  total: number
): Promise<Order> {
  const order: Order = {
    id: generateOrderRef(),
    customer,
    items,
    total,
    status: "جديد",
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const supabase = createClient();
    const { error } = await supabase.from("orders").insert({
      order_ref: order.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_address: customer.address,
      items: items,
      total: total,
      status: order.status,
    });
    if (error) throw new Error(error.message);
    return order;
  }

  // احتياطي محلي (بيئة بدون قاعدة بيانات)
  saveLocalOrder(order);
  return order;
}

/** رقم طلب مقروء، مثال: ORD-7F3K2. */
function generateOrderRef(): string {
  return "ORD-" + Date.now().toString(36).toUpperCase().slice(-5);
}

function saveLocalOrder(order: Order) {
  try {
    const key = "orders";
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as Order[];
    localStorage.setItem(key, JSON.stringify([order, ...existing]));
  } catch {
    // تجاهل
  }
}
