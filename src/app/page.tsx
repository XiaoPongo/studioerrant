"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { attachHashListener, useRouterStore } from "@/lib/router";
import { useIsClient } from "@/hooks/use-is-client";
import { LivingMesh } from "@/components/errant/living-mesh";
import { CustomCursor } from "@/components/errant/custom-cursor";
import { Navigation } from "@/components/errant/navigation";
import { Footer } from "@/components/errant/footer";
import { PageTransition } from "@/components/errant/transitions";
import { ArrivalPage } from "@/components/errant/pages/arrival-page";
import { WorkPage } from "@/components/errant/pages/work-page";
import { AboutPage } from "@/components/errant/pages/about-page";
import { ProjectDetailPage } from "@/components/errant/pages/project-detail-page";

/**
 * Studio Errant
 *
 * A digital studio built around curiosity. The website unfolds like
 * entering a quiet gallery rather than browsing a traditional website.
 *
 * Architecture note: only the `/` route is exposed. Multi-page
 * navigation is handled by a tiny hash-based router (see
 * `@/lib/router`). Each "page" is a client-side view that dissolves
 * through darkness into the next.
 *
 * The Living Mesh is a single persistent canvas behind every page so
 * that motion remains continuous across transitions — the mesh never
 * resets when the visitor moves between Arrival, Work, About, and a
 * project. Its `creativeIntensity` rises while the visitor is inside
 * creative work (the Work section and project pages), and dissolves
 * back toward black otherwise.
 */
export default function Home() {
  const route = useRouterStore((s) => s.route);
  const transitionKey = useRouterStore((s) => s.transitionKey);
  const isClient = useIsClient();

  useEffect(() => {
    const detach = attachHashListener();
    return detach;
  }, []);

  // Purple emerges only inside creative work. It is discovered, never
  // applied — so we ease it in and out gently.
  const creativeIntensity = useMemo(() => {
    if (route.name === "work" || route.name === "project") return 1;
    return 0;
  }, [route]);

  // Determine which page to render. We keep the previous page mounted
  // during exit animations via AnimatePresence.
  const pageKey = route.name === "project" ? `project-${route.slug}` : route.name;

  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      {/* Persistent atmospheric layers ------------------------------- */}

      {/* The Living Mesh — the website's heartbeat. Persistent across
          all pages so motion never resets. */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <LivingMesh creativeIntensity={creativeIntensity} />
      </div>

      {/* A subtle purple wash that emerges *beneath* the darkness while
          the visitor is inside creative work. It dissolves back to black
          when they leave. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out"
        style={{
          opacity: creativeIntensity,
          background:
            "radial-gradient(120% 80% at 20% 30%, rgba(42,31,77,0.42) 0%, rgba(0,0,0,0) 55%), radial-gradient(100% 70% at 80% 70%, rgba(59,35,80,0.32) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* A faint grain that keeps the darkness from feeling synthetic. */}
      <div className="errant-grain" aria-hidden="true" />

      {/* A vignette so the edges of the viewport recede into shadow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Interactive layers ------------------------------------------ */}
      <CustomCursor />
      <Navigation />

      {/* Page content. AnimatePresence handles dissolve-through-darkness
          transitions. We render a placeholder until mounted to avoid
          hydration mismatches with the hash router. */}
      <main className="relative z-10 flex-1">
        {isClient ? (
          <AnimatePresence mode="wait">
            <PageTransition key={pageKey} transitionKey={transitionKey}>
              {renderRoute(route)}
            </PageTransition>
          </AnimatePresence>
        ) : (
          <div className="flex min-h-screen items-center justify-center">
            <div className="errant-breathe h-2 w-2 rounded-full bg-white/60" />
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
