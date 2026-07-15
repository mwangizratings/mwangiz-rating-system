"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const celebrationDots = [
  { x: -58, y: -36, color: "#e7b220" },
  { x: 54, y: -42, color: "#6d3a8f" },
  { x: -42, y: 42, color: "#8d5aa8" },
  { x: 50, y: 34, color: "#f0c84b" },
  { x: 0, y: -62, color: "#c7961b" },
  { x: 0, y: 60, color: "#7b459c" },
];

export function ThankYouCard() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="w-full max-w-[29rem]"
    >
      <section className="rounded-[2rem] border border-white/80 bg-white/90 px-6 py-10 text-center shadow-[0_24px_80px_rgba(61,28,82,0.14)] backdrop-blur sm:px-9">
        <div className="relative mx-auto mb-8 grid size-24 place-items-center">
          {celebrationDots.map((dot) => (
            <motion.span
              key={`${dot.x}-${dot.y}`}
              className="absolute size-2.5 rounded-full"
              style={{ backgroundColor: dot.color }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 0], x: dot.x, y: dot.y, scale: 1 }}
              transition={{ duration: 0.72, ease: "easeOut" }}
              aria-hidden="true"
            />
          ))}

          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid size-24 place-items-center rounded-full bg-[#fff3c6] text-[#6d3a8f] shadow-[0_18px_45px_rgba(109,58,143,0.18)]"
          >
            <Check className="size-12" strokeWidth={2.4} aria-hidden="true" />
          </motion.div>
        </div>

        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a47b17]">
            Mwangiz Beauty Parlor
          </p>
          <h1 className="text-4xl font-semibold text-[#2b1836]">Thank You!</h1>
          <p className="mx-auto max-w-sm whitespace-pre-line text-base leading-7 text-[#62536b]">
            {`We truly appreciate you taking a moment to share your experience.

Your feedback helps Mwangiz Beauty Parlor continue providing exceptional service every day.

We look forward to serving you again soon.`}
          </p>
        </div>
      </section>
    </motion.main>
  );
}
