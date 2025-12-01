'use client'

import QuizBlockCore from "./package"
import type { QuizBlock } from "./package/quiz.types"


export default function QuizBlock({ data }: { data: QuizBlock }) {
  return <QuizBlockCore {...data} />;
}


export type { QuizBlock };