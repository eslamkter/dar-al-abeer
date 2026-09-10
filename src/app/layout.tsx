import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/lib/cart-context";
import { SiteChrome } from "@/components/layout/SiteChrome";

// خط العناوين — Amiri (خط عربي كلاسيكي فاخر)
const heading = Amiri({
  variable: "--font-heading",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

// خط النصوص — IBM Plex Sans Arabic (مصمّم للشاشة، وضوح عالٍ)
const body = IBM_Plex_Sans_Arabic({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.locale}
      dir={siteConfig.direction}
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
