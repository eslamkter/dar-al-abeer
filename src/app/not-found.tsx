import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="eyebrow block text-gold">404</span>
      <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
        الصفحة غير موجودة
      </h1>
      <p className="mt-3 max-w-md text-muted">
        الرابط الذي وصلت إليه غير صحيح، أو أن الصفحة لم تعد متوفرة.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
        >
          الرئيسية
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-border px-8 py-3 text-sm text-muted transition-colors hover:border-gold hover:text-gold"
        >
          تصفّح المتجر
        </Link>
      </div>
    </Container>
  );
}
