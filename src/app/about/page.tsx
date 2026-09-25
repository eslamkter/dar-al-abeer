import Image from "next/image";
import Link from "next/link";
import {Container} from "@/components/ui/Container";
import {aboutContent as content} from "@/config/about";
import {pageSeo} from "@/lib/seo";
export const metadata={...pageSeo("/about"),title:content.title,description:content.description};
import {Hero} from "@/components/ui/Hero";
import {siteConfig} from "@/config/site";
export default function AboutPage(){return <><Hero title={content.title} subtitle={content.intro} image={siteConfig.images.about} ambient/><Container className="py-16"><section className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]"><div><h2 className="font-heading text-3xl font-bold">{content.sections[0].title}</h2><p className="mt-5 max-w-2xl leading-relaxed text-muted">{content.sections[0].body}</p><div className="mt-6 flex flex-wrap gap-4">{content.sections[0].links.map(link=><Link key={link.href} href={link.href} className="inline-block rounded-full border border-border px-5 py-3 text-sm">{link.label}</Link>)}</div></div><div className="relative aspect-[4/5] overflow-hidden rounded-3xl"><Image src={content.image} alt="" fill sizes="(min-width:1024px) 45vw,90vw" className="object-cover"/></div></section><section className="mx-auto max-w-3xl py-16 text-center"><div><h2 className="font-heading text-3xl font-bold">{content.sections[1].title}</h2></div><div><p className="mt-5 max-w-2xl leading-relaxed text-muted">{content.sections[1].body}</p><div className="mt-6 flex flex-wrap gap-4">{content.sections[1].links.map(link=><Link key={link.href} href={link.href} className="inline-block rounded-full border border-border px-5 py-3 text-sm">{link.label}</Link>)}</div></div></section></Container></>;}
