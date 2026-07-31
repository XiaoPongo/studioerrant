"use client";

import { cn } from "@/lib/utils";

/**
 * The Studio Errant wordmark — lowercase, high-contrast editorial
 * serif, generous tracking. Drawn from the reference image: a quiet,
 * Bodoni/Didot-feeling wordmark where the typography is the symbol.
 *
 * Variants:
 *   inline  — single line ("studio errant"), used inside the hero
 *             sentence so the wordmark reads as part of it.
 *   stacked — two lines ("studio" / "errant"), used where the
 *             wordmark stands alone (footer, project pages).
 *
 * The mark never uses a graphical icon. The typography itself is
 * the identity.
 */
export function ErrantWordmark({
  variant = "inline",
  className,
  size = "md",
}: {
  variant?: "inline" | "stacked";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass = {
    sm: "text-base md:text-lg",
    md: "text-xl md:text-2xl",
    lg: "text-3xl md:text-5xl",
    xl: "text-5xl md:text-7xl",
  }[size];

  const tracking = {
    sm: "tracking-[0.18em]",
    md: "tracking-[0.2em]",
    lg: "tracking-[0.24em]",
    xl: "tracking-[0.28em]",
  }[size];

  return (
    <span
      className={cn(
        "font-editorial font-medium lowercase leading-none",
        sizeClass,
        tracking,
        className,
      )}
    >
      {variant === "stacked" ? (
        <span className="flex flex-col gap-1">
          <span>studio</span>
          <span>errant</span>
        </span>
      ) : (
        <span>studio errant</span>
      )}
    </span>
  );
}
