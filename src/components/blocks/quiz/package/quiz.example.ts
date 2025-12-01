import { QuizBlock } from "./quiz.types";

export const quizBlockObject: QuizBlock = {
  type: "quiz",
  title: "React Components: Quick Quiz",
  description: "Test your knowledge on React component basics.",
  summary: "A fast refresher on component rules and JSX basics.",
  data: {
    questions: [
      {
        question: "Which statement about React components is true?",
        options: [
          "React components must be pure functions",
          "Components must return a single parent JSX node",
          "React components must start with lowercase letters",
          "React components cannot contain hooks",
        ],
        correct: 1,
        explanation: "Components return one parent wrapper, but they can contain hooks and don't need to be pure.",
      },
      {
        question: "Which hook is used for managing state?",
        options: ["useEffect", "useMemo", "useState", "useRef"],
        correct: 2,
      },
    ],
  }
};