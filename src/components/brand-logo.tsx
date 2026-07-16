import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  compact?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  compact = false,
}: BrandLogoProps) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-[2rem] border border-[#e8d7a3] bg-[#fff8e8] shadow-[0_18px_45px_rgba(98,55,131,0.12)]",
        compact ? "size-14 rounded-2xl" : "size-28",
        className,
      )}
    >
      <Image
        src="/brand/mwangiz-logo.png"
        alt="Mwangiz Beauty Parlor logo"
        width={1080}
        height={1080}
        priority={false}
        className={cn(
          "size-24 object-contain",
          compact && "size-12",
          imageClassName,
        )}
      />
    </div>
  );
}
