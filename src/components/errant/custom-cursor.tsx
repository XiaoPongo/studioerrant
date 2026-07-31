"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * The cursor — almost not there.
 *
 * A small white dot that follows the pointer with smooth interpolation,
 * and a thin ring that lags a fraction behind. No bloom. No trail.
 * If the visitor notices the cursor, it is already doing too much.
 *
 * On hover over interactive elements, the ring expands slightly and
 * the dot dims — the only acknowledgement that something is reachable.
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
      // The dot follows closely but not perfectly attached.
      dot.x += (target.x - dot.x) * 0.32;
      dot.y += (target.y - dot.y) * 0.32;
      // The ring lags a fraction more.
      ring.x += (target.x - ring.x) * 0.14;
      ring.y += (target.y - ring.y) * 0.14;
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
      {/* The thin ring. Expands slightly on hover. Uses the
          foreground color so it adapts to Night/Morning. */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: hovering ? 28 : 18,
          height: hovering ? 28 : 18,
          border: "1px solid",
          borderColor: hovering
            ? "color-mix(in oklab, var(--foreground) 55%, transparent)"
            : "color-mix(in oklab, var(--foreground) 28%, transparent)",
          transition:
            "width 600ms cubic-bezier(0.22,0.61,0.36,1), height 600ms cubic-bezier(0.22,0.61,0.36,1), border-color 600ms ease",
        }}
      />
      {/* The dot. Small, dim, present. */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: 4,
          height: 4,
          background: "color-mix(in oklab, var(--foreground) 90%, transparent)",
          transition: "opacity 500ms ease",
          opacity: hovering ? 0.4 : 0.9,
        }}
      />
    </div>
  );
}
