-- ==========================================================================
-- مخطط قاعدة بيانات متجر العطور (Supabase)
-- شغّل الملف كامل مرة واحدة في: Supabase Dashboard > SQL Editor > New query > Run
-- ==========================================================================

-- ===== جدول المنتجات =====
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price numeric not null,
  "shortDescription" text,
  description text,
  image text,
  gallery jsonb,
  stock integer not null default 0,
  category text,
  seo_title text,
  seo_description text,
  created_at timestamptz default now()
);

-- ===== جدول الطلبات =====
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'جديد',
  created_at timestamptz default now()
);

-- ===== ملاحظات العملاء (CRM) =====
create table if not exists customer_notes (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  note text not null,
  created_at timestamptz default now()
);

-- ==========================================================================
-- سياسات الأمان (Row Level Security)
-- ==========================================================================
alter table products enable row level security;
alter table orders enable row level security;
alter table customer_notes enable row level security;

-- المنتجات: الجمهور يقرأ فقط، الموظف (مسجّل الدخول) يدير الكل.
drop policy if exists "products_public_read" on products;
create policy "products_public_read" on products
  for select to anon, authenticated using (true);

drop policy if exists "products_admin_all" on products;
create policy "products_admin_all" on products
  for all to authenticated using (true) with check (true);

-- الطلبات: أي زائر ينشئ طلب، الموظف فقط يقرأ/يعدّل/يحذف.
drop policy if exists "orders_public_insert" on orders;
create policy "orders_public_insert" on orders
  for insert to anon, authenticated with check (true);

drop policy if exists "orders_admin_read" on orders;
create policy "orders_admin_read" on orders
  for select to authenticated using (true);

drop policy if exists "orders_admin_update" on orders;
create policy "orders_admin_update" on orders
  for update to authenticated using (true) with check (true);

drop policy if exists "orders_admin_delete" on orders;
create policy "orders_admin_delete" on orders
  for delete to authenticated using (true);

-- ملاحظات العملاء: الموظف فقط.
drop policy if exists "notes_admin_all" on customer_notes;
create policy "notes_admin_all" on customer_notes
  for all to authenticated using (true) with check (true);

-- ==========================================================================
-- تعبئة المنتجات الأولية (نفس بيانات العرض)
-- ==========================================================================
insert into products (slug, name, price, "shortDescription", description, image, gallery, stock, category)
values
('oud-royale', 'عود رويال', 540,
 'عود كمبودي فاخر بلمسة من المسك الأبيض.',
 'عطر شرقي فاخر يجمع بين دفء العود الكمبودي الأصيل ونعومة المسك الأبيض. ثباته عالٍ يدوم طوال اليوم، ومناسب للمناسبات والسهرات.',
 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
 '["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80","https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80","https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80"]'::jsonb,
 12, 'عطور شرقية'),
('rose-damascena', 'وردة دمشقية', 380,
 'ماء الورد الدمشقي مع قاعدة من خشب الصندل.',
 'عبير الوردة الدمشقية النقية في تناغم راقٍ مع خشب الصندل، يمنحك إحساسًا بالأناقة والنعومة في آن واحد.',
 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
 null, 20, 'عطور زهرية'),
('amber-nights', 'ليالي العنبر', 460,
 'عنبر دافئ مع توابل شرقية وفانيليا.',
 'تركيبة غنية من العنبر الدافئ والتوابل الشرقية والفانيليا، عطر مسائي يترك أثرًا لا يُنسى.',
 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
 '["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80","https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80"]'::jsonb,
 8, 'عطور شرقية'),
('citrus-breeze', 'نسيم الحمضيات', 290,
 'انتعاش الليمون والبرغموت لإطلالة نهارية.',
 'عطر منعش يفتح بالليمون الإيطالي والبرغموت، مثالي للأجواء النهارية والعمل.',
 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
 null, 25, 'عطور منعشة'),
('white-musk', 'مسك أبيض', 320,
 'مسك أبيض نقي ناعم ومناسب للاستخدام اليومي.',
 'نقاء المسك الأبيض في أبسط وأرقى صوره، عطر هادئ ومريح يناسب كل الأوقات.',
 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80',
 null, 30, 'عطور يومية'),
('saffron-luxe', 'زعفران لوكس', 610,
 'زعفران فاخر مع الجلد والعود.',
 'تحفة عطرية تجمع الزعفران الثمين مع لمسات الجلد والعود، عطر يعكس الفخامة والتميّز.',
 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80',
 null, 6, 'عطور شرقية')
on conflict (slug) do nothing;
