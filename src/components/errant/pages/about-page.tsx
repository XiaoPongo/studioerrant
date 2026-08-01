"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Reveal, PullQuote } from "@/components/errant/transitions";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * About answers one question: why does Studio Errant exist?
 *
 * It is not a résumé. It is told in the first person because honesty
 * creates trust. The creative process is described as a cycle —
 * Question → Observation → Experiment → Failure → Reflection →
 * Understanding → Creation — and this diagram becomes a recurring
 * visual motif.
 */

const PROCESS_STEPS = [
  {
    name: "Question",
    note: "Most worthwhile ideas begin as a question, not an answer.",
  },
  {
    name: "Observation",
    note: "Before building, we watch. Sometimes for a long time.",
  },
  {
    name: "Experiment",
    note: "Small, quick, often wrong. The point is to learn, not to win.",
  },
  {
    name: "Failure",
    note: "Not hidden. Documented. Failure is part of the network.",
  },
  {
    name: "Reflection",
    note: "We sit with what happened long enough to understand it.",
  },
  {
    name: "Understanding",
    note: "Sometimes. Eventually. Rarely on the schedule we hoped for.",
  },
  {
    name: "Creation",
    note: "What emerges when the rest has been done honestly.",
  },
];

const VALUES = [
  {
    title: "Calm, not loud",
    body: "Spacing, typography, animation, and pacing should all encourage slower interaction. The internet constantly asks people to move faster. I quietly ask them to stay a little longer.",
  },
  {
    title: "Curiosity as discipline",
    body: "Curiosity is not a personality trait. It is a discipline. It can be practised. It can be refused. I treat it as the daily work, not the inspiration.",
  },
  {
    title: "Atmosphere before interface",
    body: "I begin every project by asking how someone should feel standing here. Only afterward do I build the interface. Atmosphere is never a background.",
  },
  {
    title: "Leave things unfinished",
    body: "Perfection ends conversation. Some ideas deserve to remain open. Visitors should sense that work continues after they leave.",
  },
];

