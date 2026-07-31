"use client";

import { useEffect, useRef, useState } from "react";
import { useRouterStore } from "@/lib/router";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  NAV_SECTIONS,
  type NavSection,
} from "@/data/errant/nav-sections";
import type { ProjectCategory } from "@/data/errant/projects";
import { cn } from "@/lib/utils";

/**
 * The dynamic rolling navigation — RIGHT side.
 *
 * A vertical "reel" of all section names, with exactly three visible
 * at once. The reel is physically translated up or down so the active
 * section is always centered. The transition is a smooth rolling
 * scroll — the items slide through the center position as though the
 * list itself were a wheel rotating.
 *
 *   Writing
 *   › Design ‹   ← centered, highlighted, largest
 *   Research
 *
 * The reel is taller than its viewport (overflow hidden) so items
 * enter from one edge and exit the other. Masking fades the top and
 * bottom edges so items dissolve rather than cut.
 *
 * Two forces move the reel:
 *   1. Scroll — when a new Work chapter centers in the viewport.
 *   2. Auto-rotation — every 4 seconds the reel advances one step.
 *
 * The navigation is DATA-DRIVEN, reading from NAV_SECTIONS (built
 * directly from the canonical CATEGORIES list).
 *
 * Desktop-only. ~50% larger than the previous version.
 */
const AUTO_ROTATE_INTERVAL = 4000;
const AUTO_ROTATE_PAUSE_AFTER_INTERACTION = 8000;

// Geometry of the reel, in px. ~50% larger than the previous version.
const ITEM_HEIGHT = 52; // vertical pitch per item in the reel
const REEL_HEIGHT = ITEM_HEIGHT * 3; // exactly 3 items visible

export function RollingNav() {
  const navigate = useRouterStore((s) => s.navigate);
  const route = useRouterStore((s) => s.route);
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(min-width: 768px)");

  const [activeId, setActiveId] = useState<ProjectCategory>(
    NAV_SECTIONS[0]?.id ?? "ai",
  );
  const pauseUntilRef = useRef<number>(0);

  // The index of the active section in NAV_SECTIONS. Drives the
  // vertical translation of the reel.
  const activeIndex = NAV_SECTIONS.findIndex((s) => s.id === activeId);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  // Scroll-driven rotation.
  useEffect(() => {
    if (!finePointer) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-section]"),
      );
      if (sections.length === 0) return;
      const center = window.innerHeight / 2;
      let best: { id: string; dist: number } | null = null;
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - center);
        const id = el.dataset.navSection;
        if (!id) continue;
        if (!best || dist < best.dist) {
          best = { id, dist };
        }
      }
      if (best) {
        setActiveId(best.id as ProjectCategory);
        pauseUntilRef.current =
          performance.now() + AUTO_ROTATE_PAUSE_AFTER_INTERACTION;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const timers = [100, 500, 1200, 2000].map((ms) =>
      window.setTimeout(update, ms),
    );
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [route, finePointer]);

  // Auto-rotation every 4 seconds.
  useEffect(() => {
    if (!finePointer || reduced) return;
    const interval = window.setInterval(() => {
      if (performance.now() < pauseUntilRef.current) return;
      setActiveId((current) => {
        const idx = NAV_SECTIONS.findIndex((s) => s.id === current);
        const nextIdx = (idx + 1) % NAV_SECTIONS.length;
        return NAV_SECTIONS[nextIdx]?.id ?? current;
      });
    }, AUTO_ROTATE_INTERVAL);
    return () => window.clearInterval(interval);
  }, [finePointer, reduced]);

  if (!finePointer) return null;
  if (NAV_SECTIONS.length === 0) return null;

  const go = (section: NavSection) => {
    pauseUntilRef.current =
      performance.now() + AUTO_ROTATE_PAUSE_AFTER_INTERACTION;
    setActiveId(section.id);
    if (route.name !== "work") {
      navigate({ name: "work" });
      setTimeout(() => {
        const el = document.querySelector(
          `[data-nav-section="${section.id}"]`,
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 700);
      return;
    }
    const el = document.querySelector(`[data-nav-section="${section.id}"]`);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  // Build the reel. We render the full list but translate it so the
  // active item sits in the center slot. The reel is wrapped in a
  // fixed-height overflow-hidden viewport with mask fades at the
  // top and bottom edges.
  const translateY = -safeIndex * ITEM_HEIGHT;

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:right-10"
    >
      {/* The reel viewport — exactly 3 items tall, overflow hidden. */}
      <div
        className="relative overflow-hidden"
        style={{
          height: REEL_HEIGHT,
          width: 220,
          // Mask: fade the top and bottom edges so items dissolve
          // rather than cut. The fade is gentle so all 3 items
          // remain visible — only the extreme edges fade.
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        {/* The reel itself. Translated vertically so the active item
            is centered. The transition is the rolling animation. */}
        <ul
          className="m-0 list-none p-0"
          style={{
            // translateY is negative (−index × ITEM_HEIGHT). We add
            // ITEM_HEIGHT to offset the reel so the active item lands
            // in the center slot of the 3-item viewport.
            transform: `translateY(${ITEM_HEIGHT + translateY}px)`,
            transition: reduced
              ? "none"
              : "transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        >
          {NAV_SECTIONS.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li
                key={section.id}
                style={{ height: ITEM_HEIGHT }}
                className="flex items-center justify-end"
              >
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => go(section)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group flex items-center gap-3 pr-5 text-right transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/35 hover:text-foreground/65",
                  )}
                  style={{ height: ITEM_HEIGHT }}
                >
                  <span
                    className={cn(
                      "font-editorial lowercase leading-none transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                      isActive
                        ? "text-xl md:text-2xl"
                        : "text-sm md:text-base",
                    )}
                    style={{
                      letterSpacing: isActive ? "0.01em" : "0.04em",
                    }}
                  >
                    {section.navLabel}
                  </span>
                  {/* The marker — a small dash that becomes a diamond
                      when the item is centered. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                      isActive
                        ? "h-2 w-2 rotate-45 bg-foreground"
                        : "h-px w-3 bg-foreground/30 group-hover:w-4 group-hover:bg-foreground/50",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* A thin vertical guide line on the right edge — the spine. */}
      <div
        aria-hidden="true"
        className="absolute right-[3px] top-1/2 h-[60px] w-px -translate-y-1/2 bg-foreground/15"
      />
    </nav>
  );
}
