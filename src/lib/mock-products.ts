import type { Product } from "./types";

/**
 * بيانات احتياطية (تُستخدم لو Supabase غير متاح) — مطابقة لملف
 * docs/supabase-migration-2.sql. الصور من Unsplash (مسموح بها في next.config.ts).
 */
const img = {
  oud: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
  rose: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
  amber: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
  citrus: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
  musk: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
  saffron: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80",
};

export const mockProducts: Product[] = [
  { id: "1", slug: "oud-royale", name: "عود رويال", price: 540, shortDescription: "عود كمبودي فاخر بلمسة من المسك الأبيض.", description: "عطر شرقي فاخر يجمع بين دفء العود الكمبودي الأصيل ونعومة المسك الأبيض. ثباته عالٍ يدوم طوال اليوم.", image: img.oud, gallery: [img.oud, img.saffron, img.amber], stock: 12, category: "عطور شرقية", gender: "للجنسين", is_featured: true, is_bestseller: true, created_at: "2025-06-01" },
  { id: "2", slug: "rose-damascena", name: "وردة دمشقية", price: 380, shortDescription: "ماء الورد الدمشقي مع قاعدة من خشب الصندل.", description: "عبير الوردة الدمشقية النقية في تناغم راقٍ مع خشب الصندل.", image: img.rose, stock: 20, category: "عطور زهرية", gender: "نسائي", created_at: "2025-06-05" },
  { id: "3", slug: "amber-nights", name: "ليالي العنبر", price: 460, shortDescription: "عنبر دافئ مع توابل شرقية وفانيليا.", description: "تركيبة غنية من العنبر الدافئ والتوابل الشرقية والفانيليا.", image: img.amber, gallery: [img.amber, img.musk], stock: 8, category: "عطور شرقية", gender: "للجنسين", sale_price: 390, discount_start: "2026-09-01", discount_end: "2026-09-30", is_featured: true, created_at: "2025-07-10" },
  { id: "4", slug: "citrus-breeze", name: "نسيم الحمضيات", price: 290, shortDescription: "انتعاش الليمون والبرغموت لإطلالة نهارية.", description: "عطر منعش يفتح بالليمون الإيطالي والبرغموت، مثالي للعمل.", image: img.citrus, stock: 25, category: "عطور منعشة", gender: "رجالي", created_at: "2025-07-20" },
  { id: "5", slug: "white-musk", name: "مسك أبيض", price: 320, shortDescription: "مسك أبيض نقي ناعم للاستخدام اليومي.", description: "نقاء المسك الأبيض في أبسط وأرقى صوره.", image: img.musk, stock: 30, category: "مسك", gender: "للجنسين", created_at: "2025-08-01" },
  { id: "6", slug: "saffron-luxe", name: "زعفران لوكس", price: 610, shortDescription: "زعفران فاخر مع الجلد والعود.", description: "تحفة عطرية تجمع الزعفران الثمين مع لمسات الجلد والعود.", image: img.saffron, stock: 4, category: "عطور شرقية", gender: "رجالي", sale_price: 520, discount_start: "2026-09-01", discount_end: "2026-09-25", is_featured: true, is_bestseller: true, created_at: "2025-08-15" },
  { id: "7", slug: "midnight-oud", name: "عود منتصف الليل", price: 580, shortDescription: "عود داكن غامض مع الجلد.", description: "عطر ليلي جريء يمزج العود الداكن بالجلد والتوابل.", image: img.oud, stock: 7, category: "عود", gender: "رجالي", sale_price: 490, discount_end: "2026-10-15", badge: "الأكثر طلبًا", created_at: "2025-09-01" },
  { id: "8", slug: "royal-amber", name: "عنبر ملكي", price: 430, shortDescription: "عنبر كهرماني دافئ مع اللبان.", description: "دفء العنبر الكهرماني في تناغم مع اللبان العماني.", image: img.amber, stock: 15, category: "عطور شرقية", gender: "للجنسين", created_at: "2025-09-10" },
  { id: "9", slug: "jasmine-nights", name: "ليالي الياسمين", price: 360, shortDescription: "ياسمين عربي مع مسك ناعم.", description: "رقّة الياسمين العربي المتفتح ليلًا فوق قاعدة من المسك.", image: img.rose, stock: 18, category: "عطور زهرية", gender: "نسائي", created_at: "2026-09-02" },
  { id: "10", slug: "lemon-verbena", name: "لويزة الليمون", price: 270, shortDescription: "لويزة منعشة مع نعناع أخضر.", description: "انتعاش اللويزة والليمون مع لمسة نعناع، عطر صيفي خفيف.", image: img.citrus, stock: 22, category: "عطور منعشة", gender: "للجنسين", created_at: "2026-09-03" },
  { id: "11", slug: "vanilla-dusk", name: "غسق الفانيليا", price: 340, shortDescription: "فانيليا كريمية مع كراميل.", description: "دفء الفانيليا الكريمية مع لمسة كراميل، عطر حميمي.", image: img.musk, stock: 16, category: "عطور يومية", gender: "نسائي", sale_price: 280, discount_start: "2026-09-05", discount_end: "2026-09-28", created_at: "2025-05-20" },
  { id: "12", slug: "cambodian-oud", name: "عود كمبودي", price: 690, shortDescription: "عود كمبودي صافٍ بتعتيق طويل.", description: "أرقى درجات العود الكمبودي المعتّق، فخامة خالصة.", image: img.saffron, stock: 3, category: "عود", gender: "رجالي", is_featured: true, is_bestseller: true, created_at: "2025-04-10" },
  { id: "13", slug: "pink-peony", name: "بيوني وردي", price: 350, shortDescription: "بيوني نضر مع فريزيا.", description: "باقة من البيوني الوردي والفريزيا، أنوثة منعشة.", image: img.rose, stock: 19, category: "عطور زهرية", gender: "نسائي", created_at: "2025-06-25" },
  { id: "14", slug: "aqua-marine", name: "أكوا مارين", price: 300, shortDescription: "نوتات بحرية منعشة مع مسك.", description: "انتعاش النسمات البحرية مع مسك خفيف، حيوية نهارية.", image: img.citrus, stock: 21, category: "عطور منعشة", gender: "رجالي", created_at: "2026-09-01" },
  { id: "15", slug: "musk-tahara", name: "مسك الطهارة", price: 180, shortDescription: "مسك أبيض ناعم نقي.", description: "مسك الطهارة النقي، نظافة ونعومة تدوم.", image: img.musk, stock: 40, category: "مسك", gender: "نسائي", is_bestseller: true, created_at: "2025-03-15" },
  { id: "16", slug: "cedar-wood", name: "خشب الأرز", price: 410, shortDescription: "أرز جاف مع فيتيفر.", description: "دفء خشب الأرز الجاف مع الفيتيفر، عطر رجالي رصين.", image: img.oud, stock: 14, category: "عود", gender: "رجالي", created_at: "2025-07-05" },
  { id: "17", slug: "orange-blossom", name: "زهر البرتقال", price: 330, shortDescription: "نيرولي مشرق مع عسل.", description: "إشراقة زهر البرتقال (نيرولي) مع لمسة عسل.", image: img.rose, stock: 17, category: "عطور زهرية", gender: "نسائي", sale_price: 260, discount_start: "2026-09-04", discount_end: "2026-09-27", created_at: "2025-08-20" },
  { id: "18", slug: "silk-musk", name: "مسك الحرير", price: 390, shortDescription: "مسك حريري مع زهور بيضاء.", description: "نعومة المسك الحريري مع الزهور البيضاء، أناقة هادئة.", image: img.musk, stock: 13, category: "مسك", gender: "للجنسين", created_at: "2026-09-06" },
  { id: "19", slug: "imperial-saffron", name: "زعفران إمبراطوري", price: 650, shortDescription: "زعفران نادر مع ورد وعود.", description: "مزيج إمبراطوري من الزعفران النادر والورد التركي والعود.", image: img.saffron, stock: 6, category: "عطور شرقية", gender: "للجنسين", sale_price: 540, discount_start: "2026-09-01", discount_end: "2026-09-30", is_featured: true, badge: "أفضل قيمة", created_at: "2025-05-01" },
  { id: "20", slug: "fresh-bergamot", name: "برغموت منعش", price: 280, shortDescription: "برغموت إيطالي مع زنجبيل.", description: "حيوية البرغموت الإيطالي مع لسعة الزنجبيل، انتعاش نهاري.", image: img.citrus, stock: 24, category: "عطور منعشة", gender: "رجالي", created_at: "2025-09-05" },
];
