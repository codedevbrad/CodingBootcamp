import { BaseBlock } from "../../base.type"

export interface QuizOption {
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];    // array of answers
  correct: number;      // index of correct option
  explanation?: string; // optional feedback
}


/* ------------ BLOCK OBJECT PROPS (like animatedCodeChallenge) ------------ */

export interface QuizBlock extends BaseBlock {
  type: "quiz";
  data: {
    questions: QuizQuestion[];
  }
}

