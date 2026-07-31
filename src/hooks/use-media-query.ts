import { useSyncExternalStore } from "react";

/**
 * Subscribe to a media query. Returns its current match state and
 * stays in sync if it changes. Implemented with `useSyncExternalStore`
 * so there is no setState-in-effect (React 19 clean).
 *
 * Returns `false` during SSR and on the first client render, then the
 * real value afterwards — so components gating on media queries do not
 * cause hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
