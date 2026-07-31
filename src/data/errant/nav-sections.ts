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
  /** The label shown in the rolling navigation. Keep it short. */
  navLabel: string;
  /** The full title shown in the Work page chapter heading. */
  title: string;
  /** The short paragraph that introduces the chapter. */
  introduction: string;
}

/**
 * Build the nav sections directly from the canonical CATEGORIES list.
 * This guarantees the navigation can never drift from the actual
 * content — if CATEGORIES changes, this list changes with it.
 */
export const NAV_SECTIONS: NavSection[] = CATEGORIES.map((c) => ({
  id: c.id,
  navLabel: c.title,
  title: c.title,
  introduction: c.introduction,
}));

/**
 * Given a section id, return the three-item window centered on it:
 * [previous, current, next]. Wraps so the list is always circular —
 * the visitor can roll forever in either direction.
 */
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
