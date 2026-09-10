import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { CartItem, OrderStatus, Product } from "./types";

/** صف الطلب كما هو مخزّن في قاعدة البيانات. */
export interface OrderRow {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}

/** ملخص عميل مشتقّ من طلباته. */
export interface CustomerSummary {
  phone: string;
  name: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

async function db() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

// ===== الطلبات =====
export async function getOrders(): Promise<OrderRow[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as OrderRow[];
}

// ===== المنتجات (للإدارة) =====
export async function getAdminProducts(): Promise<Product[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as Product[];
}

export async function getAdminProductById(
  id: string
): Promise<Product | null> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Product;
}

// ===== العملاء (CRM) — مشتقّة من الطلبات =====
export async function getCustomers(): Promise<CustomerSummary[]> {
  const orders = await getOrders();
  const map = new Map<string, CustomerSummary>();

  for (const o of orders) {
    const existing = map.get(o.customer_phone);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += Number(o.total);
      // الطلبات مرتبة تنازليًا، فأول ظهور هو الأحدث
    } else {
      map.set(o.customer_phone, {
        phone: o.customer_phone,
        name: o.customer_name,
        ordersCount: 1,
        totalSpent: Number(o.total),
        lastOrderAt: o.created_at,
      });
    }
  }

  return Array.from(map.values());
}

export async function getCustomerOrders(
  phone: string
): Promise<OrderRow[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as OrderRow[];
}

// ===== ملاحظات العملاء =====
export interface CustomerNote {
  id: string;
  customer_phone: string;
  note: string;
  created_at: string;
}

export async function getCustomerNotes(
  phone: string
): Promise<CustomerNote[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("customer_notes")
    .select("*")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as CustomerNote[];
}
