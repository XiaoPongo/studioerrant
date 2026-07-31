import { useSyncExternalStore } from "react";

/**
 * Hydration-safe "are we on the client?" flag.
 *
 * Returns `false` during SSR and the first client render, then `true`
 * afterwards. Uses `useSyncExternalStore` so there is no
 * `setState`-in-effect (which React 19's lint rules forbid).
 *
 * Useful for gating client-only UI (custom cursors, hash routers, etc.)
 * behind a render that matches the server's first paint.
 */
function subscribe(): () => void {
  return () => {};
}
function getSnapshot(): boolean {
  return true;
}
function getServerSnapshot(): boolean {
  return false;
}

export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
