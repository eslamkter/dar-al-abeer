"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Value = { title: string; body: string; icon: ReactNode };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const },
  },
};

/** بطاقات "ما يميّزنا" — وزن بصري حقيقي (أيقونة + بطاقة) وظهور متدرّج عند الدخول للشاشة. */
export function ValueGrid({ values }: { values: Value[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : container}
      initial={reduceMotion ? undefined : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={{ once: true, amount: 0.3 }}
      className="grid gap-6 sm:grid-cols-3"
    >
      {values.map((v) => (
        <motion.div
          key={v.title}
          variants={reduceMotion ? undefined : item}
          className="rounded-xl border border-border bg-background p-8 text-center shadow-[0_1px_3px_rgba(28,26,23,0.06)]"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
            {v.icon}
          </div>
          <h3 className="font-heading text-xl font-semibold">{v.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
