export type ProjectCategory =
  | "ai"
  | "design"
  | "writing"
  | "research"
  | "experiments"
  | "visual";

export interface CategoryMeta {
  id: ProjectCategory;
  title: string;
  /** A short paragraph that establishes context before showing projects. */
  introduction: string;
}

export interface ProjectSection {
  heading: string;
  /** Each item is a paragraph. The page alternates text with visuals. */
  paragraphs: string[];
  /** Optional visual identifier so the page can place a generated visual. */
  visual?: {
    label: string;
    /** Tailwind gradient hint used by the abstract project visual. */
    palette: string;
  };
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: string;
  /** One-line description shown on the card. */
  summary: string;
  /** Longer description shown when the card is hovered. */
  detail: string;
  tags: string[];
  status?: "shipped" | "ongoing" | "archived";
  /** Cover gradient hint used by the abstract card visual. */
  palette: string;
  /** Essay-style content for the project page. */
  overview: string;
  sections: ProjectSection[];
  reflection: {
    whatWorked: string;
    whatSurprised: string;
    whatWouldChange: string;
    whatRemains: string;
  };
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    introduction:
      "We build systems that help people think, observe, and create — not simply automate. Each project begins as a question about what a machine could notice that a person might miss.",
  },
  {
    id: "design",
    title: "Design",
    introduction:
      "Design that disappears behind the experience. Systems, interfaces, and identities built with restraint — where the spacing is as considered as the type.",
  },
  {
    id: "writing",
    title: "Writing",
    introduction:
      "Essays and notes that think in public. Writing is part of the work, not a record of it. Some ideas only become clear when we try to set them down.",
  },
  {
    id: "research",
    title: "Research",
    introduction:
      "Long, patient investigation. We follow questions wherever they lead — including into dead ends, which are documented as carefully as the breakthroughs.",
  },
  {
    id: "experiments",
    title: "Experiments",
    introduction:
      "Small, unfinished, occasionally failed. Experiments are how the studio thinks out loud. Failure is not hidden here; it is part of the network.",
  },
  {
    id: "visual",
    title: "Visual Media",
    introduction:
      "Images, motion, and atmosphere. Visual work that treats contrast, stillness, and light as primary materials rather than decoration.",
  },
];

