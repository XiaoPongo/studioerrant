"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { attachHashListener, useRouterStore } from "@/lib/router";
import { useIsClient } from "@/hooks/use-is-client";
import { LivingMesh } from "@/components/errant/living-mesh";
import { CustomCursor } from "@/components/errant/custom-cursor";
import { Navigation } from "@/components/errant/navigation";
import { Footer } from "@/components/errant/footer";
import { PaperDogEar } from "@/components/errant/paper-dog-ear";
import { PageTransition } from "@/components/errant/transitions";
import { ArrivalPage } from "@/components/errant/pages/arrival-page";
import { WorkPage } from "@/components/errant/pages/work-page";
import { AboutPage } from "@/components/errant/pages/about-page";
import { ProjectDetailPage } from "@/components/errant/pages/project-detail-page";

/**
 * Studio Errant — refined.
 *
 * A digital studio built around curiosity. The website unfolds like
 * entering a museum before opening hours: quiet, tactile, material.
 *
 * Architecture: only the `/` route is exposed. Multi-page navigation
 * is handled by a tiny hash-based router. Each "page" is a client-side
 * view that dissolves through darkness into the next.
 *
 * The Living Mesh is a single persistent canvas behind every page so
 * that motion remains continuous across transitions — the dust never
 * resets. Its `creativeIntensity` rises only inside creative work
 * (Work / Experiments / project pages). On Arrival it is zero — the
 * experience is nearly monochrome. The visitor discovers purple; they
 * are never introduced to it.
 *
 * Two materials: Night (graphite, the default) and Morning (archival
 * paper), toggled by a physical paper dog-ear in the top-right corner.
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
  // About — those rooms are nearly monochrome. The visitor must
  // deepen their navigation before the accent appears.
  const creativeIntensity = useMemo(() => {
    if (route.name === "work" || route.name === "project") return 0.7;
    return 0;
  }, [route]);

  const pageKey =
    route.name === "project" ? `project-${route.slug}` : route.name;

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* ───────── Persistent material layers ───────── */}

      {/* The graphite sheen — a faint directional gradient that gives
          the surface the impression of brushed metal under raking
          light. Sits beneath everything. */}
      <div className="errant-sheen" aria-hidden="true" />

      {/* The Living Mesh — the website's dust. Persistent across all
          pages so motion never resets. Nearly imperceptible. */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <LivingMesh creativeIntensity={creativeIntensity} />
      </div>

      {/* The creative accent — a deep, muted violet that emerges
          *beneath* the surface only while the visitor is inside
          creative work. On Arrival and About this is fully
          transparent. The transition is very slow so the visitor
          almost feels the change before they see it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          opacity: creativeIntensity,
          background:
            "radial-gradient(120% 80% at 20% 30%, rgba(40,32,63,0.32) 0%, rgba(0,0,0,0) 55%), radial-gradient(100% 70% at 80% 70%, rgba(52,36,63,0.24) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* The material grain — what makes the monitor feel tactile. */}
      <div className="errant-grain" aria-hidden="true" />

      {/* The vignette — the edges of the viewport recede into the
          material. */}
      <div className="errant-vignette" aria-hidden="true" />

      {/* ───────── Interactive layers ───────── */}
      <CustomCursor />
      <Navigation />
      <PaperDogEar />

      {/* Page content. AnimatePresence handles dissolve-through-
          darkness transitions. A placeholder renders until mounted
          to avoid hydration mismatches with the hash router. */}
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
