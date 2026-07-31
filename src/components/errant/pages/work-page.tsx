"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouterStore } from "@/lib/router";
import { NAV_SECTIONS } from "@/data/errant/nav-sections";
import { PROJECTS, type ProjectCategory } from "@/data/errant/projects";
import { Reveal, PullQuote } from "@/components/errant/transitions";
import { ProjectCard } from "@/components/errant/project-card";
import { cn } from "@/lib/utils";

/**
 * Work — the heart of the website.
 *
 * Each section is a chapter. The chapter list is read from
 * NAV_SECTIONS — the single source of truth shared with the rolling
 * navigation.
 *
 * The Market Teardown Series has a special "paginated" layout: only
 * 2 cards are shown at once. If there are more, a "See more" arrow
 * reveals the next page of 2. This keeps the section from dominating
 * the page when many teardowns are added.
 */
export function WorkPage() {
  const navigate = useRouterStore((s) => s.navigate);

  return (
    <div className="relative">
      {/* Page opener */}
      <section className="relative mx-auto max-w-[1600px] px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-52 md:pl-20 lg:pl-28">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.5em] text-foreground/35">
            Studio Errant — Work
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="max-w-4xl font-editorial text-display-lg text-foreground">
            Curiosity, followed
            <br />
            far enough to
            <br />
            become something.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-10 max-w-xl text-base leading-loose text-foreground/55 md:text-lg">
            What follows is not a portfolio. It is a record of questions I
            took seriously. Some projects are finished. Some are ongoing. A
            few are deliberately unfinished. Each is evidence that curiosity
            existed.
          </p>
        </Reveal>
      </section>

      {/* Chapters */}
      {NAV_SECTIONS.map((section) => {
        const projects = PROJECTS.filter((p) => p.category === section.id);
        if (projects.length === 0) return null;

        // The Market Teardown Series and Writing use a paginated
        // 2-per-page layout with a "See more" arrow.
        const isPaginated = section.id === "teardowns" || section.id === "writing";

        return (
          <section
            key={section.id}
            id={`section-${section.id}`}
            data-nav-section={section.id}
            className="relative mx-auto max-w-[1600px] scroll-mt-32 px-6 py-24 md:px-12 md:py-32 md:pl-20 lg:pl-28"
          >
            {/* Section heading */}
            <div className="grid gap-10 md:grid-cols-12">
              <Reveal className="md:col-span-5">
                <h2 className="font-editorial text-display-md text-foreground">
                  {section.title}
                </h2>
              </Reveal>
              <Reveal className="md:col-span-6 md:col-start-7" delay={0.08}>
                <p className="text-base leading-loose text-foreground/55 md:text-lg">
                  {section.introduction}
                </p>
              </Reveal>
            </div>

            {/* Projects */}
            {isPaginated ? (
              <PaginatedGrid projects={projects} />
            ) : (
              <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-12">
                {projects.map((project, i) => (
                  <div
                    key={project.slug}
                    className={cn(
                      "md:col-span-6",
                      projects.length === 1 && "md:col-span-8 md:col-start-3",
                      projects.length >= 3 && i === projects.length - 1 && projects.length % 2 === 1 && "md:col-span-8 md:col-start-3",
                    )}
                  >
                    <ProjectCard project={project} index={i} />
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {/* Closing pull quote */}
      <section className="relative mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
        <Reveal>
          <PullQuote>
            Failure is not hidden here. It is documented. Reflection is
            part of the finished work.
          </PullQuote>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
            — studio errant
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <button
            type="button"
            onClick={() => navigate({ name: "about" })}
            data-cursor="hover"
            className="group mt-12 inline-flex items-center gap-4 text-sm uppercase tracking-[0.3em] text-foreground/65 transition-colors hover:text-foreground"
          >
            <span className="h-px w-6 bg-foreground/30 transition-all group-hover:w-10 group-hover:bg-foreground/70" />
            Why I build this way
          </button>
        </Reveal>
      </section>
    </div>
  );
}

/**
 * A paginated grid for the Market Teardown Series. Shows 2 cards at a
 * time. A "See more" arrow at the bottom-right reveals the next page
 * of 2. Visitors can page through all cards.
 */
function PaginatedGrid({ projects }: { projects: typeof PROJECTS }) {
  const PAGE_SIZE = 2;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const visible = projects.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const hasMore = page < totalPages - 1;

  return (
    <div className="mt-16">
      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
        {visible.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {/* See more arrow — only if there are more pages. */}
      {hasMore && (
        <div className="mt-12 flex justify-center md:justify-end">
          <button
            type="button"
            data-cursor="hover"
            onClick={() => setPage((p) => p + 1)}
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-foreground/45 transition-colors duration-500 hover:text-foreground"
            aria-label="See more"
          >
            See more
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              className="inline-flex"
            >
              <ArrowRight
                size={16}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </motion.span>
          </button>
        </div>
      )}

      {/* Page indicator + back — shown when not on the first page. */}
      {page > 0 && (
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            type="button"
            data-cursor="hover"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="text-[10px] uppercase tracking-[0.3em] text-foreground/35 transition-colors hover:text-foreground/65"
          >
            ← Back
          </button>
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/25">
            {page + 1} / {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
