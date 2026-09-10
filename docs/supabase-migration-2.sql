-- ==========================================================================
-- ترقية 2: أعمدة العروض/الشارات/الجنس + 20 منتجًا موزّعين على التصنيفات
-- شغّل الملف كامل مرة واحدة في: Supabase Dashboard > SQL Editor > Run
-- ==========================================================================

-- ===== أعمدة جديدة (آمنة: لو موجودة تتجاهل) =====
alter table products add column if not exists gender text;
alter table products add column if not exists sale_price numeric;
alter table products add column if not exists discount_start timestamptz;
alter table products add column if not exists discount_end timestamptz;
alter table products add column if not exists is_featured boolean default false;
alter table products add column if not exists is_bestseller boolean default false;
alter table products add column if not exists badge text;

-- ===== 20 منتجًا (upsert: يحدّث الموجود ويضيف الجديد) =====
insert into products
(slug, name, price, "shortDescription", description, image, gallery, stock, category, gender, sale_price, discount_start, discount_end, is_featured, is_bestseller, badge, created_at)
values
('oud-royale','عود رويال',540,'عود كمبودي فاخر بلمسة من المسك الأبيض.','عطر شرقي فاخر يجمع بين دفء العود الكمبودي الأصيل ونعومة المسك الأبيض. ثباته عالٍ يدوم طوال اليوم، ومناسب للمناسبات والسهرات.','https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80','["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80","https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80","https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80"]'::jsonb,12,'عطور شرقية','للجنسين',null,null,null,true,true,null,'2025-06-01'),
('rose-damascena','وردة دمشقية',380,'ماء الورد الدمشقي مع قاعدة من خشب الصندل.','عبير الوردة الدمشقية النقية في تناغم راقٍ مع خشب الصندل، يمنحك إحساسًا بالأناقة والنعومة.','https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',null,20,'عطور زهرية','نسائي',null,null,null,false,false,null,'2025-06-05'),
('amber-nights','ليالي العنبر',460,'عنبر دافئ مع توابل شرقية وفانيليا.','تركيبة غنية من العنبر الدافئ والتوابل الشرقية والفانيليا، عطر مسائي يترك أثرًا لا يُنسى.','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80','["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80","https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80"]'::jsonb,8,'عطور شرقية','للجنسين',390,'2026-09-01','2026-09-30',true,false,null,'2025-07-10'),
('citrus-breeze','نسيم الحمضيات',290,'انتعاش الليمون والبرغموت لإطلالة نهارية.','عطر منعش يفتح بالليمون الإيطالي والبرغموت، مثالي للأجواء النهارية والعمل.','https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',null,25,'عطور منعشة','رجالي',null,null,null,false,false,null,'2025-07-20'),
('white-musk','مسك أبيض',320,'مسك أبيض نقي ناعم للاستخدام اليومي.','نقاء المسك الأبيض في أبسط وأرقى صوره، عطر هادئ ومريح يناسب كل الأوقات.','https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80',null,30,'مسك','للجنسين',null,null,null,false,false,null,'2025-08-01'),
('saffron-luxe','زعفران لوكس',610,'زعفران فاخر مع الجلد والعود.','تحفة عطرية تجمع الزعفران الثمين مع لمسات الجلد والعود، عطر يعكس الفخامة والتميّز.','https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80',null,4,'عطور شرقية','رجالي',520,'2026-09-01','2026-09-25',true,true,null,'2025-08-15'),
('midnight-oud','عود منتصف الليل',580,'عود داكن غامض مع الجلد.','عطر ليلي جريء يمزج العود الداكن بالجلد والتوابل، حضور طاغٍ للمناسبات الخاصة.','https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',null,7,'عود','رجالي',490,null,'2026-10-15',false,false,'الأكثر طلبًا','2025-09-01'),
('royal-amber','عنبر ملكي',430,'عنبر كهرماني دافئ مع اللبان.','دفء العنبر الكهرماني في تناغم مع اللبان العماني، عطر يليق بالأمسيات.','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',null,15,'عطور شرقية','للجنسين',null,null,null,false,false,null,'2025-09-10'),
('jasmine-nights','ليالي الياسمين',360,'ياسمين عربي مع مسك ناعم.','رقّة الياسمين العربي المتفتح ليلًا فوق قاعدة من المسك الناعم.','https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',null,18,'عطور زهرية','نسائي',null,null,null,false,false,null,'2026-09-02'),
('lemon-verbena','لويزة الليمون',270,'لويزة منعشة مع نعناع أخضر.','انتعاش اللويزة والليمون مع لمسة نعناع، عطر صيفي خفيف.','https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',null,22,'عطور منعشة','للجنسين',null,null,null,false,false,null,'2026-09-03'),
('vanilla-dusk','غسق الفانيليا',340,'فانيليا كريمية مع كراميل.','دفء الفانيليا الكريمية مع لمسة كراميل، عطر حميمي ودود.','https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80',null,16,'عطور يومية','نسائي',280,'2026-09-05','2026-09-28',false,false,null,'2025-05-20'),
('cambodian-oud','عود كمبودي',690,'عود كمبودي صافٍ بتعتيق طويل.','أرقى درجات العود الكمبودي المعتّق، فخامة خالصة لعشّاق العود.','https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80',null,3,'عود','رجالي',null,null,null,true,true,null,'2025-04-10'),
('pink-peony','بيوني وردي',350,'بيوني نضر مع فريزيا.','باقة من البيوني الوردي والفريزيا، أنوثة منعشة وراقية.','https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',null,19,'عطور زهرية','نسائي',null,null,null,false,false,null,'2025-06-25'),
('aqua-marine','أكوا مارين',300,'نوتات بحرية منعشة مع مسك.','انتعاش النسمات البحرية مع مسك خفيف، حيوية نهارية.','https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',null,21,'عطور منعشة','رجالي',null,null,null,false,false,null,'2026-09-01'),
('musk-tahara','مسك الطهارة',180,'مسك أبيض ناعم نقي.','مسك الطهارة النقي، نظافة ونعومة تدوم، مفضّل للاستخدام اليومي.','https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80',null,40,'مسك','نسائي',null,null,null,false,true,null,'2025-03-15'),
('cedar-wood','خشب الأرز',410,'أرز جاف مع فيتيفر.','دفء خشب الأرز الجاف مع الفيتيفر، عطر رجالي أنيق ورصين.','https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',null,14,'عود','رجالي',null,null,null,false,false,null,'2025-07-05'),
('orange-blossom','زهر البرتقال',330,'نيرولي مشرق مع عسل.','إشراقة زهر البرتقال (نيرولي) مع لمسة عسل، بهجة ناعمة.','https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',null,17,'عطور زهرية','نسائي',260,'2026-09-04','2026-09-27',false,false,null,'2025-08-20'),
('silk-musk','مسك الحرير',390,'مسك حريري مع زهور بيضاء.','نعومة المسك الحريري مع الزهور البيضاء، أناقة هادئة.','https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80',null,13,'مسك','للجنسين',null,null,null,false,false,null,'2026-09-06'),
('imperial-saffron','زعفران إمبراطوري',650,'زعفران نادر مع ورد وعود.','مزيج إمبراطوري من الزعفران النادر والورد التركي والعود، فخامة استثنائية.','https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80',null,6,'عطور شرقية','للجنسين',540,'2026-09-01','2026-09-30',true,false,'أفضل قيمة','2025-05-01'),
('fresh-bergamot','برغموت منعش',280,'برغموت إيطالي مع زنجبيل.','حيوية البرغموت الإيطالي مع لسعة الزنجبيل، انتعاش رجالي نهاري.','https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',null,24,'عطور منعشة','رجالي',null,null,null,false,false,null,'2025-09-05')
on conflict (slug) do update set
  name=excluded.name, price=excluded.price, "shortDescription"=excluded."shortDescription",
  description=excluded.description, image=excluded.image, gallery=excluded.gallery,
  stock=excluded.stock, category=excluded.category, gender=excluded.gender,
  sale_price=excluded.sale_price, discount_start=excluded.discount_start,
  discount_end=excluded.discount_end, is_featured=excluded.is_featured,
  is_bestseller=excluded.is_bestseller, badge=excluded.badge, created_at=excluded.created_at;
