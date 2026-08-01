import type { Metadata } from "next";
import { ProjectDetailPage } from "@/components/errant/pages/project-detail-page";
import { PROJECTS, getProject } from "@/data/errant/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);

  // Unknown slug, coming-soon placeholder, or intentionally hidden
  // ("secret") pages should not be indexed until they carry real
  // content. See Phase 2 risk register — thin/placeholder pages
  // dilute crawl budget and read as low-quality to Google.
  if (!project || project.comingSoon || project.secret) {
    return {
      robots: { index: false, follow: false },
    };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/project/${project.slug}` },
  };
}

export default function ProjectDetail({
  params,
}: {
  params: { slug: string };
}) {
  return <ProjectDetailPage slug={params.slug} />;
}
