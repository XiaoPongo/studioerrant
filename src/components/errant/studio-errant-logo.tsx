"use client";

import { cn } from "@/lib/utils";

/**
 * The official Studio Errant wordmark.
 *
 * A Didone-style (Bodoni/Didot) lowercase wordmark: "studio" set
 * larger on top, "errant" smaller below. The typography IS the
 * symbol — there is no separate graphic mark. Treated as typography,
 * not decoration.
 *
 * Set in Bodoni Moda (the closest freely-available Google Font to
 * the original), with tight leading and slight negative tracking on
 * "studio" so the two words read as a single composed block.
 *
 * Variants:
 *   stacked  — the canonical two-line lockup. Used in the hero and
 *              wherever the wordmark stands alone.
 *   inline   — single line "studio errant". Used in tight chrome
 *              (footer wordmark, project pages).
 */
export function StudioErrantLogo({
  variant = "stacked",
  className,
  /** Visual size preset. Actual px values are fluid via clamp(). */
  size = "md",
  as: Tag = "span",
}: {
  variant?: "stacked" | "inline";
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  as?: "span" | "h1" | "h2" | "a" | "div";
}) {
  // Fluid sizes via clamp(). "studio" is always larger than "errant".
  // Tuned so the largest lockup fits within ~88vw on phones.
  const studioSize = {
    xs: "clamp(1.5rem, 5vw, 2rem)",
    sm: "clamp(2rem, 7vw, 3rem)",
    md: "clamp(2.75rem, 9vw, 4.5rem)",
    lg: "clamp(3.5rem, 12vw, 7rem)",
    xl: "clamp(3rem, 13vw, 8.5rem)",
  }[size];

  const errantSize = {
    xs: "clamp(1rem, 3.3vw, 1.35rem)",
    sm: "clamp(1.35rem, 4.6vw, 2rem)",
    md: "clamp(1.85rem, 6vw, 3rem)",
    lg: "clamp(2.3rem, 8vw, 4.6rem)",
    xl: "clamp(2rem, 8.5vw, 5.5rem)",
  }[size];

  if (variant === "inline") {
    return (
      <Tag
        className={cn(
          "font-editorial font-normal lowercase leading-none text-foreground",
          className,
        )}
        style={{ fontSize: studioSize, letterSpacing: "-0.01em" }}
      >
        studio{" "}
        <span style={{ fontSize: errantSize, letterSpacing: "0.005em" }}>
          errant
        </span>
      </Tag>
    );
  }

  return (
    <Tag
      className={cn(
        "font-editorial font-normal lowercase leading-[0.92] text-foreground",
        className,
      )}
      style={{ letterSpacing: "-0.012em" }}
    >
      <span
        className="block"
        style={{ fontSize: studioSize, letterSpacing: "-0.012em" }}
      >
        studio
      </span>
      <span
        className="block"
        style={{ fontSize: errantSize, letterSpacing: "0.002em" }}
      >
        errant
      </span>
    </Tag>
  );
}
