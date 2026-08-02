export type ProjectCategory =
  | "design"
  | "writing"
  | "teardowns"
  | "visual";

export interface CategoryMeta {
  id: ProjectCategory;
  title: string;
  /** A short paragraph that establishes context before showing projects. */
  introduction: string;
}

export interface ProjectSection {
  heading: string;
  paragraphs: string[];
  visual?: {
    label: string;
    palette: string;
  };
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  detail: string;
  tags: string[];
  status?: "shipped" | "ongoing" | "archived" | "soon";
  palette: string;
  overview: string;
  /** Optional PDF download link, shown as a secondary action on the detail page. */
downloadUrl?: string;
  sections: ProjectSection[];
  reflection: {
    whatWorked: string;
    whatSurprised: string;
    whatWouldChange: string;
    whatRemains: string;
  };
  /** For "coming soon" items — overrides the card and detail page. */
  comingSoon?: boolean;
  /** Special label for items that are intentionally hidden. */
  secret?: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "design",
    title: "Design",
    introduction:
      "Posters, brochures, pitch decks, and reels — a selection of visual work made for college events, campaigns, and competitions. Each piece is linked to its source file so you can see the full thing.",
  },
  {
    id: "writing",
    title: "Writing",
    introduction:
      "Essays and fragments — some published, some still forming. Writing is where the ideas arrive before they know what they want to be.",
  },
  {
    id: "teardowns",
    title: "The Market Teardown Series",
    introduction:
      "Long-form teardowns of products, brands, and markets. Pictures, files, and analysis — each one a self-contained dossier. More are on the way.",
  },
  {
    id: "visual",
    title: "Visual Media",
    introduction:
      "Photography, motion, and atmosphere. A quieter corner of the practice.",
  },
];

// ── Design portfolio links (from thebandar.co.in) ──
export const DESIGN_LINKS: { title: string; url: string }[] = [
  { title: "The A to Z Guide to Watches — Presentation", url: "https://pitch.com/v/the-a-to-z-guide-to-watches-types-best-in-budget-and-more-t49inw" },
  { title: "SU Audio Speakers — Pitch Deck", url: "https://pitch.com/v/its-now-or-never-rzdrs5" },
  { title: "Insignia 9.0 — Brochure", url: "https://www.canva.com/design/DAGeUMmgpjk/81DIgF231GP-QfQU91bXYQ/edit" },
  { title: "Insignia 9.0 — Trophy Labels", url: "https://www.canva.com/design/DAGgGwZ8H9s/TjJcARF3NQpo3T-bFOL0pQ/edit" },
  { title: "General Secretary Elections 2024 — Winning Candidate", url: "https://www.canva.com/design/DAGLY2PBank/rFAUQa2kd-DnUO9UDvQweA/edit" },
  { title: "General Secretary Elections 2024 — Thank You Poster", url: "https://www.canva.com/design/DAGLq3mD6Z4/d0fDWPxxShPNwVR2CrOoHA/edit" },
  { title: "Business Thank You Card", url: "https://www.canva.com/design/DAGko-NmXAY/wSmMiKyXFClC7NxEXeNaAg/edit" },
  { title: "RCCA Football Tournament 2025", url: "https://www.canva.com/design/DAGkb-UJi-Y/LHh5W38AM4FM13EbIne_JA/edit" },
  { title: "Business Plan Competition 2026 — Banner", url: "https://www.canva.com/design/DAGh0LJtJzM/nJvvwv5ryIa_bbojH0hEyA/edit" },
  { title: "Business Plan Competition 2025 — Trophy Label", url: "https://www.canva.com/design/DAGh0fTxQuY/M4Tw6wJz4mkZfZean7In4Q/edit" },
  { title: "RevoRoots Business Plan (Won 3rd Place)", url: "https://www.canva.com/design/DAGhhkUbB2w/k5LFlbOTZgoTdjzXn-QNRw/edit" },
  { title: "Magic Touch Beauty Parlor — Poster", url: "https://canva.link/90qyrjblsdtf8ng" },
  { title: "RCCA World Yoga Day", url: "https://canva.link/00hcz61pwoak1gj" },
  { title: "Digital Poster Making Competition — 1st Place", url: "https://canva.link/980o5ph1b77xqvt" },
  { title: "Annual Athletic Meet — Menu", url: "https://canva.link/tzhhe2lwd5k6w9g" },
  { title: "Insignia 10.0 — Standee, Backdrop & Banner", url: "https://canva.link/8l1fddyle003ti0" },
  { title: "Insignia 10.0 — Badges", url: "https://canva.link/ectkzolptmy5nz4" },
  { title: "Insignia 10.0 — Brochure", url: "https://canva.link/y1u3k7qrgo70qe2" },
  { title: "Comquest 5.0 Reel — 1st Place (Script, Direction, Editing)", url: "https://www.instagram.com/reel/DT2CTgHDJBO/" },
  { title: "Arena 2026 Reel (Script, Direction, Editing)", url: "https://www.instagram.com/reel/DUXhZM4iBQ4/" },
  { title: "Insignia 10.0 — Logo Reveal", url: "https://www.instagram.com/reel/DVVkG37jYbg/" },
  { title: "Insignia 10.0 — Coming Soon (Stop-Motion)", url: "https://www.instagram.com/reel/DVTBl4Tjamo/" },
  { title: "Insignia 10.0 — Register Now", url: "https://www.instagram.com/reel/DVVzMU3k4mQ/" },
];

