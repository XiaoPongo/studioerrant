"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useFinePointer } from "@/hooks/use-fine-pointer";

/**
 * The cursor — disappears into the experience.
 *
 * A tiny dot (3px) and a subtle thin ring (16px) that lags a fraction
 * behind. Soft easing. On hover over interactive elements, the ring
 * expands very slightly and the dot dims. On click, a subtle tap
 * ripple expands from the cursor position and fades — the only
 * acknowledgement that an action occurred.
 *
 * If the visitor notices the cursor, it is already doing too much.
 *
 * Disabled on touch and when reduced motion is requested. Touch
 * devices get their own tap ripple via <TapRipple />.
 */
export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const rippleIdRef = useRef(0);

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

    function onDown(e: MouseEvent) {
      const id = rippleIdRef.current++;
      setRipples((rs) => [...rs, { id, x: e.clientX, y: e.clientY }]);
      // Remove the ripple after the animation completes.
      window.setTimeout(() => {
        setRipples((rs) => rs.filter((r) => r.id !== id));
      }, 700);
    }

    function loop() {
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
    window.addEventListener("mousedown", onDown, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
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
      {/* Tap ripples — expand and fade on each click. */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            border: "1px solid color-mix(in oklab, var(--foreground) 40%, transparent)",
            animation: "errant-tap 700ms cubic-bezier(0.22,0.61,0.36,1) forwards",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Touch tap ripple — for mobile/touch devices where the custom cursor
 * is disabled. Renders a subtle expanding ring at each tap location.
 */
export function TapRipple() {
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const rippleIdRef = useRef(0);

  // Only on touch devices (no fine pointer) and when motion is allowed.
  const enabled = !finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const id = rippleIdRef.current++;
      setRipples((rs) => [...rs, { id, x: t.clientX, y: t.clientY }]);
      window.setTimeout(() => {
        setRipples((rs) => rs.filter((r) => r.id !== id));
      }, 700);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => window.removeEventListener("touchstart", onTouchStart);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    >
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            border: "1px solid color-mix(in oklab, var(--foreground) 45%, transparent)",
            animation: "errant-tap 700ms cubic-bezier(0.22,0.61,0.36,1) forwards",
          }}
        />
      ))}
    </div>
  );
}
