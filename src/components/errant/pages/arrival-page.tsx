"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouterStore } from "@/lib/router";
import { ARRIVAL_QUOTES } from "@/data/errant/quotes";
import { Reveal } from "@/components/errant/transitions";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Arrival — the first screen.
 *
 * It should not immediately explain Studio Errant. It creates curiosity.
 * The visitor feels they have entered a quiet place where something is
 * already happening. Nothing rushes to introduce itself.
 *
 * Layout: the Living Mesh occupies the left side of the viewport; the
 * logo placeholder sits centered slightly left of the page's vertical
 * center; a single rotating reflective sentence sits beneath it.
 */
export function ArrivalPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const reduced = usePrefersReducedMotion();

  // Rotate the hero statement on each page refresh.
  const quote = useMemo(
    () =>
      ARRIVAL_QUOTES[Math.floor(Math.random() * ARRIVAL_QUOTES.length)],
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
      {/* HERO — first viewport. Sits comfortably in silence. */}
      <section className="relative flex min-h-screen items-center justify-center px-6 md:px-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-center text-center md:items-start md:translate-x-[-8%] md:text-left">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
            className="relative mb-12 flex h-32 w-32 items-center justify-center md:h-48 md:w-48"
          >
            <motion.div
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: 120, ease: "linear", repeat: Infinity }}
              className="absolute inset-0 rounded-full border border-white/15"
            />
            <motion.div
              animate={reduced ? undefined : { rotate: -360 }}
              transition={{ duration: 90, ease: "linear", repeat: Infinity }}
              className="absolute inset-4 rounded-full border border-white/25"
            />
            <div className="absolute inset-10 rounded-full border border-white/40" />
            <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.6)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.9 }}
            className="mb-3 flex flex-col items-center gap-1 md:items-start"
          >
            <span className="text-xs uppercase tracking-[0.5em] text-white/55">
              Studio
            </span>
            <span className="text-xs uppercase tracking-[0.5em] text-white">
              Errant
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 1.2 }}
            className="font-serif text-2xl italic leading-relaxed text-white/85 md:text-3xl md:leading-relaxed"
          >
            {quote}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 1.8 }}
            className="mt-10 max-w-md text-sm leading-relaxed text-white/45"
          >
            A digital studio built around curiosity. We build what curiosity
            discovers — and document the wandering that gets us there.
          </motion.p>
        </div>

        {/* Scroll cue: a thin vertical line slowly extending downward. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollHint ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">
              Wander
            </span>
            <div className="relative h-16 w-px overflow-hidden bg-white/10">
              <motion.div
                initial={reduced ? { y: 0 } : { y: "-100%" }}
                animate={reduced ? { y: 0 } : { y: "100%" }}
                transition={
                  reduced
                    ? undefined
                    : {
                        duration: 2.4,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0.8,
                      }
                }
                className="absolute inset-0 w-px bg-white/70"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* DISCOVERY — as scrolling begins, the page opens rather than moves. */}
      <section className="relative mx-auto max-w-3xl px-6 py-32 md:px-12 md:py-48">
        <Reveal>
          <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-white/35">
            I — On wandering
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="font-serif text-2xl leading-relaxed text-white/80 md:text-3xl md:leading-relaxed">
            The word <em className="text-white">errant</em> traditionally
            describes someone who wanders. We have kept the word because we
            have not found a better name for the way ideas actually arrive.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 text-base leading-loose text-white/55 md:text-lg">
            Ideas rarely appear fully formed. Most worthwhile ideas begin as
            questions. Questions become experiments. Experiments become
            observations. Observations become understanding. Understanding,
            eventually, becomes meaningful work. Studio Errant exists inside
            that slow movement — and this website is built to make the
            movement visible.
          </p>
        </Reveal>
      </section>

      {/* IMMERSION — a doorway into the Work. */}
      <section className="relative mx-auto max-w-5xl px-6 py-32 md:px-12 md:py-48">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7" delay={0.05}>
            <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-white/35">
              II — On the work
            </p>
            <p className="font-serif text-2xl leading-relaxed text-white/80 md:text-3xl md:leading-relaxed">
              The work is not a portfolio. It is a record of curiosities
              followed far enough to become something.
            </p>
            <p className="mt-8 text-base leading-loose text-white/55">
              Projects are grouped not by date but by the kind of question
              they were trying to answer. Some are finished. Some are
              ongoing. A few are deliberately unfinished. All of them are
              evidence that curiosity existed.
            </p>
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group mt-10 inline-flex items-center gap-4 text-sm uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
            >
              Enter the work
              <span className="relative h-px w-12 bg-white/40 transition-all duration-500 group-hover:w-20 group-hover:bg-white/80" />
            </button>
          </Reveal>

          <Reveal className="md:col-span-5" delay={0.15}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a1f4d] via-[#1a1530] to-black opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-serif text-lg italic leading-relaxed text-white/70">
                  &ldquo;Some ideas only appear when you&rsquo;re lost.&rdquo;
                </p>
                <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-white/35">
                  — Field Notes
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REFLECTION — leaving should feel like walking out of a gallery. */}
      <section className="relative mx-auto max-w-3xl px-6 py-32 md:px-12 md:py-48">
        <Reveal>
          <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-white/35">
            III — Before you continue
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="font-serif text-2xl leading-relaxed text-white/80 md:text-3xl md:leading-relaxed">
            You are not here to be impressed. You are here to slow down
            enough that something quiet can reach you.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 text-base leading-loose text-white/55 md:text-lg">
            Take your time. The pages ahead are not in a hurry. Neither, we
            hope, are you.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/65 transition-colors hover:text-white"
            >
              <span className="h-px w-6 bg-white/30 transition-all group-hover:w-10 group-hover:bg-white/70" />
              Work
            </button>
            <button
              type="button"
              onClick={() => navigate({ name: "about" })}
              data-cursor="hover"
              className="group flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/65 transition-colors hover:text-white"
            >
              <span className="h-px w-6 bg-white/30 transition-all group-hover:w-10 group-hover:bg-white/70" />
              About
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
