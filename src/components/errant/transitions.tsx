"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Page transitions dissolve through darkness — "walking into another
 * room with the lights dimmed". No slides, no cubes, no zooms.
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
        initial: { opacity: 0, filter: "blur(8px)" },
        animate: {
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: "easeOut" },
        },
        exit: {
          opacity: 0,
          filter: "blur(6px)",
          transition: { duration: 0.5, ease: "easeIn" },
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
 * A subtle reveal-on-scroll wrapper. Motion should reveal — never
 * distract. Elements rise a few pixels and fade in over a long duration.
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
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1, ease: "easeOut", delay }}
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
      <blockquote className="font-serif text-2xl italic leading-relaxed text-white/85 md:text-3xl md:leading-relaxed">
        &ldquo;{children}&rdquo;
      </blockquote>
      {by && (
        <figcaption className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/40">
          — {by}
        </figcaption>
      )}
    </figure>
  );
}
