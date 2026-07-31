"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRouterStore } from "@/lib/router";
import type { Project } from "@/data/errant/projects";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Project cards resemble carefully framed exhibits. Spacing matters more
 * than decoration. Hovering feels like attention rather than activation:
 * a slight lift, a slight brightness, a tiny mesh response — no flips,
 * rotations, or aggressive zooms.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const navigate = useRouterStore((s) => s.navigate);
  const reduced = usePrefersReducedMotion();

  const statusLabel =
    project.status === "ongoing"
      ? "Ongoing"
      : project.status === "archived"
        ? "Archived"
        : project.status === "shipped"
          ? "Shipped"
          : undefined;

  return (
    <motion.button
      type="button"
      data-cursor="hover"
      onClick={() => navigate({ name: "project", slug: project.slug })}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{
        duration: 0.9,
        ease: "easeOut",
        delay: (index % 2) * 0.08,
      }}
      className="group relative block w-full text-left"
      aria-label={`Open project: ${project.title}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-foreground/[0.06] bg-background">
        {/* Abstract cover visual — a slow gradient + drifting light. */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-700 group-hover:opacity-100",
            project.palette,
          )}
        />
        {/* A soft moving highlight that rewards attention. */}
        {!reduced && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="absolute -inset-x-10 top-1/3 h-24 rotate-[-8deg] bg-foreground/10 blur-2xl"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-black/10 to-transparent" />

        {/* Top row — year + status */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/55">
            {project.year}
          </span>
          {statusLabel && (
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">
              {statusLabel}
            </span>
          )}
        </div>

        {/* Title block */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-editorial text-2xl text-white md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/55">
            {project.summary}
          </p>
        </div>

        {/* The reveal — slightly more information on hover. */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/85 via-black/40 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div>
            <p className="max-w-md text-sm leading-relaxed text-foreground/80">
              {project.detail}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-foreground/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ArrowUpRight
          size={18}
          className="absolute right-5 top-5 text-foreground/0 transition-all duration-500 group-hover:right-4 group-hover:top-4 group-hover:text-foreground/70"
        />
      </div>
    </motion.button>
  );
}
