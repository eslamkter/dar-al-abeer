import { createClient } from "@supabase/supabase-js";

/**
 * عميل Supabase عام (بدون تسجيل دخول) — للقراءة العامة زي المنتجات.
 * بياخد المفاتيح من .env.local. لو مش موجودة، بيرجع null والموقع يشتغل
 * على البيانات الوهمية.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;
