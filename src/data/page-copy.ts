import { L } from "@/lib/schema";
export const pageSections: Record<
  string,
  { title: ReturnType<typeof L>; body: ReturnType<typeof L> }[]
> = {
  about: [
    {
      title: L(
        "نفحة صغيرة، ومساحة للذاكرة.",
        "A small note. Room for a memory.",
      ),
      body: L(
        "قد تبدأ الحكاية بخشب دافئ في مجلس، أو وردة في صباح هادئ. في عالم شذا نقترب من هذه التفاصيل: عطر للحضور، وزيت للمسة الأخيرة، وبخور لدفء المكان. اكتشف المجموعات على مهل، واتبع الرائحة التي تشبه ذوقك.",
        "A story may begin with warm wood in a gathering, or a rose on a quiet morning. In the world of Shadha, we look closer at those details: perfume for your presence, oil for a finishing touch, incense to warm a room. Explore slowly, and follow the fragrance that feels like you.",
      ),
    },
  ],
  shipping: [
    {
      title: L("التوصيل في نسخة العرض", "Delivery in this preview"),
      body: L(
        "الرسوم وحد الشحن المجاني موضحان أدناه ويظهران في ملخص الطلب. لا تنفذ نسخة العرض شحنًا فعليًا ولا تحدد موعد وصول. يزوّد المتجر العميل بمناطق التوصيل والمواعيد وسياسة الاسترجاع الفعلية قبل فتح البيع.",
        "The illustrative delivery charge and free-delivery threshold are shown below and in the order summary. This preview does not ship products or promise an arrival date. The merchant supplies actual delivery regions, timelines and return terms before opening sales.",
      ),
    },
  ],
  privacy: [
    {
      title: L("ما يُحفظ في هذا المتصفح", "What stays in this browser"),
      body: L(
        "تُحفظ الحقيبة والمفضلة والمنتجات التي شاهدتها وإيصالات الطلب التجريبي محليًا في المتصفح. لا يحفظ الإيصال عنوانك أو بيانات الاتصال. نماذج العرض لا ترسل رسائل إلى طرف خارجي. يمكنك إزالة البيانات بمسح بيانات الموقع في متصفحك.",
        "Your bag, saved items, recently viewed products and preview receipts are stored locally in this browser. Receipts do not store your address or contact details. Preview forms do not send messages to an external recipient. You can remove this data by clearing the site data in your browser.",
      ),
    },
  ],
  terms: [
    {
      title: L("تجربة الثيم", "Exploring the theme"),
      body: L(
        "شذا هنا هوية توضيحية. المنتجات والأسعار والآراء والصور أمثلة لاستكشاف تجربة المتجر، وليست عرض بيع أو ادعاءات عن منتجات تجارية. لا تتطلب تجربة الطلب بيانات دفع، ولا تخصم أموالًا.",
        "Shadha is an illustrative identity in this preview. Products, prices, reviews and imagery demonstrate the storefront experience; they are not a sales offer or claims about merchant inventory. Preview checkout does not ask for payment details or charge money.",
      ),
    },
  ],
};
