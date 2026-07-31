"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Page transitions dissolve through darkness — "walking into another
 * room with the lights dimmed". Slow. No slides, no cubes, no zooms.
 *
 * In reduced-motion mode, transitions become simple opacity fades.
 */
export function PageTransition({
  children,
  transitionKey,
}: {
  children: ReactNode;
  transitionKey: string | number;
}) {
  const reduced = usePrefersReducedMotion();

  const variants: Variants = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 1.6, ease: "easeOut" },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.9, ease: "easeIn" },
        },
      };

  return (
    <motion.div
      key={transitionKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}

/**
 * A subtle reveal-on-scroll. Motion should reveal — never distract.
 * Elements rise a few pixels and fade in over a long duration, only
 * once, when they enter the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "p" | "h1" | "h2" | "h3" | "li";
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1.4, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/** A short reflective quote, treated like a journal fragment. */
export function PullQuote({
  children,
  by,
  className,
}: {
  children: ReactNode;
  by?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <blockquote className="font-editorial text-2xl italic leading-[1.5] text-foreground/80 md:text-3xl md:leading-[1.45]">
        &ldquo;{children}&rdquo;
      </blockquote>
      {by && (
        <figcaption className="mt-5 text-[10px] uppercase tracking-[0.4em] text-foreground/40">
          — {by}
        </figcaption>
      )}
    </figure>
  );
}
