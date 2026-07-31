"use client";

import { useRouterStore } from "@/lib/router";
import { StudioErrantLogo } from "@/components/errant/studio-errant-logo";

/**
 * The footer should feel like walking out of a quiet exhibition —
 * nothing dramatic, no grand finale, only a lingering feeling.
 * Uses the official logo and theme-aware colors so it adapts
 * to Night / Morning.
 */
export function Footer() {
  const navigate = useRouterStore((s) => s.navigate);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-divider bg-background">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <button
              type="button"
              onClick={() => navigate({ name: "arrival" })}
              data-cursor="hover"
              className="transition-opacity duration-700 hover:opacity-80"
              aria-label="Studio Errant — return to arrival"
            >
              <StudioErrantLogo
                width="auto"
                height="40px"
                alt="Studio Errant"
              />
            </button>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-foreground/45">
              An independent practice built around curiosity. I build what
              curiosity discovers — and document the wandering that gets
              me there.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-6 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
              Wander
            </h3>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: "arrival" })}
                  className="transition-colors duration-700 hover:text-foreground"
                  data-cursor="hover"
                >
                  Arrival
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: "work" })}
                  className="transition-colors duration-700 hover:text-foreground"
                  data-cursor="hover"
                >
                  Work
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: "about" })}
                  className="transition-colors duration-700 hover:text-foreground"
                  data-cursor="hover"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-6 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
              Elsewhere
            </h3>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li>
                <a
                  href="mailto:hello@amaydeep.com"
                  className="transition-colors duration-700 hover:text-foreground"
                  data-cursor="hover"
                >
                  hello@amaydeep.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/chillbandar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-700 hover:text-foreground"
                  data-cursor="hover"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/XiaoPongo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-700 hover:text-foreground"
                  data-cursor="hover"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/amay-deep-34158b229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-700 hover:text-foreground"
                  data-cursor="hover"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-divider pt-8 text-[10px] uppercase tracking-[0.28em] text-foreground/35 md:flex-row md:items-center">
          <span>© {year} Amay Deep · Studio Errant</span>
          <span className="font-editorial normal-case tracking-normal italic text-foreground/45">
            Wander deliberately.
          </span>
          <span>Built quietly.</span>
        </div>
      </div>
    </footer>
  );
}
