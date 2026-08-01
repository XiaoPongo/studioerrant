"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/errant/projects";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Project cards resemble carefully framed exhibits. Spacing matters more
 * than decoration. Hovering feels like attention rather than activation.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = usePrefersReducedMotion();

  // "Coming soon" cards — no click, muted appearance.
  if (project.comingSoon) {
    return (
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 0.9, ease: "easeOut", delay: (index % 2) * 0.08 }}
        className="group relative block w-full"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-foreground/[0.06] bg-surface">
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", project.palette)} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="font-editorial text-2xl italic text-foreground/40 md:text-3xl">
              Coming soon
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // "Secret" cards — clickable but show a whisper instead of opening.
  if (project.secret) {
    return (
      <motion.button
        type="button"
        data-cursor="hover"
        onClick={() => {
          // Do nothing — the secret is already shown on the card.
          // The whisper is the whole interaction.
        }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 0.9, ease: "easeOut", delay: (index % 2) * 0.08 }}
        className="group relative block w-full text-left"
        aria-label={project.title}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-foreground/[0.06] bg-surface">
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", project.palette)} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="font-editorial text-2xl text-foreground/70 md:text-3xl">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/40">{project.summary}</p>
          </div>
        </div>
      </motion.button>
    );
  }

  // Standard cards — click to open the project detail page.
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: "easeOut", delay: (index % 2) * 0.08 }}
      className="group relative block w-full"
    >
      <Link
        href={`/project/${project.slug}`}
        data-cursor="hover"
        className="block text-left"
        aria-label={`Open project: ${project.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-foreground/[0.06] bg-surface">
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-700 group-hover:opacity-100", project.palette)} />
          {!reduced && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.2 }}
              className="absolute -inset-x-10 top-1/3 h-24 rotate-[-8deg] bg-foreground/10 blur-2xl"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">
              {project.year}
            </span>
            {project.status === "ongoing" && (
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                Ongoing
              </span>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="font-editorial text-2xl text-foreground md:text-3xl">
              {project.title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/55">
              {project.summary}
            </p>
          </div>
          <ArrowUpRight size={18} className="absolute right-5 top-5 text-foreground/0 transition-all duration-500 group-hover:right-4 group-hover:top-4 group-hover:text-foreground/70" />
        </div>
      </Link>
    </motion.div>
  );
}
