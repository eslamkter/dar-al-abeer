export const serviceConfig={mode:process.env.NEXT_PUBLIC_THEME_SERVICE_MODE === "live" ? "live" : "demo",baseUrl:process.env.NEXT_PUBLIC_STOREFRONT_API_BASE_URL || "",storageKey:"dar-al-abeer-demo-receipts-v1",paths:{contact:"/contact",newsletter:"/subscriptions",order:"/orders"}} as const;
export const serviceMessages={
  "pending": {
    "ar": "جارٍ الحفظ…",
    "en": "Saving…"
  },
  "submit": {
    "ar": "إرسال",
    "en": "Submit"
  },
  "demoSuccess": {
    "ar": "حُفظت العملية التجريبية في هذه الجلسة. لم تُرسل إلى متجر حقيقي.",
    "en": "Demo submission saved in this session. Nothing was sent to a real store."
  },
  "liveSuccess": {
    "ar": "تم استلام طلبك.",
    "en": "Your request was received."
  },
  "reference": {
    "ar": "رقم المرجع",
    "en": "Reference"
  },
  "errors": {
    "validation": {
      "ar": "راجع البيانات المطلوبة ثم أعد المحاولة.",
      "en": "Check the required details and try again."
    },
    "storage": {
      "ar": "تعذر حفظ العملية على هذا المتصفح. بقيت بياناتك ويمكنك إعادة المحاولة.",
      "en": "This browser could not save the submission. Your details remain available to retry."
    },
    "network": {
      "ar": "تعذر الاتصال بالخدمة. حاول مجددًا؛ لم نمسح اختياراتك.",
      "en": "Could not reach the service. Retry; your selections have been kept."
    },
    "configuration": {
      "ar": "خدمة المتجر غير مهيأة لهذا العنوان.",
      "en": "The store service is not configured for this address."
    },
    "response": {
      "ar": "لم تصل رسالة تأكيد صالحة. أعد المحاولة بنفس البيانات.",
      "en": "No valid confirmation was returned. Retry with the same details."
    }
  }
} as const;
