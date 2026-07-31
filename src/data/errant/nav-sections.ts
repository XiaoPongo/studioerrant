import { CATEGORIES, type ProjectCategory } from "./projects";

/**
 * The single source of truth for the site's navigable sections.
 *
 * Both the Work page chapters AND the dynamic rolling navigation
 * read from this list. Rename a section here and the navigation
 * updates automatically — no component code changes required.
 *
 * The rolling navigation shows exactly three items at a time
 * (previous / current / next). `id` is the stable key used to track
 * the active section as the visitor scrolls.
 */
export interface NavSection {
  id: ProjectCategory;
  navLabel: string;
  title: string;
  introduction: string;
}

export const NAV_SECTIONS: NavSection[] = CATEGORIES.map((c) => ({
  id: c.id,
  navLabel: c.title,
  title: c.title,
  introduction: c.introduction,
}));

export function getNavWindow(currentId: ProjectCategory): NavSection[] {
  const sections = NAV_SECTIONS;
  const len = sections.length;
  if (len === 0) return [];
  const idx = sections.findIndex((s) => s.id === currentId);
  const safeIdx = idx === -1 ? 0 : idx;
  return [
    sections[(safeIdx - 1 + len) % len],
    sections[safeIdx],
    sections[(safeIdx + 1) % len],
  ];
}
