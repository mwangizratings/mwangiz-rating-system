"use client";

import { LoaderCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  disabled: boolean;
  isLoading: boolean;
};

export function SubmitButton({ disabled, isLoading }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={disabled || isLoading}
      className="min-h-14 w-full bg-[#6d3a8f] text-base text-white shadow-[0_14px_30px_rgba(109,58,143,0.24)] hover:bg-[#5d2f7d] focus-visible:ring-[#6d3a8f]/35 disabled:bg-[#d8cddd] disabled:text-[#75657e]"
    >
      {isLoading ? (
        <>
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          Submitting
        </>
      ) : (
        <>
          <Send aria-hidden="true" />
          Submit Feedback
        </>
      )}
    </Button>
  );
}
