import type { Metadata } from "next";
import { WorkPage } from "@/components/errant/pages/work-page";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Browse the full Studio Errant archive: design portfolio, essays, market teardowns, and visual media.",
  alternates: {
    canonical: "https://studioerrant.in/work/",
  },
  openGraph: {
    title: "Work · Studio Errant",
    description:
      "Browse the full Studio Errant archive: design portfolio, essays, market teardowns, and visual media.",
    url: "https://studioerrant.in/work/",
  },
};

export default function Work() {
  return <WorkPage />;
}
