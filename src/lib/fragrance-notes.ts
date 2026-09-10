/**
 * نوتات العطر + مناسبة الاستخدام لكل منتج (مفتاحها الـ slug).
 * منفصلة عن قاعدة البيانات — تشتغل مع أي منتج بدون تعديل السكيمة.
 * لاحقًا ممكن تتنقل لعمود في جدول products.
 */
export interface FragranceProfile {
  top: string[]; // نوتات القمة
  heart: string[]; // نوتات القلب
  base: string[]; // نوتات القاعدة
  occasion: string;
  intensity: number; // من 1 لـ 5
}

export const fragranceNotes: Record<string, FragranceProfile> = {
  "oud-royale": {
    top: ["زعفران", "برغموت"],
    heart: ["عود كمبودي", "ورد"],
    base: ["مسك أبيض", "عنبر"],
    occasion: "المناسبات والسهرات",
    intensity: 5,
  },
  "rose-damascena": {
    top: ["ورد دمشقي", "ليتشي"],
    heart: ["بيوني", "فريزيا"],
    base: ["خشب الصندل", "مسك"],
    occasion: "الإطلالات النهارية الأنيقة",
    intensity: 3,
  },
  "amber-nights": {
    top: ["هيل", "قرفة"],
    heart: ["عنبر", "لبان"],
    base: ["فانيليا", "خشب العود"],
    occasion: "الأمسيات الشتوية",
    intensity: 4,
  },
  "citrus-breeze": {
    top: ["ليمون إيطالي", "برغموت"],
    heart: ["نعناع", "زهر البرتقال"],
    base: ["مسك خفيف", "خشب الأرز"],
    occasion: "العمل والنهار",
    intensity: 2,
  },
  "white-musk": {
    top: ["مسك أبيض", "زهر القطن"],
    heart: ["زنبق الوادي", "ياسمين"],
    base: ["مسك ناعم", "خشب أبيض"],
    occasion: "الاستخدام اليومي",
    intensity: 2,
  },
  "saffron-luxe": {
    top: ["زعفران", "جلد"],
    heart: ["ورد تركي", "بنفسج"],
    base: ["عود", "عنبر", "جلد"],
    occasion: "المناسبات الفاخرة",
    intensity: 5,
  },
  "midnight-oud": {
    top: ["فلفل أسود", "برغموت"],
    heart: ["عود داكن", "جلد"],
    base: ["عنبر", "باتشولي"],
    occasion: "السهرات والمناسبات الخاصة",
    intensity: 5,
  },
  "royal-amber": {
    top: ["لبان", "هيل"],
    heart: ["عنبر كهرماني", "ورد"],
    base: ["فانيليا", "خشب"],
    occasion: "الأمسيات",
    intensity: 4,
  },
  "jasmine-nights": {
    top: ["ياسمين", "نرجس"],
    heart: ["زهر البرتقال", "توبروز"],
    base: ["مسك", "خشب الصندل"],
    occasion: "المناسبات المسائية",
    intensity: 3,
  },
  "lemon-verbena": {
    top: ["لويزة", "ليمون"],
    heart: ["نعناع", "زنجبيل"],
    base: ["مسك أبيض", "أرز"],
    occasion: "الصيف والنهار",
    intensity: 2,
  },
  "vanilla-dusk": {
    top: ["كراميل", "لوز"],
    heart: ["فانيليا", "زهر البرتقال"],
    base: ["مسك", "خشب"],
    occasion: "اللقاءات الحميمية",
    intensity: 3,
  },
  "cambodian-oud": {
    top: ["زعفران", "توابل"],
    heart: ["عود كمبودي", "ورد"],
    base: ["عنبر", "مسك"],
    occasion: "المناسبات الكبرى",
    intensity: 5,
  },
  "pink-peony": {
    top: ["بيوني", "ليتشي"],
    heart: ["فريزيا", "ورد"],
    base: ["مسك أبيض", "أرز"],
    occasion: "النهار والإطلالات الأنيقة",
    intensity: 2,
  },
  "aqua-marine": {
    top: ["نوتات بحرية", "برغموت"],
    heart: ["ياسمين مائي", "نعناع"],
    base: ["مسك", "خشب"],
    occasion: "النهار والرياضة",
    intensity: 2,
  },
  "musk-tahara": {
    top: ["مسك أبيض"],
    heart: ["زهر القطن", "ياسمين"],
    base: ["مسك ناعم"],
    occasion: "الاستخدام اليومي",
    intensity: 2,
  },
  "cedar-wood": {
    top: ["أرز", "برغموت"],
    heart: ["فيتيفر", "بخور"],
    base: ["خشب جاف", "مسك"],
    occasion: "العمل والإطلالات الرصينة",
    intensity: 4,
  },
  "orange-blossom": {
    top: ["زهر البرتقال", "نيرولي"],
    heart: ["ياسمين", "عسل"],
    base: ["مسك", "خشب أبيض"],
    occasion: "النهار",
    intensity: 2,
  },
  "silk-musk": {
    top: ["زهور بيضاء", "بيرة الكمثرى"],
    heart: ["مسك حريري", "بيوني"],
    base: ["خشب ناعم", "عنبر أبيض"],
    occasion: "كل الأوقات",
    intensity: 3,
  },
  "imperial-saffron": {
    top: ["زعفران", "برغموت"],
    heart: ["ورد تركي", "عود"],
    base: ["عنبر", "جلد", "مسك"],
    occasion: "المناسبات الاستثنائية",
    intensity: 5,
  },
  "fresh-bergamot": {
    top: ["برغموت", "زنجبيل"],
    heart: ["نعناع", "لافندر"],
    base: ["مسك", "خشب الأرز"],
    occasion: "النهار والعمل",
    intensity: 2,
  },
};

export function getFragranceProfile(slug: string): FragranceProfile | null {
  return fragranceNotes[slug] ?? null;
}
