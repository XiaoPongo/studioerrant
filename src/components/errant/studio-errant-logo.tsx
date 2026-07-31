"use client";

import { useMaterial } from "@/lib/material";
import { cn } from "@/lib/utils";

/**
 * The official Studio Errant logo.
 *
 * Renders the supplied SVG wordmark (a stacked lowercase Didone
 * lockup: "studio" larger, "errant" smaller). The SVG has a
 * transparent background with dark charcoal marks, and a 5:3
 * aspect ratio (500×300 natural size).
 *
 * Theme-awareness:
 *   Night  (default, dark page)  → light logo  (CSS `filter: invert(1)`)
 *   Morning (light theme)        → dark logo   (no filter)
 *
 * Uses a SINGLE <img> element. The filter transitions smoothly when
 * the dog-ear unfolds. This avoids the two-image stacking approach
 * which caused sizing bugs (the relative image would render at its
 * natural 500×300 size, ignoring the parent's height constraint,
 * and overflow the nav into the hero area).
 *
 * Sizing: the parent span is sized by the caller's width/height
 * props. The img uses `max-width: 100%; max-height: 100%` so it is
 * always constrained by the parent's definite dimension:
 *   - Nav  (height: 22px, width: auto) → img fills height, width
 *     follows the 5:3 aspect ratio.
 *   - Hero (width: min(72vw, 460px), height: auto) → img fills
 *     width, height follows the aspect ratio.
 */
export function StudioErrantLogo({
  className,
  width = "auto",
  height = "auto",
  alt = "Studio Errant",
}: {
  className?: string;
  width?: string;
  height?: string;
  alt?: string;
}) {
  const material = useMaterial((s) => s.material);
  const isMorning = material === "morning";

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      style={{ width, height, lineHeight: 0, overflow: "hidden" }}
      role="img"
      aria-label={alt}
    >
      <img
        src="/studio-errant-logo.svg"
        alt=""
        aria-hidden="true"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          filter: isMorning ? "none" : "invert(1)",
          transition: "filter 1.6s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
        draggable={false}
      />
    </span>
  );
}
