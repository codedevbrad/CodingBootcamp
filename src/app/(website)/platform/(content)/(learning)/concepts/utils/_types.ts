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
 

export interface UITopic {
  id: string;
  slug: string;
  title: string;
  estMins: number;
  status: TopicStatus;
}

export interface UIConcept {
  id: string;
  slug: string;
  title: string;
  description: string;
  gradient: string;
  updatedAt: string | Date;
  tags: string[];
  languages: string[];
  topics: UITopic[];
  category?: string;
  difficulty?: string;
  featured?: boolean;
}