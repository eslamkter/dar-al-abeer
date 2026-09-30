import Link from "next/link";
import { headers } from "next/headers";
import { getStore } from "@/lib/runtime";
import { href, label } from "@/lib/catalog";
export default async function NotFound() {
  const s = await getStore();
  const l = (await headers()).get("x-shadha-locale") === "en" ? "en" : "ar";
  return (
    <section className="empty-state section">
      <span className="eyebrow">404</span>
      <h1>{label(s, "notFound", l)}</h1>
      <p>{label(s, "notFoundBody", l)}</p>
      <Link className="button" href={href(l, "/")}>
        {label(s, "home", l)}
      </Link>
    </section>
  );
}
