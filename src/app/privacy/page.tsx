import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: `سياسة الخصوصية الخاصة بـ ${siteConfig.name}.`,
};

export default function PrivacyPage() {
  return (
    <Container className="py-16">
      <h1 className="font-heading text-3xl font-bold">سياسة الخصوصية</h1>
      <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-foreground/80">
        <p>
          نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. نجمع فقط المعلومات
          اللازمة لإتمام طلبك (الاسم، رقم الهاتف، عنوان التوصيل)، ولا
          نشاركها مع أي جهة خارجية إلا في نطاق تنفيذ الطلب والشحن.
        </p>
        <p>
          يمكنك التواصل معنا في أي وقت عبر صفحة{" "}
          <a href="/contact" className="text-gold hover:underline">
            تواصل معنا
          </a>{" "}
          لطلب مراجعة بياناتك أو حذفها.
        </p>
        <p className="text-sm text-muted">
          هذه صفحة نموذجية — يُستبدل نصها بالسياسة الفعلية لكل عميل قبل
          الإطلاق.
        </p>
      </div>
    </Container>
  );
}
