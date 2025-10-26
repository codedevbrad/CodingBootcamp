export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category = "Frontend" | "Backend" | "System Design" | "Database";
export type Language = "TypeScript" | "JavaScript" | "Python" | "SQL" | "NoSQL" | "GraphQL";
export type TopicStatus = "Ready" | "Completed" | "Locked";

export type Topic = {
  id: string;
  slug: string;
  title: string;
  estMins: number;
  status: TopicStatus;
};

export type Concept = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  languages: Language[];
  gradient: string; // tailwind gradient
  updatedAt: string; // ISO
  topics: Topic[];
  tags: string[];
  featured?: boolean;
};
