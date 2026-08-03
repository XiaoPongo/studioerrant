"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The Living Mesh — a constellation of ideas.
 *
 * A field of soft points drifts slowly and quietly across the
 * viewport — never in a single direction, never with a trailing
 * shape. When two points happen to drift near one another, a faint
 * line connects them, like a synapse firing between neurons. As they
 * drift apart, the line fades. This is the whole effect: points and
 * the occasional line between them — nothing organic, nothing with a
 * head or a tail.
 *
 * Motion is a gentle random drift (a soft, damped Brownian walk),
 * wrapped at the edges so the field never thins out or needs to
 * "spawn" new points. The field should read as calm and structural —
 * a network quietly thinking — rather than as flowing particles.
 *
 * The point/line color follows the theme: warm white in Night
 * (graphite dust in raking light), charcoal in Morning (graphite on
 * paper). In Morning the field is MORE visible (--mote-alpha-mult is
 * higher) so it never disappears on the light background.
 *
 * Reduced motion: drift slows dramatically but does not stop — the
 * atmosphere remains, and connections still form and fade.
 */
interface MeshProps {
  creativeIntensity?: number;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  /** Phase for a slow, subtle breathing pulse in opacity. */
  phase: number;
}

function cssColorToRgb(input: string): { r: number; g: number; b: number } {
  const s = (input || "").trim();
  if (!s) return { r: 232, g: 228, b: 220 };
  const hexMatch = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const num = parseInt(h, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  const rgbMatch = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }
  // Bare "r, g, b" triple (the format --mote-color is stored in)
  const tripleMatch = s.match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (tripleMatch) {
    return {
      r: parseInt(tripleMatch[1], 10),
      g: parseInt(tripleMatch[2], 10),
      b: parseInt(tripleMatch[3], 10),
    };
  }
  return { r: 232, g: 228, b: 220 };
}

export function LivingMesh({ creativeIntensity = 0, className }: MeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const creativeRef = useRef(creativeIntensity);

  useEffect(() => {
    creativeRef.current = creativeIntensity;
  }, [creativeIntensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let points: Point[] = [];
    let rafId = 0;
    const startTime = performance.now();
    let lastTime = startTime;
    const pointer = { x: -9999, y: -9999, active: false };
    let cachedRgb = { r: 232, g: 228, b: 220 };
    let cachedAlphaMult = 1;

    // Max distance at which two points connect with a line. Scales
    // gently with viewport so the field feels similarly dense on
    // large and small screens.
    let connectDist = 130;

    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      connectDist = Math.max(90, Math.min(160, width / 12));

      const area = width * height;
      let density = Math.floor(area / 34000);
      if (isTouch) density = Math.floor(density * 0.55);
      if (reducedMotion) density = Math.floor(density * 0.7);
      density = Math.max(16, Math.min(density, 46));
      points = new Array(density).fill(0).map(() => spawn());
      ctx.clearRect(0, 0, width, height);
    }

    function spawn(): Point {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.012 + Math.random() * 0.02;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.9 + Math.random() * 0.9,
        baseAlpha: 0.14 + Math.random() * 0.16,
        phase: Math.random() * Math.PI * 2,
      };
    }

    function step(now: number) {
      if (!ctx) return;
      const t = now - startTime;
      const dt = Math.min(now - lastTime, 60);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Re-read the mote color from the CSS variable on every frame
      // so it tracks theme changes instantly.
      const cs = getComputedStyle(document.documentElement);
      const fg = cs.getPropertyValue("--mote-color").trim();
      const am = cs.getPropertyValue("--mote-alpha-mult").trim();
      if (fg) cachedRgb = cssColorToRgb(fg);
      if (am) {
        const parsed = parseFloat(am);
        if (!Number.isNaN(parsed)) cachedAlphaMult = parsed;
      }
      const rgb = cachedRgb;
      const alphaMult = cachedAlphaMult;

      const speedScale = reducedMotion ? 0.2 : 1;
      const creative = creativeRef.current;

      // The accent — deep, muted, discovered.
      const accentR = 90;
      const accentG = 76;
      const accentB = 128;

      // ── Drift each point ──
      for (const p of points) {
        // A very small, slowly-changing random acceleration — a
        // gentle Brownian wander, not a purposeful flow.
        p.vx += (Math.random() - 0.5) * 0.0025 * speedScale;
        p.vy += (Math.random() - 0.5) * 0.0025 * speedScale;

        // Cursor influence — points drift softly away from the
        // pointer, like disturbed dust settling.
        if (pointer.active && !reducedMotion && !isTouch) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 160;
          if (dist2 < radius * radius) {
            const d = Math.sqrt(dist2) || 1;
            const force = (1 - d / radius) * 0.012;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        // Damping keeps the drift slow and settled rather than
        // accelerating indefinitely.
        p.vx *= 0.98;
        p.vy *= 0.98;
        const maxSpeed = 0.06 * speedScale;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > maxSpeed) {
          p.vx = (p.vx / sp) * maxSpeed;
          p.vy = (p.vy / sp) * maxSpeed;
        }

        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);

        // Wrap at the edges — the field never thins out or needs to
        // respawn points, so density stays constant and even.
        const margin = 20;
        if (p.x < -margin) p.x = width + margin;
        if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        if (p.y > height + margin) p.y = -margin;
      }

      // ── Draw connections first, so points sit on top ──
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist >= connectDist) continue;

          const proximity = 1 - dist / connectDist;
          let alpha = proximity * proximity * 0.16 * alphaMult;
          if (alpha < 0.002) continue;

          const useAccent =
            creative > 0.01 && (i + j) % 7 === 0 && creative > Math.random();

          if (useAccent) {
            const accentAlpha = alpha * creative * 1.4;
            ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${accentAlpha})`;
          } else {
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          }
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // ── Draw points ──
      for (const p of points) {
        const pulse = 0.85 + Math.sin(t * 0.0006 + p.phase) * 0.15;
        const alpha = p.baseAlpha * pulse * alphaMult;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.2);
        grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
        grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }
    function onMouseLeave() {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    }

    resize();
    window.addEventListener("resize", resize);
    if (!isTouch) {
      window.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
    }

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
