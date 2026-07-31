"use client";

import { useRouterStore } from "@/lib/router";

/**
 * The footer should feel like walking out of a quiet exhibition —
 * nothing dramatic, no grand finale, only a lingering feeling.
 */
export function Footer() {
  const navigate = useRouterStore((s) => s.navigate);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-black">
      <div className="mx-auto max-w-[1600px] px-6 py-14 md:px-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-serif text-xl italic text-white/80 md:text-2xl">
              &ldquo;The quiet work is usually the important work.&rdquo;
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/45">
              Studio Errant is a digital studio built around curiosity. We
              build what curiosity discovers — and document the wandering
              that gets us there.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-5 text-[11px] uppercase tracking-[0.3em] text-white/35">
              Wander
            </h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: "arrival" })}
                  className="transition-colors hover:text-white"
                  data-cursor="hover"
                >
                  Arrival
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: "work" })}
                  className="transition-colors hover:text-white"
                  data-cursor="hover"
                >
                  Work
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: "about" })}
                  className="transition-colors hover:text-white"
                  data-cursor="hover"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-5 text-[11px] uppercase tracking-[0.3em] text-white/35">
              Elsewhere
            </h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li>
                <a
                  href="mailto:hello@studioerrant.example"
                  className="transition-colors hover:text-white"
                  data-cursor="hover"
                >
                  hello@studioerrant.example
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-white"
                  data-cursor="hover"
                  onClick={(e) => e.preventDefault()}
                >
                  Journal (soon)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-white"
                  data-cursor="hover"
                  onClick={(e) => e.preventDefault()}
                >
                  Notes (soon)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 text-[11px] uppercase tracking-[0.25em] text-white/35 md:flex-row md:items-center">
          <span>© {year} Studio Errant</span>
          <span className="font-serif normal-case tracking-normal italic text-white/40">
            Wander deliberately.
          </span>
          <span>Built quietly.</span>
        </div>
      </div>
    </footer>
  );
}