export const PROJECTS: Project[] = [
  {
    slug: "errant-atlas",
    title: "Errant Atlas",
    category: "ai",
    year: "2024",
    summary:
      "A reading companion that maps how ideas connect across the books you've already loved.",
    detail:
      "An AI system that treats your library as a graph of questions rather than a list of titles — and recommends the next book by the question it will help you ask, not the topic it covers.",
    tags: ["RAG", "Knowledge graphs", "Reading", "LLM orchestration"],
    status: "ongoing",
    palette: "from-[#211b38] via-[#16121f] to-background",
    overview:
      "Errant Atlas began with a frustration most readers know: the books we love recommend more books like themselves, when what we actually want is the next question. We built a system that maps a personal library as a graph of underlying questions, then suggests the book most likely to deepen or unsettle the inquiry.",
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "Recommendation engines optimise for similarity. A reader who loved one book on attention is offered ten more on attention. Curiosity, however, rarely moves in straight lines — it moves by association, by contradiction, by the quiet pull of an adjacent question.",
          "We wanted a tool that could hold an entire reading history and answer a deceptively simple query: what should I read next, given not what I liked, but what I am currently wondering about?",
        ],
        visual: {
          label: "Recommendation as similarity vs. as inquiry",
          palette: "from-[#1a1730] to-background",
        },
      },
      {
        heading: "Research",
        paragraphs: [
          "We spent the first six weeks not building. We read what librarians wrote about serendipity. We interviewed eleven readers about the last time a book genuinely surprised them. The pattern was consistent: surprise came from a book that answered a question the reader had not yet articulated.",
          "This reframed the entire system. The unit of recommendation was not the book but the question.",
        ],
        visual: {
          label: "Reader interviews, weeks 1–6",
          palette: "from-[#211b38] to-background",
        },
      },
      {
        heading: "Process",
        paragraphs: [
          "We extract propositions from each book using a fine-tuned extractor, then cluster them into latent questions using embedding neighbourhoods. Each reader's library becomes a personal graph of questions and the books that touch them.",
          "The recommendation step is intentionally slow. The system presents three candidates and, for each, the question it believes it will help the reader ask. The reader chooses the question, not the book.",
        ],
      },
      {
        heading: "Iterations",
        paragraphs: [
          "The first version was too confident. It presented single recommendations with explanations that read like arguments. Readers pushed back — they wanted to be offered the question, not told the answer.",
          "We rewrote the prompt layer to surface uncertainty. Each recommendation now arrives with the doubts the system has about itself.",
        ],
        visual: {
          label: "Three candidate questions, presented as a choice",
          palette: "from-[#2a2040] to-background",
        },
      },
      {
        heading: "Final Outcome",
        paragraphs: [
          "Errant Atlas now serves a small private cohort of readers. The most common feedback is that it has changed how they read books they have already read — by revealing the questions those books were quietly answering.",
          "We are not in a hurry to release it publicly. The system is most valuable when it is slow.",
        ],
      },
    ],
    reflection: {
      whatWorked:
        "Reframing the unit of recommendation from book to question. Everything else followed from that single decision.",
      whatSurprised:
        "How often readers chose the candidate the system was least confident about. We had built in uncertainty as a feature, and people reached for it.",
      whatWouldChange:
        "We would start the reader interviews on day one rather than week three. The technical design kept collapsing under the weight of assumptions we had not yet tested.",
      whatRemains:
        "Whether a system can teach a person to notice their own unasked questions — or whether it can only ever answer the ones they already know.",
    },
  },
  {
    slug: "lumen-field",
    title: "Lumen Field",
    category: "visual",
    year: "2023",
    summary:
      "A generative light study that paints with atmospheric density instead of pixels.",
    detail:
      "An interactive field of soft light that responds to attention rather than input — a quiet experiment in interfaces that breathe back.",
    tags: ["Generative", "Canvas", "Atmosphere", "Interaction"],
    status: "shipped",
    palette: "from-[#2a2040] via-[#16121f] to-background",
    overview:
      "Lumen Field is a study in interface breath. The screen holds a field of soft light that drifts on its own rhythm and responds, gently, to where a visitor's attention lingers. There are no buttons. The only interaction is the act of looking.",
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "Most interfaces treat attention as a resource to be captured. We wanted to build an interface that treated attention as something to be returned — a surface that responded to looking by breathing back.",
        ],
      },
      {
        heading: "Process",
        paragraphs: [
          "We began with a single instruction: the field must never demand. It must invite. We iterated on density, on drift speed, on the softness of the response curve. Each version was tested not for performance but for atmosphere.",
          "The breakthrough came when we stopped treating the cursor as a pointer and started treating it as a gaze. The field now responds not to position but to dwell.",
        ],
        visual: {
          label: "Drift field responding to dwell, not click",
          palette: "from-[#211b38] to-background",
        },
      },
      {
        heading: "Iterations",
        paragraphs: [
          "Early versions were too eager. The field rushed toward the cursor and visitors flinched. We slowed the response by an order of magnitude and the experience transformed. Restraint, it turned out, was the feature.",
        ],
      },
      {
        heading: "Final Outcome",
        paragraphs: [
          "Lumen Field shipped as a standalone piece. Most visitors spend between four and seven minutes with it — an eternity by web standards. We consider that the result.",
        ],
      },
    ],
    reflection: {
      whatWorked:
        "Slowing everything down by 10×. The instinct to make interfaces responsive is also the instinct to make them anxious.",
      whatSurprised:
        "How long people would stay with a screen that asked nothing of them.",
      whatWouldChange:
        "We would build a reduced-motion path from the start rather than retrofitting it. The atmosphere should be available to everyone on equal terms.",
      whatRemains:
        "Whether interfaces that breathe can scale to work that must also inform — or whether breath belongs only to contemplative surfaces.",
    },
  },
  {
    slug: "field-notes",
    title: "Field Notes",
    category: "writing",
    year: "Ongoing",
    summary:
      "A long-running journal of unfinished questions, written in public.",
    detail:
      "Field Notes is where the studio thinks out loud — essays, fragments, and abandoned drafts, all kept because even the dead ends taught us something.",
    tags: ["Essays", "Notes", "Thinking in public"],
    status: "ongoing",
    palette: "from-[#1a1730] via-[#141416] to-background",
    overview:
      "Field Notes is the studio's open journal. It is not a publication schedule. It is the place where unfinished questions live long enough to either become finished essays or quietly teach us something and remain unfinished.",
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "Most studio writing is retrospective — a polished account of work already done. We wanted a place to write the work as it happens, including the parts that never finish.",
        ],
      },
      {
        heading: "Process",
        paragraphs: [
          "Every entry begins as a question we cannot yet answer. We publish the question first, then return to it over weeks or months as the answer (or the better question) emerges.",
          "Some entries are deliberately left open. The internet expects completeness; we believe leaving a thought unfinished can be more honest than pretending to have concluded it.",
        ],
      },
      {
        heading: "Final Outcome",
        paragraphs: [
          "Field Notes has become the studio's most-read surface. The most-visited entry is one we never finished — a fragment about the difference between noticing and looking, abandoned halfway through and left exactly as it was.",
        ],
      },
    ],
    reflection: {
      whatWorked:
        "Treating unfinished writing as a feature, not a failure state.",
      whatSurprised:
        "That an abandoned entry could become the most-read piece on the site.",
      whatWouldChange:
        "We would resist the urge to 'tidy' older entries when we revisit them. The earlier voice matters.",
      whatRemains:
        "Whether writing in public changes what we think, or merely records it faster.",
    },
  },
  {
    slug: "quiet-index",
    title: "Quiet Index",
    category: "research",
    year: "2023",
    summary:
      "A research study on how interfaces could measure attention without extracting it.",
    detail:
      "An investigation into whether a website can know it is being read without knowing who is reading — a study in metrics that respect the reader.",
    tags: ["Attention", "Privacy", "Metrics", "Ethics"],
    status: "shipped",
    palette: "from-[#211b38] via-[#16121f] to-background",
    overview:
      "Quiet Index asks whether the useful parts of analytics — knowing whether a piece of writing was actually read — can be separated from the extractive parts. We prototyped a metric that measures dwell without measuring identity.",
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "The web measures everything except what matters. It knows how many people arrived and how many left, but not whether anyone actually read what was written. The metrics that come closest — scroll depth, time on page — are also the most invasive.",
          "We wanted a metric that could answer 'was this read?' without ever answering 'who read this?'",
        ],
      },
      {
        heading: "Research",
        paragraphs: [
          "We surveyed the field of privacy-preserving analytics, then interviewed twelve writers about what they actually wanted to know. The answers were surprisingly humble: most wanted a single signal — was this piece read attentively, yes or no.",
          "Everything else, they said, was vanity.",
        ],
      },
      {
        heading: "Process",
        paragraphs: [
          "We designed a dwell-based signal that fires once per piece, only after a threshold of attentive reading, and carries no identifying information. The signal is aggregated to a single number per essay.",
          "The system never stores the reader. It only stores the fact that reading happened.",
        ],
      },
      {
        heading: "Final Outcome",
        paragraphs: [
          "The Quiet Index now runs silently on this very site. The numbers are visible only to us, and only in aggregate. We do not know who you are. We only know, vaguely, that someone read this far.",
        ],
      },
    ],
    reflection: {
      whatWorked:
        "Asking writers what they actually wanted to know. The honest answer was much smaller than the analytics industry assumes.",
      whatSurprised:
        "How technically simple the privacy-preserving version turned out to be, once we let go of the metrics nobody really needed.",
      whatWouldChange:
        "We would publish the methodology earlier. The most useful feedback came from researchers we had not thought to consult.",
      whatRemains:
        "Whether a metric that cannot identify its reader can still, over time, shape one.",
    },
  },
  {
    slug: "halcyon",
    title: "Halcyon",
    category: "experiments",
    year: "2024",
    summary:
      "A small experiment: a clock that does not tell you the time until you ask it twice.",
    detail:
      "Halcyon is a clock that resists the impulse to check the time. It only answers after you ask twice — a tiny friction designed to make urgency visible.",
    tags: ["Time", "Friction", "Small experiments"],
    status: "archived",
    palette: "from-[#1a1730] to-background",
    overview:
      "Halcyon is a clock that does not tell you the time unless you really mean it. The first time you glance, it gives you nothing. Only the second deliberate ask returns the hour. It is a small experiment in friction as a design material.",
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "We check the time reflexively, not deliberately. Halcyon asks what a clock would feel like if it required just enough friction to make the act of checking conscious.",
        ],
      },
      {
        heading: "Process",
        paragraphs: [
          "The interaction is simple: the first tap returns a question mark. The second tap, within three seconds, returns the time. Outside that window, the counter resets. The clock remembers nothing about you.",
        ],
      },
      {
        heading: "Reflection",
        paragraphs: [
          "After a week of using it ourselves, we noticed we checked the time about a third as often. The friction did not frustrate — it interrupted a habit we had not realised we had.",
        ],
      },
    ],
    reflection: {
      whatWorked:
        "The double-tap. A single, simple rule that changed the entire feeling of the object.",
      whatSurprised:
        "How quickly the friction became invisible — within a day, the double-tap felt natural.",
      whatWouldChange:
        "We might try a version that requires three asks, just to find the edge of usefulness.",
      whatRemains:
        "Whether small frictions scale — or whether they only work at the scale of a single, deliberate object.",
    },
  },
  {
    slug: "verdant",
    title: "Verdant",
    category: "design",
    year: "2022",
    summary:
      "A design system built around breath — spacing as rhythm, type as silence.",
    detail:
      "Verdant is a design system where every token is named after a duration rather than a size. Spacing becomes rhythm; type becomes silence.",
    tags: ["Design system", "Typography", "Rhythm"],
    status: "shipped",
    palette: "from-[#211b38] via-[#141416] to-background",
    overview:
      "Verdant began as a question: what would a design system look like if its primary axis were time, not space? The result is a system where every spacing token is named after a breath — inhale, hold, exhale — and every type ramp is calibrated to the time it takes to read.",
    sections: [
      {
        heading: "The Problem",
        paragraphs: [
          "Design systems describe space with numbers — 4px, 8px, 16px. The numbers are precise but emotionally meaningless. We wanted a system whose tokens communicated rhythm rather than measurement.",
        ],
      },
      {
        heading: "Process",
        paragraphs: [
          "We mapped each spacing value to a duration — the time it takes to read a line, to pause between paragraphs, to settle after a transition. The tokens became inhale, hold, exhale, settle, linger.",
          "Designers using the system began to think in pace rather than in pixels. Composition changed.",
        ],
      },
      {
        heading: "Final Outcome",
        paragraphs: [
          "Verdant is now the foundation of this very website. The spacing you are reading right now is measured in breaths, not pixels. We consider that a quiet success.",
        ],
      },
    ],
    reflection: {
      whatWorked:
        "Naming tokens after durations. Language shapes thought, and thought shapes layout.",
      whatSurprised:
        "How quickly designers adopted the new vocabulary once it was the only vocabulary available.",
      whatWouldChange:
        "We would document the mapping to conventional units earlier. Designers needed a bridge before they could trust the new names.",
      whatRemains:
        "Whether a system built around breath can survive being handed to teams that do not share the studio's pace.",
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
