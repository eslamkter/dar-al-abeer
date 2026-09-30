import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getStore } from "@/lib/runtime";
import { MotionEnhancement } from "@/components/motion";
import { ShopProvider } from "@/components/shop-context";
import { Header, Footer, Floating } from "@/components/shell";
import type { Locale } from "@/lib/schema";
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const s = await getStore();
  if (locale !== "ar" && locale !== "en") {
    if (s.redirects["/" + locale]) redirect(s.redirects["/" + locale]);
    notFound();
  }
  const l = locale as Locale;
  const currentPath = (await headers()).get("x-shadha-url") ?? `/${l}`;
  const tokens = Object.fromEntries(
    Object.entries(s.tokens).map(([key, value]) => [
      `--${key}`,
      typeof value === "number"
        ? `${value}${key.endsWith("Ms") ? "ms" : "px"}`
        : value,
    ]),
  );
  const fonts = s.fonts.registry
    .map(
      (f) =>
        `@font-face{font-family:${JSON.stringify(f.family)};src:url(${JSON.stringify(f.src)});font-weight:${f.weight};font-display:swap;}`,
    )
    .join("");
  return (
    <html lang={l} dir={l === "ar" ? "rtl" : "ltr"}>
      <head>
        <style>{fonts}</style>
      </head>
      <body
        id="top"
        data-motion={s.motion}
        style={
          {
            ...tokens,
            "--texture": `url(${JSON.stringify(s.background.texture)})`,
            "--texture-size": `${s.background.size}px`,
            "--font-heading": `"${s.fonts[l].heading}"`,
            "--font-body": `"${s.fonts[l].body}"`,
          } as React.CSSProperties
        }
      >
        <ShopProvider s={s} l={l}>
          <a className="skip-link" href="#main">
            {s.labels.skip[l]}
          </a>
          <Header initialPath={currentPath} />
          <noscript>
            <style>
              {
                ".desktop-nav{display:flex!important;flex-wrap:wrap}.nav-expand,.mobile-menu{display:none!important}"
              }
            </style>
          </noscript>
          <main id="main">{children}</main>
          <Footer />
          <Floating />
          <MotionEnhancement />
        </ShopProvider>
      </body>
    </html>
  );
}
