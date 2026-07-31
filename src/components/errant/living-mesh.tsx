"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The Living Mesh
 *
 * The defining visual element of Studio Errant. It is not decoration —
 * it is the website's heartbeat. It represents thought before language:
 * ideas before structure, connections before conclusions.
 *
 * Implementation notes (kept honest for future maintainers):
 *
 * - Pure 2D canvas. The brief permits GPU acceleration but warns that
 *   "the emotional experience is more important than the rendering
 *   technique." A 2D canvas gives us silk-underwater softness with
 *   graceful degradation on weak GPUs, and zero shader complexity to
 *   maintain. WebGL would add fidelity but at the cost of fragility.
 * - The mesh is built from a flowing particle field advected by a
 *   smoothly evolving noise vector field. Each particle leaves a short
 *   trail (we paint a translucent black rectangle each frame instead of
 *   clearing) which produces the silk-underwater / long-exposure-ink
 *   look the brief asks for.
 * - Composition drifts horizontally from the left and avoids symmetry.
 * - Cursor influence is gentle — like passing a hand through water.
 * - Scroll subtly increases flow speed.
 * - Reduced motion: particles slow dramatically, cursor influence off.
 * - Touch devices: no cursor influence (handled by the absence of mouse
 *   events); density is reduced by the responsive resize logic.
 */

interface MeshProps {
  /** 0..1 — how strongly the creative purple emerges beneath the black. */
  creativeIntensity?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

// Cheap deterministic pseudo-noise — smooth, periodic, no dependencies.
// Two stacked sines approximate low-frequency flow; a third adds warp.
function flowAngle(x: number, y: number, t: number): number {
  const a =
    Math.sin(x * 0.0016 + t * 0.00018) +
    Math.cos(y * 0.0019 - t * 0.00015) +
    Math.sin((x + y) * 0.0009 + t * 0.00012) * 0.6;
  return a * Math.PI;
}

export function LivingMesh({ creativeIntensity = 0, className }: MeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const creativeRef = useRef(creativeIntensity);

  // Keep the latest creative intensity in a ref so the animation loop
  // (which is set up once) can read it. Updated in an effect rather
  // than during render, per React 19's ref rules.
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
    let particles: Particle[] = [];
    let rafId = 0;
    const startTime = performance.now();
    let lastTime = startTime;
    let scrollInfluence = 0;
    let targetScrollInfluence = 0;
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
      const area = width * height;
      let density = Math.floor(area / 9000);
      if (isTouch) density = Math.floor(density * 0.55);
      if (reducedMotion) density = Math.floor(density * 0.5);
      density = Math.max(40, Math.min(density, 260));
      particles = new Array(density).fill(0).map(() => spawn());
      ctx.clearRect(0, 0, width, height);
    }

    function spawn(initial = false): Particle {
      const x = initial
        ? Math.random() * width
        : Math.random() * width * 0.7 - width * 0.1;
      const y = Math.random() * height;
      const maxLife = 220 + Math.random() * 320;
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        life: Math.random() * maxLife,
        maxLife,
        size: 0.6 + Math.random() * 1.8,
      };
    }

    function step(now: number) {
      if (!ctx || !canvas) return;
      const t = now - startTime;
      const dt = Math.min(now - lastTime, 40);
      lastTime = now;

      scrollInfluence += (targetScrollInfluence - scrollInfluence) * 0.08;
      targetScrollInfluence *= 0.94;

      const fadeAlpha = reducedMotion ? 0.16 : 0.05;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, width, height);

      const speedScale = reducedMotion ? 0.25 : 1;
      const scrollBoost = 1 + scrollInfluence * 0.8;
      const creative = creativeRef.current;

      const accentR = 90;
      const accentG = 70;
      const accentB = 150;

      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = flowAngle(p.x, p.y, t);
        const flow = 0.55 * speedScale * scrollBoost;
        p.vx += Math.cos(angle) * flow;
        p.vy += Math.sin(angle) * flow;

        if (pointer.active && !reducedMotion && !isTouch) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 160;
          if (dist2 < radius * radius) {
            const d = Math.sqrt(dist2) || 1;
            const force = (1 - d / radius) * 0.5;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.life += dt;

        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;
        if (p.y < -40) p.y = height + 40;
        if (p.y > height + 40) p.y = -40;

        if (p.life > p.maxLife) {
          Object.assign(p, spawn(false));
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        const fade =
          lifeRatio < 0.15
            ? lifeRatio / 0.15
            : lifeRatio > 0.8
              ? (1 - lifeRatio) / 0.2
              : 1;

        const whiteAlpha = 0.12 * fade;
        const accentAlpha = creative * 0.18 * fade;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${whiteAlpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (accentAlpha > 0.001) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${accentAlpha})`;
          ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "source-over";
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
      targetScrollInfluence = Math.min(1, targetScrollInfluence + 0.12);
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
