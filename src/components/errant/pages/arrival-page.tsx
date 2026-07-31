"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouterStore } from "@/lib/router";
import { ARRIVAL_QUOTES } from "@/data/errant/quotes";
import { Reveal } from "@/components/errant/transitions";
import { ErrantWordmark } from "@/components/errant/errant-wordmark";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Arrival — the first room.
 *
 * Refinement goals (from the Peter Zumthor directive):
 *   - The hero whispers. "This is ◉ Studio Errant." Nothing else.
 *   - Enormous breathing room. The first screen communicates
 *     confidence through absence.
 *   - No purple on Arrival. Nearly monochrome.
 *   - The logo is part of the sentence, not a separate branding
 *     element. Typography sits slightly left of center.
 *   - Silence is part of the introduction. The visitor earns the
 *     explanation later.
 *   - Scrolling feels like walking. Transitions feel like crossing
 *     thresholds. Every screen is a room with its own atmosphere.
 */
export function ArrivalPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const reduced = usePrefersReducedMotion();

  // One rotating reflective fragment, displayed very far down the
  // page — never in the hero. The hero stays silent.
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
          The first screen. Almost nothing. The visitor enters a
          quiet room and is given only enough to know they are
          somewhere. Silence is the introduction.
          ════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center px-6 md:px-12">
        <div className="relative z-10 w-full max-w-5xl md:translate-x-[-6%]">
          {/* "This is" — a small, italic editorial line. The
              wordmark that follows is part of the same sentence. */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.6 }}
            className="mb-6 font-editorial text-lg italic text-foreground/50 md:text-xl"
          >
            This is
          </motion.p>

          {/* The wordmark-as-symbol: a small filled circle (the
              studio's only iconographic gesture) sitting in line
              with the wordmark, so the whole reads as a single
              sentence: "This is ◉ studio errant". */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 1.0 }}
            className="flex items-baseline gap-5 md:gap-7"
          >
            {/* The circle. A 20–30 second breathing cycle —
                imperceptible unless you watch. */}
            <span
              aria-hidden="true"
              className="relative inline-flex h-3 w-3 shrink-0 items-center justify-center self-center md:h-4 md:w-4"
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-foreground/90"
                animate={
                  reduced
                    ? undefined
                    : {
                        scale: [1, 1.18, 1],
                        opacity: [0.85, 1, 0.85],
                      }
                }
                transition={{
                  duration: 24,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </span>
            <ErrantWordmark size="xl" />
          </motion.div>

          {/* Nothing else. No intro paragraph. No "we build what
              curiosity discovers". The visitor earns that later. */}
        </div>

        {/* The scroll cue: a thin vertical line, barely there.
            Extends downward over 6 seconds. The visitor discovers
            that scrolling continues — they are never told. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollHint ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-12 left-6 md:left-12"
          aria-hidden="true"
        >
          <div className="flex items-center gap-4">
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
                className="absolute inset-0 w-px bg-foreground/60"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ROOM II — THE THRESHOLD
          A long, narrow hallway. Almost empty. One sentence,
          centered in vast negative space. The visitor slows
          before the next room opens.
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto flex min-h-screen max-w-3xl items-center px-6 md:px-12">
        <Reveal>
          <p className="font-editorial text-3xl leading-[1.35] text-foreground/85 md:text-5xl md:leading-[1.3]">
            We build what curiosity discovers —
            <span className="text-foreground/45"> and document the wandering that gets us there.</span>
          </p>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════════
          ROOM III — THE LIBRARY
          A quieter, denser room. Short paragraphs separated by
          large vertical air. The visitor sits with each idea
          before the next one arrives.
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-2xl px-6 py-40 md:px-12 md:py-56">
        <Reveal>
          <p className="mb-16 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
            On wandering
          </p>
        </Reveal>
        <div className="space-y-16 text-lg leading-[1.9] text-foreground/65 md:text-xl md:leading-[1.85]">
          <Reveal as="p" delay={0.05}>
            The word <em className="text-foreground/85">errant</em> describes
            someone who wanders. We kept the word because we never found a
            better name for the way ideas actually arrive.
          </Reveal>
          <Reveal as="p" delay={0.08}>
            Most worthwhile ideas begin as questions. Questions become
            experiments. Experiments become observations. Observations become
            understanding. Understanding, eventually, becomes meaningful work.
          </Reveal>
          <Reveal as="p" delay={0.11}>
            Studio Errant exists inside that slow movement. This website is
            built to make the movement visible — and to invite you to slow
            down enough to see it.
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ROOM IV — THE DOORWAY
          A single framed opening. Beyond it: the work. The
          visitor is invited, not pushed.
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 md:px-12">
        <div className="grid w-full gap-16 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7" delay={0.05}>
            <p className="mb-10 text-[10px] uppercase tracking-[0.4em] text-foreground/35">
              The work
            </p>
            <p className="font-editorial text-3xl leading-[1.35] text-foreground/85 md:text-4xl md:leading-[1.3]">
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
            {/* A single quiet framed object — the only image on
                Arrival. No purple. Just material. */}
            <div className="relative aspect-[3/4] overflow-hidden border border-foreground/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-foreground/[0.02]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-editorial text-lg italic leading-relaxed text-foreground/45">
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
          The visitor leaves the way they came. No grand finale.
          Only a lingering feeling, and a choice of where to go
          next.
          ════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 text-center md:px-12">
        <Reveal>
          <p className="font-editorial text-2xl italic leading-relaxed text-foreground/55 md:text-3xl md:leading-relaxed">
            Take your time. The pages ahead are not in a hurry.
            <br />
            Neither, we hope, are you.
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
