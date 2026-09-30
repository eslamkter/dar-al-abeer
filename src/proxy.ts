import { NextRequest, NextResponse } from "next/server";
export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (
    /^\/(products|about|contact|cart|checkout|gifts|faq|shipping|privacy|terms)(\/|$)/.test(
      path,
    )
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/ar" + path;
    return NextResponse.redirect(url, 308);
  }
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-shadha-url", req.nextUrl.pathname + req.nextUrl.search);
  requestHeaders.set(
    "x-shadha-locale",
    req.nextUrl.pathname.startsWith("/en") ? "en" : "ar",
  );
  return NextResponse.next({ request: { headers: requestHeaders } });
}
export const config = {
  matcher: [
    "/((?!api|_next|images|fonts|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
