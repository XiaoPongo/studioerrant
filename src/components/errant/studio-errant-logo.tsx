"use client";

import { useMaterial } from "@/lib/material";
import { cn } from "@/lib/utils";

/**
 * The official Studio Errant logo.
 *
 * Renders the supplied SVG wordmark (a stacked lowercase Didone
 * lockup: "studio" larger, "errant" smaller). The SVG has a
 * transparent background with dark charcoal marks, and a 5:3
 * aspect ratio (375×225 viewBox).
 *
 * Theme-awareness:
 *   Night  (default, dark page)  → light logo  (CSS `filter: invert(1)`)
 *   Morning (light theme)        → dark logo   (no filter)
 *
 * Two stacked <img> elements crossfade via opacity. The dark logo
 * is position:relative so it establishes the box size; the light
 * logo overlays it absolutely. invert() does not affect the alpha
 * channel, so transparency is preserved in both themes.
 *
 * Styles are applied inline (rather than via CSS classes) so they
 * are never stripped by the CSS processor.
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
      className={cn("relative inline-block align-middle", className)}
      style={{ width, height, lineHeight: 0 }}
      role="img"
      aria-label={alt}
    >
      {/* Dark logo — visible in Morning (light theme).
          position:relative so it establishes the box size. */}
      <img
        src="/studio-errant-logo.svg"
        alt=""
        aria-hidden="true"
        className="relative block h-auto max-w-full"
        style={{
          opacity: isMorning ? 1 : 0,
          transition: "opacity 1.6s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
        draggable={false}
      />
      {/* Light logo — visible in Night (dark theme, default).
          Absolutely positioned to overlay the dark one exactly.
          Same SVG, inverted via CSS filter so dark marks become
          light. Transparent background is unaffected by invert(). */}
      <img
        src="/studio-errant-logo.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{
          objectFit: "contain",
          opacity: isMorning ? 0 : 1,
          filter: "invert(1)",
          transition: "opacity 1.6s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
        draggable={false}
      />
    </span>
  );
}
