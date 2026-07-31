import { create } from "zustand";

/**
 * Two materials. Never "dark mode" or "light mode".
 *
 *   night    — graphite, oxidized steel, museum, observatory. The default.
 *   morning  — archival paper, workshop plaster, library stone.
 *
 * The toggle is a physical paper dog-ear in the top-right corner.
 * Toggling unfolds the page from one material into the other over a
 * long, slow transition.
 *
 * The choice is remembered across visits. We deliberately do not
 * detect `prefers-color-scheme` — the studio's default is Night, and
 * the visitor earns Morning by unfolding the dog-ear.
 */
export type Material = "night" | "morning";

const STORAGE_KEY = "errant.material";

interface MaterialState {
  material: Material;
  /** Increments each time the material changes, so the unfold
      animation can retrigger. */
  unfoldKey: number;
  setMaterial: (m: Material) => void;
  toggle: () => void;
  hydrate: () => void;
}

function applyToDocument(material: Material) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (material === "morning") {
    root.classList.add("theme-morning");
  } else {
    root.classList.remove("theme-morning");
  }
  // Update the theme-color meta so mobile browser chrome matches.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", material === "morning" ? "#f2efe8" : "#0c0d0e");
  }
}

export const useMaterial = create<MaterialState>((set, get) => ({
  material: "night",
  unfoldKey: 0,
  setMaterial: (m) => {
    applyToDocument(m);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, m);
      } catch {
        /* ignore */
      }
    }
    set((s) => ({ material: m, unfoldKey: s.unfoldKey + 1 }));
  },
  toggle: () => {
    const next = get().material === "night" ? "morning" : "night";
    get().setMaterial(next);
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    let stored: Material | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "night" || raw === "morning") stored = raw;
    } catch {
      /* ignore */
    }
    const m: Material = stored ?? "night";
    applyToDocument(m);
    set({ material: m });
  },
}));