export function AboutPage() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative">
      {/* Opener — why does Studio Errant exist? */}
      <section className="relative mx-auto max-w-[1600px] px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-52">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.5em] text-foreground/35">
            Studio Errant — About
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="max-w-4xl font-editorial text-display-lg text-foreground">
            I exist to ask
            <br />
            better questions,
            <br />
            not to pretend
            <br />
            I have answers.
          </h1>
        </Reveal>
      </section>

      {/* Story — first person, conversational, never corporate. */}
      <section className="relative mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
            I — The story so far
          </p>
        </Reveal>
        <div className="space-y-8 text-lg leading-loose text-foreground/70">
          <Reveal as="p" delay={0.05}>
            I&rsquo;m Amay Deep — a B.Com. graduate who never quite fit the
            mold of a commerce student. I came to design, writing, and code
            sideways, the way most honest things arrive: not through a plan,
            but through a long series of questions I could not put down.
          </Reveal>
          <Reveal as="p" delay={0.08}>
            For a while I operated under the name The Bandar Co. — a small,
            playful identity I built while I was still figuring out what I
            actually wanted to make. It was useful. It let me experiment in
            public. But the name never quite fit the work I found myself
            drawn toward: slower, quieter, more deliberate.
          </Reveal>
          <Reveal as="p" delay={0.11}>
            Studio Errant is that work, given a name I can stand behind. The
            word <em className="text-foreground/85">errant</em> describes
            someone who wanders. I kept it because I never found a better
            word for the way ideas actually arrive — not in a straight line,
            but through drift, detour, and the occasional productive loss
            of direction.
          </Reveal>
          <Reveal as="p" delay={0.14}>
            Today Studio Errant is one person. Tomorrow it may become a
            studio, a research lab, a small publishing house. I am in no
            hurry to define it. Ambiguity, here, is intentional.
          </Reveal>
        </div>
      </section>

      {/* Philosophy — the creative process as a cycle. */}
      <section className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
            II — The creative process
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-2xl font-editorial text-display-sm leading-[1.4] text-foreground/80 md:text-display-md md:leading-[1.35]">
            Curiosity is a cycle. Not a pipeline. Not a funnel. A cycle
            you walk around, and around, until something quietly becomes
            clear.
          </p>
        </Reveal>

        {/* The cycle as a recurring visual motif. */}
        <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5" delay={0.08}>
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-foreground/10" />
              <div className="absolute inset-6 rounded-full border border-foreground/[0.06]" />
              <div className="absolute inset-12 rounded-full border border-foreground/[0.04]" />
              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-foreground/15 bg-background/40 text-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                    The
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                    Cycle
                  </span>
                </div>
              </div>
              {/* Step markers placed around the circle */}
              {PROCESS_STEPS.map((step, i) => {
                const angle = (i / PROCESS_STEPS.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 44; // percentage from center
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return (
                  <motion.div
                    key={step.name}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.2 + i * 0.08,
                    }}
                    className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-foreground/15 bg-background text-center"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="text-[10px] uppercase leading-tight tracking-[0.2em] text-foreground/85">
                      {step.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <ol className="space-y-6">
              {PROCESS_STEPS.map((step, i) => (
                <Reveal as="li" key={step.name} delay={0.05 + i * 0.05}>
                  <div className="flex gap-6 border-b border-foreground/[0.05] pb-6">
                    <span className="font-editorial text-sm italic text-foreground/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base uppercase tracking-[0.2em] text-foreground">
                        {step.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                        {step.note}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Values — what we hold to. */}
      <section className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
            III — What I hold to
          </p>
        </Reveal>
        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 0.08}>
              <h3 className="font-editorial text-2xl text-foreground md:text-3xl">
                {v.title}
              </h3>
              <p className="mt-4 text-base leading-loose text-foreground/55">
                {v.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Résumé — view and download. */}
      <section className="relative mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <p className="mb-10 text-[11px] uppercase tracking-[0.4em] text-foreground/35">
            IV — Résumé
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="font-editorial text-display-sm leading-[1.4] text-foreground/80 md:text-display-md md:leading-[1.35]">
            If you would like the formal version of this story —
            <span className="text-foreground/45">
              {" "}education, selected work, skills, links — it is here as a
              single page.
            </span>
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/amay-deep-resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors duration-700 hover:text-foreground"
            >
              View résumé
              <span className="h-px w-6 bg-foreground/30 transition-all duration-700 group-hover:w-10 group-hover:bg-foreground/70" />
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/amay-deep-resume.pdf`}
              download="amay-deep-resume.pdf"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors duration-700 hover:text-foreground"
            >
              Download PDF
              <span className="h-px w-6 bg-foreground/30 transition-all duration-700 group-hover:w-10 group-hover:bg-foreground/70" />
            </a>
          </div>
        </Reveal>
      </section>

      {/* Future vision + contact. */}
      <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:px-12 md:py-32">
        <Reveal>
          <PullQuote>
            The goal is not admiration. The goal is resonance. If someone
            closes the browser and finds themselves thinking about Studio
            Errant hours later, then the design has succeeded.
          </PullQuote>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-12 text-base leading-loose text-foreground/55">
            If you have a question worth following — or a project that
            begins as one — write to me. I answer slowly, but I answer.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <a
              href="mailto:amay@studioerrant.com"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors hover:text-foreground"
            >
              amay@studioerrant.com
              <span className="h-px w-6 bg-foreground/30 transition-all group-hover:w-10 group-hover:bg-foreground/70" />
            </a>
            <a
              href="https://wa.me/917588643764"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors hover:text-foreground"
            >
              WhatsApp · +91 75886 43764
              <span className="h-px w-6 bg-foreground/30 transition-all group-hover:w-10 group-hover:bg-foreground/70" />
            </a>
            <Link
  href="/work"
  data-cursor="hover"
  className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70 transition-colors hover:text-foreground"
>
  See the work
  <span className="h-px w-6 bg-foreground/30 transition-all group-hover:w-10 group-hover:bg-foreground/70" />
</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
