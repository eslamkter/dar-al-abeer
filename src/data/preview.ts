import {
  L,
  storeSchema,
  type Kind,
  type Text,
  type HomeSection,
} from "@/lib/schema";
import { extraLabels } from "./labels";
import { pageSections } from "./page-copy";
import { legacyRedirects } from "./legacy-redirects";
const image = (name: string) => `/images/${name}.webp`;
const media = (asset: string, name: Text) => [
  {
    src: image(asset),
    alt: L(
      `تصوير توضيحي لمجموعة ${name.ar}`,
      `Illustrative collection photography: ${name.en}`,
    ),
    illustrative: true,
    view: "full",
  },
  {
    src: image(asset),
    alt: L(
      `تفصيل مكبّر من الصورة التوضيحية: ${name.ar}`,
      `Enlarged detail of the illustrative photograph: ${name.en}`,
    ),
    illustrative: true,
    view: "detail",
  },
];
const base = (
  id: string,
  name: Text,
  kind: Kind,
  asset: string,
  family: string,
  notes: string[],
  occasions = ["everyday", "evening"],
) => ({
  id,
  slug: id,
  name,
  kind,
  brand: "shadha",
  published: true,
  sample: true,
  family,
  notes,
  occasions,
  createdAt: "2026-09-20",
  summary: L("تفاصيل قليلة. أثر يبقى.", "Quiet details. A lasting impression."),
  description: L(
    "تكوين عطري من مجموعة شذا التوضيحية. اقرأ تفاصيل النوتات والحجم لتختار ما يلائم ذوقك. الصور تعبّر عن تصميم المجموعة ولا تمثّل تصويرًا تجاريًا لمنتج حقيقي.",
    "A fragrance composition from the illustrative Shadha collection. Explore its notes and size to find your preference. Images show the collection packaging concept, not photography of real merchant inventory.",
  ),
  usage: L(
    "استخدم وفق تعليمات العبوة. جرّب كمية صغيرة أولًا.",
    "Follow the packaging instructions. Try a small amount first.",
  ),
  care: L(
    "يحفظ بعيدًا عن الحرارة وأشعة الشمس ومتناول الأطفال.",
    "Keep away from heat, sunlight and children.",
  ),
  alternatives: [] as string[],
  complements: [] as string[],
  giftEligible: true,
  sampleId: null as string | null,
  intensity: "balanced" as const,
  performanceNote: null,
  asset,
});
const variant = (
  pid: string,
  id: string,
  label: Text,
  price: number,
  asset: string,
  name: Text,
  extra: object = {},
  stock = 12,
) => ({
  id,
  sku: `SH-${pid}-${id}`.toUpperCase(),
  label,
  price,
  compareAt: null,
  stock,
  media: media(asset, name),
  ...extra,
});
const perfumeRows: [
  string,
  string,
  string,
  string,
  string,
  string[],
  number,
][] = [
  [
    "amber-nights",
    "ليل العنبر",
    "Amber nights",
    "amber",
    "amber",
    ["amber", "oud", "saffron"],
    285,
  ],
  [
    "rose-dawn",
    "فجر الورد",
    "Rose dawn",
    "rose",
    "floral",
    ["rose", "musk", "bergamot"],
    245,
  ],
  [
    "green-hour",
    "ساعة خضراء",
    "The green hour",
    "green",
    "fresh",
    ["bergamot", "cedar", "musk"],
    225,
  ],
  [
    "oud-royale",
    "عود رويال",
    "Oud royale",
    "amber",
    "woody",
    ["oud", "saffron", "amber"],
    345,
  ],
  [
    "soft-musk",
    "همس المسك",
    "Musk whisper",
    "rose",
    "musk",
    ["musk", "rose", "vanilla"],
    195,
  ],
  [
    "cedar-path",
    "درب الأرز",
    "Cedar path",
    "green",
    "woody",
    ["cedar", "bergamot", "oud"],
    265,
  ],
  [
    "saffron-evening",
    "مساء الزعفران",
    "Saffron evening",
    "amber",
    "amber",
    ["saffron", "amber", "vanilla"],
    295,
  ],
  [
    "rose-letter",
    "رسالة ورد",
    "A rose letter",
    "rose",
    "floral",
    ["rose", "vanilla", "musk"],
    235,
  ],
];
const perfumes = perfumeRows.map(
  ([id, ar, en, asset, family, notes, price], i) => {
    const name = L(ar, en);
    return {
      ...base(
        id,
        name,
        "perfume",
        asset,
        family,
        notes,
        i % 2 ? ["everyday", "gifting"] : ["evening", "gifting"],
      ),
      audience: "unisex",
      intensity: ["soft", "balanced", "rich"][i % 3],
      summary: L(
        `${notes.map((n) => ({ oud: "عود", amber: "عنبر", rose: "ورد", musk: "مسك", bergamot: "برغموت", cedar: "أرز", saffron: "زعفران", vanilla: "فانيليا" })[n]).join("، ")} — تكوين متوازن.`,
        `${notes.join(", ")} — a balanced composition.`,
      ),
      pyramid: { top: [notes[2]], heart: [notes[1]], base: [notes[0]] },
      sampleId:
        id === "amber-nights"
          ? "amber-sample"
          : id === "rose-dawn"
            ? "rose-sample"
            : null,
      alternatives: (
        {
          "amber-nights": ["saffron-evening"],
          "rose-dawn": ["rose-letter"],
          "green-hour": ["cedar-path"],
          "oud-royale": ["amber-nights"],
          "soft-musk": ["rose-dawn"],
          "cedar-path": ["oud-royale"],
          "saffron-evening": ["amber-nights"],
          "rose-letter": ["soft-musk"],
        } as Record<string, string[]>
      )[id],
      complements: ["gathering-bakhoor"],
      variants: [
        variant(
          id,
          "50",
          L("٥٠ مل · أو دو بارفان", "50 ml · Eau de parfum"),
          price,
          asset,
          name,
          { volumeMl: 50, concentration: "EDP" },
          i === 5 ? 0 : 12,
        ),
        variant(
          id,
          "100",
          L("١٠٠ مل · أو دو بارفان", "100 ml · Eau de parfum"),
          price + 100,
          asset,
          name,
          { volumeMl: 100, concentration: "EDP" },
          8,
        ),
      ],
    };
  },
);
const oils = [
  ["oud-oil", "دهن الدار", "House oud oil"],
  ["musk-oil", "مسك ناعم", "Soft musk oil"],
  ["rose-oil", "زيت الورد", "Rose oil"],
].map(([id, ar, en], i) => {
  const name = L(ar, en);
  return {
    ...base(
      id,
      name,
      "oil",
      "oil",
      i === 1 ? "musk" : i === 2 ? "floral" : "woody",
      [i === 0 ? "oud" : i === 1 ? "musk" : "rose"],
    ),
    oilType: i === 0 ? "dehn-oud" : i === 1 ? "musk" : "perfume-oil",
    origin: null,
    applicator: L("عود زجاجي للتطبيق", "Glass applicator"),
    variants: [
      variant(id, "6", L("٦ مل", "6 ml"), 125 + i * 35, "oil", name, {
        volumeMl: 6,
      }),
      variant(id, "12", L("١٢ مل", "12 ml"), 215 + i * 35, "oil", name, {
        volumeMl: 12,
      }),
    ],
  };
});
const ouds = [
  ["oud-chips", "رقائق العود", "Oud chips"],
  ["oud-selection", "اختيار العود", "Oud selection"],
].map(([id, ar, en], i) => {
  const name = L(ar, en);
  return {
    ...base(id, name, "oud", "oud", "woody", ["oud"]),
    origin: null,
    grade: null,
    heatingMethod: L(
      "مبخرة مناسبة مع تهوية جيدة",
      "Suitable incense burner with good ventilation",
    ),
    usage: L(
      "استخدم كمية صغيرة في مبخرة مناسبة. لا تترك الحرارة دون مراقبة.",
      "Use a small amount in a suitable burner. Never leave heat unattended.",
    ),
    variants: [
      variant(id, "25", L("٢٥ غ", "25 g"), 155 + i * 90, "oud", name, {
        weightG: 25,
      }),
      variant(id, "50", L("٥٠ غ", "50 g"), 280 + i * 90, "oud", name, {
        weightG: 50,
      }),
    ],
  };
});
const bakhoors = [
  ["gathering-bakhoor", "بخور المجلس", "Gathering bakhoor"],
  ["amber-bakhoor", "بخور العنبر", "Amber bakhoor"],
].map(([id, ar, en], i) => {
  const name = L(ar, en);
  return {
    ...base(id, name, "bakhoor", "bakhoor", "amber", ["oud", "amber"]),
    blend: L(
      i ? "خلطة عنبر وخشب" : "خلطة خشبية دافئة",
      i ? "Amber and wood blend" : "Warm wood blend",
    ),
    baseMaterial: L("رقائق خشبية معطرة", "Scented wood flakes"),
    heatingMethod: L(
      "مبخرة بخور مع تهوية",
      "Incense burner in a ventilated space",
    ),
    variants: [
      variant(id, "40", L("٤٠ غ", "40 g"), 95 + i * 20, "bakhoor", name, {
        weightG: 40,
      }),
      variant(id, "80", L("٨٠ غ", "80 g"), 170 + i * 25, "bakhoor", name, {
        weightG: 80,
      }),
    ],
  };
});
const maamoulName = L("معمول المساء", "Evening maamoul");
const maamoul = {
  ...base("evening-maamoul", maamoulName, "maamoul", "maamoul", "amber", [
    "amber",
    "musk",
  ]),
  blend: L("تركيبة خشبية مضغوطة", "Pressed wood blend"),
  heatingMethod: L(
    "حرارة مبخرة معتدلة وتهوية",
    "Moderate incense heat and ventilation",
  ),
  variants: [
    variant(
      "evening-maamoul",
      "8",
      L("٨ قطع · ٤٠ غ", "8 pieces · 40 g"),
      115,
      "maamoul",
      maamoulName,
      { weightG: 40, pieces: 8 },
    ),
  ],
};
const diffuserName = L("شذا البيت", "The house diffuser");
const diffuser = {
  ...base(
    "house-diffuser",
    diffuserName,
    "diffuser",
    "home",
    "fresh",
    ["cedar", "bergamot"],
    ["home"],
  ),
  reedCount: 6,
  refillIds: [],
  variants: [
    variant(
      "house-diffuser",
      "150",
      L("١٥٠ مل", "150 ml"),
      165,
      "home",
      diffuserName,
      { volumeMl: 150 },
    ),
  ],
};
const sprayName = L("رذاذ الدار", "House mist");
const spray = {
  ...base(
    "house-mist",
    sprayName,
    "home-spray",
    "green",
    "fresh",
    ["bergamot", "musk"],
    ["home"],
  ),
  suitableSurfaces: L(
    "هواء الغرفة؛ لا يرش على البشرة أو الأقمشة دون اختبار",
    "Room air; not for skin. Test before use on fabrics.",
  ),
  variants: [
    variant(
      "house-mist",
      "100",
      L("١٠٠ مل", "100 ml"),
      95,
      "green",
      sprayName,
      { volumeMl: 100 },
    ),
  ],
};
const burners = [
  ["stone-burner", "مبخرة الحجر", "Stone burner"],
  ["ritual-burner", "مبخرة الطقس", "Ritual burner"],
].map(([id, ar, en], i) => {
  const name = L(ar, en);
  return {
    ...base(id, name, "burner", "burner", "woody", [], ["home", "gifting"]),
    material: L("حجر مع وعاء معدني", "Stone with a metal insert"),
    heatSource: "charcoal",
    voltage: null,
    powerW: null,
    usage: L(
      "ضعها على سطح مقاوم للحرارة. لا تلمس الوعاء أثناء الاستخدام.",
      "Place on a heat-resistant surface. Do not touch the insert during use.",
    ),
    variants: [
      variant(
        id,
        "stone",
        L("حجر طبيعي", "Natural stone"),
        185 + i * 40,
        "burner",
        name,
        {
          widthCm: 10 + i * 2,
          depthCm: 10 + i * 2,
          heightCm: 9 + i * 2,
          finish: L("حجري مطفي", "Matte stone"),
        },
      ),
    ],
  };
});
const samples = perfumes
  .filter((p) => ["amber-nights", "rose-dawn"].includes(p.id))
  .map((p) => ({
    ...p,
    id: p.sampleId!,
    slug: p.sampleId!,
    name: L(`عينة ${p.name.ar}`, `${p.name.en} sample`),
    sampleId: null,
    giftEligible: false,
    variants: [
      variant(
        p.sampleId!,
        "2",
        L("عينة ٢ مل", "2 ml sample"),
        25,
        "discovery",
        p.name,
        { volumeMl: 2, concentration: "EDP" },
        20,
      ),
    ],
  }));
