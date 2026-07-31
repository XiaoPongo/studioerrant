import { useSyncExternalStore } from "react";

/**
 * Whether the current device supports a fine pointer with hover
 * (i.e. a real mouse/trackpad). Used to decide whether to enable the
 * custom cursor and other hover-only interactions.
 *
 * Touch devices are excluded — per the brief, touch interactions use
 * soft ripples, opacity, and gentle scaling instead of a simulated
 * cursor.
 */
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(FINE_POINTER_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
