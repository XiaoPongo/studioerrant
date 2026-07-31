"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * The cursor is another living element — a small source of awareness
 * moving through the environment. It follows the mouse with slight
 * interpolation (never perfectly attached, never sluggish) and leaves
 * an extremely subtle fading trail.
 *
 * Disabled entirely on touch devices and when the visitor requests
 * reduced motion.
 */
export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const orbRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("errant-custom-cursor");
      return;
    }
    document.body.classList.add("errant-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const orb = { x: target.x, y: target.y };
    const trail = { x: target.x, y: target.y };
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
      orb.x += (target.x - orb.x) * 0.28;
      orb.y += (target.y - orb.y) * 0.28;
      trail.x += (target.x - trail.x) * 0.12;
      trail.y += (target.y - trail.y) * 0.12;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${orb.x}px, ${orb.y}px, 0) translate(-50%, -50%)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`;
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
      <div
        ref={trailRef}
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: 26,
          height: 26,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(2px)",
          transition:
            "width 240ms ease-out, height 240ms ease-out, opacity 240ms ease-out",
          opacity: hovering ? 0.7 : 0.45,
        }}
      />
      <div
        ref={orbRef}
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: hovering ? 18 : 12,
          height: hovering ? 18 : 12,
          background: hovering
            ? "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0) 100%)"
            : "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0) 100%)",
          filter: "blur(0.6px)",
          transition: "width 220ms ease-out, height 220ms ease-out",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
