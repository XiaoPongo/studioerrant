"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useIsClient } from "@/hooks/use-is-client";
import { LivingMesh } from "@/components/errant/living-mesh";
import { CustomCursor, TapRipple } from "@/components/errant/custom-cursor";
import { Navigation } from "@/components/errant/navigation";
import { RollingNav } from "@/components/errant/rolling-nav";
import { Footer } from "@/components/errant/footer";
import { PaperDogEar } from "@/components/errant/paper-dog-ear";
import { PageTransition } from "@/components/errant/transitions";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isClient = useIsClient();

  // Purple emerges only inside creative work — /work and /project/*.
  const creativeIntensity = useMemo(() => {
    if (pathname.startsWith("/work") || pathname.startsWith("/project")) return 0.7;
    return 0;
  }, [pathname]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="errant-sheen" aria-hidden="true" />
      <div className="errant-light" aria-hidden="true" />

      <div className="pointer-events-none fixed inset-0 z-0">
        <LivingMesh creativeIntensity={creativeIntensity} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[2400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          opacity: creativeIntensity,
          background:
            "radial-gradient(120% 80% at 20% 30%, rgba(38,30,61,0.30) 0%, rgba(0,0,0,0) 55%), radial-gradient(100% 70% at 80% 70%, rgba(50,31,59,0.22) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="errant-grain" aria-hidden="true" />
      <div className="errant-grain-fine" aria-hidden="true" />
      <div className="errant-vignette" aria-hidden="true" />

      <CustomCursor />
      <TapRipple />
      <Navigation />
      <RollingNav />
      <PaperDogEar />

      <main className="relative z-10 flex-1">
        {isClient ? (
          <AnimatePresence mode="wait">
            <PageTransition key={pathname}>{children}</PageTransition>
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
