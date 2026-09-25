"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Content is visible in server HTML; motion progressively enhances its first entry. */
export function Reveal({children,delay=0,className,immediate=false}: {children: ReactNode; delay?: number; className?: string; immediate?: boolean}) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(() => {
  const element=ref.current;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!element || media.matches || immediate || !element.animate || !window.IntersectionObserver) return;
  let animation: Animation | undefined;
  const observer=new IntersectionObserver(entries => {
   if (!entries.some(entry => entry.isIntersecting)) return;
   observer.disconnect();
   if (!media.matches) animation=element.animate([{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"none"}], {duration:600,delay:Math.min(delay,0.25)*1000,easing:"cubic-bezier(.2,.7,.2,1)"});
  },{threshold:0});
  const stop=() => {if(media.matches) animation?.cancel();};
  media.addEventListener("change",stop);
  observer.observe(element);
  return () => {observer.disconnect();animation?.cancel();media.removeEventListener("change",stop);};
 },[delay,immediate]);
 return <div ref={ref} className={className}>{children}</div>;
}
