"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * The cursor — disappears into the experience.
 *
 * A tiny dot (3px) and a subtle thin ring (16px) that lags a fraction
 * behind. Soft easing. No bloom, no trail, no effects. On hover over
 * interactive elements, the ring expands very slightly and the dot
 * dims — the only acknowledgement that something is reachable.
 *
 * If the visitor notices the cursor, it is already doing too much.
 *
 * Disabled on touch and when reduced motion is requested.
 */
export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("errant-custom-cursor");
      return;
    }
    document.body.classList.add("errant-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: target.x, y: target.y };
    const ring = { x: target.x, y: target.y };
    let rafId = 0;

    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      setHovering(
        !!el?.closest(
          'a, button, [role="button"], [data-cursor="hover"], input, textarea, select, summary',
        ),
      );
    }

    function loop() {
      // Soft easing. The dot follows closely; the ring lags slightly.
      dot.x += (target.x - dot.x) * 0.3;
      dot.y += (target.y - dot.y) * 0.3;
      ring.x += (target.x - ring.x) * 0.12;
      ring.y += (target.y - ring.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("errant-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    >
      {/* The thin ring. Expands slightly on hover. */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: hovering ? 24 : 16,
          height: hovering ? 24 : 16,
          border: "1px solid",
          borderColor: hovering
            ? "color-mix(in oklab, var(--foreground) 50%, transparent)"
            : "color-mix(in oklab, var(--foreground) 22%, transparent)",
          transition:
            "width 700ms cubic-bezier(0.22,0.61,0.36,1), height 700ms cubic-bezier(0.22,0.61,0.36,1), border-color 700ms ease",
        }}
      />
      {/* The dot. Tiny. */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: 3,
          height: 3,
          background: "color-mix(in oklab, var(--foreground) 85%, transparent)",
          transition: "opacity 600ms ease",
          opacity: hovering ? 0.35 : 0.85,
        }}
      />
    </div>
  );
}