const sets = [
  {
    id: "house-gift",
    name: L("هدية الدار", "The house gift"),
    kind: "gift-set",
    asset: "gift",
    price: 420,
    contents: [
      { productId: "amber-nights", variantId: "50", quantity: 1 },
      { productId: "musk-oil", variantId: "6", quantity: 1 },
      { productId: "gathering-bakhoor", variantId: "40", quantity: 1 },
    ],
  },
  {
    id: "scent-discovery",
    name: L("بداية الحكاية", "A first discovery"),
    kind: "discovery-set",
    asset: "discovery",
    price: 45,
    contents: [
      { productId: "amber-sample", variantId: "2", quantity: 1 },
      { productId: "rose-sample", variantId: "2", quantity: 1 },
    ],
  },
].map((p) => ({
  ...base(
    p.id,
    p.name,
    p.kind as Kind,
    p.asset,
    "amber",
    ["amber", "rose"],
    ["gifting"],
  ),
  contents: p.contents,
  packaging: L(
    "علبة شذا التوضيحية؛ المحتويات المحددة أدناه هي المرجع",
    "Illustrative Shadha packaging; the listed contents below are authoritative",
  ),
  variants: [
    variant(
      p.id,
      "set",
      L("المجموعة الكاملة", "Complete set"),
      p.price,
      p.asset,
      p.name,
    ),
  ],
}));
const entry = (
  id: string,
  ar: string,
  en: string,
  description: Text,
  asset: string,
) => ({
  id,
  name: L(ar, en),
  description,
  image: image(asset),
  published: true,
});
const notes = [
  entry(
    "oud",
    "العود",
    "Oud",
    L(
      "خشب دافئ، بطابع عميق ومطمئن.",
      "Warm woods with a deep, reassuring character.",
    ),
    "oud",
  ),
  entry(
    "rose",
    "الورد",
    "Rose",
    L(
      "نفحات زهرية رقيقة تفتح التكوين.",
      "Delicate floral notes that open the composition.",
    ),
    "rose",
  ),
  entry(
    "amber",
    "العنبر",
    "Amber",
    L(
      "دفء ناعم يجمع الخشب والحلاوة.",
      "A soft warmth between woods and sweetness.",
    ),
    "amber",
  ),
  entry(
    "musk",
    "المسك",
    "Musk",
    L("ملمس عطري هادئ وقريب.", "A quiet, close-to-skin fragrance texture."),
    "oil",
  ),
  entry(
    "bergamot",
    "البرغموت",
    "Bergamot",
    L("بداية حمضية مضيئة وخضراء.", "A bright, green citrus opening."),
    "green",
  ),
  entry(
    "cedar",
    "الأرز",
    "Cedar",
    L("طابع خشبي جاف ونظيف.", "A dry, clean woody character."),
    "oud",
  ),
  entry(
    "saffron",
    "الزعفران",
    "Saffron",
    L("لمسة توابل دافئة في القلب.", "A warm spice accent at the heart."),
    "amber",
  ),
  entry(
    "vanilla",
    "الفانيليا",
    "Vanilla",
    L(
      "حلاوة مستديرة لتوازن القاعدة.",
      "Rounded sweetness to balance the base.",
    ),
    "oil",
  ),
].map((n) => ({ ...n, image: image("note-" + n.id) }));
const section = (
  id: HomeSection["kind"],
  title: Text,
  body: Text,
  asset = "",
  href = "",
  action = L("اكتشف المجموعة", "Explore the collection"),
  productIds: string[] = [],
): HomeSection => ({
  id,
  kind: id,
  title,
  body,
  image: asset ? image(asset) : "",
  href,
  action,
  productIds,
  banners: [],
  enabled: true,
  startsAt: null,
  endsAt: null,
  presentation: { gap: 32, imagePosition: "center", height: 500 },
});
export const preview = storeSchema.parse({
  version: 1,
  id: "shadha",
  preview: true,
  indexable: false,
  origin: "https://shadha.example",
  brand: L("شَـذَا", "SHADHA"),
  tagline: L("أثرٌ يشبهك", "A trace of you"),
  currency: "SAR",
  tokens: {
    canvas: "#F5F2EB",
    ink: "#332C28",
    muted: "#756A60",
    accent: "#62513C",
    onAccent: "#FFFFFF",
    surface: "#EEE8DC",
    line: "#DAD1C2",
    pageWidth: 1440,
    gutter: 32,
    sectionGap: 64,
    radius: 24,
    microMs: 220,
    revealMs: 800,
  },
  fonts: {
    ar: { heading: "Almarai", body: "Almarai" },
    en: { heading: "Plex Arabic", body: "Plex Arabic" },
    registry: [
      { family: "Almarai", src: "/fonts/almarai.ttf", weight: 400 },
      { family: "Almarai", src: "/fonts/almarai-bold.ttf", weight: 700 },
      {
        family: "Plex Arabic",
        src: "/fonts/PlexArabic-Regular.ttf",
        weight: 400,
      },
      {
        family: "Plex Arabic",
        src: "/fonts/PlexArabic-Medium.ttf",
        weight: 500,
      },
      {
        family: "Plex Arabic",
        src: "/fonts/PlexArabic-SemiBold.ttf",
        weight: 600,
      },
    ],
  },
  motion: "calm",
  announcement: {
    enabled: true,
    text: L(
      "من أول نفحة، تبدأ حكايتك. اكتشف مجموعة شذا.",
      "Your story begins with the first note. Discover Shadha.",
    ),
    href: "/collections/signatures",
  },
  features: {
    multiBrand: false,
    gifts: true,
    samples: true,
    wishlist: true,
    recent: true,
    compare: false,
    finder: true,
  },
  floating: {
    backToTop: true,
    whatsapp: false,
    compare: false,
    wishlist: false,
  },
  navigation: [
    {
      label: L("العطور", "Perfumes"),
      href: "/perfumes",
      children: [
        { label: L("بنفحات العود", "Oud notes"), href: "/perfumes/oud" },
        { label: L("بنفحات الورد", "Rose notes"), href: "/perfumes/rose" },
        { label: L("بنفحات العنبر", "Amber notes"), href: "/perfumes/amber" },
      ],
    },
    {
      label: L("العود والبخور", "Oud & incense"),
      href: "/incense",
      children: [
        { label: L("رقائق العود", "Oud chips"), href: "/incense/oud" },
        {
          label: L("خلطات البخور", "Bakhoor blends"),
          href: "/incense/bakhoor",
        },
        {
          label: L("معمول البخور", "Incense tablets"),
          href: "/incense/maamoul",
        },
        { label: L("المباخر", "Burners"), href: "/burners" },
      ],
    },
    { label: L("الزيوت العطرية", "Perfume oils"), href: "/oils" },
    { label: L("للبيت", "For the home"), href: "/home-fragrance" },
    { label: L("الهدايا", "Gifts"), href: "/gifts" },
    { label: L("عالم شذا", "Our world"), href: "/about" },
  ],
  footer: [
    {
      title: L("تسوّق شذا", "Shop Shadha"),
      links: [
        { label: L("كل المنتجات", "All products"), href: "/products" },
        { label: L("العطور", "Perfumes"), href: "/perfumes" },
        { label: L("العود والبخور", "Oud & incense"), href: "/incense" },
        { label: L("المباخر", "Burners"), href: "/burners" },
        { label: L("الهدايا", "Gifts"), href: "/gifts" },
      ],
    },
    {
      title: L("اكتشف عطرك", "Find your fragrance"),
      links: [
        { label: L("مكتبة النوتات", "The note library"), href: "/notes" },
        { label: L("حسب المناسبة", "By occasion"), href: "/occasions" },
        { label: L("مساعد الاختيار", "Scent finder"), href: "/scent-finder" },
        {
          label: L("مجموعات الاكتشاف", "Discovery sets"),
          href: "/discovery-sets",
        },
        { label: L("دليل العطر", "Fragrance journal"), href: "/guides" },
      ],
    },
    {
      title: L("نحن هنا لمساعدتك", "Here to help"),
      links: [
        { label: L("تواصل معنا", "Contact us"), href: "/contact" },
        {
          label: L("الشحن والاسترجاع", "Delivery & returns"),
          href: "/shipping",
        },
        { label: L("الأسئلة الشائعة", "Questions & answers"), href: "/faq" },
        { label: L("سياسة الخصوصية", "Privacy"), href: "/privacy" },
        { label: L("الشروط والأحكام", "Terms"), href: "/terms" },
      ],
    },
  ],
  home: [
    section(
      "hero",
      L("حكاية تبدأ بالعنبر،\nوتبقى معك.", "Amber begins\nthe story."),
      L(
        "عطور تلامس الذاكرة، وعود يملأ المكان دفئًا.\nاكتشف تفاصيل صغيرة تترك أثرًا يشبهك.",
        "Fragrances that stir a memory. Oud that warms a room.\nDiscover the small details that feel like you.",
      ),
      "hero-campaign",
      "/collections/signatures",
      L("تسوّق مجموعة شذا", "Shop the signature collection"),
    ),
    section(
      "trust",
      L("تفاصيل تستحق الاهتمام", "Thoughtful in every detail"),
      L("تعرف على اختياراتنا", "Explore our approach"),
    ),
    section(
      "categories",
      L("عالمٌ من شذا", "A world of Shadha"),
      L(
        "من عطرك اليومي إلى رائحة البيت.",
        "From your everyday fragrance to the scent of home.",
      ),
    ),
    section(
      "brands",
      L("دور تستحق الاكتشاف", "Houses worth discovering"),
      L(
        "اختيارات من الدور المتاحة في المتجر.",
        "Discover the houses available in the store.",
      ),
    ),
    section(
      "products",
      L("اختيارات تترك أثرًا", "Selected to stay with you"),
      L(
        "من دفء العنبر إلى نعومة الورد. اختر النفحة الأقرب إليك.",
        "From amber warmth to soft rose. Find the note that feels like you.",
      ),
      "",
      "/products",
      L("كل العطور", "All fragrances"),
      ["amber-nights", "rose-dawn", "green-hour", "oud-royale"],
    ),
    {
      ...section(
        "promotions",
        L("تفاصيل تُكمل التجربة", "Make the experience yours"),
        L("اكتشف، اختر، وأهدِ.", "Discover, choose, give."),
      ),
      banners: [
        {
          id: "gift-campaign",
          title: L("هدية تترك أثرًا", "A gift that stays with them"),
          body: L(
            "مجموعات مختارة، تغليف هدية، ورسالة منك.",
            "Curated sets, gift wrapping and a note from you.",
          ),
          action: L("اكتشف الهدايا", "Explore gifts"),
          href: "/gifts",
          image: image("gift"),
          mobileImage: "",
          enabled: true,
          startsAt: null,
          endsAt: null,
          imagePosition: "center",
          requirement: "gifts",
        },
        {
          id: "discovery-campaign",
          title: L("جرّب قبل أن تختار", "Find your signature first"),
          body: L(
            "تعرّف على الروائح مع عينات ومجموعات الاكتشاف.",
            "Meet the fragrances through samples and discovery sets.",
          ),
          action: L("تسوّق مجموعات الاكتشاف", "Shop discovery sets"),
          href: "/discovery-sets",
          image: image("discovery"),
          mobileImage: "",
          enabled: true,
          startsAt: null,
          endsAt: null,
          imagePosition: "center",
          requirement: "samples",
        },
      ],
    },
    section(
      "notes",
      L("اتبع النفحة\nالتي تحبّها.", "Follow the note\nyou love."),
      L(
        "خشبي، زهري، أم دافئ؟ اقترب من المكونات، ودع ذوقك يقودك.",
        "Woody, floral, or warm? Get to know the ingredients. Let your taste lead.",
      ),
      "oud",
      "/notes",
      L("مكتبة النوتات", "The note library"),
    ),
    section(
      "oud",
      L(
        "دفء المكان،\nوحكاية العود.",
        "The warmth of a room.\nThe story of oud.",
      ),
      L(
        "رقائق عود، خلطات بخور، ومباخر بتفاصيل هادئة. طقس صغير يعيد للمكان روحه.",
        "Oud chips, incense blends, and thoughtfully shaped burners. A small ritual that makes a room your own.",
      ),
      "oud",
      "/incense",
      L("اكتشف العود والبخور", "Explore oud & incense"),
      ["oud-chips", "gathering-bakhoor"],
    ),
    section(
      "occasions",
      L("لكل يوم، إحساس.", "A feeling for every day."),
      L(
        "اختر عطرك للحظة التي تنتظرك.",
        "Choose a fragrance for the moment ahead.",
      ),
      "rose",
    ),
    section(
      "gifts",
      L(
        "تُهدى بذوق.\nوتُذكر بشذا.",
        "Given with thought.\nRemembered by scent.",
      ),
      L(
        "هدية تجمع عطرًا تحبه وتفاصيل تقول أكثر. اختر المجموعة وأضف رسالتك.",
        "A favourite fragrance and details that say a little more. Choose a set and add your message.",
      ),
      "gift",
      "/gifts",
      L("اختر هديتك", "Find your gift"),
      ["house-gift", "scent-discovery"],
    ),
    section(
      "story",
      L(
        "قبل أن يصبح عطرًا،\nكان إحساسًا.",
        "Before it was a fragrance,\nit was a feeling.",
      ),
      L(
        "كيف تبدأ الحكاية من نفحة، وكيف تختار عطرًا ترتاح له؟ مساحة صغيرة للتعرّف، قبل الاختيار.",
        "How does a story begin with a note? And how do you find a fragrance that feels right? A little room to discover, before you choose.",
      ),
      "note-rose",
      "/guides/choose-fragrance",
      L("اقرأ الحكاية", "Read the story"),
    ),
    section(
      "reviews",
      L("كلمات من تجربة العطر", "Words from a fragrance experience"),
      L(
        "آراء توضيحية لعرض تصميم الثيم، وليست مراجعات شراء حقيقية.",
        "Illustrative reviews for the theme preview, not real purchase reviews.",
      ),
    ),
    section(
      "faq",
      L("للاختيار بثقة", "A little clarity before you choose"),
      L(
        "إجابات قريبة، لتجربة أبسط.",
        "Helpful answers for an easier experience.",
      ),
    ),
    section(
      "capture",
      L("رسالة تحمل شذا.", "A note from Shadha."),
      L(
        "اكتشف المجموعات الجديدة وقصص الروائح في بريدك.",
        "New collections and fragrance stories, delivered to your inbox.",
      ),
    ),
  ],
  products: [
    ...perfumes,
    ...oils,
    ...ouds,
    ...bakhoors,
    maamoul,
    diffuser,
    spray,
    ...burners,
    ...samples,
    ...sets,
  ],
  categories: [
    entry(
      "perfumes",
      "العطور",
      "Perfumes",
      L("نفحات تصاحب حضورك", "Fragrances for your presence"),
      "amber",
    ),
    entry(
      "incense",
      "العود والبخور",
      "Oud & incense",
      L("دفء، وطقس يتجدد", "Warmth and a daily ritual"),
      "oud",
    ),
    entry(
      "oils",
      "الزيوت العطرية",
      "Perfume oils",
      L("لمسة قريبة منك", "A personal finishing touch"),
      "oil",
    ),
    entry(
      "home-fragrance",
      "للبيت",
      "For the home",
      L("رائحة تستقبلك", "A scent to come home to"),
      "home",
    ),
    entry(
      "burners",
      "المباخر",
      "Burners",
      L("جمال في التفاصيل", "Beauty in the details"),
      "burner",
    ),
  ].map((c, i) => ({
    ...c,
    span: i === 0 ? 2 : 1,
    image: i === 0 ? image("amber") : c.image,
    kinds: [
      ["perfume"],
      ["oud", "bakhoor", "maamoul"],
      ["oil"],
      ["diffuser", "home-spray"],
      ["burner"],
    ][i],
  })),
  notes,
  families: [
    entry(
      "woody",
      "خشبي",
      "Woody",
      L("دفء الأخشاب وتفاصيلها", "The warmth and texture of wood"),
      "oud",
    ),
    entry(
      "floral",
      "زهري",
      "Floral",
      L("ورد ونفحات ناعمة", "Rose and softer notes"),
      "rose",
    ),
    entry(
      "amber",
      "عنبري",
      "Amber",
      L("تكوين دافئ ومستدير", "Warm, rounded compositions"),
      "amber",
    ),
    entry("musk", "مسكي", "Musk", L("هدوء وقرب", "Quiet and intimate"), "oil"),
    entry(
      "fresh",
      "منعش",
      "Fresh",
      L("حمضيات وخضرة", "Citrus and green notes"),
      "green",
    ),
  ],
  occasions: [
    entry(
      "everyday",
      "لتفاصيل يومك",
      "For your everyday",
      L("نفحات سهلة تصاحب يومك.", "Easy-going notes for the everyday."),
      "green",
    ),
    entry(
      "evening",
      "لمساء مختلف",
      "For a different evening",
      L(
        "تكوين أعمق، للحظات الخاصة.",
        "A deeper composition for special moments.",
      ),
      "amber",
    ),
    entry(
      "gifting",
      "لمن تحب",
      "For someone you love",
      L(
        "اختيارات تعبّر عن اهتمامك.",
        "Thoughtful choices for someone special.",
      ),
      "gift",
    ),
    entry(
      "home",
      "للبيت",
      "For your home",
      L("دفء تستقبله كل يوم.", "A warm welcome, every day."),
      "home",
    ),
  ],
  brands: [
    entry(
      "shadha",
      "شذا",
      "Shadha",
      L("مجموعة شذا التوضيحية", "The illustrative Shadha collection"),
      "hero",
    ),
  ],
  guides: [
    {
      ...entry(
        "choose-fragrance",
        "كيف تختار عطرك؟",
        "How to choose your fragrance",
        L("ابدأ بالنفحات التي ترتاح لها.", "Begin with the notes you enjoy."),
        "hero",
      ),
      paragraphs: [
        L(
          "تعرّف على العائلة العطرية أولًا. الروائح الخشبية والزهرية والمنعشة تعطي نقطة بداية، وليست قواعد ثابتة لذوقك.",
          "Get to know the fragrance family first. Woody, floral and fresh descriptions are starting points, not rules for your taste.",
        ),
        L(
          "قارن الأحجام والتركيز والسعر. إذا كانت العينة متاحة، جرّبها قبل اختيار العبوة الكاملة. يختلف إحساس الرائحة من شخص لآخر.",
          "Compare size, concentration and price. When a sample is available, try it before choosing a full bottle. Fragrance is experienced differently by each person.",
        ),
      ],
    },
    {
      ...entry(
        "oud-ritual",
        "العطر والبخور: طقسان مختلفان",
        "Perfume and incense: two rituals",
        L(
          "اعرف طريقة الاستخدام المناسبة لكل نوع.",
          "Choose the right use for each type.",
        ),
        "oud",
      ),
      paragraphs: [
        L(
          "العطر والزيت لا يستخدمان مثل العود والبخور. راجع تعليمات العبوة والأداة المناسبة، ولا تستخدم عطر الجسم في المبخرة.",
          "Perfume and oils are used differently from oud and incense. Follow the product instructions and use the right equipment; do not put body perfume in a burner.",
        ),
        L(
          "استخدم البخور في مكان جيد التهوية وعلى سطح مقاوم للحرارة. أبعده عن الأطفال والحيوانات، ولا تترك مصدر الحرارة دون مراقبة.",
          "Use incense in a ventilated space on a heat-resistant surface. Keep it away from children and pets, and never leave heat unattended.",
        ),
      ],
    },
  ],
  faq: [
    {
      question: L(
        "كيف أختار الرائحة المناسبة لي؟",
        "How do I find a fragrance I like?",
      ),
      answer: L(
        "ابدأ بالنوتة التي تحبها، ثم اختر المناسبة والميزانية في مساعد اختيار العطر. يمكنك تجربة العينات المتاحة قبل الحجم الكامل.",
        "Start with a note you enjoy, then use our scent finder to choose an occasion and budget. Try an available sample before a full bottle.",
      ),
    },
    {
      question: L(
        "هل يمكن اختيار حجم مختلف؟",
        "Can I choose a different size?",
      ),
      answer: L(
        "نعم، تعرض صفحة كل منتج أحجامه المتاحة. يتغير السعر والتوفر مع اختيار الحجم، وتُحفظ اختياراتك في السلة.",
        "Yes. Each product page lists available sizes. Price and availability update with your selection, which stays with the cart line.",
      ),
    },
    {
      question: L("هل توجد خيارات للهدايا؟", "Are gift options available?"),
      answer: L(
        "المنتجات المؤهلة تدعم التغليف ورسالة الإهداء. تظهر التكلفة الإضافية قبل الإضافة ويمكن تعديلها في السلة.",
        "Eligible products support wrapping and a gift message. The extra cost is shown before adding and can be edited in your bag.",
      ),
    },
    {
      question: L(
        "كيف يُحسب الشحن والاسترجاع؟",
        "How do delivery and returns work?",
      ),
      answer: L(
        "راجع صفحة الشحن والاسترجاع وإجمالي الطلب قبل التأكيد. هذه نسخة عرض توضيحية؛ لا يتم شحن منتجات أو تحصيل أموال.",
        "Check Delivery & returns and your order total before confirming. This is an illustrative preview; no products are shipped and no money is collected.",
      ),
    },
  ],
  trust: [
    {
      title: L("اختر على مهل", "Take your time"),
      body: L("أحجام ونوتات واضحة", "Clear sizes and fragrance notes"),
      icon: "bottle",
    },
    {
      title: L("هدية بتفاصيلك", "Make it personal"),
      body: L("تغليف ورسالة إهداء", "Wrapping and a personal note"),
      icon: "gift",
    },
    {
      title: L("جرّب قبل أن تختار", "Discover before you decide"),
      body: L("عينات ومجموعات اكتشاف", "Samples and discovery sets"),
      icon: "spark",
    },
  ],
  reviews: [
    {
      id: "r1",
      productId: "amber-nights",
      name: L("نورة", "Noura"),
      quote: L(
        "أحببت الفكرة: أن أبدأ بالنفحة التي أحبها، وأصل إلى عطر يشبه ذوقي.",
        "I love the idea of starting with a favourite note and finding a fragrance that feels like me.",
      ),
      score: 5,
      sample: true,
      verified: false,
    },
    {
      id: "r2",
      productId: "house-gift",
      name: L("خالد", "Khalid"),
      quote: L(
        "تفاصيل الهدية هي ما يجعل الاختيار شخصيًا.",
        "It is the little details that make a gift personal.",
      ),
      score: 5,
      sample: true,
      verified: false,
    },
  ],
  socialProfiles: [],
  sampleSocials: true,
  previewSocialProfiles: [
    {
      id: "instagram",
      platform: "instagram",
      label: L("إنستغرام", "Instagram"),
      url: "",
      enabled: true,
    },
    {
      id: "snapchat",
      platform: "snapchat",
      label: L("سناب شات", "Snapchat"),
      url: "",
      enabled: true,
    },
    {
      id: "tiktok",
      platform: "tiktok",
      label: L("تيك توك", "TikTok"),
      url: "",
      enabled: true,
    },
    { id: "x", platform: "x", label: L("إكس", "X"), url: "", enabled: true },
    {
      id: "facebook",
      platform: "facebook",
      label: L("فيسبوك", "Facebook"),
      url: "",
      enabled: true,
    },
  ],
  contact: {
    email: "",
    phone: "",
    whatsapp: "",
    address: L("", ""),
    hours: L("", ""),
    mapUrl: "",
    branches: [],
  },
  pages: Object.fromEntries(
    [
      [
        "about",
        L("شذا، كما تحب أن تُذكر.", "Shadha. A way to be remembered."),
        L(
          "نقترب من العطر بتفاصيله الصغيرة: النفحة، الملمس، واللحظة.",
          "We approach fragrance through its smaller details: the note, the texture, the moment.",
        ),
        "hero",
      ],
      [
        "contact",
        L("حديثٌ يبدأ بنفحة.", "A conversation starts here."),
        L(
          "لديك سؤال عن رائحة أو حجم أو هدية؟ اترك لنا رسالتك.",
          "A question about a fragrance, a size, or a gift? Leave us a note.",
        ),
        "",
      ],
      [
        "shipping",
        L("الشحن والاسترجاع", "Delivery & returns"),
        L(
          "سياسة توضيحية لنسخة العرض. يحدد التاجر شروطه الفعلية قبل النشر.",
          "Illustrative preview policy. The merchant supplies their actual terms before publication.",
        ),
        "",
      ],
      [
        "privacy",
        L("سياسة الخصوصية", "Privacy"),
        L(
          "نسخة العرض تحفظ السلة والمفضلة في متصفحك. النماذج لا ترسل بيانات خارجية في وضع العرض.",
          "The preview stores your bag and saved items in this browser. Forms do not send data externally in preview mode.",
        ),
        "",
      ],
      [
        "terms",
        L("الشروط والأحكام", "Terms"),
        L(
          "المحتوى والأسعار والصور هنا أمثلة لتجربة الثيم؛ لا تمثل عرض بيع حقيقيًا.",
          "The content, prices and imagery are examples for this theme preview, not a real offer for sale.",
        ),
        "",
      ],
    ].map(([id, title, intro, img]) => [
      id,
      {
        title,
        intro,
        image: img ? image(img as string) : "",
        sections: pageSections[id as string] ?? [
          {
            title: L(
              "تفاصيل واضحة، واختيار أسهل.",
              "Clear details. A simpler choice.",
            ),
            body: L(
              "تُدار التفاصيل من إعدادات المتجر، وتظهر فقط الخدمات والمعلومات المتاحة فعلًا. هذه نسخة شذا التوضيحية لاختبار تجربة التسوق.",
              "Details are managed through store settings, and only available services and information are shown. This is the Shadha preview for exploring the shopping experience.",
            ),
          },
        ],
      },
    ]),
  ),
  labels: {
    ...extraLabels,
    search: L(
      "ابحث عن عطر، نفحة، أو مجموعة",
      "Search a fragrance, note, or collection",
    ),
    searchAction: L("بحث", "Search"),
    bag: L("حقيبة التسوق", "Shopping bag"),
    saved: L("المفضلة", "Saved"),
    menu: L("القائمة", "Menu"),
    close: L("إغلاق", "Close"),
    all: L("عرض الكل", "View all"),
    add: L("أضف للحقيبة", "Add to bag"),
    choose: L("اختر الحجم", "Choose options"),
    details: L("تفاصيل المنتج", "Product details"),
    quick: L("معاينة سريعة", "Quick view"),
    available: L("متوفر", "Available"),
    unavailable: L("غير متوفر", "Unavailable"),
    notes: L("النوتات العطرية", "Fragrance notes"),
    family: L("العائلة العطرية", "Fragrance family"),
    occasion: L("المناسبة", "Occasion"),
    type: L("نوع المنتج", "Product type"),
    price: L("السعر", "Price"),
    size: L("الحجم / الوزن", "Size / weight"),
    quantity: L("الكمية", "Quantity"),
    filter: L("تصفية", "Filter"),
    sort: L("ترتيب حسب", "Sort by"),
    clear: L("مسح الكل", "Clear all"),
    results: L("نتيجة", "results"),
    empty: L(
      "لم نجد ما يطابق اختياراتك. جرّب إزالة أحد الفلاتر.",
      "No matches for these choices. Try removing a filter.",
    ),
    home: L("الرئيسية", "Home"),
    catalog: L("كل ما يحمل شذا", "Everything Shadha"),
    catalogIntro: L(
      "اختر النفحة والحجم، واترك الباقي لذوقك.",
      "Choose your note and size. Let your taste do the rest.",
    ),
    sample: L("نسخة عرض توضيحية", "Illustrative theme preview"),
    photoNote: L(
      "تصوير توضيحي لتصميم المجموعة؛ راجع حجم العبوة والمحتويات المحددة.",
      "Illustrative collection packaging; refer to the selected size and listed contents.",
    ),
    wrap: L("تغليف هدية", "Gift wrapping"),
    message: L("رسالة الإهداء", "Gift message"),
    subtotal: L("مجموع المنتجات", "Subtotal"),
    shipping: L("الشحن", "Delivery"),
    total: L("الإجمالي", "Total"),
    checkout: L("إتمام الطلب", "Checkout"),
    remove: L("إزالة", "Remove"),
    continue: L("تابع الاكتشاف", "Continue exploring"),
    email: L("البريد الإلكتروني", "Email address"),
    name: L("الاسم", "Name"),
    phone: L("رقم الهاتف", "Phone number"),
    city: L("المدينة", "City"),
    district: L("الحي", "District"),
    address: L("العنوان التفصيلي", "Street address"),
    send: L("أرسل رسالتك", "Send your message"),
    subscribe: L("اشترك", "Subscribe"),
    pending: L("جارٍ الإرسال…", "Sending…"),
    demoSuccess: L(
      "تم تسجيل التجربة محليًا. لم تُرسل رسالة خارجية.",
      "Preview recorded locally. No external message was sent.",
    ),
    serviceError: L(
      "الخدمة غير متاحة الآن. احتفظنا بمدخلاتك لتعيد المحاولة.",
      "The service is unavailable. Your entries are kept so you can retry.",
    ),
    sampleAction: L("جرّب العينة", "Try a sample"),
    compare: L("قارن", "Compare"),
    recent: L("شاهدت مؤخرًا", "Recently viewed"),
    save: L("حفظ", "Save"),
    unsave: L("إلغاء الحفظ", "Unsave"),
    unit: L("السعر القياسي", "Unit price"),
    guide: L("دليل الحجم", "Size guide"),
    care: L("الاستخدام والعناية", "Use & care"),
    similar: L("نفحات قد تحبّها", "Notes you may also love"),
    complements: L("يكمل الحكاية", "Complete the ritual"),
    backTop: L("العودة للأعلى", "Back to top"),
    sampleSocial: L(
      "أمثلة توضيحية غير مرتبطة بحسابات",
      "Unlinked sample profiles",
    ),
    newest: L("الأحدث", "Newest"),
    priceAsc: L("السعر: الأقل أولًا", "Price: low to high"),
    priceDesc: L("السعر: الأعلى أولًا", "Price: high to low"),
    inStock: L("المتوفر فقط", "In stock only"),
    min: L("من", "From"),
    max: L("إلى", "To"),
    finder: L("لنجد عطرك", "Let’s find your fragrance"),
    finderIntro: L(
      "نفحة تحبها، مناسبة، وميزانية. اختيارات أقرب إليك.",
      "A favourite note, an occasion, a budget. Choices closer to you.",
    ),
    find: L("اعرض اختياراتي", "Find my fragrances"),
    newsletterNotice: L(
      "تجربة اشتراك توضيحية، دون إرسال بريد فعلي.",
      "Preview subscription; no emails will be sent.",
    ),
    rights: L("شذا. كل الحقوق محفوظة.", "Shadha. All rights reserved."),
    notFound: L("هذه الصفحة لا تحمل شذا بعد.", "This page is not here yet."),
    notFoundBody: L(
      "قد يكون الرابط تغيّر. اكتشف المجموعات المتاحة.",
      "The link may have changed. Explore the available collections.",
    ),
    orderDemo: L("تأكيد طلب تجريبي", "Confirm preview order"),
    quoteChanged: L(
      "تغير السعر أو التوفر. راجع السلة قبل المحاولة مرة أخرى.",
      "Price or availability changed. Review your bag and try again.",
    ),
    deliveryPending: L("تُحدد قبل تأكيد الطلب", "Confirmed before ordering"),
    noSaved: L(
      "ابدأ بحفظ ما يلفت انتباهك.",
      "Save the things that catch your eye.",
    ),
    stockWarning: L(
      "الكمية المطلوبة غير متاحة.",
      "The requested quantity is unavailable.",
    ),
    topNotes: L("البداية", "The opening"),
    heartNotes: L("القلب", "The heart"),
    baseNotes: L("الأثر", "The lasting note"),
    contents: L("داخل المجموعة", "Inside the set"),
    brand: L("الدار", "House"),
    intensity: L("الطابع", "Character"),
    soft: L("ناعم", "Soft"),
    balanced: L("متوازن", "Balanced"),
    rich: L("عميق", "Rich"),
  },
  commerce: {
    deliveryFee: 25,
    freeDeliveryAbove: 400,
    taxIncluded: true,
    giftWrapPrice: 20,
    giftMessageMax: 180,
    maxSamples: 4,
    coupon: { code: "DISCOVER", percent: 10, endsAt: "2027-01-01T00:00:00Z" },
  },
  services: { checkout: false, contact: false, newsletter: false },
  redirects: {
    ...legacyRedirects,
    "/": "/ar",
    "/products": "/ar/products",
    "/about": "/ar/about",
    "/contact": "/ar/contact",
    "/cart": "/ar/cart",
    "/checkout": "/ar/checkout",
  },
});
