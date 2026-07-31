"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouterStore, type ErrantRoute, type RouteName } from "@/lib/router";
import { StudioErrantLogo } from "@/components/errant/studio-errant-logo";
import { cn } from "@/lib/utils";

const ITEMS: { name: RouteName; label: string; route: ErrantRoute }[] = [
  { name: "arrival", label: "Arrival", route: { name: "arrival" } },
  { name: "work", label: "Work", route: { name: "work" } },
  { name: "about", label: "About", route: { name: "about" } },
];

export function Navigation() {
  const route = useRouterStore((s) => s.route);
  const navigate = useRouterStore((s) => s.navigate);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile overlay whenever the route changes. We adjust
  // state during render (the documented React pattern) rather than
  // via setState-in-effect.
  const routeKey = route.name + (route.slug ?? "");
  const [prevRouteKey, setPrevRouteKey] = useState(routeKey);
  if (prevRouteKey !== routeKey) {
    setPrevRouteKey(routeKey);
    if (mobileOpen) setMobileOpen(false);
  }

  // Subscribe to scroll. The setState happens inside the passive
  // event handler (allowed) — never synchronously in the effect body.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (name: RouteName) => {
    if (name === "arrival") return route.name === "arrival";
    return route.name === name;
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          scrolled
            ? "bg-background/50 backdrop-blur-[2px]"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
          {/* The official logo — clicking returns the visitor to
              Arrival. Uses the actual supplied SVG wordmark, not
              text. Theme-aware (light for Night, dark for Morning). */}
          <button
            type="button"
            onClick={() => navigate({ name: "arrival" })}
            className="group transition-opacity duration-700 hover:opacity-80"
            aria-label="Studio Errant — return to arrival"
            data-cursor="hover"
          >
            <StudioErrantLogo width="auto" height="30px" alt="Studio Errant" />
          </button>

          {/* Desktop nav — top right, small typography. */}
          <nav className="hidden items-center gap-12 md:flex">
            {ITEMS.map((item) => {
              const active = isActive(item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.route)}
                  data-cursor="hover"
                  className="group relative text-[11px] uppercase tracking-[0.32em] transition-colors duration-700"
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "transition-colors duration-700",
                      active
                        ? "text-foreground"
                        : "text-foreground/40 group-hover:text-foreground/75",
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "absolute -bottom-2 left-0 h-px bg-foreground/60 transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                      active ? "w-full opacity-100" : "w-0 opacity-0",
                    )}
                  />
                </button>
              );
            })}
          </nav>

          {/* Mobile trigger */}
          <button
            type="button"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-foreground/60 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Open menu"
            data-cursor="hover"
          >
            <span>{mobileOpen ? "Close" : "Menu"}</span>
            {mobileOpen ? <X size={12} /> : <Menu size={12} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay with smooth fade */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background md:hidden"
          >
            <nav className="flex flex-col items-center gap-14">
              {ITEMS.map((item, i) => {
                const active = isActive(item.name);
                return (
                  <motion.button
                    key={item.name}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      ease: "easeOut",
                      delay: 0.15 + i * 0.1,
                    }}
                    onClick={() => navigate(item.route)}
                    className={cn(
                      "font-editorial text-2xl lowercase tracking-[0.18em] transition-colors duration-700",
                      active ? "text-foreground" : "text-foreground/45",
                    )}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
