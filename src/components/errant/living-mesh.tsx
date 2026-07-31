"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The Living Mesh — final pass.
 *
 * Dust caught in light. Not particles flying through space.
 *
 * What it is now:
 *   - Almost nothing. ~10–28 motes total on a desktop screen.
 *   - Movement happens on the timescale of minutes. A visitor notices
 *     it only after watching for several seconds.
 *   - Motes have varying thickness — some are tiny pinpricks, a few
 *     are slightly larger like graphite flecks.
 *   - Opacity is very low. They fade in and out over long lifetimes
 *     (20–45 seconds), so the field breathes rather than twinkles.
 *   - No "lighter" composite. Soft radial gradients only.
 *   - Cursor influence is nearly imperceptible — a wide, very weak
 *     displacement, like air disturbed by a passing hand.
 *   - Scroll does not speed the field; it only drifts the noise
 *     sample origin so the composition evolves as you walk.
 *
 * The mote color follows the theme: warm white in Night (graphite
 * dust in raking light), charcoal in Morning (graphite on paper).
 * So movement STAYS VISIBLE in both rooms — the Workshop does not
 * lose the dust the way a naive inversion would.
 */
interface MeshProps {
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

// Very low-frequency flow. Motion on the timescale of minutes.
function flowAngle(x: number, y: number, t: number): number {
  const a =
    Math.sin(x * 0.00038 + t * 0.000014) +
    Math.cos(y * 0.00044 - t * 0.000011) +
    Math.sin((x + y) * 0.00024 + t * 0.000009) * 0.35;
  return a * Math.PI;
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
    let motes: Mote[] = [];
    let rafId = 0;
    const startTime = performance.now();
    let lastTime = startTime;
    let scrollOffset = 0;
    let targetScrollOffset = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    let cachedRgb = { r: 232, g: 228, b: 220 };
    let cachedAlphaMult = 1;
    let lastVarCheck = 0;

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

      // Extremely sparse. Dust, not a field.
      const area = width * height;
      let density = Math.floor(area / 52000);
      if (isTouch) density = Math.floor(density * 0.55);
      if (reducedMotion) density = Math.floor(density * 0.45);
      density = Math.max(8, Math.min(density, 28));
      motes = new Array(density).fill(0).map(() => spawn(true));
      ctx.clearRect(0, 0, width, height);
    }

    function spawn(initial = false): Mote {
      const x = initial
        ? Math.random() * width
        : Math.random() * width * 0.7 - width * 0.05;
      const y = Math.random() * height;
      // Very long lifetimes — motes drift in and out over half a minute.
      const maxLife = 20000 + Math.random() * 25000;
      // Varying thickness: most are tiny, a few are larger flecks.
      // size^2 weighting makes large motes rare.
      const r = Math.random();
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        life: Math.random() * maxLife,
        maxLife,
        size: 0.3 + r * r * 1.8,
        baseAlpha: 0.04 + Math.random() * 0.1,
      };
    }

    function step(now: number) {
      if (!ctx) return;
      const t = now - startTime;
      const dt = Math.min(now - lastTime, 60);
      lastTime = now;

      scrollOffset += (targetScrollOffset - scrollOffset) * 0.035;
      targetScrollOffset *= 0.984;

      // Very gentle fade of existing pixels — motes leave the softest
      // possible trace, like graphite dust suspended in still air.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      // Re-read the mote color from the CSS variable every ~500ms so
      // theme transitions are followed without per-frame cost.
      if (now - lastVarCheck > 500) {
        const cs = getComputedStyle(document.documentElement);
        const fg = cs.getPropertyValue("--mote-color").trim();
        const am = cs.getPropertyValue("--mote-alpha-mult").trim();
        if (fg) cachedRgb = cssColorToRgb(fg);
        if (am) {
          const parsed = parseFloat(am);
          if (!Number.isNaN(parsed)) cachedAlphaMult = parsed;
        }
        lastVarCheck = now;
      }
      const rgb = cachedRgb;
      const alphaMult = cachedAlphaMult;

      const speedScale = reducedMotion ? 0.12 : 1;
      const creative = creativeRef.current;

      // The accent — deep, muted, almost invisible.
      const accentR = 86;
      const accentG = 74;
      const accentB = 124;

      for (let i = 0; i < motes.length; i++) {
        const p = motes[i];

        const angle = flowAngle(p.x, p.y + scrollOffset, t);
        const flow = 0.008 * speedScale;
        p.vx += Math.cos(angle) * flow;
        p.vy += Math.sin(angle) * flow;

        // Cursor influence — almost imperceptible. Wide, very weak.
        if (pointer.active && !reducedMotion && !isTouch) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 260;
          if (dist2 < radius * radius) {
            const d = Math.sqrt(dist2) || 1;
            const force = (1 - d / radius) * 0.012;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        p.vx *= 0.978;
        p.vy *= 0.978;
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.life += dt;

        if (
          p.x < -80 ||
          p.x > width + 80 ||
          p.y < -80 ||
          p.y > height + 80 ||
          p.life > p.maxLife
        ) {
          Object.assign(p, spawn(false));
          continue;
        }

        // Long, slow fades. Fade in for the first 22%, hold, fade out
        // for the last 35%. Occasional fading — the field breathes.
        const lifeRatio = p.life / p.maxLife;
        let fade: number;
        if (lifeRatio < 0.22) {
          fade = lifeRatio / 0.22;
        } else if (lifeRatio > 0.65) {
          fade = (1 - lifeRatio) / 0.35;
        } else {
          fade = 1;
        }
        fade = fade * fade * fade;

        const alpha = p.baseAlpha * fade * alphaMult;

        // Soft mote — a tiny radial gradient so the edge is never hard.
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.2);
        grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
        grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
        ctx.fill();

        // A fraction of motes carry the creative accent — only when
        // creative intensity has risen. Even then, very faint.
        if (creative > 0.01 && i % 6 === 0) {
          const accentAlpha = creative * alpha * 0.45;
          if (accentAlpha > 0.001) {
            const ag = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4.2);
            ag.addColorStop(0, `rgba(${accentR}, ${accentG}, ${accentB}, ${accentAlpha})`);
            ag.addColorStop(1, `rgba(${accentR}, ${accentG}, ${accentB}, 0)`);
            ctx.fillStyle = ag;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4.2, 0, Math.PI * 2);
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
      targetScrollOffset += window.scrollY * 0.0006;
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
