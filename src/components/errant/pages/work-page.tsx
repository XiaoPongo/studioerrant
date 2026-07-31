"use client";

import { useRouterStore } from "@/lib/router";
import { CATEGORIES, PROJECTS } from "@/data/errant/projects";
import { NAV_SECTIONS } from "@/data/errant/nav-sections";
import { Reveal, PullQuote } from "@/components/errant/transitions";
import { ProjectCard } from "@/components/errant/project-card";
import { cn } from "@/lib/utils";

/**
 * Work — the heart of the website.
 *
 * Projects are grouped by discipline, not chronology. Each category is
 * a chapter within the same story. The chapter introduces itself before
 * showing projects.
 *
 * Each chapter <section> is tagged with data-nav-section="<id>" so the
 * dynamic RollingNav component can observe which chapter is centered in
 * the viewport and rotate accordingly. The chapter list is read from
 * NAV_SECTIONS — the single source of truth shared with the navigation.
 *
 * The Work section introduces the only significant colour shift: purple
 * slowly emerges *beneath* the darkness, driven by creativeIntensity on
 * the parent route.
 */
export function WorkPage() {
  const navigate = useRouterStore((s) => s.navigate);

  return (
    <div className="relative">
      {/* Page opener — large title, breathing room, sparse. */}
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

      {/* Chapters — each category is a chapter. Tagged so the rolling
          navigation can observe which chapter is centered. */}
      {NAV_SECTIONS.map((section, chapterIndex) => {
        const projects = PROJECTS.filter((p) => p.category === section.id);
        if (projects.length === 0) return null;
        return (
          <section
            key={section.id}
            id={`section-${section.id}`}
            data-nav-section={section.id}
            className="relative mx-auto max-w-[1600px] scroll-mt-32 px-6 py-24 md:px-12 md:py-32 md:pl-20 lg:pl-28"
          >
            {/* Chapter heading */}
            <div className="grid gap-10 md:grid-cols-12">
              <Reveal className="md:col-span-5">
                <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
                  {String(chapterIndex + 1).padStart(2, "0")} — Chapter
                </p>
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
            Why we build this way
          </button>
        </Reveal>
      </section>
    </div>
  );
}


