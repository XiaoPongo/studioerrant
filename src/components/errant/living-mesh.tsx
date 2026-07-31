"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The Living Mesh — refined.
 *
 * The first version was too active. This one is almost not there.
 *
 * What it is now:
 *   - Dust floating through light. Not particles flying through space.
 *   - A faint, physical haze — graphite powder disturbed by air —
 *     rather than a cosmic field.
 *   - Movement the visitor notices only after several seconds.
 *
 * How:
 *   - ~80% fewer particles than before. Density is tiny.
 *   - Drift is ~6–8× slower. Velocities are near-zero; the field
 *     is advected by a very low-frequency noise so motion happens
 *     on the timescale of breath, not animation.
 *   - No "lighter" composite fireworks. Particles are drawn as
 *     extremely faint, soft dots that fade in and out over long
 *     lifetimes — like motes catching light for a moment.
 *   - Cursor influence is almost imperceptible: a tiny, slow
 *     displacement that decays over a wide radius.
 *   - Scroll does not visibly speed the field; it only shifts the
 *     noise sample origin so the composition evolves as you walk.
 *   - The creative accent (purple) is driven by `creativeIntensity`
 *     and is ONLY raised outside of Arrival. On Arrival it is zero.
 *
 * The grain, vignette, and sheen are handled by separate DOM layers
 * (see globals.css `.errant-grain`, `.errant-vignette`, `.errant-sheen`).
 * The canvas here is just the dust.
 */

interface MeshProps {
  /** 0..1 — how strongly the creative accent emerges beneath the
      surface. Zero on Arrival. Rises only inside Work / Experiments
      / project pages. */
  creativeIntensity?: number;
  className?: string;
}

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  baseAlpha: number;
}

// Very low-frequency flow. The field barely moves — motion happens
// on the timescale of minutes, not seconds.
function flowAngle(x: number, y: number, t: number): number {
  const a =
    Math.sin(x * 0.00045 + t * 0.000022) +
    Math.cos(y * 0.00052 - t * 0.000018) +
    Math.sin((x + y) * 0.00028 + t * 0.000015) * 0.4;
  return a * Math.PI;
}

// Parse a CSS color (hex, rgb, rgba) into an {r,g,b} triple. Used so
// the dust can follow the theme's foreground color (Night vs Morning).
// Falls back to warm white if parsing fails.
function cssColorToRgb(input: string): { r: number; g: number; b: number } {
  const s = input.trim();
  if (!s) return { r: 233, g: 230, b: 225 };
  // hex
  const hexMatch = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = parseInt(h, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  // rgb()/rgba()
  const rgbMatch = s.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i,
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }
  return { r: 233, g: 230, b: 225 };
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
    let motes: Mote[] = [];
    let rafId = 0;
    const startTime = performance.now();
    let lastTime = startTime;
    let scrollOffset = 0;
    let targetScrollOffset = 0;
    const pointer = { x: -9999, y: -9999, active: false };

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

      // Density: deliberately tiny. Dust, not a field.
      // ~1 mote per 26,000 px² on desktop, even fewer on touch.
      const area = width * height;
      let density = Math.floor(area / 26000);
      if (isTouch) density = Math.floor(density * 0.6);
      if (reducedMotion) density = Math.floor(density * 0.5);
      density = Math.max(18, Math.min(density, 70));
      motes = new Array(density).fill(0).map(() => spawn(true));
      ctx.clearRect(0, 0, width, height);
    }

    function spawn(initial = false): Mote {
      const x = initial
        ? Math.random() * width
        : Math.random() * width * 0.6 - width * 0.05;
      const y = Math.random() * height;
      // Long lifetimes — motes drift in and out slowly.
      const maxLife = 14000 + Math.random() * 18000;
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        life: Math.random() * maxLife,
        maxLife,
        // Most motes are very small; a few are slightly larger.
        size: 0.4 + Math.random() * Math.random() * 1.6,
        baseAlpha: 0.05 + Math.random() * 0.12,
      };
    }

    function step(now: number) {
      if (!ctx) return;
      const t = now - startTime;
      const dt = Math.min(now - lastTime, 60);
      lastTime = now;

      // Ease the scroll offset toward target then slowly decay.
      // The field does not speed up; the sample origin drifts.
      scrollOffset += (targetScrollOffset - scrollOffset) * 0.04;
      targetScrollOffset *= 0.985;

      // A very gentle clear. We keep a faint residue so motes leave
      // the softiest possible trace — like dust suspended in still air.
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      const speedScale = reducedMotion ? 0.15 : 1;
      const creative = creativeRef.current;

      // Read the current foreground color from the CSS variable so
      // the dust adapts to Night (warm white) and Morning (charcoal).
      // We re-read on each frame so theme transitions are followed.
      const styles = getComputedStyle(document.documentElement);
      const fg = styles.getPropertyValue("--foreground").trim();
      const rgb = cssColorToRgb(fg);

      // The accent — deep, muted, almost invisible.
      const accentR = 88;
      const accentG = 76;
      const accentB = 132;

      for (let i = 0; i < motes.length; i++) {
        const p = motes[i];

        const angle = flowAngle(p.x, p.y + scrollOffset, t);
        const flow = 0.012 * speedScale;
        p.vx += Math.cos(angle) * flow;
        p.vy += Math.sin(angle) * flow;

        if (pointer.active && !reducedMotion && !isTouch) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 220;
          if (dist2 < radius * radius) {
            const d = Math.sqrt(dist2) || 1;
            const force = (1 - d / radius) * 0.018;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.life += dt;

        if (
          p.x < -60 ||
          p.x > width + 60 ||
          p.y < -60 ||
          p.y > height + 60 ||
          p.life > p.maxLife
        ) {
          Object.assign(p, spawn(false));
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        let fade: number;
        if (lifeRatio < 0.18) {
          fade = lifeRatio / 0.18;
        } else if (lifeRatio > 0.7) {
          fade = (1 - lifeRatio) / 0.3;
        } else {
          fade = 1;
        }
        fade = fade * fade;

        const alpha = p.baseAlpha * fade;

        // Soft mote, drawn as a tiny radial gradient so the edge is
        // never hard. Color follows the theme's foreground.
        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 3,
        );
        grad.addColorStop(
          0,
          `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`,
        );
        grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        if (creative > 0.01 && i % 5 === 0) {
          const accentAlpha = creative * alpha * 0.5;
          if (accentAlpha > 0.001) {
            const ag = ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              p.size * 4,
            );
            ag.addColorStop(
              0,
              `rgba(${accentR}, ${accentG}, ${accentB}, ${accentAlpha})`,
            );
            ag.addColorStop(
              1,
              `rgba(${accentR}, ${accentG}, ${accentB}, 0)`,
            );
            ctx.fillStyle = ag;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
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
    function onScroll() {
      // The field does not speed up. We only drift the sample origin.
      targetScrollOffset += window.scrollY * 0.0008;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!isTouch) {
      window.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
    }

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
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
