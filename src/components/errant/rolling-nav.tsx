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
 * A vertical "reel" of all section names. Exactly three items are
 * visible at once; the active item is centered, highlighted, and
 * larger. The reel slides vertically so the active item is always in
 * the center slot.
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
 *      cycles through sections WITHOUT scrolling the page. This is
 *      achieved with native non-passive event listeners so
 *      preventDefault() actually works.
 *
 * DATA-DRIVEN: reads from NAV_SECTIONS (built from CATEGORIES).
 *
 * Desktop: fixed to the right edge, vertically centered, full size.
 * Mobile: rendered inline below the hero, smaller, centered.
 */
const AUTO_ROTATE_INTERVAL = 4000;
const AUTO_ROTATE_PAUSE_AFTER_INTERACTION = 8000;

// Geometry — desktop.
const DESKTOP_ITEM_HEIGHT = 52;
const DESKTOP_REEL_HEIGHT = DESKTOP_ITEM_HEIGHT * 3;
// Geometry — mobile (smaller).
const MOBILE_ITEM_HEIGHT = 34;
const MOBILE_REEL_HEIGHT = MOBILE_ITEM_HEIGHT * 3;

export function RollingNav({
  /** When true, this instance only renders on mobile (inline). */
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
  const navRef = useRef<HTMLElement>(null);

  // Refs for wheel/touch handling (kept in refs so the native
  // listeners attached once can always read the latest values).
  const wheelAccumRef = useRef<number>(0);
  const lastWheelTimeRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchAccumRef = useRef<number>(0);
  const advanceRef = useRef<(dir: 1 | -1) => void>(() => {});

  const activeIndex = NAV_SECTIONS.findIndex((s) => s.id === activeId);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

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
  // Keep advanceRef in sync so native listeners can call the latest.
  advanceRef.current = advance;

  // Page-scroll-driven rotation (desktop only).
  useEffect(() => {
    if (!isDesktop || mobileOnly) return;

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
  }, [route, isDesktop, mobileOnly]);

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

  // ── Native non-passive wheel + touch listeners ──
  // React's onWheel is passive by default so preventDefault() is
  // ignored. We attach native listeners with { passive: false } so
  // we can stop the page from scrolling when the visitor scrolls
  // on the nav itself.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onWheel = (e: WheelEvent) => {
      // CRITICAL: prevent the page from scrolling.
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheelTimeRef.current > 300) {
        wheelAccumRef.current = 0;
      }
      lastWheelTimeRef.current = now;
      wheelAccumRef.current += e.deltaY;
      const threshold = 40;
      if (Math.abs(wheelAccumRef.current) >= threshold) {
        advanceRef.current(wheelAccumRef.current > 0 ? 1 : -1);
        wheelAccumRef.current = 0;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      touchAccumRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      // CRITICAL: prevent the page from scrolling while the visitor
      // drags on the nav.
      e.preventDefault();
      if (!touchStartRef.current) return;
      const t = e.touches[0];
      const dy = t.clientY - touchStartRef.current.y;
      touchAccumRef.current = dy;
    };

    const onTouchEnd = () => {
      if (Math.abs(touchAccumRef.current) > 25) {
        advanceRef.current(touchAccumRef.current > 0 ? 1 : -1);
      }
      touchStartRef.current = null;
      touchAccumRef.current = 0;
    };

    nav.addEventListener("wheel", onWheel, { passive: false });
    nav.addEventListener("touchstart", onTouchStart, { passive: false });
    nav.addEventListener("touchmove", onTouchMove, { passive: false });
    nav.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      nav.removeEventListener("wheel", onWheel);
      nav.removeEventListener("touchstart", onTouchStart);
      nav.removeEventListener("touchmove", onTouchMove);
      nav.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  if (NAV_SECTIONS.length === 0) return null;

  // This instance only renders on mobile (inline, below the hero).
  if (mobileOnly && isDesktop) return null;
  // The global instance only renders on desktop (fixed right).
  if (!mobileOnly && !isDesktop) return null;

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

  // ── Shared reel renderer ──
  // The same vertical reel is used on both desktop and mobile. Only
  // the sizing and positioning differ.
  const isMobileLayout = mobileOnly && !isDesktop;
  const itemH = isMobileLayout ? MOBILE_ITEM_HEIGHT : DESKTOP_ITEM_HEIGHT;
  const reelH = isMobileLayout ? MOBILE_REEL_HEIGHT : DESKTOP_REEL_HEIGHT;
  const translateY = -safeIndex * itemH;

  const reel = (
    <div
      className="relative overflow-hidden"
      style={{
        height: reelH,
        width: isMobileLayout ? 180 : 220,
        margin: isMobileLayout ? "0 0 0 auto" : undefined,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
    >
      <ul
        className="m-0 list-none p-0"
        style={{
          transform: `translateY(${itemH + translateY}px)`,
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
              style={{ height: itemH }}
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
                style={{ height: itemH }}
              >
                <span
                  className={cn(
                    "font-editorial lowercase leading-none transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                    isMobileLayout
                      ? isActive
                        ? "text-base"
                        : "text-[10px]"
                      : isActive
                        ? "text-xl md:text-2xl"
                        : "text-sm md:text-base",
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
                      ? isMobileLayout
                        ? "h-1.5 w-1.5 rotate-45 bg-foreground"
                        : "h-2 w-2 rotate-45 bg-foreground"
                      : "h-px w-3 bg-foreground/30 group-hover:w-4 group-hover:bg-foreground/50",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  // ── MOBILE: inline, centered, smaller, below the hero. ──
  if (isMobileLayout) {
    return (
      <nav
        ref={navRef as React.RefObject<HTMLElement>}
        aria-label="Sections"
        className="pointer-events-auto mt-10 select-none"
      >
        {reel}
      </nav>
    );
  }

  // ── DESKTOP: fixed to the right edge, vertically centered. ──
  return (
    <nav
      ref={navRef as React.RefObject<HTMLElement>}
      aria-label="Sections"
      className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:right-10"
    >
      {reel}
      <div
        aria-hidden="true"
        className="absolute right-[3px] top-1/2 h-[60px] w-px -translate-y-1/2 bg-foreground/15"
      />
    </nav>
  );
}
