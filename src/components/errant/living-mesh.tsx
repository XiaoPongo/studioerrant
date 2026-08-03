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
  /** A persistent target velocity the point always eases toward —
   *  this is what keeps drift alive without needing cursor input. */
  targetVx: number;
  targetVy: number;
  size: number;
  baseAlpha: number;
  /** Phase for a slow, subtle breathing pulse in opacity. */
  phase: number;
  /** Recomputed each frame — how many lines currently connect to
   *  this point. Used to make well-connected points shine brighter. */
  connections: number;
  /** Distance to the single nearest connected neighbor this frame —
   *  drives the amoeba-like stretch toward it. Infinity if none. */
  nearestDist: number;
  /** Angle toward that nearest neighbor, in radians. */
  nearestAngle: number;
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
      let density = Math.floor((area / 34000) * 2.5);
      if (isTouch) density = Math.floor(density * 0.55);
      if (reducedMotion) density = Math.floor(density * 0.7);
      density = Math.max(40, Math.min(density, 115));
      points = new Array(density).fill(0).map(() => spawn());
      ctx.clearRect(0, 0, width, height);
    }

    function spawn(): Point {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.032 + Math.random() * 0.05;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        targetVx: Math.cos(angle) * speed,
        targetVy: Math.sin(angle) * speed,
        size: 0.9 + Math.random() * 0.9,
        baseAlpha: 0.2 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        connections: 0,
        nearestDist: Infinity,
        nearestAngle: 0,
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
        // The target velocity wanders slowly over time — organic
        // variation — but is always renormalized to a real, visible
        // speed, so it never decays toward zero the way pure random
        // noise would.
        p.targetVx += (Math.random() - 0.5) * 0.0018 * speedScale;
        p.targetVy += (Math.random() - 0.5) * 0.0018 * speedScale;
        const targetSpeed = Math.hypot(p.targetVx, p.targetVy) || 1;
        const minTarget = 0.035 * speedScale;
        const maxTarget = 0.09 * speedScale;
        const clamped = Math.min(Math.max(targetSpeed, minTarget), maxTarget);
        p.targetVx = (p.targetVx / targetSpeed) * clamped;
        p.targetVy = (p.targetVy / targetSpeed) * clamped;

        // Ease the actual velocity toward the target. This is what
        // guarantees continuous motion — the point always has
        // somewhere to drift toward, with or without the cursor.
        p.vx += (p.targetVx - p.vx) * 0.025;
        p.vy += (p.targetVy - p.vy) * 0.025;

        // Cursor influence — a temporary push layered on top. The
        // easing above will settle it back toward the target drift
        // over the following second or two.
        if (pointer.active && !reducedMotion && !isTouch) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 160;
          if (dist2 < radius * radius) {
            const d = Math.sqrt(dist2) || 1;
            const force = (1 - d / radius) * 0.02;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        // A safety clamp so cursor bursts never send a point flying.
        const maxSpeed = 0.22 * speedScale;
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

        p.connections = 0;
        p.nearestDist = Infinity;
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
          let alpha = proximity * proximity * 0.24 * alphaMult;
          if (alpha < 0.002) continue;

          a.connections += proximity;
          b.connections += proximity;

          if (dist < a.nearestDist) {
            a.nearestDist = dist;
            a.nearestAngle = Math.atan2(b.y - a.y, b.x - a.x);
          }
          if (dist < b.nearestDist) {
            b.nearestDist = dist;
            b.nearestAngle = Math.atan2(a.y - b.y, a.x - b.x);
          }

          const useAccent =
            creative > 0.01 && (i + j) % 7 === 0 && creative > Math.random();

          if (useAccent) {
            const accentAlpha = alpha * creative * 1.4;
            ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${accentAlpha})`;
          } else {
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          }
          // Closer points connect with a thicker line — this is
          // what makes near-clusters read as brighter "hubs".
          ctx.lineWidth = 0.4 + proximity * 1.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // ── Draw points ──
      for (const p of points) {
        const pulse = 0.85 + Math.sin(t * 0.0006 + p.phase) * 0.15;
        // Points with more/closer connections shine brighter and
        // slightly larger — this is what makes hub points stand out,
        // similar in spirit to the denser convergence points in a
        // real neural network render.
        const connectionBoost = Math.min(1 + p.connections * 0.35, 2.4);
        const alpha = p.baseAlpha * pulse * alphaMult * connectionBoost;
        const radius = p.size * 2.2 * Math.min(1 + p.connections * 0.12, 1.6);

        // A gentle amoeba-like stretch toward the nearest connected
        // neighbor — subtle, not cartoonish. Reaches out slightly
        // more as the neighbor gets closer, and relaxes back to a
        // plain round dot when nothing is nearby.
        const proximity =
          p.nearestDist < connectDist ? 1 - p.nearestDist / connectDist : 0;
        const stretch = 1 + proximity * 0.45;
        const squeeze = 1 - proximity * 0.16;

        ctx.save();
        ctx.translate(p.x, p.y);
        if (proximity > 0) ctx.rotate(p.nearestAngle);
        ctx.scale(stretch, squeeze);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(alpha, 0.9)})`);
        grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
