"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import { FeedbackSection } from "@/components/feedback-section";
import { Header } from "@/components/header";
import { StarRating } from "@/components/star-rating";
import { SubmitButton } from "@/components/submit-button";
import { getOrCreateDeviceId } from "@/lib/device-id";

type FeedbackApiResponse = {
  success: boolean;
  message?: string;
};

type RatingCardProps = {
  branch: {
    id: string;
    name: string;
  };
};

export function RatingCard({ branch }: RatingCardProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (!rating || hasScrolledRef.current) {
      return;
    }

    hasScrolledRef.current = true;
    const scrollTimer = window.setTimeout(() => {
      feedbackRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 220);

    return () => window.clearTimeout(scrollTimer);
  }, [rating]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!rating) {
      return;
    }

    setSubmitMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: feedback,
          deviceId: getOrCreateDeviceId(),
          branchId: branch.id,
        }),
      });

      const payload = (await response
        .json()
        .catch(() => null)) as FeedbackApiResponse | null;

      if (!response.ok || !payload?.success) {
        setSubmitMessage(
          payload?.message ?? "We couldn't submit your feedback. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      router.push("/thank-you");
    } catch {
      setSubmitMessage(
        "We couldn't submit your feedback. Please check your connection and try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-[29rem]"
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-white/95 bg-white/96 px-5 py-7 shadow-[0_34px_100px_rgba(36,32,58,0.26)] ring-1 ring-white/70 backdrop-blur-xl sm:px-8 sm:py-9"
      >
        <div className="space-y-8">
          <Header branchName={branch.name} />

          <div className="h-px bg-gradient-to-r from-transparent via-[#ead9f0] to-transparent" />

          <StarRating value={rating} onChange={setRating} />

          <AnimatePresence initial={false}>
            {rating > 0 ? (
              <FeedbackSection
                key="feedback-section"
                rating={rating}
                feedback={feedback}
                onFeedbackChange={setFeedback}
                sectionRef={feedbackRef}
              />
            ) : null}
          </AnimatePresence>

          {submitMessage ? (
            <p
              role="alert"
              className="rounded-3xl border border-[#ead9f0] bg-[#fff8e8] px-4 py-3 text-center text-sm leading-6 text-[#5f3c14]"
            >
              {submitMessage}
            </p>
          ) : null}

          <SubmitButton disabled={!rating} isLoading={isSubmitting} />
        </div>
      </form>
    </motion.main>
  );
}
