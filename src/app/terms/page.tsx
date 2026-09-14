import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: `الشروط والأحكام الخاصة بـ ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <Container className="py-16">
      <h1 className="font-heading text-3xl font-bold">الشروط والأحكام</h1>
      <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-foreground/80">
        <p>
          باستخدامك لموقع {siteConfig.name} فإنك توافق على الشروط التالية:
          الأسعار المعروضة نهائية وتشمل جميع الرسوم المذكورة، والدفع يتم
          عند الاستلام ما لم يُذكر خلاف ذلك، والمرتجعات تخضع لسياسة
          الاستبدال المعلنة عند الشراء.
        </p>
        <p>
          نحتفظ بالحق في تعديل هذه الشروط دون إشعار مسبق. يُنصح بمراجعة هذه
          الصفحة دوريًا.
        </p>
        <p className="text-sm text-muted">
          هذه صفحة نموذجية — يُستبدل نصها بالشروط الفعلية لكل عميل قبل
          الإطلاق.
        </p>
      </div>
    </Container>
  );
}
