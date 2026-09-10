import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { siteConfig } from "@/config/site";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // حماية إضافية على مستوى الصفحة (بجانب الـ middleware)
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* القائمة الجانبية */}
      <aside className="flex w-60 shrink-0 flex-col border-l border-border bg-surface p-4">
        <Link href="/dashboard" className="font-heading text-lg font-bold">
          {siteConfig.name}
        </Link>
        <p className="mt-1 mb-6 text-xs text-muted">لوحة التحكم</p>

        <DashboardNav />

        <div className="mt-auto space-y-3 pt-6">
          <Link
            href="/"
            className="block text-center text-xs text-muted hover:text-gold"
          >
            عرض المتجر ↗
          </Link>
          <p className="truncate text-center text-xs text-muted">
            {user.email}
          </p>
          <SignOutButton />
        </div>
      </aside>

      {/* المحتوى */}
      <div className="flex-1 bg-background p-8">{children}</div>
    </div>
  );
}
