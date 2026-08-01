import { ProjectDetailPage } from "@/components/errant/pages/project-detail-page";

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  return <ProjectDetailPage slug={params.slug} />;
}
