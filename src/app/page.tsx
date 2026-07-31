"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { attachHashListener, useRouterStore } from "@/lib/router";
import { useIsClient } from "@/hooks/use-is-client";
import { LivingMesh } from "@/components/errant/living-mesh";
import { CustomCursor } from "@/components/errant/custom-cursor";
import { Navigation } from "@/components/errant/navigation";
import { RollingNav } from "@/components/errant/rolling-nav";
import { Footer } from "@/components/errant/footer";
import { PaperDogEar } from "@/components/errant/paper-dog-ear";
import { PageTransition } from "@/components/errant/transitions";
import { ArrivalPage } from "@/components/errant/pages/arrival-page";
import { WorkPage } from "@/components/errant/pages/work-page";
import { AboutPage } from "@/components/errant/pages/about-page";
import { ProjectDetailPage } from "@/components/errant/pages/project-detail-page";

/**
 * Studio Errant — final refinement.
 *
 * A living practice of design, writing, research, and experiments.
 * Unfinished, by intention.
 *
 * Architecture: only the `/` route is exposed. Multi-page navigation
 * is handled by a tiny hash-based router. Each page dissolves through
 * darkness into the next, like crossing a threshold between rooms.
 *
 * The page itself is made from a material — graphite (Night) or
 * archival paper (Morning) — built from three stacked fixed layers:
 * a directional sheen, a soft radial light, and a static grain. The
 * Living Mesh (a sparse field of dust) drifts on top. None of these
 * shimmer or animate aggressively; they are the surface.
 *
 * The dynamic rolling navigation (left edge, desktop only) reads from
 * a single data source and rotates as the visitor scrolls through the
 * Work chapters.
 */
export default function Home() {
  const route = useRouterStore((s) => s.route);
  const transitionKey = useRouterStore((s) => s.transitionKey);
  const isClient = useIsClient();

  useEffect(() => {
    const detach = attachHashListener();
    return detach;
  }, []);

  // Purple emerges only inside creative work. Zero on Arrival and
  // About — those rooms are nearly monochrome.
  const creativeIntensity = useMemo(() => {
    if (route.name === "work" || route.name === "project") return 0.7;
    return 0;
  }, [route]);

  const pageKey =
    route.name === "project" ? `project-${route.slug}` : route.name;

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* ───────── The material surface (3 stacked layers) ───────── */}
      <div className="errant-sheen" aria-hidden="true" />
      <div className="errant-light" aria-hidden="true" />

      {/* The Living Mesh — sparse dust. Persistent across all pages. */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <LivingMesh creativeIntensity={creativeIntensity} />
      </div>

      {/* The creative accent — emerges beneath the surface only inside
          creative work. Very slow transition. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          opacity: creativeIntensity,
          background:
            "radial-gradient(120% 80% at 20% 30%, rgba(38,30,61,0.30) 0%, rgba(0,0,0,0) 55%), radial-gradient(100% 70% at 80% 70%, rgba(50,31,59,0.22) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* The grain — two stacked static SVG turbulence layers. This
          is what makes the monitor feel tactile. Never animates. */}
      <div className="errant-grain" aria-hidden="true" />
      <div className="errant-grain-fine" aria-hidden="true" />

      {/* The vignette — edges recede into the material. */}
      <div className="errant-vignette" aria-hidden="true" />

      {/* ───────── Interactive layers ───────── */}
      <CustomCursor />
      <Navigation />
      <RollingNav />
      <PaperDogEar />

      {/* Page content */}
      <main className="relative z-10 flex-1">
        {isClient ? (
          <AnimatePresence mode="wait">
            <PageTransition key={pageKey} transitionKey={transitionKey}>
              {renderRoute(route)}
            </PageTransition>
          </AnimatePresence>
        ) : (
          <div className="flex min-h-screen items-center justify-center">
            <div className="errant-breathe h-1.5 w-1.5 rounded-full bg-foreground/50" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function renderRoute(route: ReturnType<typeof useRouterStore.getState>["route"]) {
  switch (route.name) {
    case "arrival":
      return <ArrivalPage />;
    case "work":
      return <WorkPage />;
    case "about":
      return <AboutPage />;
    case "project":
      return <ProjectDetailPage slug={route.slug ?? ""} />;
    default:
      return <ArrivalPage />;
  }
}
