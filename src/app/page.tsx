import { ArrivalPage } from "@/components/errant/pages/arrival-page";

const personWebsiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://studioerrant.in/#person",
      name: "Amay Deep",
      alternateName: "Studio Errant",
      url: "https://studioerrant.in/",
      image: "https://studioerrant.in/og-image.png",
      jobTitle: "Designer & Writer",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
      sameAs: [
        "https://github.com/XiaoPongo",
        "https://linkedin.com/in/amay-deep-34158b229",
        "https://instagram.com/chillbandar",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://studioerrant.in/#website",
      url: "https://studioerrant.in/",
      name: "Studio Errant",
      description:
        "An independent design and writing practice. Portfolio work, essays, and long-form market teardowns.",
      publisher: { "@id": "https://studioerrant.in/#person" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://studioerrant.in/work?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personWebsiteSchema) }}
      />
      <ArrivalPage />
    </>
  );
}
