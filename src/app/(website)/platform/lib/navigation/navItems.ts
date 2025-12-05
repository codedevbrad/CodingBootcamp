import {
    BookOpen,
    Rocket,
    Layers,
    Map,
    PlusCircle,
    LucideIcon,
  } from "lucide-react"
  

  export type SectionLink = {
    title: string;
    href: string;
  };
  
  export type SectionExtraCard = {
    title: string;
    description: string;
  };
  
  export type SectionConfig = {
    title: string;
    description: string;
    href: string;
    color: string;
    icon: LucideIcon;
    links: SectionLink[];
    extraCard?: SectionExtraCard;
  };
  

/* --- Content for each section --- */
export const sections: Record<string, SectionConfig> = {
    create: {
      title: "Learn and create",
      description: "Practice creating System design and ERM diagrams",
      href: "/platform/create",
      color: "from-fuchsia-500/10 to-rose-500/10",
      icon: PlusCircle,
      links: [
        { title: "Create a Diagram", href: "/platform/create/diagram" },
        { title: "Coding Editor", href: "/platform/create/code" },
        { title: "Build a project", href: "/platform/create/project" },
      ],
      extraCard: {
        title: "What you'll build",
        description:
          "Sketch architectures, model data, and turn your ideas into concrete, visual diagrams you can iterate on quickly.",
      },
    },
    concepts: {
      title: "Concepts",
      description:
        "Master theory with bite-sized interactive explanations and examples.",
      href: "/platform/concepts",
      color: "from-blue-500/10 to-purple-500/10",
      icon: BookOpen,
      links: [
        { title: "All Concepts", href: "/concepts" },
        { title: "JavaScript", href: "/concepts/javascript" },
        { title: "React", href: "/concepts/react" },
      ],
      extraCard: {
        title: "How this helps",
        description:
          "Reinforce fundamentals with focused lessons so you can reason clearly about code, patterns, and trade-offs.",
      },
    },
    challenges: {
      title: "Challenges",
      description:
        "Sharpen your skills with coding puzzles and real-time grading.",
      href: "/platform/challenges",
      color: "from-orange-500/10 to-pink-500/10",
      icon: Rocket,
      links: [
        { title: "Daily Challenges", href: "/challenges/daily" },
        { title: "React Challenges", href: "/challenges/react" },
        { title: "Algorithm Drills", href: "/challenges/algorithms" },
      ],
      extraCard: {
        title: "Level up faster",
        description:
          "Push yourself with timed tasks and feedback that highlight gaps in your understanding.",
      },
    },
    projects: {
      title: "Projects",
      description:
        "Build real-world projects and showcase your progress through code.",
      href: "/platform/projects",
      color: "from-emerald-500/10 to-teal-500/10",
      icon: Layers,
      links: [
        { title: "All Projects", href: "/projects" },
        { title: "Beginner", href: "/projects/beginner" },
        { title: "Intermediate", href: "/projects/intermediate" },
      ],
      extraCard: {
        title: "Portfolio ready",
        description:
          "Create practical apps and features you can show recruiters, teammates, or mentors.",
      },
    },
    journeys: {
      title: "Journeys",
      description:
        "Follow guided learning paths from beginner to pro, step by step.",
      href: "/platform/journeys",
      color: "from-cyan-500/10 to-blue-500/10",
      icon: Map,
      links: [
        { title: "Frontend Journey", href: "/journeys/frontend" },
        { title: "Backend Journey", href: "/journeys/backend" },
        { title: "Fullstack Path", href: "/journeys/fullstack" },
      ],
      extraCard: {
        title: "Stay on track",
        description:
          "Progress through curated checkpoints so you always know what to learn next.",
      },
    },
    inspiration: {
      title: "Inspiration",
      description: "Get inspired by cool designs and tricks",
      href: "/platform/inspiration",
      color: "from-orange-500/10 to-pink-500/10",
      icon: Rocket,
      links: [{ title: "UI design", href: "/platform/inspiration/design" }],
      extraCard: {
        title: "Steal like a dev",
        description:
          "Discover patterns, layouts, and micro-interactions you can adapt in your own work.",
      },
    },
  };