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
 * The dynamic rolling navigation.
 *
 * A "reel" of all section names. Exactly three items are visible at
 * once; the active item is centered, highlighted, and larger. The
 * reel slides vertically (desktop) or horizontally (mobile) so the
 * active item is always in the center slot.
 *
 *   Writing          ← dim
 *   › Design ‹       ← centered, highlighted, largest
 *   Research         ← dim
 *
 * Four forces move the reel:
 *   1. Page scroll — when a Work chapter centers in the viewport.
 *   2. Auto-rotation — every 4 seconds the reel advances one step.
 *   3. Click — clicking any item scrolls the page to that chapter.
 *   4. User scroll on the nav itself — wheel/touch over the nav
 *      cycles through sections without scrolling the page.
 *
 * DATA-DRIVEN: reads from NAV_SECTIONS (built from CATEGORIES).
 *
 * Desktop: fixed to the right edge, vertically centered.
 * Mobile: rendered inline (not fixed) below the hero, horizontally.
 */
const AUTO_ROTATE_INTERVAL = 4000;
const AUTO_ROTATE_PAUSE_AFTER_INTERACTION = 8000;

// Geometry — desktop vertical reel.
const ITEM_HEIGHT = 52;
const REEL_HEIGHT = ITEM_HEIGHT * 3;

export function RollingNav({
  /** When true, this instance only renders on mobile (inline). When
   * false, only renders on desktop (fixed right). Default: false
   * (desktop), which is what the global page-level instance uses.
   * The Arrival hero passes mobileOnly=true so the nav appears below
   * the hero logo on phones. */
  mobileOnly = false,
}: {
  mobileOnly?: boolean;
}) {
  const navigate = useRouterStore((s) => s.navigate);
  const route = useRouterStore((s) => s.route);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [activeId, setActiveId] = useState<ProjectCategory>(
    NAV_SECTIONS[0]?.id ?? "ai",
  );
  const pauseUntilRef = useRef<number>(0);
  const wheelAccumRef = useRef<number>(0);
  const lastWheelTimeRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(
    null,
  );

  const activeIndex = NAV_SECTIONS.findIndex((s) => s.id === activeId);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  // Page-scroll-driven rotation (desktop only — on mobile the nav
  // is inline, not fixed, so page scroll doesn't drive it).
  useEffect(() => {
    if (!isDesktop) return;

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
  }, [route, isDesktop]);

  // Auto-rotation every 4 seconds.
  useEffect(() => {
    if (reduced) return;
    const interval = window.setInterval(() => {
      if (performance.now() < pauseUntilRef.current) return;
      setActiveId((current) => {
        const idx = NAV_SECTIONS.findIndex((s) => s.id === current);
        const nextIdx = (idx + 1) % NAV_SECTIONS.length;
        return NAV_SECTIONS[nextIdx]?.id ?? current;
      });
    }, AUTO_ROTATE_INTERVAL);
    return () => window.clearInterval(interval);
  }, [reduced]);

  if (NAV_SECTIONS.length === 0) return null;

  // This instance only renders on mobile (inline, below the hero).
  if (mobileOnly && isDesktop) return null;
  // The global instance only renders on desktop (fixed right).
  if (!mobileOnly && !isDesktop) return null;

  const advance = (dir: 1 | -1) => {
    pauseUntilRef.current =
      performance.now() + AUTO_ROTATE_PAUSE_AFTER_INTERACTION;
    setActiveId((current) => {
      const idx = NAV_SECTIONS.findIndex((s) => s.id === current);
      const nextIdx =
        (idx + dir + NAV_SECTIONS.length) % NAV_SECTIONS.length;
      return NAV_SECTIONS[nextIdx]?.id ?? current;
    });
  };

  const goToSection = (section: NavSection) => {
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
    el?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  };

  // User scroll on the nav itself: wheel (desktop) or touch (mobile).
  // Accumulates delta and advances one section per threshold. This
  // lets the visitor cycle the menu without scrolling the page.
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const now = performance.now();
    // Reset accumulator if it's been a while.
    if (now - lastWheelTimeRef.current > 300) {
      wheelAccumRef.current = 0;
    }
    lastWheelTimeRef.current = now;
    wheelAccumRef.current += e.deltaY;
    const threshold = 40;
    if (Math.abs(wheelAccumRef.current) >= threshold) {
      advance(wheelAccumRef.current > 0 ? 1 : -1);
      wheelAccumRef.current = 0;
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY, t: performance.now() };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    // On mobile the nav is horizontal, so horizontal swipe drives it.
    // On desktop it's vertical, so vertical swipe drives it.
    if (isDesktop) {
      if (Math.abs(dy) > 30 && Math.abs(dy) > Math.abs(dx)) {
        advance(dy > 0 ? 1 : -1);
      }
    } else {
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        advance(dx < 0 ? 1 : -1);
      }
    }
  };

  const translateY = -safeIndex * ITEM_HEIGHT;

  // ── MOBILE: horizontal reel, inline (not fixed), below the hero. ──
  // Reached only by the mobileOnly instance on mobile viewports.
  if (mobileOnly && !isDesktop) {
    return (
      <MobileRollingNav
        activeId={activeId}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onItemClick={goToSection}
      />
    );
  }

  // ── DESKTOP: vertical reel, fixed to the right edge. ──
  return (
    <nav
      aria-label="Sections"
      className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:right-10"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="relative overflow-hidden"
        style={{
          height: REEL_HEIGHT,
          width: 220,
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        <ul
          className="m-0 list-none p-0"
          style={{
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
                  onClick={() => goToSection(section)}
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
                      isActive ? "text-xl md:text-2xl" : "text-sm md:text-base",
                    )}
                    style={{ letterSpacing: isActive ? "0.01em" : "0.04em" }}
                  >
                    {section.navLabel}
                  </span>
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
      <div
        aria-hidden="true"
        className="absolute right-[3px] top-1/2 h-[60px] w-px -translate-y-1/2 bg-foreground/15"
      />
    </nav>
  );
}

// ── Mobile rolling nav ──────────────────────────────────────────
// Renders inline (not fixed). A horizontal reel: the active item is
// centered, with one neighbor on each side. Swipe left/right cycles.
function MobileRollingNav({
  activeId,
  onItemClick,
}: {
  activeId: ProjectCategory;
  onWheel: (e: React.WheelEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onItemClick: (s: NavSection) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const idx = NAV_SECTIONS.findIndex((s) => s.id === activeId);
  const safeIdx = idx === -1 ? 0 : idx;

  // Build a window of 3: prev, current, next (wrapping).
  const len = NAV_SECTIONS.length;
  const window3 = [
    NAV_SECTIONS[(safeIdx - 1 + len) % len],
    NAV_SECTIONS[safeIdx],
    NAV_SECTIONS[(safeIdx + 1) % len],
  ];

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-auto mt-12 select-none"
    >
      <div className="relative overflow-hidden px-4">
        <div
          className="flex items-center justify-center gap-6"
          style={{
            transition: reduced
              ? "none"
              : "transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        >
          {window3.map((section, i) => {
            const isActive = i === 1;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onItemClick(section)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "font-editorial lowercase leading-none transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                  isActive
                    ? "text-lg text-foreground"
                    : "text-xs text-foreground/40",
                )}
                style={{
                  letterSpacing: isActive ? "0.01em" : "0.04em",
                  flexShrink: 0,
                }}
              >
                {section.navLabel}
              </button>
            );
          })}
        </div>
        {/* Center marker */}
        <div className="mt-3 flex justify-center">
          <span className="h-1.5 w-1.5 rotate-45 bg-foreground" aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
}