export const PROJECTS: Project[] = [
  // ── DESIGN — one card, linking to a full portfolio page ──
  {
    slug: "design-portfolio",
    title: "Design Portfolio",
    category: "design",
    year: "2022—Present",
    summary:
      "Posters, brochures, pitch decks, and reels — the full collection of visual work.",
    detail:
      "A growing archive of design work made for college events, campaigns, and competitions. Each piece links to its source file.",
    tags: ["Posters", "Brochures", "Decks", "Reels"],
    status: "ongoing",
    palette: "from-[#211b38] via-[#16121f] to-background",
    overview:
      "A selection of visual work — posters, brochures, pitch decks, and reels — made for college events, campaigns, and competitions. Each piece is linked to its source file so you can see the full thing.",
    sections: [
      {
        heading: "The Collection",
        paragraphs: [
          "Below is the full collection, each linking to its original file. The work spans presentations, print collateral, social media reels, and competition entries.",
        ],
      },
    ],
    reflection: {
      whatWorked:
        "Treating each design as a small experiment rather than a deliverable.",
      whatSurprised:
        "How often the quickest, least-polished piece was the one that landed.",
      whatWouldChange:
        "I would document the process, not just the final file.",
      whatRemains:
        "Whether design is a skill I practice or a language I am still learning.",
    },
  },

  // ── WRITING — 4 items ──
  {
    slug: "the-fool",
    title: "The Fool",
    category: "writing",
    year: "2026",
    summary: "A poem.",
    detail: "A poem.",
    tags: ["Poem"],
    status: "shipped",
    palette: "from-[#1a1730] to-background",
    overview: "An poem.",
    downloadUrl: "https://drive.google.com/file/d/1p4ca1-O_MZwGtch8N6e_D7XfJPps1qgi/view",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },
  {
    slug: "where-the-land-forgets-itself",
    title: "Where the Land Forgets Itself (Got me 3rd place)",
    category: "writing",
    year: "2026",
    summary: "A poem.",
    detail: "A poem.",
    tags: ["Poem"],
    status: "shipped",
    palette: "from-[#211b38] to-background",
    overview: "A poem.",
    downloadUrl: "https://drive.google.com/file/d/1VJWR0XqCPN951rg5LEq0hNBXQZf84_IU/view",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },
  {
    slug: "a-name-i-once-knew",
    title: "A Name I Once Knew",
    category: "writing",
    year: "—",
    summary: "A short story.",
    detail: "A short story.",
    tags: ["Story"],
    status: "shipped",
    palette: "from-[#1a1730] to-background",
    overview: "A short story.",
    downloadUrl: "https://drive.google.com/file/d/1RX8SO3_n0yvimoz3RgRpfbcuKyI7LW4l/view",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },
  {
    slug: "the-accidental-engico",
    title: "The Accidental Engico",
    category: "writing",
    year: "—",
    summary: "ssshhh… in the works.",
    detail: "ssshhh… in the works.",
    tags: ["Novel"],
    status: "ongoing",
    palette: "from-[#16121f] to-background",
    overview: "ssshhh… in the works.",
    secret: "ssshhh… in the works.",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },

  // ── THE MARKET TEARDOWN SERIES — 4 dummies, all "coming soon" ──
  // To add a 5th: copy one of these objects, change the slug/title,
  // and fill in the content. The card and detail page will pick it up
  // automatically.
  {
    slug: "teardown-01",
    title: "Teardown 01",
    category: "teardowns",
    year: "Soon",
    summary: "Coming soon.",
    detail: "Coming soon.",
    tags: ["Teardown"],
    status: "soon",
    comingSoon: true,
    palette: "from-[#211b38] via-[#16121f] to-background",
    overview: "Coming soon.",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },
  {
    slug: "teardown-02",
    title: "Teardown 02",
    category: "teardowns",
    year: "Soon",
    summary: "Coming soon.",
    detail: "Coming soon.",
    tags: ["Teardown"],
    status: "soon",
    comingSoon: true,
    palette: "from-[#1a1730] to-background",
    overview: "Coming soon.",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },
  {
    slug: "teardown-03",
    title: "Teardown 03",
    category: "teardowns",
    year: "Soon",
    summary: "Coming soon.",
    detail: "Coming soon.",
    tags: ["Teardown"],
    status: "soon",
    comingSoon: true,
    palette: "from-[#211b38] to-background",
    overview: "Coming soon.",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },
  {
    slug: "teardown-04",
    title: "Teardown 04",
    category: "teardowns",
    year: "Soon",
    summary: "Coming soon.",
    detail: "Coming soon.",
    tags: ["Teardown"],
    status: "soon",
    comingSoon: true,
    palette: "from-[#1a1730] to-background",
    overview: "Coming soon.",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },

  // ── VISUAL MEDIA — one mock, "coming soon" everywhere ──
  {
    slug: "visual-coming-soon",
    title: "Coming Soon",
    category: "visual",
    year: "Soon",
    summary: "Coming soon.",
    detail: "Coming soon.",
    tags: [],
    status: "soon",
    comingSoon: true,
    palette: "from-[#16121f] to-background",
    overview: "Coming soon.",
    sections: [],
    reflection: {
      whatWorked: "",
      whatSurprised: "",
      whatWouldChange: "",
      whatRemains: "",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getRelatedProjects(
  slug: string,
  category: ProjectCategory,
  limit = 2,
): Project[] {
  return PROJECTS.filter(
    (p) => p.slug !== slug && p.category === category,
  ).slice(0, limit);
}
