import { ProjectDetailPage } from "@/components/errant/pages/project-detail-page";
import { PROJECTS } from "@/data/errant/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  return <ProjectDetailPage slug={params.slug} />;
}
