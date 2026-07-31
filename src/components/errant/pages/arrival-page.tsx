"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouterStore } from "@/lib/router";
import { ARRIVAL_QUOTES } from "@/data/errant/quotes";
import { Reveal } from "@/components/errant/transitions";
import { StudioErrantLogo } from "@/components/errant/studio-errant-logo";
import { RollingNav } from "@/components/errant/rolling-nav";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Arrival — the first room.
 *
 * The hero whispers:
 *
 *   This is
 *   [official Studio Errant logo]
 *
 * The logo is the actual supplied SVG wordmark — not text. It is
 * treated as typography, sitting in line with the introduction.
 * Sized with min(vw, px) so it NEVER overflows on any viewport.
 *
 * The composition sits slightly left of center with enormous
 * breathing room. No purple on Arrival. Nearly monochrome. Silence
 * is the introduction.
 */
export function ArrivalPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const reduced = usePrefersReducedMotion();

  const quote = useMemo(
    () => ARRIVAL_QUOTES[Math.floor(Math.random() * ARRIVAL_QUOTES.length)],
    [],
  );
  const [scrollHint, setScrollHint] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrollHint(window.scrollY < 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      {/* ════════════════════════════════════════════════════════
          ROOM I — THE WHISPER
          ════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="relative z-10 w-full">
          {/* "This is" — a small italic editorial line. */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.6 }}
            className="mb-5 font-editorial text-base italic text-foreground/50 sm:text-lg md:mb-7 md:text-xl"
          >
            This is
          </motion.p>

          {/* The official logo image. Constrained with min(vw, px)
              minus the horizontal padding so it never overflows any
              viewport. The SVG has a 5:3 aspect ratio. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 1.0 }}
            className="relative"
          >
            <StudioErrantLogo
              width="min(72vw, 460px)"
              height="auto"
              alt="Studio Errant"
            />
          </motion.div>

          {/* Mobile rolling nav — appears below the hero logo in the
              same frame, only on mobile. On desktop this renders null
              and the fixed right-edge nav is used instead. */}
          <div className="mt-10 md:hidden">
            <RollingNav mobileOnly />
          </div>
        </div>

        {/* The scroll cue: a thin vertical line, barely there. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollHint ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-12 left-6 sm:left-10 md:left-16 lg:left-20"
          aria-hidden="true"
        >
          <div className="relative h-20 w-px overflow-hidden bg-foreground/10">
            <motion.div
              initial={reduced ? { y: 0 } : { y: "-100%" }}
              animate={reduced ? { y: 0 } : { y: "100%" }}
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 6,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1.2,
                    }
              }
              className="absolute inset-0 w-px bg-foreground/55"
            />
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ROOM II — THE THRESHOLD
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto flex min-h-screen max-w-3xl items-center px-6 sm:px-8 md:px-12">
        <Reveal>
          <p className="font-editorial text-display-sm leading-[1.35] text-foreground/85 md:text-display-md md:leading-[1.3]">
            A living practice of design, writing, research, and
            experiments.{" "}
            <span className="text-foreground/45">
              Unfinished, by intention.
            </span>
          </p>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════
          ROOM III — THE LIBRARY
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-2xl px-6 py-40 sm:px-8 md:px-12 md:py-56">
        <Reveal>
          <p className="mb-16 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
            On wandering
          </p>
        </Reveal>
        <div className="space-y-14 text-base leading-[1.9] text-foreground/65 sm:text-lg md:text-xl md:leading-[1.85]">
          <Reveal as="p" delay={0.05}>
            The word <em className="text-foreground/85">errant</em>{" "}
            describes someone who wanders. I kept the word because I never
            found a better name for the way ideas actually arrive.
          </Reveal>
          <Reveal as="p" delay={0.08}>
            Most worthwhile ideas begin as questions. Questions become
            experiments. Experiments become observations. Observations
            become understanding. Understanding, eventually, becomes
            meaningful work.
          </Reveal>
          <Reveal as="p" delay={0.11}>
            Studio Errant is an independent practice built inside that slow
            movement. This website is built to make the movement visible —
            and to invite you to slow down enough to see it.
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ROOM IV — THE DOORWAY
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 sm:px-8 md:px-12">
        <div className="grid w-full gap-14 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7" delay={0.05}>
            <p className="mb-10 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
              The work
            </p>
            <p className="font-editorial text-display-sm leading-[1.35] text-foreground/85 md:text-display-md md:leading-[1.3]">
              Beyond this point, projects. Not a portfolio — a record of
              curiosities followed far enough to become something.
            </p>
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group mt-12 inline-flex items-center gap-5 text-[11px] uppercase tracking-[0.32em] text-foreground/55 transition-colors duration-700 hover:text-foreground"
            >
              Enter
              <span className="relative h-px w-10 bg-foreground/25 transition-all duration-700 group-hover:w-20 group-hover:bg-foreground/60" />
            </button>
          </Reveal>

          <Reveal className="md:col-span-4 md:col-start-9" delay={0.15}>
            <div className="relative aspect-[3/4] overflow-hidden border border-divider">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-foreground/[0.02]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-editorial text-lg italic leading-relaxed text-foreground/45 md:text-xl">
                  {quote}
                </p>
                <p className="mt-6 text-[9px] uppercase tracking-[0.4em] text-foreground/25">
                  — a note
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ROOM V — THE EXIT
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 text-center sm:px-8 md:px-12">
        <Reveal>
          <p className="font-editorial text-display-sm italic leading-relaxed text-foreground/55 md:text-display-md md:leading-relaxed">
            Take your time. The pages ahead are not in a hurry.
            <br />
            Neither, I hope, are you.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground/55 transition-colors duration-700 hover:text-foreground"
            >
              <span className="h-px w-5 bg-foreground/25 transition-all duration-700 group-hover:w-8 group-hover:bg-foreground/60" />
              Work
            </button>
            <button
              type="button"
              onClick={() => navigate({ name: "about" })}
              data-cursor="hover"
              className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground/55 transition-colors duration-700 hover:text-foreground"
            >
              <span className="h-px w-5 bg-foreground/25 transition-all duration-700 group-hover:w-8 group-hover:bg-foreground/60" />
              About
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
