"use client";

import { useEffect, useState } from "react";
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
 * The dynamic rolling navigation.
 *
 *   Work
 *   › Design ‹   ← centered, highlighted
 *   Research
 *
 * Exactly three items are always visible: the previous section, the
 * current section (centered, highlighted), and the next section. All
 * three remain clickable. When the visitor scrolls and a new section
 * enters the center of the viewport, the list rotates smoothly so the
 * new section becomes the centered one.
 *
 * The navigation is DATA-DRIVEN. It reads from NAV_SECTIONS, which is
 * built directly from the site's canonical CATEGORIES list. Rename a
 * category in the data source and the navigation updates automatically
 * — no component code changes required.
 *
 * The component is desktop-only. On touch devices it is hidden; the
 * mobile menu (in <Navigation />) remains the primary nav.
 */
export function RollingNav() {
  const navigate = useRouterStore((s) => s.navigate);
  const route = useRouterStore((s) => s.route);
  const reduced = usePrefersReducedMotion();
  const finePointer = useMediaQuery("(min-width: 768px)");

  // The currently-centered section id. Tracked by observing which
  // Work-page chapter is closest to the viewport's vertical center.
  const [activeId, setActiveId] = useState<ProjectCategory>(
    NAV_SECTIONS[0]?.id ?? "ai",
  );

  // Observe the Work page chapter sections. Each is tagged with
  // data-nav-section="<id>". We find the one whose center is closest
  // to the viewport's vertical center and make it active. The setState
  // happens inside the scroll/resize callback (allowed) — never
  // synchronously in the effect body.
  useEffect(() => {
    if (!finePointer) return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-section]"),
    );
    if (sections.length === 0) return;

    let raf = 0;
    const update = () => {
      raf = 0;
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
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Defer the first update so the page has time to mount after a
    // route transition (the sections may not be in their final
    // positions synchronously).
    const initialTimer = window.setTimeout(update, 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.clearTimeout(initialTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [route, finePointer]);

  if (!finePointer) return null;

  const window3 = getNavWindow(activeId);
  if (window3.length < 3) return null;

  const [prev, current, next] = window3;

  const go = (section: NavSection) => {
    // Smooth-scroll the visitor to the chosen chapter, if it exists
    // on the page. If we're not on the Work page, navigate there
    // first (the section will be scrolled to after arrival via the
    // browser's hash fragment).
    if (route.name !== "work") {
      navigate({ name: "work" });
      // After navigation, give the page time to mount, then scroll.
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
      className="pointer-events-auto fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:left-10"
    >
      <div className="flex flex-col items-start gap-5">
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

      {/* A thin vertical guide line — the spine the items rotate
          around. Almost invisible. */}
      <div
        aria-hidden="true"
        className="absolute left-[3px] top-0 h-full w-px bg-foreground/10"
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
        "group relative flex items-center gap-3 pl-5 text-left transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        isCurrent
          ? "text-foreground"
          : "text-foreground/35 hover:text-foreground/65",
      )}
    >
      {/* The marker — a small dash that grows into a diamond when
          the item is centered. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          isCurrent
            ? "h-1.5 w-1.5 rotate-45 bg-foreground"
            : "h-px w-3 bg-foreground/30 group-hover:w-4 group-hover:bg-foreground/50",
        )}
      />
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
    </button>
  );
}
