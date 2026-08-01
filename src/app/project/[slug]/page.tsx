import type { Metadata } from "next";
import { ProjectDetailPage } from "@/components/errant/pages/project-detail-page";
import { PROJECTS, getProject } from "@/data/errant/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

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

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  // Only emit CreativeWork schema for real, indexable projects —
  // same eligibility as generateMetadata above.
  const showSchema = project && !project.comingSoon && !project.secret;

  const schema = showSchema
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url: `https://studioerrant.in/project/${project.slug}`,
        author: { "@id": "https://studioerrant.in/#person" },
        dateCreated: project.year,
        keywords: project.tags.join(", "),
        isPartOf: { "@id": "https://studioerrant.in/#website" },
      }
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ProjectDetailPage slug={slug} />
    </>
  );
}
