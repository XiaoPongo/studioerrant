"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouterStore } from "@/lib/router";
import {
  CATEGORIES,
  PROJECTS,
  type ProjectCategory,
} from "@/data/errant/projects";
import { Reveal, PullQuote } from "@/components/errant/transitions";
import { ProjectCard } from "@/components/errant/project-card";
import { cn } from "@/lib/utils";

/**
 * Work — the heart of the website.
 *
 * Projects are grouped by discipline, not chronology. Each category is
 * a chapter within the same story. The chapter introduces itself before
 * showing projects, so visitors understand context before they encounter
 * artefacts.
 *
 * The Work section introduces the only significant colour shift in the
 * website: purple slowly emerges *beneath* the darkness. We signal this
 * to the Living Mesh through the parent route component (creativeIntensity
 * rises when this page is active).
 */
export function WorkPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");

  const visibleCategories =
    filter === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === filter);

  return (
    <div className="relative">
      {/* Page opener — large title, breathing room, sparse. */}
      <section className="relative mx-auto max-w-[1600px] px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-52">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.5em] text-foreground/35">
            Studio Errant — Work
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="max-w-4xl font-editorial text-5xl leading-[1.05] text-white md:text-7xl md:leading-[1.05]">
            Curiosity, followed
            <br />
            far enough to
            <br />
            become something.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-10 max-w-xl text-base leading-loose text-foreground/55 md:text-lg">
            What follows is not a portfolio. It is a record of questions
            we took seriously. Some projects are finished. Some are
            ongoing. A few are deliberately unfinished. Each is evidence
            that curiosity existed.
          </p>
        </Reveal>

        {/* Simple category navigation — avoid complex filter interfaces. */}
        <Reveal delay={0.18}>
          <div className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-foreground/[0.06] pt-8">
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="All"
            />
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.id}
                active={filter === c.id}
                onClick={() => setFilter(c.id)}
                label={c.title}
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Chapters — each category is a chapter. */}
      {visibleCategories.map((category, chapterIndex) => {
        const projects = PROJECTS.filter((p) => p.category === category.id);
        if (projects.length === 0) return null;
        return (
          <section
            key={category.id}
            className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32"
          >
            {/* Chapter heading — large title + short paragraph. */}
            <div className="grid gap-10 md:grid-cols-12">
              <Reveal className="md:col-span-5">
                <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
                  {String(chapterIndex + 1).padStart(2, "0")} — Chapter
                </p>
                <h2 className="font-editorial text-4xl leading-tight text-white md:text-5xl md:leading-tight">
                  {category.title}
                </h2>
              </Reveal>
              <Reveal className="md:col-span-6 md:col-start-7" delay={0.08}>
                <p className="text-base leading-loose text-foreground/55 md:text-lg">
                  {category.introduction}
                </p>
              </Reveal>
            </div>

            {/* Projects — curated rather than indexed. Alternate the
                grid rhythm so chapters feel hand-placed. */}
            <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-12">
              {projects.map((project, i) => (
                <div
                  key={project.slug}
                  className={cn(
                    "md:col-span-6",
                    // Occasionally let a project breathe alone in a row.
                    projects.length === 1 && "md:col-span-8 md:col-start-3",
                    projects.length >= 3 && i === projects.length - 1 && projects.length % 2 === 1 && "md:col-span-8 md:col-start-3",
                  )}
                >
                  <ProjectCard project={project} index={i} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Closing pull quote — quiet, no grand finale. */}
      <section className="relative mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
        <Reveal>
          <PullQuote>
            Failure is not hidden here. It is documented. Reflection is
            part of the finished work.
          </PullQuote>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
            — Studio Errant
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
            Why we build this way
          </button>
        </Reveal>
      </section>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="hover"
      className={cn(
        "relative text-[11px] uppercase tracking-[0.3em] transition-colors duration-300",
        active ? "text-foreground" : "text-foreground/40 hover:text-foreground/70",
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="filter-underline"
          className="absolute -bottom-2 left-0 h-px w-full bg-foreground/70"
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </button>
  );
}
