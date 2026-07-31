import { useSyncExternalStore } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` setting and stays in sync
 * if they change it while the page is open.
 *
 * Implemented with `useSyncExternalStore` so there is no
 * `setState`-in-effect — the canonical React 19 way to subscribe to a
 * browser media query.
 *
 * Per the brief: reduced motion does not remove atmosphere — it removes
 * unnecessary motion. The Living Mesh slows dramatically, the cursor and
 * particles are disabled, and transitions become elegant fades.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
