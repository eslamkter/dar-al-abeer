"use client";
import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { useShop } from "./shop-context";
import { label } from "@/lib/catalog";
import { Icon } from "./icon";
type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  fallbackSrc?: string | null;
  fallbackLabel?: string | null;
};
export function Photo({
  src,
  alt,
  fallbackSrc,
  fallbackLabel,
  ...props
}: Props) {
  const { s, l } = useShop();
  const [failed, setFailed] = useState<string[]>([]);
  const ref = useRef<HTMLImageElement>(null);
  const useFallback = failed.includes(src) && !!fallbackSrc && !!fallbackLabel;
  const active = useFallback ? fallbackSrc! : src;
  const unavailable = failed.includes(active);
  const fail = () =>
    setFailed((list) => (list.includes(active) ? list : [...list, active]));
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && !img.naturalWidth)
      img
        .decode()
        .catch(() =>
          setFailed((list) =>
            list.includes(active) ? list : [...list, active],
          ),
        );
  }, [active]);
  if (unavailable)
    return (
      <span
        className="photo-unavailable"
        role="img"
        aria-label={label(s, "photoMissing", l)}
      >
        <Icon name="bottle" />
        <span>{label(s, "photoMissing", l)}</span>
      </span>
    );
  const img = (
    <img
      {...props}
      ref={ref}
      src={active}
      alt={useFallback ? fallbackLabel! : alt}
      onError={fail}
    />
  );
  return useFallback ? (
    <span className="photo-fallback">
      {img}
      <small>{fallbackLabel}</small>
    </span>
  ) : (
    img
  );
}
