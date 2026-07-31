"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRouterStore } from "@/lib/router";
import {
  getProject,
  getRelatedProjects,
  CATEGORIES,
} from "@/data/errant/projects";
import { Reveal, PullQuote } from "@/components/errant/transitions";
import { ProjectCard } from "@/components/errant/project-card";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Every project deserves its own page. Projects feel like essays rather
 * than product pages. Each page tells a story — and every project ends
 * with reflection, because reflection communicates maturity better than
 * perfection.
 */
export function ProjectDetailPage({ slug }: { slug: string }) {
  const navigate = useRouterStore((s) => s.navigate);
  const reduced = usePrefersReducedMotion();
  const project = getProject(slug);

  if (!project) {
    return (
      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <p className="font-serif text-3xl italic text-white/80">
          That project has wandered off.
        </p>
        <p className="mt-6 text-sm text-white/45">
          It may be archived, or it may never have been finished. Either
          way, the question it was asking is still worth following.
        </p>
        <button
          type="button"
          onClick={() => navigate({ name: "work" })}
          data-cursor="hover"
          className="group mt-10 inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Return to the work
        </button>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === project.category);
  const related = getRelatedProjects(project.slug, project.category, 2);
  const reflectionItems = [
    { label: "What worked", body: project.reflection.whatWorked },
    { label: "What surprised us", body: project.reflection.whatSurprised },
    { label: "What we would change", body: project.reflection.whatWouldChange },
    { label: "What questions remain", body: project.reflection.whatRemains },
  ];

  return (
    <article className="relative">
      {/* Back link — quiet, top-left. */}
      <div className="mx-auto max-w-[1600px] px-6 pt-32 md:px-12 md:pt-40">
        <Reveal>
          <button
            type="button"
            onClick={() => navigate({ name: "work" })}
            data-cursor="hover"
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={12}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to the work
          </button>
        </Reveal>
      </div>

      {/* HERO IMAGE — large visual, generous negative space. */}
      <section className="mx-auto max-w-[1600px] px-6 pt-12 md:px-12 md:pt-16">
        <Reveal delay={0.05}>
          <div className="relative aspect-[21/10] overflow-hidden rounded-sm border border-white/[0.06]">
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-95",
                project.palette,
              )}
            />
            {!reduced && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 2, delay: 0.4 }}
                className="absolute -inset-x-20 top-1/3 h-40 rotate-[-6deg] bg-white/10 blur-3xl"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
              <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-white/55">
                {category?.title} · {project.year}
              </p>
              <h1 className="font-serif text-4xl leading-tight text-white md:text-6xl md:leading-tight">
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                {project.summary}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Tag row */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/55"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PROJECT OVERVIEW — short, confident opening. */}
      <section className="mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-white/35">
            Overview
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="font-serif text-2xl leading-relaxed text-white/80 md:text-3xl md:leading-relaxed">
            {project.overview}
          </p>
        </Reveal>
      </section>

      {/* SECTIONS — alternate between short text and generous visuals.
          The page should breathe. */}
      {project.sections.map((section, i) => (
        <section
          key={section.heading}
          className={cn(
            "mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28",
          )}
        >
          <div
            className={cn(
              "grid gap-12 md:grid-cols-12 md:items-start",
              // Alternate the column rhythm so sections don't feel mechanical.
              i % 2 === 1 && "md:[direction:rtl]",
            )}
          >
            <Reveal className="md:col-span-5 md:[direction:ltr]">
              <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-white/35">
                {String(i + 1).padStart(2, "0")} — {section.heading}
              </p>
            </Reveal>
            <div className="md:col-span-6 md:col-start-7 md:[direction:ltr]">
              {section.paragraphs.map((para, j) => (
                <Reveal as="div" key={j} delay={0.05 + j * 0.06}>
                  <p className="text-lg leading-loose text-white/70">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Optional visual — large, framed, breathing. */}
          {section.visual && (
            <Reveal delay={0.1} className="mt-16">
              <figure className="relative overflow-hidden rounded-sm border border-white/[0.06]">
                <div
                  className={cn(
                    "aspect-[21/9] bg-gradient-to-br",
                    section.visual.palette,
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 p-6 text-[11px] uppercase tracking-[0.3em] text-white/55">
                  {section.visual.label}
                </figcaption>
              </figure>
            </Reveal>
          )}
        </section>
      ))}

      {/* REFLECTION — every project ends here. */}
      <section className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-white/35">
              Reflection
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <PullQuote>
              Reflection communicates maturity better than perfection.
            </PullQuote>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {reflectionItems.map((item, i) => (
            <Reveal key={item.label} delay={(i % 2) * 0.08}>
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                {item.label}
              </h3>
              <p className="mt-4 text-lg leading-loose text-white/75">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RELATED PROJECTS — connections should feel earned. */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <Reveal>
            <p className="mb-12 text-[11px] uppercase tracking-[0.4em] text-white/35">
              Related — {category?.title}
            </p>
          </Reveal>
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
            {related.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Departure — no grand finale, only a lingering feeling. */}
      <section className="relative mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
        <Reveal>
          <p className="font-serif text-2xl italic leading-relaxed text-white/70 md:text-3xl md:leading-relaxed">
            Thank you for following this one as far as it went.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} />
              More work
            </button>
            <button
              type="button"
              onClick={() => navigate({ name: "about" })}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
            >
              Why we build this way
              <ArrowUpRight size={14} />
            </button>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
