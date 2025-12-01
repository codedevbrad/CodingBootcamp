import { BaseBlock } from "../../base.type" 

/* -------------------------------------------------------
   NEW LINE TYPE
------------------------------------------------------- */

export interface NewLineInfo {
  state: boolean;
  by: number;
}

/* -------------------------------------------------------
   A SINGLE CODE LINE
------------------------------------------------------- */

export interface CodeLine {
  content: string;
  indent: number;                 // indent level
  newLine: boolean | NewLineInfo; // supports "false" OR { state, by }
}

/* -------------------------------------------------------
   APPEND TYPE — NEW BLOCK OR EDIT PREVIOUS STEP
------------------------------------------------------- */

export type AppendType =
  | { type: "new" }
  | { type: "edit"; step: number };

/* -------------------------------------------------------
   INTERACTIVE BLOCK (THE QUIZ PART)
------------------------------------------------------- */

export interface InteractiveData {
  question: string;
  options: string[];
  correct: number; // index of correct option
}

/* -------------------------------------------------------
   A FULL STEP IN YOUR ARRAY
------------------------------------------------------- */

export interface Step {
  step: number;
  type: "interactive"; // can extend later for "info", "audio", etc.

  audio: string;

  appendType: AppendType;

  code: CodeLine[];

  interactive: InteractiveData;
}

/* -------------------------------------------------------
               FINAL TYPE FOR YOUR ARRAY
   ------------------------------------------------------- */

export type animatedData = Step[];

export interface animatedCodeChallengeBlock extends BaseBlock {
  type: "animatedCodeChallenge";
  data: {
    steps: Step[];
    codeType: "js" | "jsx";
  }
}