"use client";

import Image from "next/image";
import { useState } from "react";

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
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
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
    </div>
  );
}
