import { siteConfig } from "@/config/site";
import type { CSSProperties, ReactNode } from "react";

/** حاوية بعرض ثابت وهوامش متناسقة لكل الصفحات. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div style={{ "--content-width": siteConfig.layout.contentWidth, "--page-gutter": siteConfig.layout.gutter, "--rail-card-max": siteConfig.layout.railCardMax } as CSSProperties} className={`mx-auto w-full theme-container ${className}`}>
      {children}
    </div>
  );
}
