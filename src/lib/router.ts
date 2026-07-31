import { create } from "zustand";

export type RouteName = "arrival" | "work" | "about" | "project";

export interface ErrantRoute {
  name: RouteName;
  // For project pages, the slug of the project.
  slug?: string;
}

interface RouterState {
  route: ErrantRoute;
  /** Monotonic key used to retrigger page-transition animations. */
  transitionKey: number;
  navigate: (route: ErrantRoute) => void;
}

function parseHash(): ErrantRoute {
  if (typeof window === "undefined") return { name: "arrival" };
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [name, slug] = hash.split("/");
  if (name === "work") return { name: "work" };
  if (name === "about") return { name: "about" };
  if (name === "project" && slug) return { name: "project", slug };
  return { name: "arrival" };
}

function toHash(route: ErrantRoute): string {
  if (route.name === "arrival") return "#/";
  if (route.name === "project" && route.slug) return `#/project/${route.slug}`;
  return `#/${route.name}`;
}

export const useRouterStore = create<RouterState>((set) => ({
  route: typeof window !== "undefined" ? parseHash() : { name: "arrival" },
  transitionKey: 0,
  navigate: (route) => {
    if (typeof window !== "undefined") {
      const target = toHash(route);
      if (window.location.hash !== target) {
        window.location.hash = target;
      }
    }
    set((state) => ({ route, transitionKey: state.transitionKey + 1 }));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  },
}));

/**
 * Subscribe to native hashchange so browser back/forward works.
 * Called once on the client.
 */
export function attachHashListener() {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    const next = parseHash();
    useRouterStore.setState((state) => ({
      route: next,
      transitionKey: state.transitionKey + 1,
    }));
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  window.addEventListener("hashchange", handler);
  // Ensure the initial hash is reflected.
  handler();
  return () => window.removeEventListener("hashchange", handler);
}
