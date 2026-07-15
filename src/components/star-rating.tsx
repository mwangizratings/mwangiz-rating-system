"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="mx-auto max-w-xs text-center text-2xl font-semibold leading-tight text-[#2f1d39]">
        How was your experience today?
      </legend>

      <div
        className="flex items-center justify-center gap-1.5 sm:gap-2"
        role="radiogroup"
        aria-label="Rate your experience from one to five stars"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isSelected = star <= value;

          return (
            <motion.button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
              onClick={() => onChange(star)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              animate={isSelected ? { scale: [1, 1.14, 1] } : { scale: 1 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={cn(
                "grid size-12 place-items-center rounded-2xl outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-[#7b459c]/30 sm:size-14",
                isSelected
                  ? "bg-[#fff3c6] text-[#d7a51f]"
                  : "bg-[#f8f0fa] text-[#c5b3cc] hover:bg-[#fff7dc] hover:text-[#c99a18]",
              )}
            >
              <Star
                className={cn(
                  "size-7 transition-all sm:size-8",
                  isSelected && "fill-current",
                )}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}
