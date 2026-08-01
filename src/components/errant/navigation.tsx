"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StudioErrantLogo } from "@/components/errant/studio-errant-logo";
import { cn } from "@/lib/utils";

type RouteName = "arrival" | "work" | "about";

const ITEMS: { name: RouteName; label: string; href: string }[] = [
  { name: "arrival", label: "Arrival", href: "/" },
  { name: "work", label: "Work", href: "/work" },
  { name: "about", label: "About", href: "/about" },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile overlay whenever the route changes.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
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
          <Link
            href="/"
            className="group transition-opacity duration-700 hover:opacity-80"
            aria-label="Studio Errant — return to arrival"
            data-cursor="hover"
          >
            <StudioErrantLogo
              width="auto"
              height="44px"
              alt="Studio Errant"
            />
          </Link>

          {/* Desktop nav — top right, small typography. */}
          <nav className="hidden items-center gap-12 md:flex">
            {ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  data-cursor="hover"
                  className="group relative text-[11px] uppercase tracking-[0.32em] transition-colors duration-700"
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "transition-colors duration-700",
                      active
                        ? "text-foreground"
                        : "text-foreground/60 group-hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "absolute -bottom-2 left-0 h-px bg-foreground transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                      active ? "w-full opacity-100" : "w-0 opacity-0",
                    )}
                  />
                </Link>
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
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      ease: "easeOut",
                      delay: 0.15 + i * 0.1,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "font-editorial text-2xl lowercase tracking-[0.18em] transition-colors duration-700",
                        active ? "text-foreground" : "text-foreground/45",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
