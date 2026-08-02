import type { Metadata } from "next";
import { AboutPage } from "@/components/errant/pages/about-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Studio Errant is Amay Deep's independent practice of design, writing, and research. Based in India.",
  alternates: {
    canonical: "https://studioerrant.in/about/",
  },
  openGraph: {
    title: "About · Studio Errant",
    description:
      "Studio Errant is Amay Deep's independent practice of design, writing, and research.",
    url: "https://studioerrant.in/about/",
  },
};

export default function About() {
  return <AboutPage />;
}
