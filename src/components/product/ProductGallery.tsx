"use client";

import Image from "./ProductImage";
import { imageUi } from "@/config/image";
import { useState, useRef } from "react";

/**
 * معرض صور المنتج.
 * بياخد قائمة صور — لو صورة وحدة، بيعرضها من غير مصغّرات.
 * البنية تسمح بأي عدد من الصور.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const zoom=useRef<HTMLDialogElement>(null);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <button type="button" className="absolute inset-0 cursor-zoom-in rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-[-4px]" aria-label={imageUi.zoom} onClick={()=>zoom.current?.showModal()}/>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
              aria-pressed={active === i}
              className={`relative h-20 w-20 overflow-hidden rounded-md border transition-colors ${
                i === active
                  ? "border-gold"
                  : "border-border hover:border-gold/60"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <dialog ref={zoom} aria-label={imageUi.zoom} className="product-zoom" onClick={e=>{if(e.target===e.currentTarget)zoom.current?.close();}}><button type="button" className="relative z-10 mb-3 rounded-full border border-border bg-surface px-5 py-3" onClick={()=>zoom.current?.close()}>{imageUi.close}</button><div className="relative h-[75dvh] w-full"><Image src={images[active]} alt={alt} fill sizes="90vw" className="object-contain"/></div></dialog>
    </div>
  );
}
