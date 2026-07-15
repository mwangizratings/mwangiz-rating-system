"use client";

import { motion } from "framer-motion";

import { Textarea } from "@/components/ui/textarea";

const feedbackMessages: Record<number, string> = {
  5: "We're thrilled you had an amazing experience! We'd love to know what stood out.",
  4: "Thank you! What could we improve to make your next visit a perfect 5-star experience?",
  3: "We'd really appreciate knowing what we could do better.",
  2: "We're sorry your experience wasn't what you expected. Please tell us how we can improve.",
  1: "We sincerely apologize. Your feedback will help us improve and serve you better.",
};

type FeedbackSectionProps = {
  rating: number;
  feedback: string;
  onFeedbackChange: (value: string) => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
};

export function FeedbackSection({
  rating,
  feedback,
  onFeedbackChange,
  sectionRef,
}: FeedbackSectionProps) {
  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: -12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
      aria-live="polite"
    >
      <div className="space-y-5 pt-2">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.28 }}
          className="rounded-3xl border border-[#ead9f0] bg-[#fbf7fc] px-4 py-4 text-center text-sm leading-6 text-[#59425f]"
        >
          {feedbackMessages[rating]}
        </motion.p>

        <div className="space-y-3 text-left">
          <label
            htmlFor="feedback"
            className="block text-base font-semibold text-[#33203d]"
          >
            Tell us more <span className="font-normal">(Optional)</span>
          </label>

          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(215, 165, 31, 0)",
                "0 0 0 6px rgba(215, 165, 31, 0.16)",
                "0 0 0 0 rgba(215, 165, 31, 0)",
              ],
            }}
            transition={{ delay: 0.24, duration: 0.78, ease: "easeOut" }}
            className="rounded-3xl"
          >
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(event) => onFeedbackChange(event.target.value)}
              placeholder="Your feedback helps us improve our services for you and future customers..."
              aria-describedby="feedback-helper"
            />
          </motion.div>

          <p id="feedback-helper" className="sr-only">
            Feedback is optional. Submit is available after selecting a rating.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
