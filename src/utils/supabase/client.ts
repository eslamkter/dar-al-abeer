import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** عميل Supabase للاستخدام في مكوّنات المتصفح (client components). */
export const createClient = () =>
  createBrowserClient(supabaseUrl!, supabaseKey!);
