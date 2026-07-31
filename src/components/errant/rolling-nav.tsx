"use client";

import { useEffect, useRef, useState } from "react";
import { useRouterStore } from "@/lib/router";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  NAV_SECTIONS,
  getNavWindow,
  type NavSection,
} from "@/data/errant/nav-sections";
import type { ProjectCategory } from "@/data/errant/projects";
import { cn } from "@/lib/utils";

/**
 * The dynamic rolling navigation — RIGHT side.
 *
 *   Work
 *   › Design ‹   ← centered, highlighted
 *   Research
 *
 * Exactly three items are always visible: the previous section, the
 * current section (centered, highlighted), and the next section. All
 * three remain clickable.
 *
 * Two forces move the list:
 *   1. Scroll — when the visitor scrolls and a new Work chapter
 *      centers in the viewport, the list rotates to follow.
 *   2. Auto-rotation — every 4 seconds the list advances one step
 *      on its own, so the menu is always gently alive even when the
 *      visitor is still. The auto-rotation is paused for a while
 *      after the visitor scrolls or clicks, so it never fights them.
 *
 * The navigation is DATA-DRIVEN, reading from NAV_SECTIONS (built
 * directly from the canonical CATEGORIES list). Rename a category in
 * the data source and the navigation updates automatically.
 *
 * Desktop-only. On touch devices it is hidden.
 */
const AUTO_ROTATE_INTERVAL = 4000;
const AUTO_ROTATE_PAUSE_AFTER_INTERACTION = 8000;

export function RollingNav() {
  const navigate = useRouterStore((s) => s.navigate);
  const route = useRouterStore((s) => s.route);
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(min-width: 768px)");

  const [activeId, setActiveId] = useState<ProjectCategory>(
    NAV_SECTIONS[0]?.id ?? "ai",
  );
  // A monotonic counter that advances the active section by one,
  // wrapping around. Used by both auto-rotation and the "next"
  // affordance.
  const pauseUntilRef = useRef<number>(0);

  // Scroll-driven rotation. Re-queries sections each update so it
  // catches them after the page transition completes.
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
        // Pause auto-rotation while the visitor is actively scrolling.
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

  // Auto-rotation. Every 4 seconds, advance the active section by one
  // (wrapping) — unless the visitor has scrolled or clicked recently,
  // or has requested reduced motion.
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

  const window3 = getNavWindow(activeId);
  if (window3.length < 3) return null;

  const [prev, current, next] = window3;

  const go = (section: NavSection) => {
    // Any click pauses the auto-rotation for a while.
    pauseUntilRef.current =
      performance.now() + AUTO_ROTATE_PAUSE_AFTER_INTERACTION;
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

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:right-10"
    >
      <div className="flex flex-col items-end gap-5">
        <NavItem
          section={prev}
          state="prev"
          reduced={reduced}
          onClick={() => go(prev)}
        />
        <NavItem
          section={current}
          state="current"
          reduced={reduced}
          onClick={() => go(current)}
        />
        <NavItem
          section={next}
          state="next"
          reduced={reduced}
          onClick={() => go(next)}
        />
      </div>

      {/* A thin vertical guide line on the right edge — the spine. */}
      <div
        aria-hidden="true"
        className="absolute right-[3px] top-0 h-full w-px bg-foreground/10"
      />
    </nav>
  );
}

function NavItem({
  section,
  state,
  reduced,
  onClick,
}: {
  section: NavSection;
  state: "prev" | "current" | "next";
  reduced: boolean;
  onClick: () => void;
}) {
  const isCurrent = state === "current";
  return (
    <button
      type="button"
      data-cursor="hover"
      onClick={onClick}
      aria-current={isCurrent ? "true" : undefined}
      className={cn(
        "group relative flex items-center gap-3 pr-5 text-right transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        isCurrent
          ? "text-foreground"
          : "text-foreground/35 hover:text-foreground/65",
      )}
    >
      <span
        className={cn(
          "font-editorial lowercase leading-none transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          isCurrent ? "text-base md:text-lg" : "text-xs md:text-sm",
        )}
        style={{
          letterSpacing: isCurrent ? "0.01em" : "0.04em",
        }}
      >
        {section.navLabel}
      </span>
      {/* The marker — on the RIGHT side of the text. A small dash
          that grows into a diamond when the item is centered. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          isCurrent
            ? "h-1.5 w-1.5 rotate-45 bg-foreground"
            : "h-px w-3 bg-foreground/30 group-hover:w-4 group-hover:bg-foreground/50",
        )}
      />
    </button>
  );
}
