import { siteConfig } from "@/config/site";
import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = { ...pageSeo("/login", true), title: "تسجيل الدخول", description: siteConfig.description };
export default function PageLayout({ children }: { children: ReactNode }) { return children; }
