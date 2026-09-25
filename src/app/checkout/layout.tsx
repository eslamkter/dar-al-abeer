import { siteConfig } from "@/config/site";
import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = { ...pageSeo("/checkout", true), title: "إتمام الطلب", description: siteConfig.description };
export default function PageLayout({ children }: { children: ReactNode }) { return children; }
