"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { useRouterStore } from "@/lib/router";
import {
  getProject,
  getRelatedProjects,
  CATEGORIES,
  DESIGN_LINKS,
} from "@/data/errant/projects";
import { Reveal, PullQuote } from "@/components/errant/transitions";
import { ProjectCard } from "@/components/errant/project-card";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const navigate = useRouterStore((s) => s.navigate);
  const reduced = usePrefersReducedMotion();
  const project = getProject(slug);

  if (!project) {
    return (
      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <p className="font-editorial text-3xl italic text-foreground/80">
          That project has wandered off.
        </p>
        <p className="mt-6 text-sm text-foreground/45">
          It may be archived, or it may never have been finished. Either
          way, the question it was asking is still worth following.
        </p>
        <button
          type="button"
          onClick={() => navigate({ name: "work" })}
          data-cursor="hover"
          className="group mt-10 inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Return to the work
        </button>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === project.category);

  // ── Coming soon page ──
  if (project.comingSoon) {
    return (
      <article className="relative">
        <div className="mx-auto max-w-[1600px] px-6 pt-32 md:px-12 md:pt-40">
          <Reveal>
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-foreground/45 transition-colors hover:text-foreground"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
              Back to the work
            </button>
          </Reveal>
        </div>
        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center md:px-12">
          <Reveal>
            <p className="font-editorial text-display-md italic text-foreground/50">
              Coming soon
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-sm text-foreground/40">
              This piece is still being assembled. Check back.
            </p>
          </Reveal>
        </section>
      </article>
    );
  }

  // ── Secret page ("ssshhh… in the works") ──
  if (project.secret) {
    return (
      <article className="relative">
        <div className="mx-auto max-w-[1600px] px-6 pt-32 md:px-12 md:pt-40">
          <Reveal>
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-foreground/45 transition-colors hover:text-foreground"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
              Back to the work
            </button>
          </Reveal>
        </div>
        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center md:px-12">
          <Reveal>
            <p className="font-editorial text-display-lg italic text-foreground/60">
              {project.secret}
            </p>
          </Reveal>
        </section>
      </article>
    );
  }

  // ── Design portfolio page — shows all design links ──
  if (project.slug === "design-portfolio") {
    return (
      <article className="relative">
        <div className="mx-auto max-w-[1600px] px-6 pt-32 md:px-12 md:pt-40">
          <Reveal>
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-foreground/45 transition-colors hover:text-foreground"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
              Back to the work
            </button>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-12 relative aspect-[21/10] overflow-hidden rounded-sm border border-foreground/[0.06]">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", project.palette)} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-foreground/55">
                  {category?.title} · {project.year}
                </p>
                <h1 className="font-editorial text-display-lg text-foreground">
                  {project.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
                  {project.summary}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* The full collection of design links */}
        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <Reveal>
            <p className="mb-12 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
              The Collection
            </p>
          </Reveal>
          <div className="space-y-1">
            {DESIGN_LINKS.map((item, i) => (
              <Reveal key={item.url} delay={Math.min(i * 0.02, 0.2)}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="group flex items-center justify-between gap-6 border-b border-foreground/[0.05] py-5 transition-colors duration-500 hover:border-foreground/15"
                >
                  <span className="font-editorial text-lg text-foreground/70 transition-colors duration-500 group-hover:text-foreground md:text-xl">
                    {item.title}
                  </span>
                  <ExternalLink
                    size={16}
                    className="shrink-0 text-foreground/0 transition-all duration-500 group-hover:text-foreground/50"
                  />
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Departure */}
        <section className="relative mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
          <Reveal>
            <p className="font-editorial text-2xl italic leading-relaxed text-foreground/55 md:text-3xl md:leading-relaxed">
              More on the way.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group mt-12 inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors hover:text-foreground"
            >
              <ArrowLeft size={14} />
              More work
            </button>
          </Reveal>
        </section>
      </article>
    );
  }

  // ── Standard project detail page ──
  const related = getRelatedProjects(project.slug, project.category, 2);

  return (
    <article className="relative">
      <div className="mx-auto max-w-[1600px] px-6 pt-32 md:px-12 md:pt-40">
        <Reveal>
          <button
            type="button"
            onClick={() => navigate({ name: "work" })}
            data-cursor="hover"
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-foreground/45 transition-colors hover:text-foreground"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            Back to the work
          </button>
        </Reveal>

        {/* Hero */}
        <Reveal delay={0.05}>
          <div className="mt-12 relative aspect-[21/10] overflow-hidden rounded-sm border border-foreground/[0.06]">
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", project.palette)} />
            {!reduced && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 2, delay: 0.4 }}
                className="absolute -inset-x-20 top-1/3 h-40 rotate-[-6deg] bg-foreground/10 blur-3xl"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
              <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-foreground/55">
                {category?.title} · {project.year}
              </p>
              <h1 className="font-editorial text-display-lg text-foreground">
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
                {project.summary}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Tags */}
        {project.tags.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-foreground/15 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-foreground/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* Overview */}
      <section className="mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
            Overview
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="font-editorial text-display-sm leading-[1.4] text-foreground/80 md:text-display-md md:leading-[1.35]">
            {project.overview}
          </p>
        </Reveal>
      </section>

      {/* Sections */}
      {project.sections.map((section, i) => (
        <section
          key={section.heading}
          className={cn("mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28")}
        >
          <div className={cn("grid gap-12 md:grid-cols-12 md:items-start", i % 2 === 1 && "md:[direction:rtl]")}>
            <Reveal className="md:col-span-5 md:[direction:ltr]">
              <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
                {String(i + 1).padStart(2, "0")} — {section.heading}
              </p>
            </Reveal>
            <div className="md:col-span-6 md:col-start-7 md:[direction:ltr]">
              {section.paragraphs.map((para, j) => (
                <Reveal as="div" key={j} delay={0.05 + j * 0.06}>
                  <p className="text-lg leading-loose text-foreground/70">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
          {section.visual && (
            <Reveal delay={0.1} className="mt-16">
              <figure className="relative overflow-hidden rounded-sm border border-foreground/[0.06]">
                <div className={cn("aspect-[21/9] bg-gradient-to-br", section.visual.palette)} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 p-6 text-[11px] uppercase tracking-[0.3em] text-foreground/55">
                  {section.visual.label}
                </figcaption>
              </figure>
            </Reveal>
          )}
        </section>
      ))}

      {/* Reflection */}
      {project.reflection.whatWorked && (
        <section className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
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
            {[
              { label: "What worked", body: project.reflection.whatWorked },
              { label: "What surprised us", body: project.reflection.whatSurprised },
              { label: "What we would change", body: project.reflection.whatWouldChange },
              { label: "What questions remain", body: project.reflection.whatRemains },
            ].map((item, i) => (
              <Reveal key={item.label} delay={(i % 2) * 0.08}>
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-foreground/45">
                  {item.label}
                </h3>
                <p className="mt-4 text-lg leading-loose text-foreground/75">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
          <Reveal>
            <p className="mb-12 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
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

      {/* Departure */}
      <section className="relative mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
        <Reveal>
          <p className="font-editorial text-2xl italic leading-relaxed text-foreground/70 md:text-3xl md:leading-relaxed">
            Thank you for following this one as far as it went.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <button
              type="button"
              onClick={() => navigate({ name: "work" })}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors hover:text-foreground"
            >
              <ArrowLeft size={14} />
              More work
            </button>
            <button
              type="button"
              onClick={() => navigate({ name: "about" })}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors hover:text-foreground"
            >
              Why I build this way
              <ArrowUpRight size={14} />
            </button>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
