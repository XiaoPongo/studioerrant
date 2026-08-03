"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The Living Mesh — the flow of ideas.
 *
 * Particles (motes) are born at the LEFT edge of the viewport and
 * travel RIGHT with purpose — imitating the flow of ideas through a
 * neural network, or signals traveling between neurons. Most reach
 * the right edge. Some drift upward, some downward, but the general
 * direction is always left-to-right.
 *
 * No motes appear randomly in the middle. They are always emitted
 * from the left and always travel rightward. When a mote reaches the
 * right edge (or strays too far up/down), it is recycled back to the
 * left edge as a new mote.
 *
 * Each mote is rendered as a thin, faint STREAK — a signal along a
 * pathway, not a particle with a bulbous head. Paths are close to
 * straight, with only a slight organic wobble, so the field reads as
 * calm directional flow rather than swimming motion.
 *
 * The mote color follows the theme: warm white in Night (graphite
 * dust in raking light), charcoal in Morning (graphite on paper). In
 * Morning the motes are MORE visible (--mote-alpha-mult is higher)
 * so the flow never disappears on the light background.
 *
 * Reduced motion: the flow slows dramatically but does not stop —
 * the atmosphere remains.
 */
interface MeshProps {
  creativeIntensity?: number;
  className?: string;
}

interface Mote {
  x: number;
  y: number;
  /** Previous frame's position, used to draw the streak segment. */
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  baseAlpha: number;
  /** A persistent vertical drift — some motes rise, some fall. */
  drift: number;
  /** A small phase for organic wobble. */
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
    let motes: Mote[] = [];
    let rafId = 0;
    const startTime = performance.now();
    let lastTime = startTime;
    const pointer = { x: -9999, y: -9999, active: false };
    let cachedRgb = { r: 232, g: 228, b: 220 };
    let cachedAlphaMult = 1;

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

      // Density: a sparse field of idea-flows. Fewer on touch.
      const area = width * height;
      let density = Math.floor(area / 38000);
      if (isTouch) density = Math.floor(density * 0.55);
      if (reducedMotion) density = Math.floor(density * 0.6);
      density = Math.max(14, Math.min(density, 48));
      motes = new Array(density).fill(0).map(() => spawn(true));
      ctx.clearRect(0, 0, width, height);
    }

    function spawn(initial = false): Mote {
      // Motes are ALWAYS born at the left edge. On the very first
      // spawn (initial=true) we distribute them across the width so
      // the field doesn't start empty — but they still flow right.
      const x = initial ? Math.random() * width : -20 - Math.random() * 60;
      const y = Math.random() * height;
      // Rightward velocity — the purpose. Most motes move at a
      // similar pace; a few are slower or faster, but the spread is
      // gentler than before so the field feels coherent, not scattered.
      const speed = 0.16 + Math.random() * 0.34;
      // Vertical drift: a light, mostly-straight path. Some motes
      // rise, some fall, but only slightly — signals along a
      // pathway, not creatures swimming.
      const driftSign = Math.random() < 0.5 ? -1 : 1;
      const driftMag = Math.random() * 0.016;
      return {
        x,
        y,
        px: x,
        py: y,
        vx: speed,
        vy: 0,
        life: 0,
        maxLife: 18000 + Math.random() * 16000,
        // Uniform-ish thin size — no oversized "heads".
        size: 0.55 + Math.random() * 0.55,
        baseAlpha: 0.07 + Math.random() * 0.13,
        drift: driftSign * driftMag,
        phase: Math.random() * Math.PI * 2,
      };
    }

    function step(now: number) {
      if (!ctx) return;
      const t = now - startTime;
      const dt = Math.min(now - lastTime, 60);
      lastTime = now;

      // Fade of existing pixels so streaks leave a soft, SHORT
      // trailing tail rather than a long comet.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.065)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

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

      const speedScale = reducedMotion ? 0.25 : 1;
      const creative = creativeRef.current;

      // The accent — deep, muted, discovered.
      const accentR = 90;
      const accentG = 76;
      const accentB = 128;

      ctx.lineCap = "round";

      for (let i = 0; i < motes.length; i++) {
        const p = motes[i];

        p.px = p.x;
        p.py = p.y;

        // Rightward flow — the purpose. Constant gentle push right.
        p.vx += 0.002 * speedScale;
        // A restrained, slow wobble — enough to feel organic, not
        // enough to read as a curving swim path.
        p.vy += p.drift + Math.sin(t * 0.00011 + p.phase) * 0.0013;

        // Cursor influence — a gentle deflection, like a hand
        // disturbing the flow. Never stops the rightward motion.
        if (pointer.active && !reducedMotion && !isTouch) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 200;
          if (dist2 < radius * radius) {
            const d = Math.sqrt(dist2) || 1;
            const force = (1 - d / radius) * 0.02;
            p.vy += (dy / d) * force;
          }
        }

        // Damping — keep motion fluid, never robotic.
        p.vx *= 0.985;
        p.vy *= 0.955;
        // Clamp horizontal speed so it never stalls or sprints.
        const minVx = 0.08 * speedScale;
        const maxVx = 0.7 * speedScale;
        if (p.vx < minVx) p.vx = minVx;
        if (p.vx > maxVx) p.vx = maxVx;

        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.life += dt;

        // Recycle when the mote reaches the right edge, strays too
        // far vertically, or lives too long. Always re-birth at the
        // LEFT edge — never in the middle.
        if (
          p.x > width + 30 ||
          p.y < -80 ||
          p.y > height + 80 ||
          p.life > p.maxLife
        ) {
          Object.assign(p, spawn(false));
          continue;
        }

        // Fade in for the first 12% of life, hold, fade out for the
        // last 25%. Long, slow fades.
        const lifeRatio = p.life / p.maxLife;
        let fade: number;
        if (lifeRatio < 0.12) {
          fade = lifeRatio / 0.12;
        } else if (lifeRatio > 0.75) {
          fade = (1 - lifeRatio) / 0.25;
        } else {
          fade = 1;
        }
        fade = fade * fade;

        const alpha = p.baseAlpha * fade * alphaMult;

        // The signal itself — a thin stroked line from the previous
        // position to the current one. No radial blob, no bulbous
        // head. This is what makes it read as a traveling signal
        // rather than a swimming particle.
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // A soft, SMALL glow at the leading point — subtle, not a
        // dominant head shape.
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 1.4);
        grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
        ctx.fill();

        // A fraction of motes carry the creative accent — and only
        // when creative intensity has risen.
        if (creative > 0.01 && i % 5 === 0) {
          const accentAlpha = creative * alpha * 0.5;
          if (accentAlpha > 0.001) {
            ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${accentAlpha})`;
            ctx.lineWidth = p.size * 1.1;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
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
