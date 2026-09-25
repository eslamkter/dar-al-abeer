import { siteConfig } from "@/config/site";
import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = { ...pageSeo("/cart", true), title: "سلة التسوق", description: siteConfig.description };
export default function PageLayout({ children }: { children: ReactNode }) { return children; }
