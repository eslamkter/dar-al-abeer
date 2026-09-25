"use client";
export default function ErrorPage({reset}: {reset: () => void}) {
 return <section className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="font-heading text-3xl">تعذر تحميل الصفحة</h1><p className="mt-4 text-muted">يرجى المحاولة مجددًا. لم تتغير محتويات سلتك.</p><button onClick={reset} className="mt-6 rounded-full bg-foreground px-6 py-3 text-background">إعادة المحاولة</button></section>;
}
