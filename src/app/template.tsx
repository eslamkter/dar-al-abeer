import type { ReactNode } from "react";

/**
 * template.tsx يعاد تركيبه مع كل انتقال صفحة، فحركة الـ CSS تتكرر —
 * يعطي إحساس انتقال ناعم بين الصفحات (CSS خالص، موثوق).
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
