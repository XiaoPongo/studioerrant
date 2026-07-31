"use client";

import { useEffect, useRef, useState } from "react";
import { useMaterial } from "@/lib/material";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";

/**
 * The paper dog-ear.
 *
 * Not a dark/light toggle. A corner of the page that appears gently
 * folded over. Hovering lifts it slightly and casts a soft paper
 * shadow. Clicking unfolds the page — Night (graphite) slowly
 * transforms into Morning (archival paper), or folds back.
 *
 * The corner is built from layered CSS triangles + a real box-shadow
 * so the fold reads as physical, not iconic. It sits flush in the
 * top-right of the viewport, never inside the navigation bar — the
 * navigation belongs to the page; the dog-ear belongs to the page
 * itself.
 */
export function PaperDogEar() {
  const material = useMaterial((s) => s.material);
  const toggle = useMaterial((s) => s.toggle);
  const hydrate = useMaterial((s) => s.hydrate);
  const reduced = usePrefersReducedMotion();
  const isClient = useIsClient();
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef<number>(0);

  // Hydrate from localStorage after mount. Done in a rAF so the first
  // paint matches the server (Night) and the unfold, if any, happens
  // after the visitor has seen the room.
  useEffect(() => {
    if (!isClient) return;
    rafRef.current = requestAnimationFrame(() => hydrate());
    return () => cancelAnimationFrame(rafRef.current);
  }, [hydrate, isClient]);

  // The dog-ear is only meaningful on hover-capable, fine-pointer
  // devices. On touch it degrades to a small tappable corner.
  const isMorning = material === "morning";

  // Geometry of the folded triangle, in px. Small on mobile,
  // larger on desktop. The fold is intentionally not perfectly
  // symmetric — paper never folds along a perfectly clean line.
  const size = 52;

  return (
    <button
      type="button"
      aria-label={
        isMorning
          ? "Fold the page back to Night"
          : "Unfold the page to Morning"
      }
      aria-pressed={isMorning}
      data-cursor="hover"
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group fixed right-0 top-0 z-[60] block outline-none"
      style={{ pointerEvents: "auto", width: size, height: size }}
    >
      {/* The fold itself. We layer three shapes:
          1. The shadow the folded corner casts on the page beneath.
          2. The back of the folded paper (the underside).
          3. The top face of the folded triangle.
          All three are positioned absolutely at the top-right. */}
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 block transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          width: 0,
          height: 0,
          transform: hovered ? "translate(2px, 2px)" : "translate(0, 0)",
        }}
      >
        {/* 1. Soft paper shadow beneath the fold. */}
        <span
          className="absolute block"
          style={{
            right: -6,
            top: 4,
            width: size + 18,
            height: size + 18,
            background: "transparent",
            boxShadow:
              "0 10px 22px -10px rgba(0,0,0,0.55), 0 2px 6px -2px rgba(0,0,0,0.35)",
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
            opacity: hovered ? 0.85 : 0.5,
            transition: "opacity 600ms ease, box-shadow 600ms ease",
          }}
        />
        {/* 2. The underside of the fold — a slightly warmer/darker
               tone than the page, so the fold reads as physical
               paper lifted off the surface. */}
        <span
          className="absolute block transition-colors duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{
            right: 0,
            top: 0,
            width: 0,
            height: 0,
            borderTop: `${size}px solid ${
              isMorning ? "#cfc8b6" : "#1f2123"
            }`,
            borderLeft: `${size}px solid transparent`,
          }}
        />
        {/* 3. The top face of the folded triangle. A subtle gradient
               gives it the brushed-aluminium / matte-paper sheen. */}
        <span
          className="absolute block transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{
            right: 0,
            top: 0,
            width: 0,
            height: 0,
            borderTop: `${size - 1}px solid ${
              isMorning ? "#e3ded2" : "#16181a"
            }`,
            borderLeft: `${size - 1}px solid transparent`,
            filter: hovered
              ? "brightness(1.04)"
              : "brightness(1)",
          }}
        />
        {/* A hairline along the fold's diagonal — the crease. */}
        <span
          className="absolute block"
          style={{
            right: 0,
            top: 0,
            width: size * 1.414,
            height: 1,
            background: isMorning
              ? "rgba(42,39,36,0.18)"
              : "rgba(233,230,225,0.12)",
            transformOrigin: "right top",
            transform: "rotate(-45deg)",
            opacity: hovered ? 0.7 : 0.4,
            transition: "opacity 600ms ease",
          }}
        />
      </span>

      {/* A tiny, almost-invisible hint that the corner is folded.
          Only the most attentive visitor will notice the single
          character that lives in the fold. It is not a label. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute font-editorial italic leading-none transition-opacity duration-700",
          isClient ? "opacity-100" : "opacity-0",
        )}
        style={{
          right: 6,
          top: 6,
          fontSize: 9,
          letterSpacing: "0.02em",
          color: isMorning ? "rgba(42,39,36,0.45)" : "rgba(233,230,225,0.42)",
          transform: "rotate(0deg)",
        }}
      >
        {isMorning ? "n" : "m"}
      </span>

      {/* Reduced motion: the unfold still happens, but instantly.
          The atmosphere is preserved by the slow CSS color transition
          on html/body in globals.css. */}
      {reduced && null}
    </button>
  );
}
