import type {Product} from "@/lib/types";
export const demoProductOverrides:Record<string,Partial<Product>>={
  "oud-royale": {
    intensity: "غني",
    "brand": "دار العبير",
    "kind": "perfume",
    "concentration": "Eau de Parfum",
    "size": "100 مل",
    "unitPrice": {
      "quantity": 100,
      "referenceQuantity": 100,
      "unit": "مل"
    },
    "variants": [
      {
        "id": "oud-50",
        "label": "50 مل",
        "price": 320,
        "stock": 8,
        "unitPrice": {
          "quantity": 50,
          "referenceQuantity": 100,
          "unit": "مل"
        }
      },
      {
        "id": "oud-100",
        "label": "100 مل",
        "price": 540,
        "stock": 12,
        "unitPrice": {
          "quantity": 100,
          "referenceQuantity": 100,
          "unit": "مل"
        }
      },
      {
        "id": "oud-150",
        "label": "150 مل",
        "price": 720,
        "stock": 0,
        "unitPrice": {
          "quantity": 150,
          "referenceQuantity": 100,
          "unit": "مل"
        }
      }
    ],
    "description": "تركيبة عطرية تجريبية تجمع نوتات العود والمسك الأبيض. اختر الحجم وراجع تفاصيل النوتات قبل الإضافة."
  },
  "rose-damascena": {
    intensity: "متوازن",
    "brand": "دار العبير",
    "kind": "perfume",
    "concentration": "Eau de Parfum",
    "size": "75 مل",
    "variants": [
      {
        "id": "rose-30",
        "label": "30 مل",
        "price": 195,
        "stock": 6,
        "unitPrice": {
          "quantity": 30,
          "referenceQuantity": 100,
          "unit": "مل"
        }
      },
      {
        "id": "rose-75",
        "label": "75 مل",
        "price": 380,
        "stock": 20,
        "unitPrice": {
          "quantity": 75,
          "referenceQuantity": 100,
          "unit": "مل"
        }
      }
    ]
  },
  "cambodian-oud": {
    "name": "رقائق العود",
    "shortDescription": "رقائق خشبية بأحجام طبيعية متفاوتة.",
    "description": "منتج عود تجريبي لعرض خيارات الوزن. راجع تفاصيل الوزن وطريقة الاستخدام المرفقة بالمنتج.",
    "kind": "oud",
    "image": "/images/demo/oud-chips.png",
    "gallery": [
      "/images/demo/oud-chips.png"
    ],
    "size": "20 غرام",
    "usage": "اتبع طريقة الاستخدام الموضحة على عبوة المنتج والمبخرة المناسبة.",
    "care": "يحفظ في عبوة مغلقة بعيدًا عن الرطوبة.",
    "variants": [
      {
        "id": "oud-chips-10",
        "label": "10 غرام",
        "price": 145,
        "stock": 9,
        "unitPrice": {
          "quantity": 10,
          "referenceQuantity": 10,
          "unit": "غرام"
        }
      },
      {
        "id": "oud-chips-20",
        "label": "20 غرام",
        "price": 270,
        "stock": 4,
        "unitPrice": {
          "quantity": 20,
          "referenceQuantity": 10,
          "unit": "غرام"
        }
      }
    ]
  }
};
