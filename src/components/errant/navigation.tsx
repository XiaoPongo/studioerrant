"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouterStore, type ErrantRoute, type RouteName } from "@/lib/router";
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

  // A stable key for the current route, used to close the mobile overlay
  // whenever the visitor navigates. We adjust state during render (the
  // documented React pattern) rather than via setState-in-effect.
  const routeKey = route.name + (route.slug ?? "");
  const [prevRouteKey, setPrevRouteKey] = useState(routeKey);
  if (prevRouteKey !== routeKey) {
    setPrevRouteKey(routeKey);
    if (mobileOpen) setMobileOpen(false);
  }

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
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-700",
          scrolled
            ? "bg-black/40 backdrop-blur-[2px]"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12 md:py-7">
          {/* Logo / wordmark — clicking returns the visitor to Arrival. */}
          <button
            type="button"
            onClick={() => navigate({ name: "arrival" })}
            className="group flex items-center gap-3 text-left"
            aria-label="Studio Errant — return to arrival"
            data-cursor="hover"
          >
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-white/40" />
              <span className="absolute inset-1.5 rounded-full border border-white/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-500 group-hover:opacity-60" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[11px] uppercase tracking-[0.32em] text-white/70">
                Studio
              </span>
              <span className="text-[11px] uppercase tracking-[0.32em] text-white">
                Errant
              </span>
            </span>
          </button>

          {/* Desktop nav — top right, small typography. */}
          <nav className="hidden items-center gap-10 md:flex">
            {ITEMS.map((item) => {
              const active = isActive(item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.route)}
                  data-cursor="hover"
                  className="group relative text-[12px] uppercase tracking-[0.3em] transition-colors duration-300"
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "transition-colors duration-300",
                      active ? "text-white" : "text-white/45 group-hover:text-white/80",
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "absolute -bottom-2 left-0 h-px bg-white/70 transition-all duration-500 ease-out",
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
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/70 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Open menu"
            data-cursor="hover"
          >
            <span>{mobileOpen ? "Close" : "Menu"}</span>
            {mobileOpen ? <X size={14} /> : <Menu size={14} />}
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
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black md:hidden"
          >
            <nav className="flex flex-col items-center gap-12">
              {ITEMS.map((item, i) => {
                const active = isActive(item.name);
                return (
                  <motion.button
                    key={item.name}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.1 + i * 0.08,
                    }}
                    onClick={() => navigate(item.route)}
                    className={cn(
                      "text-2xl uppercase tracking-[0.3em] transition-colors",
                      active ? "text-white" : "text-white/50",
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
